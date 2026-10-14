"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  themes,
  STORAGE_KEY,
  DEFAULT_THEME_ID,
  type ThemeDefinition,
  type ThemeColors,
} from "@/config/themes";

const ALL_KEYS = Object.keys(themes[0].light) as (keyof ThemeColors)[];

function applyTheme(theme: ThemeDefinition, mode: "light" | "dark") {
  const root = document.documentElement;
  const colors = mode === "dark" ? theme.dark : theme.light;
  for (const key of ALL_KEYS) {
    root.style.setProperty(key, colors[key]);
  }
}

function clearOverrides() {
  const root = document.documentElement;
  for (const key of ALL_KEYS) {
    root.style.removeProperty(key);
  }
}

/* ─── Swatches ─── */

function Swatches({ theme, mode }: { theme: ThemeDefinition; mode: "light" | "dark" }) {
  const c = mode === "dark" ? theme.dark : theme.light;
  const dots = [
    c["--bg-primary"],
    c["--bg-tertiary"],
    c["--accent-primary"],
    c["--text-tertiary"],
    c["--text-primary"],
  ];
  return (
    <div className="flex gap-[3px]">
      {dots.map((color, i) => (
        <div
          key={i}
          style={{ background: color, border: "1px solid var(--border-default)" }}
          className="size-[10px] rounded-full"
        />
      ))}
    </div>
  );
}

/* ─── Mode Toggle Icon ─── */

function ModeIcon({ mode }: { mode: "light" | "dark" }) {
  if (mode === "dark") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M13.5 9.2A5.5 5.5 0 016.8 2.5 6.5 6.5 0 1013.5 9.2z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Theme Picker ─── */

export function ThemePicker() {
  const { resolvedTheme, setTheme } = useTheme();
  const [activeId, setActiveId] = useState(DEFAULT_THEME_ID);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mode = (resolvedTheme ?? "light") as "light" | "dark";

  // Restore from localStorage
  useEffect(() => {
    // localStorage throws in locked-down browsers and private modes.
    // A theme preference is never worth taking the page down for.
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && themes.some((t) => t.id === saved)) {
        // One-shot read of an external store that does not exist during SSR or
        // hydration, so it can only happen after mount. Not a cascading render.
        // (The rule reports only the first setState in an effect, so this also
        // covers the setMounted(true) hydration guard below.)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveId(saved);
      }
    } catch {
      // ignore: fall through to the default theme
    }
    setMounted(true);
  }, []);

  // Apply theme whenever activeId or mode changes
  useEffect(() => {
    if (!mounted) return;
    const theme = themes.find((t) => t.id === activeId);
    if (!theme) return;

    if (activeId === DEFAULT_THEME_ID) {
      clearOverrides();
    } else {
      applyTheme(theme, mode);
    }

    try {
      localStorage.setItem(STORAGE_KEY, activeId);
    } catch {
      // ignore: the theme still applies, it just will not persist
    }
  }, [activeId, mode, mounted]);

  // Cleanup overrides on unmount
  useEffect(() => () => clearOverrides(), []);

  // Keyboard shortcuts
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const key = e.key.toLowerCase();

      if (key === "t") {
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isOpen) return;

      if (key === "d") {
        setTheme(mode === "dark" ? "light" : "dark");
        return;
      }

      if (key === "escape") {
        setIsOpen(false);
        return;
      }

      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < themes.length) {
        setActiveId(themes[idx].id);
      }
    },
    [isOpen, mode, setTheme],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!mounted) return null;

  const activeTheme = themes.find((t) => t.id === activeId) ?? themes[0];
  const accent =
    mode === "dark"
      ? activeTheme.dark["--accent-primary"]
      : activeTheme.light["--accent-primary"];

  /* ─── Collapsed: accent dot button ─── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open theme picker"
        className="fixed right-4 bottom-4 z-[9999] flex size-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "color-mix(in oklab, var(--bg-surface) 88%, transparent)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div
          className="size-4 rounded-full transition-colors duration-300"
          style={{ background: accent }}
        />
      </button>
    );
  }

  /* ─── Expanded panel ─── */
  return (
    <div
      role="dialog"
      aria-label="Theme picker"
      className="fixed right-4 bottom-4 z-[9999] w-[260px] overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl"
      style={{
        background: "color-mix(in oklab, var(--bg-surface) 94%, transparent)",
        border: "1px solid var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <span
          className="font-jetbrains text-[11px] font-semibold tracking-wider"
          style={{ color: "var(--text-primary)" }}
        >
          THEME
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            className="flex size-7 items-center justify-center rounded-md transition-colors duration-150"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            <ModeIcon mode={mode} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close theme picker"
            className="flex size-7 items-center justify-center rounded-md transition-colors duration-150"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M4 4l6 6M10 4l-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Theme list */}
      <div className="flex flex-col gap-0.5 p-1.5">
        {themes.map((theme, i) => {
          const isActive = theme.id === activeId;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveId(theme.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150"
              style={{
                background: isActive ? "var(--bg-tertiary)" : "transparent",
                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {/* Number key hint */}
              <kbd
                className="flex size-[18px] shrink-0 items-center justify-center rounded font-jetbrains text-[10px] leading-none"
                style={{
                  border: `1px solid ${isActive ? "var(--border-strong)" : "var(--border-subtle)"}`,
                  background: isActive ? "var(--bg-tertiary)" : "transparent",
                  color: isActive ? "var(--text-secondary)" : "var(--text-muted)",
                }}
              >
                {i + 1}
              </kbd>

              {/* Name + description */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-jetbrains text-[12px] font-medium">
                    {theme.name}
                  </span>
                  {isActive && (
                    <span
                      className="shrink-0 rounded-full px-1.5 py-px font-jetbrains text-[9px]"
                      style={{
                        background: "var(--bg-tertiary)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>
                <span
                  className="block truncate font-space text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {theme.description}
                </span>
              </div>

              {/* Color swatches */}
              <Swatches theme={theme} mode={mode} />
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <span
          className="font-space text-[10px]"
          style={{ color: "var(--text-muted)" }}
        >
          1-{themes.length} select · D mode · T toggle · Esc close
        </span>
      </div>
    </div>
  );
}
