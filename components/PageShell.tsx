"use client";

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLayout } from "./LayoutProvider";

type PageShellMode = "default" | "experimental";

type PageShellProps = {
  children: ReactNode;
  mode?: PageShellMode;
};

const shellModeClasses: Record<PageShellMode, string> = {
  default: "max-w-[450px] md:max-w-[450px]",
  experimental: "w-full max-w-none",
};

const alignmentClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const RAIL_PREP_MS = 500;
const SOFT_START_MS = 260;
const SELECT_MS = 1100;
const CURSOR_TO_CENTER_MS = 500;
const CENTER_HOLD_MS = 420;
const PRE_MOVE_HOLD_MS = 260;
const MOVE_MS = 1400;
const SETTLE_MS = 400;
const LINEAR_EASING = "linear";
const DIRECTION_THRESHOLD_PX = 2;
const FRAME_CONTENT_PADDING_PX = 14;
const FRAME_VIEWPORT_INSET_PX = 48;

type RectSnapshot = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type OverlayState = {
  from: RectSnapshot;
  to: RectSnapshot;
  cursorVisible: boolean;
  opacity: number;
  enterProgress: number;
  selectProgress: number;
  centerProgress: number;
  moveProgress: number;
};
type MovementDirection = "left" | "right" | "none";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const HANDLE_SIZE = 12;

