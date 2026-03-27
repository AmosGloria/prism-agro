"use client";
import React from "react";
import { CROP_EMOJI } from "@/mock-datas/market-place";

interface ProduceIconProps {
  cropType: string;
  /** Pixel size — used as width/height for images, font-size for emojis */
  size?: number;
  className?: string;
}

/**
 * Renders a produce icon for a given crop type.
 * - If the CROP_EMOJI value starts with "/" → image path, renders <img>
 * - Otherwise → emoji character, renders inside a <span>
 * Falls back to 🌱 if crop type is not in the map.
 */
export function ProduceIcon({ cropType, size = 40, className = "" }: ProduceIconProps) {
  const value = CROP_EMOJI[cropType] ?? "🌱";
  const isImage = value.startsWith("/");

  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value}
        alt={cropType}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        onError={(e) => {
          // If image fails to load, hide it and show a fallback emoji span
          const img = e.currentTarget;
          img.style.display = "none";
          const span = document.createElement("span");
          span.textContent = "🌱";
          span.style.fontSize = `${size}px`;
          span.style.lineHeight = "1";
          img.parentElement?.appendChild(span);
        }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={cropType}
      style={{ fontSize: size, lineHeight: 1 }}
      className={className}
    >
      {value}
    </span>
  );
}
