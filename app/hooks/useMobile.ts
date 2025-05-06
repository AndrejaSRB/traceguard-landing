import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(customBreakpoint?: number) {
  const breakpoint = customBreakpoint || MOBILE_BREAKPOINT;
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    checkIsMobile();

    // Listen for both window resize and media query changes for better coverage
    window.addEventListener("resize", checkIsMobile);
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    mql.addEventListener("change", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      mql.removeEventListener("change", checkIsMobile);
    };
  }, [breakpoint]);

  return !!isMobile;
}
