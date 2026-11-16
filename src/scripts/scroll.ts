// Scroll-driven animation layer: Lenis smooth scroll + GSAP ScrollTrigger.
// Replaces the old IntersectionObserver reveal. Content is never left hidden:
// - reduced motion: no animation at all, everything visible immediately
// - script error: all tweens are reverted and the page falls back to plain content
// - no JS: the CSS gating (html.js) never applies
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { splitWords } from "./split";

const root = document.documentElement;
const $ = <T extends HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);
const $$ = <T extends HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));
const handled = (...els: Array<HTMLElement | null | undefined>) =>
  els.forEach((el) => el?.classList.add("handled"));

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduced) {
  root.classList.add("anim-ready");
} else {
  init();
}

function init(): void {
  const cleanups: Array<() => void> = [];
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | undefined;
  let lenis: Lenis | undefined;

  try {
    gsap.registerPlugin(ScrollTrigger);
    // Lift the CSS hiding first; every tween below sets its start state synchronously
    // in this same task, so nothing flashes.
    root.classList.add("anim-ready");

    lenis = setupLenis(cleanups);

    ctx = gsap.context(() => {
      progressBar();
      heroIntro();
      marquee(cleanups);
      headings();
      counters();
      approachWords();
      stickersDrop();
      contactFx();
    });

    mm.add(
      { desk: "(min-width: 861px)", wide: "(min-width: 1100px)" },
      (c) => {
        const { desk, wide } = c.conditions as { desk: boolean; wide: boolean };
        heroScrub(desk);
        projectsGrow(wide);
        projectCards(desk);
        journey(desk);
      },
    );

    ctx.add(() => genericReveal());

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);
  } catch (err) {
    console.error("[scroll] animation setup failed, falling back to static content", err);
    mm.revert();
    ctx?.revert();
    cleanups.forEach((fn) => fn());
    lenis?.destroy();
    root.classList.add("anim-ready", "anim-failed");
  }
}

/* 1. Lenis smooth scroll synced to GSAP, with working anchor links */
function setupLenis(cleanups: Array<() => void>): Lenis {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const hash = a.getAttribute("href") ?? "";
    if (hash === "#" || hash === "#top") {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.4 });
      return;
    }
    const target = document.querySelector<HTMLElement>(hash);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.4 });
    }
  };
  document.addEventListener("click", onClick);

  cleanups.push(() => {
    gsap.ticker.remove(tick);
    document.removeEventListener("click", onClick);
  });
  return lenis;
}

/* 2. Scroll progress bar */
function progressBar(): void {
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
  });
}

/* 3a. Hero intro on load */
function heroIntro(): void {
  const h1 = $("#top h1");
  if (!h1) return;
  const eyebrow = $("#top .eyebrow");
  const p = $("#top p");
  const cta = $("#top .cta");
  const tags = $$("#top .tag");
  handled(h1, eyebrow, p, cta, ...tags);

  const { words, marks } = splitWords(h1, { mask: true, label: true });
  const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
  tl.from(eyebrow, { y: 16, opacity: 0, duration: 0.6 })
    .from(words, { yPercent: 120, duration: 1, ease: "power4.out", stagger: 0.09, clearProps: "transform" }, "<0.1")
    .from(
      marks,
      {
        scale: 0,
        opacity: 0,
        rotation: (_i: number, el: Element) => (el.classList.contains("blue") ? 40 : -40),
        duration: 0.8,
        ease: "back.out(3)",
        stagger: 0.15,
        clearProps: "transform,opacity",
      },
      "-=0.5",
    )
    .from([p, cta], { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, clearProps: "transform,opacity" }, "-=0.4")
    .from(tags, { opacity: 0, duration: 0.6, stagger: 0.1, clearProps: "opacity" }, "-=0.6");
}

/* 3b. Hero scrub: tag parallax + headline shrink/fade (desktop only) */
function heroScrub(desk: boolean): void {
  if (!desk) return;
  const hero = $(".hero");
  const h1 = $(".hero h1");
  if (!hero || !h1) return;
  const trigger = { trigger: hero, start: "top top", end: "bottom top", scrub: true };

  gsap.to(h1, { scale: 0.9, opacity: 0.55, transformOrigin: "50% 0%", ease: "none", scrollTrigger: trigger });

  const dx = [-12, 14, -9, 11, -7];
  const dy = [-140, -90, -180, -120, -80];
  $$(".hero .tag").forEach((tag, i) => {
    gsap.fromTo(
      tag,
      { "--dx": "0vw", "--dy": "0px" },
      { "--dx": `${dx[i % dx.length]}vw`, "--dy": `${dy[i % dy.length]}px`, ease: "none", scrollTrigger: trigger },
    );
  });
}

/* 4. Marquee reacts to scroll velocity and direction */
function marquee(cleanups: Array<() => void>): void {
  const track = $(".marquee .track");
  if (!track) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  loop.totalTime(28 * 1000); // headroom so it can run backwards from the start

  let target = 1;
  let current = 1;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const dir = self.direction || 1;
      target = dir * (1 + Math.min(Math.abs(self.getVelocity()) / 250, 8));
    },
  });
  const tick = () => {
    const base = target < 0 ? -1 : 1;
    target += (base - target) * 0.04;
    current += (target - current) * 0.1;
    loop.timeScale(current);
  };
  gsap.ticker.add(tick);
  cleanups.push(() => gsap.ticker.remove(tick));
}

