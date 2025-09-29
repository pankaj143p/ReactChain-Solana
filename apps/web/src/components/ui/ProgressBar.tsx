import React from "react";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
  stripes?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      min = 0,
      max = 100,
      label,
      color = "#6366f1", // indigo-500
      stripes = false,
      animated = false,
      indeterminate = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const percent = Math.max(
      0,
      Math.min(100, ((value - min) / (max - min)) * 100)
    );
    return (
      <div
        ref={ref}
        className={`relative w-full bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden ${className}`}
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        role="progressbar"
        {...props}
      >
        <div
          className={`h-full transition-all duration-500 ease-in-out ${
            indeterminate ? "w-full animate-progress-indeterminate" : ""
          }`}
          style={{
            width: indeterminate ? "100%" : `${percent}%`,
            background: color,
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            ...(stripes
              ? {
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 8px, transparent 8px, transparent 16px)",
                }
              : {}),
            ...(animated && stripes
              ? {
                  animation: "progress-bar-stripes 1s linear infinite",
                }
              : {}),
          }}
        />
        {label && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-zinc-700 dark:text-zinc-200">
            {label}
          </span>
        )}
        <style jsx>{`
          @keyframes progress-bar-stripes {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 40px 0;
            }
          }
          @keyframes progress-indeterminate {
            0% {
              left: -40%;
              width: 40%;
            }
            100% {
              left: 100%;
              width: 40%;
            }
          }
          .animate-progress-indeterminate {
            animation: progress-indeterminate 1.5s infinite linear;
          }
        `}</style>
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
