export type FontScale = "xs" | "sm" | "md" | "lg" | "xl";

const KEY = "fontScale";

export const fontScaleStorage = {
  get(): FontScale {
    const v = localStorage.getItem(KEY);
    if (v === "xs" || v === "sm" || v === "md" || v === "lg" || v === "xl") return v;
    return "md";
  },
  set(v: FontScale) {
    localStorage.setItem(KEY, v);
  },
};