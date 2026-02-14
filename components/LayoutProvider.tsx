"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type LayoutAlignment = "left" | "center" | "right";
type CaseStudyMediaSide = "left" | "right";

type LayoutContextType = {
  alignment: LayoutAlignment;
  setAlignment: (alignment: LayoutAlignment) => void;
  caseStudyMediaSide: CaseStudyMediaSide;
  setCaseStudyMediaSide: (side: CaseStudyMediaSide) => void;
  layoutChangeId: number;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}

type LayoutProviderProps = {
  children: ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [alignment, setAlignmentState] = useState<LayoutAlignment>("right");
  const [caseStudyMediaSide, setCaseStudyMediaSideState] = useState<CaseStudyMediaSide>("left");
  const [layoutChangeId, setLayoutChangeId] = useState(0);

  useEffect(() => {
    const storedLayout = localStorage.getItem("layout") as LayoutAlignment | null;
    const storedCaseStudySide = localStorage.getItem("case-study-media-side") as
      | CaseStudyMediaSide
      | null;
    const validAlignments: LayoutAlignment[] = ["left", "center", "right"];
    const validSides: CaseStudyMediaSide[] = ["left", "right"];
    const resolvedAlignment = storedLayout && validAlignments.includes(storedLayout)
      ? storedLayout
      : "right";
    const resolvedCaseStudySide =
      storedCaseStudySide && validSides.includes(storedCaseStudySide)
        ? storedCaseStudySide
        : "left";
    setAlignmentState(resolvedAlignment);
    setCaseStudyMediaSideState(resolvedCaseStudySide);
  }, []);

  const setAlignment = (newAlignment: LayoutAlignment) => {
    setAlignmentState(newAlignment);
    localStorage.setItem("layout", newAlignment);
    setLayoutChangeId((currentId) => currentId + 1);
  };

  const setCaseStudyMediaSide = (side: CaseStudyMediaSide) => {
    setCaseStudyMediaSideState(side);
    localStorage.setItem("case-study-media-side", side);
  };

  return (
    <LayoutContext.Provider
      value={{ alignment, setAlignment, caseStudyMediaSide, setCaseStudyMediaSide, layoutChangeId }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
