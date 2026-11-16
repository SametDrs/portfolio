import type { Lang } from "../i18n";

export interface Project {
  name: string;
  badge: string;
  href: string;
  variant: "wide" | "pop" | "";
  external?: boolean;
  desc: Record<Lang, string>;
}

export const projects: Project[] = [
  {
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
    name: "Harman Digital",
    badge: "Web",
    href: "https://harman.alesta.dev",
    variant: "",
    external: true,
    desc: {
      tr: "Kafe, restoran, çiçekçi ve ajanslar için web siteleri, web otomasyonu, masaüstü ve mobil uygulamalar sunan stüdyo.",
      en: "A studio offering websites, web automation, desktop and mobile apps for cafés, restaurants, florists and agencies.",
    },
  },
];
