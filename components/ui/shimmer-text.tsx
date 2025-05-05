import { cn } from "@/lib/utils";
import { CSSProperties, FC, ReactNode } from "react";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 200,
}) => {
  return (
    <div className="relative">
      {/* Base text that's always visible */}
      <p
        className={cn(
          "mx-auto max-w-md text-purple-500 dark:text-purpleDark-300",
          className
        )}
      >
        {children}
      </p>

      {/* Shimmer overlay */}
      <p
        style={
          {
            "--shimmer-width": `${shimmerWidth}px`,
          } as CSSProperties
        }
        className={cn(
          "absolute inset-0 mx-auto max-w-md text-transparent",

          // Shimmer effect
          "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

          // Shimmer gradient
          "bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-purple-300/70",

          className
        )}
        aria-hidden="true"
      >
        {children}
      </p>
    </div>
  );
};

export default AnimatedShinyText;
