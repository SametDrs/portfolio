import type { Lang } from "../i18n";

export type ProjectGroup = "open" | "closed" | "ongoing";

export interface Project {
  name: string;
  /** Which section the card belongs to. */
  group: ProjectGroup;
  badge: string | Record<Lang, string>;
  /** Omitted for projects that have no public link yet. */
  href?: string;
  variant: "wide" | "pop" | "full" | "two" | "";
  /** Link label for non-GitHub projects (shown instead of the "GitHub →" text). */
  linkLabel?: string;
  /** Source repository, for projects whose main link is a live site. */
  repo?: string;
  desc: Record<Lang, string>;
}

export const projects: Project[] = [
  {
    group: "open",
    name: "peerly",
    badge: "Rust · Tauri",
    href: "https://github.com/SametDrs/peerly",
    variant: "wide",
    desc: {
      tr: "Tek kullanımlık kodla bilgisayarlar arasında doğrudan dosya ve klasör gönderimi. P2P, uçtan uca şifreli, sunucusuz.",
      en: "Send files and folders directly between computers with a one-time code. Peer-to-peer, end-to-end encrypted, serverless.",
    },
  },
  {
    group: "open",
    name: "Launchly",
    badge: "C#",
    href: "https://github.com/SametDrs/Launchly",
    variant: "",
    desc: {
      tr: "Windows için klavye odaklı uygulama ve web başlatıcı. Kısayola bas, yaz, Enter'a bas: program başlat, web'de ara, işlem hesapla veya dosya aç.",
      en: "A keyboard-driven app and web launcher for Windows. Press a hotkey, type, and hit Enter to start a program, search the web, evaluate an expression or open a file.",
    },
  },
  {
    group: "open",
    name: "RiftPilot",
    badge: "Python",
    href: "https://github.com/SametDrs/RiftPilot",
    variant: "pop",
    desc: {
      tr: "League of Legends istemcisini mobil cihazlardan yöneten ve lobi ile seçim süreçlerini otomatikleştiren masaüstü orkestrasyon sistemi.",
      en: "A desktop orchestration system that controls the League of Legends client from mobile devices and automates lobby and pick/ban flows.",
    },
  },
  {
    group: "open",
    name: "SDPI",
    badge: "C++",
    href: "https://github.com/SametDrs/SDPI",
    variant: "",
    desc: {
      tr: "Windows 11 x64'te yalnızca Discord masaüstü uygulamasının ağ paketlerini süreç bazlı işleyen DPI baypas aracı; sistemin diğer trafiğine dokunmaz.",
      en: "A process-bound DPI bypass for the Discord desktop app on Windows 11 x64; it leaves the rest of the system's traffic untouched.",
    },
  },
  {
    group: "closed",
    name: "Harman Digital",
    badge: "Web",
    href: "https://harman.alesta.dev",
    variant: "full",
    linkLabel: "harman.alesta.dev →",
    desc: {
      tr: "Kafe, restoran, çiçekçi ve ajanslar için web siteleri, web otomasyonu, masaüstü ve mobil uygulamalar sunan stüdyo.",
      en: "A studio offering websites, web automation, desktop and mobile apps for cafés, restaurants, florists and agencies.",
    },
  },
  {
    group: "open",
    name: "Portfolio",
    badge: "Astro · TypeScript",
    href: "https://github.com/SametDrs/portfolio",
    variant: "",
    desc: {
      tr: "Şu an baktığın site: Astro ile yazılmış, iki dilli, GSAP ve Lenis ile scroll efektli kişisel portfolio.",
      en: "The site you are looking at: a bilingual personal portfolio built with Astro, with GSAP and Lenis scroll effects.",
    },
  },
  {
    group: "open",
    name: "Özlem Çiçekçilik",
    badge: { tr: "Web · Müşteri işi", en: "Web · Client work" },
    href: "https://tuzlaozlemcicekcilik.com",
    variant: "two",
    linkLabel: "tuzlaozlemcicekcilik.com →",
    repo: "https://github.com/fvrhatb/ozlemcicekcilik",
    desc: {
      tr: "Tuzla'daki bir çiçekçi için yayında olan site: ürün kataloğu, öne çıkan ürünler ve aynı gün teslimatlı online sipariş.",
      en: "A live website for a florist in Tuzla, Istanbul: product catalogue, featured products and online ordering with same-day delivery.",
    },
  },
  {
    group: "ongoing",
    name: "SD Studio",
    badge: { tr: "Yapay zeka ajanları · Devam ediyor", en: "AI agents · In progress" },
    variant: "two",
    desc: {
      tr: "YouTube için içeriği otomatik üretip yükleyen yapay zeka ajanları kullanan sistem: fikirden yayına tüm süreç ajanlarla yürür.",
      en: "A system that uses AI agents to automatically produce and upload content to YouTube, running the whole pipeline from idea to publish.",
    },
  },
  {
    group: "ongoing",
    name: "SD Aura",
    badge: { tr: "Yapay zeka · Devam ediyor", en: "AI · In progress" },
    variant: "",
    desc: {
      tr: "Kişisel yapay zeka asistanı.",
      en: "A personal AI assistant.",
    },
  },
  {
    group: "ongoing",
    name: "SD Games",
    badge: { tr: "Oyun · Devam ediyor", en: "Games · In progress" },
    variant: "",
    desc: {
      tr: "TikTok Games tarzında, kısa ve hızlı oynanan mobil oyunlar.",
      en: "Short, fast-paced mobile games in the style of TikTok Games.",
    },
  },
];
