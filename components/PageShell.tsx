"use client";

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLayout } from "./LayoutProvider";

type PageShellMode = "default" | "experimental";

type PageShellProps = {
  children: ReactNode;
  mode?: PageShellMode;
  disableLayoutAnimation?: boolean;
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

const RAIL_PREP_MS = 300;
const SOFT_START_MS = 180;
const SELECT_MS = 700;
const CURSOR_TO_CENTER_MS = 320;
const CENTER_HOLD_MS = 250;
const PRE_MOVE_HOLD_MS = 160;
const MOVE_MS = 900;
const SETTLE_MS = 280;
const LINEAR_EASING = "linear";
const DIRECTION_THRESHOLD_PX = 2;
const FRAME_CONTENT_PADDING_PX = 14;
const FRAME_VIEWPORT_INSET_PX = 48;
const snapPx = (value: number) => Math.round(value);

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
    top: snapPx(rect.top),
    left: snapPx(rect.left),
    width: snapPx(rect.width),
    height: snapPx(rect.height),
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

export default function PageShell({
  children,
  mode = "default",
  disableLayoutAnimation = false,
}: PageShellProps) {
  const { alignment, layoutChangeId } = useLayout();
  const justifyClass = alignmentClasses[alignment];
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousRectRef = useRef<RectSnapshot | null>(null);
  const animationTimeoutsRef = useRef<number[]>([]);
  const cancelProgressAnimationsRef = useRef<Array<() => void>>([]);
  const isTransitioningRef = useRef(false);
  const scrollLockRef = useRef<{
    bodyOverflow: string;
    htmlOverflow: string;
    bodyPaddingRight: string;
  } | null>(null);

  const lockPageScroll = useCallback(() => {
    if (scrollLockRef.current) {
      return;
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    scrollLockRef.current = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPaddingRight: document.body.style.paddingRight,
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // Prevent layout shift when the scrollbar disappears during animation.
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }, []);

  const unlockPageScroll = useCallback(() => {
    if (!scrollLockRef.current) {
      return;
    }
    document.body.style.overflow = scrollLockRef.current.bodyOverflow;
    document.documentElement.style.overflow = scrollLockRef.current.htmlOverflow;
    document.body.style.paddingRight = scrollLockRef.current.bodyPaddingRight;
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
    if (!element) {
      return;
    }

    if (disableLayoutAnimation) {
      element.style.transition = "";
      element.style.transform = "";
      element.style.willChange = "";
      element.style.clipPath = "";
      element.style.overflow = "";
      element.style.zIndex = "";
      unlockPageScroll();
      setOverlay(null);
      isTransitioningRef.current = false;
      previousRectRef.current = snapshotRect(element.getBoundingClientRect());
      return;
    }

    if (layoutChangeId === 0) {
      // Keep the baseline in sync during initial hydration/layout restore so
      // the first user-triggered toggle animates from the true current position.
      previousRectRef.current = snapshotRect(element.getBoundingClientRect());
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

    // Strip any leftover animation styles so the target rect measurement
    // reflects the element's pure CSS position (no overflow/clip/z-index).
    element.style.overflow = "";
    element.style.clipPath = "";
    element.style.zIndex = "";
    element.style.willChange = "";

    // Measure target in a completely clean state.
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
      unlockPageScroll();
      setOverlay(null);
      isTransitioningRef.current = false;
      previousRectRef.current = targetRawRect;
      return;
    }

    const clipTop = Math.max(fromViewport.clip.top, targetViewport.clip.top);
    const clipBottom = Math.max(fromViewport.clip.bottom, targetViewport.clip.bottom);

    // Apply animation styles. None of these affect layout:
    // - overflow:clip clips rendering only, no BFC creation
    // - z-index works on flex items without position:relative (CSS spec)
    lockPageScroll();
    element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px)`;
    element.style.willChange = "transform";
    element.style.overflow = "clip";
    element.style.clipPath = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;
    element.style.zIndex = "1150";

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
          const nextOffsetX = snapPx(deltaX * (1 - progress));
          const nextOffsetY = snapPx(deltaY * (1 - progress));
          // Flush both updates synchronously so the frame and content
          // paint in the exact same browser frame — no 1-frame lag.
          flushSync(() => {
            element.style.transform = `translate3d(${nextOffsetX}px, ${nextOffsetY}px, 0px)`;
            setOverlay((currentOverlay) =>
              currentOverlay
                ? {
                    ...currentOverlay,
                    moveProgress: progress,
                  }
                : currentOverlay,
            );
          });
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
      element.style.zIndex = "";
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
  }, [
    alignment,
    disableLayoutAnimation,
    layoutChangeId,
    lockPageScroll,
    prefersReducedMotion,
    unlockPageScroll,
  ]);

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
        currentElement.style.zIndex = "";
      }
      unlockPageScroll();
    };
  }, [unlockPageScroll]);

  const overlayFrameWidth = overlay ? overlay.from.width : 0;
  const overlayFrameHeight = overlay ? overlay.from.height : 0;
  const contentFrameXRaw = overlay
    ? overlay.from.left + overlay.moveProgress * (overlay.to.left - overlay.from.left)
    : 0;
  const contentFrameYRaw = overlay
    ? overlay.from.top + overlay.moveProgress * (overlay.to.top - overlay.from.top)
    : 0;
  const contentFrameX = snapPx(contentFrameXRaw);
  const contentFrameY = snapPx(contentFrameYRaw);
  const frameX = snapPx(contentFrameX - FRAME_CONTENT_PADDING_PX);
  const frameY = snapPx(contentFrameY - FRAME_CONTENT_PADDING_PX);
  const paddedFrameWidth = overlayFrameWidth + FRAME_CONTENT_PADDING_PX * 2;
  const paddedFrameHeight = overlayFrameHeight + FRAME_CONTENT_PADDING_PX * 2;
  const frameDrawWidth = overlay ? snapPx(paddedFrameWidth * overlay.selectProgress) : 0;
  const frameDrawHeight = overlay ? snapPx(paddedFrameHeight * overlay.selectProgress) : 0;
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
  const destinationFrameX = overlay ? snapPx(overlay.to.left - FRAME_CONTENT_PADDING_PX) : 0;
  const destinationFrameY = overlay ? snapPx(overlay.to.top - FRAME_CONTENT_PADDING_PX) : 0;
  const destinationFrameWidth = overlay ? snapPx(overlay.to.width + FRAME_CONTENT_PADDING_PX * 2) : 0;
  const destinationFrameHeight = overlay ? snapPx(overlay.to.height + FRAME_CONTENT_PADDING_PX * 2) : 0;

  return (
    <>
      <main
        className={`min-h-screen flex items-start ${justifyClass} px-[clamp(24px,8vw,80px)] py-16 md:py-16`}
      >
        <div ref={contentRef} className={`${shellModeClasses[mode]} w-full`}>
          {children}
        </div>
      </main>

      {/* ── solid fill layer: renders BELOW content (z-1050) ── */}
      {overlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{
            zIndex: 1050,
            opacity: overlay.opacity * overlay.enterProgress,
            transition: `opacity ${SETTLE_MS}ms ${LINEAR_EASING}`,
          }}
        >
          {/* destination placeholder */}
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

          {/* solid fill that grows with the frame draw */}
          <div
            style={{
              position: "fixed",
              left: frameX,
              top: frameY,
              width: frameDrawWidth,
              height: frameDrawHeight,
              background: "var(--border)",
              borderRadius: "4px",
            }}
          />
        </div>
      ) : null}

      {/* ── frame UI layer: renders ABOVE content (z-1200) ── */}
      {overlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1200]"
          style={{
            opacity: overlay.opacity * overlay.enterProgress,
            transition: `opacity ${SETTLE_MS}ms ${LINEAR_EASING}`,
          }}
        >
          {/* frame border */}
          <div
            style={{
              position: "fixed",
              left: frameX,
              top: frameY,
              width: frameDrawWidth,
              height: frameDrawHeight,
              border: "2px solid var(--border-hover)",
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
