/**
 * 8 color themes — Ledger (default, built for this site) + Warm/Forest
 * originals + 5 famous editor palettes. Each theme has full light + dark
 * variants with mode-specific accents.
 */

export interface ThemeColors {
  "--bg-primary": string;
  "--bg-secondary": string;
  "--bg-tertiary": string;
  "--bg-surface": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--text-tertiary": string;
  "--text-muted": string;
  "--border-default": string;
  "--border-subtle": string;
  "--border-strong": string;
  "--accent-primary": string;
  "--accent-primary-hover": string;
  "--accent-primary-muted": string;
  "--accent-secondary": string;
  "--accent-tertiary": string;
  "--pixel-orange": string;
  "--status-error": string;
  "--status-warning": string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const STORAGE_KEY = "suryash-color-theme";
export const DEFAULT_THEME_ID = "ledger";

/* ─── OKLCH generator for original themes ─── */

interface GenConfig {
  id: string;
  name: string;
  description: string;
  neutralH: number;
  neutralC: number;
  accentH: number;
  accentC: number;
  lightL: number;
  darkL: number;
  secondaryH: number;
  tertiaryH: number;
}

function fmt(n: number): string {
  return parseFloat(n.toFixed(3)).toString();
}

function oklch(l: number, c: number, h: number, alpha?: number): string {
  const ls = fmt(l);
  const cs = fmt(c);
  const hs = fmt(h);
  if (alpha !== undefined) return `oklch(${ls} ${cs} ${hs} / ${alpha})`;
  return `oklch(${ls} ${cs} ${hs})`;
}

function generate(cfg: GenConfig): ThemeDefinition {
  const { neutralH: nh, neutralC: nc, accentH: ah, accentC: ac, lightL: ll, darkL: dl, secondaryH: sh, tertiaryH: th } = cfg;
  const sc = ac * 0.65;
  return {
    id: cfg.id,
    name: cfg.name,
    description: cfg.description,
    light: {
      "--bg-primary": oklch(0.975, nc, nh),
      "--bg-secondary": oklch(0.945, nc * 1.4, nh),
      "--bg-tertiary": oklch(0.915, nc * 1.8, nh),
      "--bg-surface": oklch(0.99, nc * 0.6, nh),
      "--text-primary": oklch(0.15, nc, nh),
      "--text-secondary": oklch(0.38, nc * 1.6, nh),
      "--text-tertiary": oklch(0.55, nc * 1.2, nh),
      "--text-muted": oklch(0.72, nc, nh),
      "--border-default": oklch(0.915, nc * 1.8, nh),
      "--border-subtle": oklch(0.945, nc * 1.4, nh),
      "--border-strong": oklch(0.84, nc * 2.2, nh),
      "--accent-primary": oklch(ll, ac, ah),
      "--accent-primary-hover": oklch(ll - 0.06, ac - 0.01, ah),
      "--accent-primary-muted": oklch(ll, ac, ah, 0.08),
      "--accent-secondary": oklch(ll, sc, sh),
      "--accent-tertiary": oklch(ll - 0.03, sc, th),
      "--pixel-orange": oklch(ll + 0.03, ac + 0.02, ah),
      "--status-error": oklch(0.52, 0.15, 25),
      "--status-warning": oklch(0.68, 0.13, 85),
    },
    dark: {
      "--bg-primary": oklch(0.1, nc * 0.8, nh),
      "--bg-secondary": oklch(0.15, nc, nh),
      "--bg-tertiary": oklch(0.2, nc * 1.2, nh),
      "--bg-surface": oklch(0.25, nc * 1.2, nh),
      "--text-primary": oklch(0.96, nc * 0.8, nh),
      "--text-secondary": oklch(0.72, nc * 1.2, nh),
      "--text-tertiary": oklch(0.54, nc, nh),
      "--text-muted": oklch(0.36, nc * 0.8, nh),
      "--border-default": oklch(0.25, nc * 1.2, nh),
      "--border-subtle": oklch(0.18, nc, nh),
      "--border-strong": oklch(0.32, nc * 1.4, nh),
      "--accent-primary": oklch(dl, ac + 0.01, ah),
      "--accent-primary-hover": oklch(dl - 0.06, ac, ah),
      "--accent-primary-muted": oklch(dl, ac + 0.01, ah, 0.08),
      "--accent-secondary": oklch(dl, sc, sh),
      "--accent-tertiary": oklch(dl - 0.02, sc, th),
      "--pixel-orange": oklch(dl + 0.02, ac + 0.02, ah),
      "--status-error": oklch(0.6, 0.15, 25),
      "--status-warning": oklch(0.72, 0.14, 85),
    },
  };
}

/* ─── Theme definitions ─── */

export const themes: ThemeDefinition[] = [
  // ━━━ Default — built for this site ━━━

  generate({
    id: "ledger",
    name: "Ledger",
    description: "Navy & slate, confident teal-blue accent",
    neutralH: 235, neutralC: 0.008,
    accentH: 215, accentC: 0.15, lightL: 0.5, darkL: 0.62,
    secondaryH: 170, tertiaryH: 40,
  }),

  // ━━━ Original themes (generated OKLCH) ━━━

  generate({
    id: "warm",
    name: "Warm",
    description: "Terracotta accent, warm neutrals",
    neutralH: 85, neutralC: 0.006,
    accentH: 40, accentC: 0.15, lightL: 0.55, darkL: 0.64,
    secondaryH: 240, tertiaryH: 150,
  }),

  generate({
    id: "forest",
    name: "Forest",
    description: "Emerald green, sage undertones",
    neutralH: 150, neutralC: 0.005,
    accentH: 155, accentC: 0.15, lightL: 0.52, darkL: 0.65,
    secondaryH: 240, tertiaryH: 150,
  }),

  // ━━━ Famous editor themes (exact published palettes) ━━━

  {
    id: "gruvbox",
    name: "Gruvbox",
    description: "Retro groove — warm orange on earthy tones",
    light: {
      "--bg-primary": "#fbf1c7",
      "--bg-secondary": "#f2e5bc",
      "--bg-tertiary": "#ebdbb2",
      "--bg-surface": "#f9f5d7",
      "--text-primary": "#282828",
      "--text-secondary": "#49423e",
      "--text-tertiary": "#5c5046",
      "--text-muted": "#6b5d49",
      "--border-default": "#ebdbb2",
      "--border-subtle": "#f2e5bc",
      "--border-strong": "#d5c4a1",
      "--accent-primary": "#af3a03",
      "--accent-primary-hover": "#8f2e02",
      "--accent-primary-muted": "rgba(175, 58, 3, 0.08)",
      "--accent-secondary": "#076678",
      "--accent-tertiary": "#79740e",
      "--pixel-orange": "#d65d0e",
      "--status-error": "#9d0006",
      "--status-warning": "#b57614",
    },
    dark: {
      "--bg-primary": "#282828",
      "--bg-secondary": "#32302f",
      "--bg-tertiary": "#3c3836",
      "--bg-surface": "#504945",
      "--text-primary": "#fbf1c7",
      "--text-secondary": "#dac9a6",
      "--text-tertiary": "#c3b39e",
      "--text-muted": "#aca198",
      "--border-default": "#3c3836",
      "--border-subtle": "#32302f",
      "--border-strong": "#504945",
      "--accent-primary": "#fe8019",
      "--accent-primary-hover": "#d65d0e",
      "--accent-primary-muted": "rgba(254, 128, 25, 0.08)",
      "--accent-secondary": "#83a598",
      "--accent-tertiary": "#b8bb26",
      "--pixel-orange": "#fe8019",
      "--status-error": "#fb4934",
      "--status-warning": "#fabd2f",
    },
  },

  {
    id: "everforest",
    name: "Everforest",
    description: "Soft green on warm earth — comfortable for the eyes",
    light: {
      "--bg-primary": "#fdf6e3",
      "--bg-secondary": "#f4f0d9",
      "--bg-tertiary": "#efebd4",
      "--bg-surface": "#fdf6e3",
      "--text-primary": "#5c6a72",
      "--text-secondary": "#415058",
      "--text-tertiary": "#515f50",
      "--text-muted": "#626b5c",
      "--border-default": "#efebd4",
      "--border-subtle": "#f4f0d9",
      "--border-strong": "#e6e2cc",
      "--accent-primary": "#8da101",
      "--accent-primary-hover": "#768901",
      "--accent-primary-muted": "rgba(141, 161, 1, 0.08)",
      "--accent-secondary": "#3a94c5",
      "--accent-tertiary": "#35a77c",
      "--pixel-orange": "#f57d26",
      "--status-error": "#f85552",
      "--status-warning": "#dfa000",
    },
    dark: {
      "--bg-primary": "#2d353b",
      "--bg-secondary": "#343f44",
      "--bg-tertiary": "#3d484d",
      "--bg-surface": "#475258",
      "--text-primary": "#d3c6aa",
      "--text-secondary": "#d6e3d9",
      "--text-tertiary": "#beccc2",
      "--text-muted": "#aab9b4",
      "--border-default": "#3d484d",
      "--border-subtle": "#343f44",
      "--border-strong": "#475258",
      "--accent-primary": "#a7c080",
      "--accent-primary-hover": "#8fa86a",
      "--accent-primary-muted": "rgba(167, 192, 128, 0.08)",
      "--accent-secondary": "#7fbbb3",
      "--accent-tertiary": "#83c092",
      "--pixel-orange": "#e69875",
      "--status-error": "#e67e80",
      "--status-warning": "#dbbc7f",
    },
  },

  {
    id: "kanagawa",
    name: "Kanagawa",
    description: "Japanese ink — crystal blue on deep indigo",
    light: {
      "--bg-primary": "#f2ecbc",
      "--bg-secondary": "#e5ddb0",
      "--bg-tertiary": "#dcd5ac",
      "--bg-surface": "#f2ecbc",
      "--text-primary": "#43436c",
      "--text-secondary": "#3f3e4e",
      "--text-tertiary": "#4f4e46",
      "--text-muted": "#5d5b4e",
      "--border-default": "#dcd5ac",
      "--border-subtle": "#e5ddb0",
      "--border-strong": "#d5cea3",
      "--accent-primary": "#4d699b",
      "--accent-primary-hover": "#3d5580",
      "--accent-primary-muted": "rgba(77, 105, 155, 0.08)",
      "--accent-secondary": "#cc6d00",
      "--accent-tertiary": "#6f894e",
      "--pixel-orange": "#e98a00",
      "--status-error": "#c84053",
      "--status-warning": "#de9800",
    },
    dark: {
      "--bg-primary": "#1f1f28",
      "--bg-secondary": "#2a2a37",
      "--bg-tertiary": "#363646",
      "--bg-surface": "#363646",
      "--text-primary": "#dcd7ba",
      "--text-secondary": "#d0c89b",
      "--text-tertiary": "#b5b4ab",
      "--text-muted": "#a0a0bc",
      "--border-default": "#2a2a37",
      "--border-subtle": "#1f1f28",
      "--border-strong": "#363646",
      "--accent-primary": "#7e9cd8",
      "--accent-primary-hover": "#6684c0",
      "--accent-primary-muted": "rgba(126, 156, 216, 0.08)",
      "--accent-secondary": "#ffa066",
      "--accent-tertiary": "#98bb6c",
      "--pixel-orange": "#ffa066",
      "--status-error": "#e46876",
      "--status-warning": "#dca561",
    },
  },

  {
    id: "nord",
    name: "Nord",
    description: "Arctic frost — cool blue on polar night",
    light: {
      "--bg-primary": "#eceff4",
      "--bg-secondary": "#e5e9f0",
      "--bg-tertiary": "#d8dee9",
      "--bg-surface": "#eceff4",
      "--text-primary": "#2e3440",
      "--text-secondary": "#3b4252",
      "--text-tertiary": "#495367",
      "--text-muted": "#546178",
      "--border-default": "#d8dee9",
      "--border-subtle": "#e5e9f0",
      "--border-strong": "#c2c8d4",
      "--accent-primary": "#5e81ac",
      "--accent-primary-hover": "#4c6d94",
      "--accent-primary-muted": "rgba(94, 129, 172, 0.08)",
      "--accent-secondary": "#81a1c1",
      "--accent-tertiary": "#6b8f5c",
      "--pixel-orange": "#bf6043",
      "--status-error": "#bf616a",
      "--status-warning": "#c08b3e",
    },
    dark: {
      "--bg-primary": "#2e3440",
      "--bg-secondary": "#3b4252",
      "--bg-tertiary": "#434c5e",
      "--bg-surface": "#4c566a",
      "--text-primary": "#eceff4",
      "--text-secondary": "#e2e8f3",
      "--text-tertiary": "#c3d2ed",
      "--text-muted": "#b3bfd6",
      "--border-default": "#434c5e",
      "--border-subtle": "#3b4252",
      "--border-strong": "#4c566a",
      "--accent-primary": "#88c0d0",
      "--accent-primary-hover": "#70a8b8",
      "--accent-primary-muted": "rgba(136, 192, 208, 0.08)",
      "--accent-secondary": "#5e81ac",
      "--accent-tertiary": "#a3be8c",
      "--pixel-orange": "#d08770",
      "--status-error": "#bf616a",
      "--status-warning": "#ebcb8b",
    },
  },

  {
    id: "catppuccin",
    name: "Catppuccin",
    description: "Pastel mauve on soothing lavender base",
    light: {
      "--bg-primary": "#eff1f5",
      "--bg-secondary": "#e6e9ef",
      "--bg-tertiary": "#dce0e8",
      "--bg-surface": "#eff1f5",
      "--text-primary": "#4c4f69",
      "--text-secondary": "#42455c",
      "--text-tertiary": "#515469",
      "--text-muted": "#5d606f",
      "--border-default": "#ccd0da",
      "--border-subtle": "#e6e9ef",
      "--border-strong": "#bcc0cc",
      "--accent-primary": "#8839ef",
      "--accent-primary-hover": "#7030d0",
      "--accent-primary-muted": "rgba(136, 57, 239, 0.08)",
      "--accent-secondary": "#1e66f5",
      "--accent-tertiary": "#40a02b",
      "--pixel-orange": "#fe640b",
      "--status-error": "#d20f39",
      "--status-warning": "#df8e1d",
    },
    dark: {
      "--bg-primary": "#1e1e2e",
      "--bg-secondary": "#313244",
      "--bg-tertiary": "#45475a",
      "--bg-surface": "#313244",
      "--text-primary": "#cdd6f4",
      "--text-secondary": "#dae2ff",
      "--text-tertiary": "#c4cbe7",
      "--text-muted": "#b3b7cf",
      "--border-default": "#313244",
      "--border-subtle": "#181825",
      "--border-strong": "#45475a",
      "--accent-primary": "#cba6f7",
      "--accent-primary-hover": "#b38ee0",
      "--accent-primary-muted": "rgba(203, 166, 247, 0.08)",
      "--accent-secondary": "#89b4fa",
      "--accent-tertiary": "#a6e3a1",
      "--pixel-orange": "#fab387",
      "--status-error": "#f38ba8",
      "--status-warning": "#f9e2af",
    },
  },
];