/* 5. Section headings: per-word masked rise, highlight words pop last */
function headings(): void {
  $$("h2.display").forEach((h) => {
    const parent = h.parentElement;
    const eyebrow = parent?.querySelector<HTMLElement>(":scope > .eyebrow");
    handled(h, parent, eyebrow);

    const { words, marks } = splitWords(h, { mask: true, label: true });
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: h, start: "top 86%", end: "max", once: true },
    });
    if (eyebrow) tl.from(eyebrow, { y: 16, opacity: 0, duration: 0.6, clearProps: "transform,opacity" }, 0);
    tl.from(words, { yPercent: 120, duration: 0.9, ease: "power4.out", stagger: 0.06, clearProps: "transform" }, 0.05).from(
      marks,
      {
        scale: 0,
        opacity: 0,
        rotation: (_i: number, el: Element) => (el.classList.contains("blue") ? 35 : -35),
        duration: 0.75,
        ease: "back.out(2.6)",
        stagger: 0.12,
        clearProps: "transform,opacity",
      },
      ">-0.3",
    );
  });
}

/* 6. Stat counters */
function counters(): void {
  $$(".stat b").forEach((b) => {
    const m = /^(\d+)(.*)$/.exec((b.textContent ?? "").trim());
    if (!m) return;
    const end = Number(m[1]);
    const suffix = m[2] ?? "";
    b.textContent = `0${suffix}`;
    ScrollTrigger.create({
      trigger: b,
      start: "top 92%",
      end: "max",
      once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            b.textContent = `${Math.round(o.v)}${suffix}`;
          },
          onComplete: () => {
            b.textContent = `${end}${suffix}`;
          },
        });
      },
    });
  });
}

/* 7. Journey: timeline line draws with scroll, items appear as it reaches them */
function journey(desk: boolean): void {
  const line = $(".timeline");
  if (!line) return;
  const steps = $$(".step", line);
  handled(...steps);
  gsap.set(steps, { opacity: 0, y: 50 });

  const shown = new Set<number>();
  const show = (i: number) => {
    if (shown.has(i)) return;
    shown.add(i);
    gsap.to(steps[i], { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity" });
  };

  let ratios: number[] | null = null;
  // The trunk is vertical at every width, so progress maps to each step's top offset.
  const measure = () => steps.map((s) => (s.offsetTop + (desk ? 28 : 24)) / line.offsetHeight);

  gsap.fromTo(
    line,
    { "--draw": 0 },
    {
      "--draw": 1,
      ease: "none",
      scrollTrigger: {
        trigger: line,
        start: "top 78%",
        end: "bottom 55%",
        scrub: 0.5,
        onRefresh: () => {
          ratios = null;
        },
        onUpdate: (self) => {
          ratios ??= measure();
          ratios.forEach((r, i) => {
            if (self.progress >= r) show(i);
          });
        },
      },
    },
  );
  // Safety net: never leave items hidden once the timeline is fully scrolled past.
  ScrollTrigger.create({
    trigger: line,
    start: "bottom bottom",
    end: "max",
    onEnter: () => steps.forEach((_, i) => show(i)),
  });
}

/* 8a. Projects block grows from an inset card to full width (wide screens only) */
function projectsGrow(wide: boolean): void {
  const sec = $("#projects");
  if (!wide || !sec) return;
  gsap.fromTo(
    sec,
    { clipPath: "inset(0px 6% 0px 6% round 64px)" },
    {
      clipPath: "inset(0px 0% 0px 0% round 40px)",
      ease: "none",
      scrollTrigger: { trigger: sec, start: "top 95%", end: "top 30%", scrub: true },
    },
  );
}

/* 8b. Project cards: staggered entrance from below, 3D tilt that settles (desktop) */
function projectCards(desk: boolean): void {
  const cards = $$("#projects .card");
  if (!cards.length) return;
  handled(...cards);
  gsap.set(cards, {
    opacity: 0,
    y: 90,
    ...(desk ? { rotationX: -18, transformPerspective: 900, transformOrigin: "50% 100%" } : {}),
  });
  ScrollTrigger.batch(cards, {
    start: "top 92%",
    end: "max",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        clearProps: "transform,opacity",
      }),
  });
}

/* 9. Approach: words fill from dim to full, tied to scroll */
function approachWords(): void {
  $$("#approach .point p").forEach((p) => {
    const { words } = splitWords(p, { mask: false, label: false });
    gsap.fromTo(
      words,
      { opacity: 0.15 },
      {
        opacity: 1,
        ease: "none",
        duration: 1,
        stagger: 0.5,
        scrollTrigger: { trigger: p, start: "top 88%", end: "bottom 58%", scrub: true },
      },
    );
  });
}

/* 10. Stickers drop in with a bounce when the board enters view */
function stickersDrop(): void {
  const board = $("#board");
  if (!board) return;
  const stickers = $$(".sticker", board);
  gsap.from(stickers, {
    y: () => -(board.clientHeight + 140),
    duration: 1.2,
    ease: "bounce.out",
    stagger: 0.12,
    scrollTrigger: { trigger: board, start: "top 80%", end: "max", once: true },
  });
}

/* 11. Contact: heading scales up with scrub, buttons stagger in */
function contactFx(): void {
  const h = $("#contact h2");
  const links = $("#contact .links");
  if (h) {
    gsap.fromTo(
      h,
      { scale: 0.45 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: h, start: "top 100%", end: "top 55%", scrub: 0.4 },
      },
    );
  }
  if (links) {
    handled(links);
    gsap.from($$("a", links), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: links, start: "top 94%", end: "max", once: true },
    });
  }
}

/* Everything else marked .reveal: simple batched fade-up */
function genericReveal(): void {
  const els = $$(".reveal").filter((el) => !el.classList.contains("handled"));
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: 36 });
  ScrollTrigger.batch(els, {
    start: "top 90%",
    end: "max",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "transform,opacity",
      }),
  });
}
