import { createContext, useContext, useState, useEffect } from "react";

const BreakpointContext = createContext({ isDesktop: false });

export function BreakpointProvider({ children }) {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <BreakpointContext.Provider value={{ isDesktop }}>
      {children}
    </BreakpointContext.Provider>
  );
}

export const useBreakpoint = () => useContext(BreakpointContext);
