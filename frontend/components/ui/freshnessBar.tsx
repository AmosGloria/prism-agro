"use client";

interface Props {
  value: number; // 0-100
  showLabel?: boolean;
  height?: "sm" | "md";
}

export function FreshnessBar({
  value,
  showLabel = true,
  height = "md",
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));

  // Color logic: Green > 80, Yellow 50-79, Red < 50
  const color =
    clamped > 80
      ? { bar: "#08C40E", bg: "#E6FEE7", text: "#046207", label: "Fresh" }
      : clamped >= 50
        ? { bar: "#F59E0B", bg: "#FFFBEB", text: "#92400E", label: "Good" }
        : { bar: "#EF4444", bg: "#FEF2F2", text: "#991B1B", label: "Ageing" };

  const h = height === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span
            className="text-xs font-medium"
            style={{ color: color.text }}
          >
            {color.label}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: color.text }}
          >
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${h} rounded-full overflow-hidden`}
        style={{ backgroundColor: color.bg }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${h} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${clamped}%`,
            backgroundColor: color.bar,
            boxShadow: `0 0 8px ${color.bar}66`,
          }}
        />
      </div>
    </div>
  );
}
