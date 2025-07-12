"use client";

import { MOOD_OPTIONS } from "../lib/utils";
import type { MoodLevel } from "../lib/types";

interface MoodSelectorProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">
        今の気分はどうですか？
      </h3>
      <div className="flex justify-between gap-2">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.level}
            onClick={() => onChange(option.level)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              value === option.level
                ? `border-blue-500 bg-blue-50`
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">{option.emoji}</div>
            <div className="text-xs text-gray-600">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
