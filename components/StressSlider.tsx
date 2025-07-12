"use client";

import { getStressLevelColor } from "../lib/utils";
import type { StressLevel } from "../lib/types";

interface StressSliderProps {
  value: StressLevel | null;
  onChange: (stress: StressLevel) => void;
}

export default function StressSlider({ value, onChange }: StressSliderProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">ストレスレベル</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>低い</span>
          <span>高い</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={1}
            max={10}
            value={value || 1}
            onChange={(e) => onChange(Number(e.target.value) as StressLevel)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: value
                ? `linear-gradient(to right, ${getStressLevelColor(
                    value
                  )} 0%, ${getStressLevelColor(value)} ${
                    (value - 1) * 11.11
                  }%, #e5e7eb ${(value - 1) * 11.11}%, #e5e7eb 100%)`
                : undefined,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <span key={num} className={value === num ? "font-bold" : ""}>
                {num}
              </span>
            ))}
          </div>
        </div>

        {value && (
          <div className="text-center">
            <span
              className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: getStressLevelColor(value) }}
            >
              レベル {value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