function snapshotRect(rect: DOMRect): RectSnapshot {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function captureRectInViewport(rect: RectSnapshot, viewportHeight: number, viewportInsetPx: number) {
  const topClip = Math.max(0, viewportInsetPx - rect.top);
  const bottomClip = Math.max(0, rect.top + rect.height - (viewportHeight - viewportInsetPx));
  const visibleHeight = Math.max(0, rect.height - topClip - bottomClip);

  return {
    rect: {
      ...rect,
      top: rect.top + topClip,
      height: visibleHeight,
    },
    clip: {
      top: topClip,
      bottom: bottomClip,
    },
  };
}

function runProgressAnimation(
  durationMs: number,
  easing: (value: number) => number,
  onProgress: (value: number) => void,
) {
  let rafId = 0;
  const startedAt = performance.now();

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    const rawProgress = clamp(elapsed / durationMs, 0, 1);
    onProgress(easing(rawProgress));
    if (rawProgress < 1) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  rafId = window.requestAnimationFrame(tick);

  return () => {
    window.cancelAnimationFrame(rafId);
  };
}

export default function PageShell({ children, mode = "default" }: PageShellProps) {
  const { alignment, layoutChangeId } = useLayout();
  const justifyClass = alignmentClasses[alignment];
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousRectRef = useRef<RectSnapshot | null>(null);
  const animationTimeoutsRef = useRef<number[]>([]);
  const cancelProgressAnimationsRef = useRef<Array<() => void>>([]);
  const isTransitioningRef = useRef(false);
  const scrollLockRef = useRef<{ bodyOverflow: string; htmlOverflow: string } | null>(null);

  const lockPageScroll = useCallback(() => {
    if (scrollLockRef.current) {
      return;
    }
    scrollLockRef.current = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  const unlockPageScroll = useCallback(() => {
    if (!scrollLockRef.current) {
      return;
    }
    document.body.style.overflow = scrollLockRef.current.bodyOverflow;
    document.documentElement.style.overflow = scrollLockRef.current.htmlOverflow;
    scrollLockRef.current = null;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setPrefersReducedMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    previousRectRef.current = snapshotRect(element.getBoundingClientRect());
  }, []);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element || layoutChangeId === 0) {
      return;
    }

    for (const timeoutId of animationTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }
    animationTimeoutsRef.current = [];

    for (const cancelAnimation of cancelProgressAnimationsRef.current) {
      cancelAnimation();
    }
    cancelProgressAnimationsRef.current = [];
    unlockPageScroll();

    const activeTransform = element.style.transform;
    const currentRawRect = snapshotRect(element.getBoundingClientRect());

    element.style.transition = "none";
    element.style.transform = "translate3d(0px, 0px, 0px)";
    const targetRawRect = snapshotRect(element.getBoundingClientRect());

    const fromRawRect =
      isTransitioningRef.current && activeTransform
        ? currentRawRect
        : previousRectRef.current ?? targetRawRect;

    const viewportHeight = window.innerHeight;
    const fromViewport = captureRectInViewport(fromRawRect, viewportHeight, FRAME_VIEWPORT_INSET_PX);
    const targetViewport = captureRectInViewport(targetRawRect, viewportHeight, FRAME_VIEWPORT_INSET_PX);
    const fromRect = fromViewport.rect;
    const targetRect = targetViewport.rect;

    const deltaX = fromRawRect.left - targetRawRect.left;
    const deltaY = fromRawRect.top - targetRawRect.top;
    const shouldAnimate = Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;

    if (prefersReducedMotion || !shouldAnimate || fromRect.height <= 0 || targetRect.height <= 0) {
      element.style.transition = "";
      element.style.transform = "";
      element.style.clipPath = "";
      element.style.overflow = "";
      element.style.background = "";
      element.style.padding = "";
      element.style.borderRadius = "";
      unlockPageScroll();
      setOverlay(null);
      isTransitioningRef.current = false;
      previousRectRef.current = targetRawRect;
      return;
    }

    const clipTop = Math.max(fromViewport.clip.top, targetViewport.clip.top);
    const clipBottom = Math.max(fromViewport.clip.bottom, targetViewport.clip.bottom);

    lockPageScroll();
    element.style.transition = "none";
    element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px)`;
    element.style.willChange = "transform";
    element.style.overflow = "hidden";
    element.style.clipPath = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;
    element.style.background = "var(--border)";
    element.style.padding = `${FRAME_CONTENT_PADDING_PX}px`;
    element.style.borderRadius = "4px";

    setOverlay({
      from: fromRect,
      to: targetRect,
      cursorVisible: true,
      opacity: 1,
      enterProgress: 0,
      selectProgress: 0,
      centerProgress: 0,
      moveProgress: 0,
    });

    isTransitioningRef.current = true;

    const startSoftStartTimeout = window.setTimeout(() => {
      cancelProgressAnimationsRef.current.push(
        runProgressAnimation(SOFT_START_MS, (value) => value, (progress) => {
          setOverlay((currentOverlay) =>
            currentOverlay
              ? {
                  ...currentOverlay,
                  enterProgress: progress,
                }
              : currentOverlay,
          );
        }),
      );
    }, 0);

    const startSelectTimeout = window.setTimeout(() => {
      cancelProgressAnimationsRef.current.push(
        runProgressAnimation(SELECT_MS, (value) => value, (progress) => {
          setOverlay((currentOverlay) =>
            currentOverlay
              ? {
                  ...currentOverlay,
                  selectProgress: progress,
                }
              : currentOverlay,
          );
        }),
      );
    }, RAIL_PREP_MS);

    const startCenterTimeout = window.setTimeout(() => {
      cancelProgressAnimationsRef.current.push(
        runProgressAnimation(CURSOR_TO_CENTER_MS, (value) => value, (progress) => {
          setOverlay((currentOverlay) =>
            currentOverlay
              ? {
                  ...currentOverlay,
                  centerProgress: progress,
                }
              : currentOverlay,
          );
        }),
      );
    }, RAIL_PREP_MS + SELECT_MS);

    const startMoveTimeout = window.setTimeout(() => {
      cancelProgressAnimationsRef.current.push(
        runProgressAnimation(MOVE_MS, easeOut, (progress) => {
          element.style.transform = `translate3d(${deltaX * (1 - progress)}px, ${deltaY * (1 - progress)}px, 0px)`;
          setOverlay((currentOverlay) =>
            currentOverlay
              ? {
                  ...currentOverlay,
                  moveProgress: progress,
                }
              : currentOverlay,
          );
        }),
      );
    }, RAIL_PREP_MS + SELECT_MS + CURSOR_TO_CENTER_MS + CENTER_HOLD_MS + PRE_MOVE_HOLD_MS);

    const settleTimeout = window.setTimeout(() => {
      setOverlay((currentOverlay) =>
        currentOverlay
          ? {
              ...currentOverlay,
              cursorVisible: false,
              opacity: 0,
            }
          : currentOverlay,
      );
    }, RAIL_PREP_MS + SELECT_MS + CURSOR_TO_CENTER_MS + CENTER_HOLD_MS + PRE_MOVE_HOLD_MS + MOVE_MS);

    const cleanupTimeout = window.setTimeout(() => {
      element.style.transition = "";
      element.style.transform = "";
      element.style.willChange = "";
      element.style.clipPath = "";
      element.style.overflow = "";
      element.style.background = "";
      element.style.padding = "";
      element.style.borderRadius = "";
      unlockPageScroll();
      setOverlay(null);
      isTransitioningRef.current = false;
      previousRectRef.current = snapshotRect(element.getBoundingClientRect());
    }, RAIL_PREP_MS + SELECT_MS + CURSOR_TO_CENTER_MS + CENTER_HOLD_MS + PRE_MOVE_HOLD_MS + MOVE_MS + SETTLE_MS);

    animationTimeoutsRef.current.push(
      startSoftStartTimeout,
      startSelectTimeout,
      startCenterTimeout,
      startMoveTimeout,
      settleTimeout,
      cleanupTimeout,
    );
  }, [alignment, layoutChangeId, lockPageScroll, prefersReducedMotion, unlockPageScroll]);

  useEffect(() => {
    const currentElement = contentRef.current;

    return () => {
      for (const timeoutId of animationTimeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      animationTimeoutsRef.current = [];

      for (const cancelAnimation of cancelProgressAnimationsRef.current) {
        cancelAnimation();
      }
      cancelProgressAnimationsRef.current = [];

      if (currentElement) {
        currentElement.style.transition = "";
        currentElement.style.transform = "";
        currentElement.style.willChange = "";
        currentElement.style.clipPath = "";
        currentElement.style.overflow = "";
        currentElement.style.background = "";
        currentElement.style.padding = "";
        currentElement.style.borderRadius = "";
      }
      unlockPageScroll();
    };
  }, [unlockPageScroll]);

  const overlayFrameWidth = overlay ? overlay.from.width : 0;
  const overlayFrameHeight = overlay ? overlay.from.height : 0;
  const contentFrameX = overlay
    ? overlay.from.left + overlay.moveProgress * (overlay.to.left - overlay.from.left)
    : 0;
  const contentFrameY = overlay
    ? overlay.from.top + overlay.moveProgress * (overlay.to.top - overlay.from.top)
    : 0;
  const frameX = contentFrameX - FRAME_CONTENT_PADDING_PX;
  const frameY = contentFrameY - FRAME_CONTENT_PADDING_PX;
  const paddedFrameWidth = overlayFrameWidth + FRAME_CONTENT_PADDING_PX * 2;
  const paddedFrameHeight = overlayFrameHeight + FRAME_CONTENT_PADDING_PX * 2;
  const frameDrawWidth = overlay ? paddedFrameWidth * overlay.selectProgress : 0;
  const frameDrawHeight = overlay ? paddedFrameHeight * overlay.selectProgress : 0;
  const showAllHandles = Boolean(overlay && overlay.selectProgress > 0.85);
  const drawEndX = frameX + paddedFrameWidth;
  const drawEndY = frameY + paddedFrameHeight;
  const frameCenterX = frameX + paddedFrameWidth / 2;
  const frameCenterY = frameY + paddedFrameHeight / 2;
  const drawCursorX = frameX + paddedFrameWidth * (overlay?.selectProgress ?? 0);
  const drawCursorY = frameY + paddedFrameHeight * (overlay?.selectProgress ?? 0);
  const centerHopCursorX =
    drawEndX + (frameCenterX - drawEndX) * (overlay?.centerProgress ?? 0);
  const centerHopCursorY =
    drawEndY + (frameCenterY - drawEndY) * (overlay?.centerProgress ?? 0);
  const cursorX = !overlay
    ? 0
    : overlay.centerProgress > 0
      ? centerHopCursorX
      : drawCursorX;
  const cursorY = !overlay
    ? 0
    : overlay.centerProgress > 0
      ? centerHopCursorY
      : drawCursorY;
  const directionalDeltaX = overlay ? overlay.to.left - overlay.from.left : 0;
  const movementDirection: MovementDirection = !overlay
    ? "none"
    : directionalDeltaX > DIRECTION_THRESHOLD_PX
      ? "right"
      : directionalDeltaX < -DIRECTION_THRESHOLD_PX
        ? "left"
        : "none";
  const showDirectionalGuides = movementDirection !== "none";
  const destinationFrameX = overlay ? overlay.to.left - FRAME_CONTENT_PADDING_PX : 0;
  const destinationFrameY = overlay ? overlay.to.top - FRAME_CONTENT_PADDING_PX : 0;
  const destinationFrameWidth = overlay ? overlay.to.width + FRAME_CONTENT_PADDING_PX * 2 : 0;
  const destinationFrameHeight = overlay ? overlay.to.height + FRAME_CONTENT_PADDING_PX * 2 : 0;

  return (
    <>
      <main
        className={`min-h-screen flex items-start ${justifyClass} px-[clamp(24px,8vw,80px)] py-16 md:py-16`}
      >
        <div ref={contentRef} className={`${shellModeClasses[mode]} w-full`}>
          {children}
        </div>
      </main>

      {overlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1200]"
          style={{
            opacity: overlay.opacity * overlay.enterProgress,
            transition: `opacity ${SETTLE_MS}ms ${LINEAR_EASING}`,
          }}
        >
          {showDirectionalGuides ? (
            <div
              style={{
                position: "fixed",
                left: destinationFrameX,
                top: destinationFrameY,
                width: destinationFrameWidth,
                height: destinationFrameHeight,
                border: "1.5px dashed var(--border-hover)",
                opacity: 0.38,
                background: "var(--surface)",
                borderRadius: "4px",
              }}
            />
          ) : null}

          <div
            style={{
              position: "fixed",
              left: frameX,
              top: frameY,
              width: frameDrawWidth,
              height: frameDrawHeight,
              border: "2px solid var(--border-hover)",
              boxShadow: "0 0 0 1px var(--border)",
              borderRadius: "4px",
            }}
          />
          <div
            style={{
              position: "fixed",
              left: frameX - HANDLE_SIZE / 2,
              top: frameY - HANDLE_SIZE / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              borderRadius: 1,
              background: "var(--border-hover)",
            }}
          />
          {showAllHandles ? (
            <>
              <div
                style={{
                  position: "fixed",
                  left: frameX + frameDrawWidth - HANDLE_SIZE / 2,
                  top: frameY - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  borderRadius: 1,
                  background: "var(--border-hover)",
                }}
              />
              <div
                style={{
                  position: "fixed",
                  left: frameX - HANDLE_SIZE / 2,
                  top: frameY + frameDrawHeight - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  borderRadius: 1,
                  background: "var(--border-hover)",
                }}
              />
              <div
                style={{
                  position: "fixed",
                  left: frameX + frameDrawWidth - HANDLE_SIZE / 2,
                  top: frameY + frameDrawHeight - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  borderRadius: 1,
                  background: "var(--border-hover)",
                }}
              />
            </>
          ) : null}

          {overlay.cursorVisible ? (
            <svg
              style={{
                position: "fixed",
                left: cursorX - 18,
                top: cursorY - 20,
                width: 36,
                height: 36,
                overflow: "visible",
                filter: "drop-shadow(0 6px 16px var(--text-tertiary))",
              }}
              viewBox="0 0 20 20"
            >
              <path
                d="M2.5 2.2L15.7 9.1L10 10.4L8.7 16.3L2.5 2.2Z"
                fill="var(--text)"
                stroke="var(--bg)"
                strokeWidth="1"
              />
            </svg>
          ) : null}
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[1100]"
        style={{
          height: 110,
          background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
        }}
      />
    </>
  );
}
