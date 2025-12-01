import { Loader2 } from "lucide-react";

export default function Loader({
  size = "md",
  fullscreen = false,
  text = "",
  inline = false,
  className = "",
}) {
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  // wrapper classes
  const baseWrapper = inline
    ? `inline-flex items-center gap-2 ${className}`
    : `flex flex-col items-center gap-2 ${className}`;

  const content = (
    <div
      className={`${baseWrapper} text-gray-700 dark:text-gray-200`}
      role="status"
      aria-busy="true"
    >
      <Loader2 className={`${spinnerSize} animate-spin`} aria-hidden="true" />

      {text ? (
        <span className="text-sm sm:text-base font-medium">{text}</span>
      ) : null}
    </div>
  );

  if (fullscreen && !inline) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none bg-purple-300/10 backdrop-blur-lg z-100">
        <div className="bg-black/40 pointer-events-auto p-4 rounded-2xl backdrop-blur-sm shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
