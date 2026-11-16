import { tr, type Dict } from "./tr";
import { en } from "./en";

export type Lang = "tr" | "en";

export const dictionaries: Record<Lang, Dict> = { tr, en };

export const paths: Record<Lang, string> = { tr: "/", en: "/en/" };

export function otherLang(lang: Lang): Lang {
  return lang === "tr" ? "en" : "tr";
}
