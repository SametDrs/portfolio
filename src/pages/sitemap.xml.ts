import type { APIRoute } from "astro";
import { paths, type Lang } from "../i18n";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("astro.config.mjs içinde `site` tanımlı olmalı.");

  const langs = Object.keys(paths) as Lang[];
  const abs = (lang: Lang) => new URL(paths[lang], site).href;
  const lastmod = new Date().toISOString().slice(0, 10);

  // Her dil sürümü, tüm alternatifleriyle birlikte listelenir.
  const alternates = [
    ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(l)}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs("tr")}" />`,
  ].join("\n");

  const urls = langs
    .map((l) => `  <url>\n    <loc>${abs(l)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
