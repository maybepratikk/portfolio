"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type LayoutAlignment = "left" | "center" | "right";

type LayoutContextType = {
  alignment: LayoutAlignment;
  setAlignment: (alignment: LayoutAlignment) => void;
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
  const [layoutChangeId, setLayoutChangeId] = useState(0);

  useEffect(() => {
    const storedLayout = localStorage.getItem("layout") as LayoutAlignment | null;
    const validAlignments: LayoutAlignment[] = ["left", "center", "right"];
    const resolvedAlignment = storedLayout && validAlignments.includes(storedLayout)
      ? storedLayout
      : "right";
    setAlignmentState(resolvedAlignment);
  }, []);

  const setAlignment = (newAlignment: LayoutAlignment) => {
    setAlignmentState(newAlignment);
    localStorage.setItem("layout", newAlignment);
    setLayoutChangeId((currentId) => currentId + 1);
  };

  return (
    <LayoutContext.Provider value={{ alignment, setAlignment, layoutChangeId }}>
      {children}
    </LayoutContext.Provider>
  );
}
