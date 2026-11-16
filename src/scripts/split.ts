// Small word splitter (no paid GSAP SplitText). Keeps nested .hl spans, <br>,
// spaces and Turkish characters intact. The visual pieces are aria-hidden and the
// original text stays available to assistive tech (aria-label on headings, a
// visually hidden copy for other elements).

export interface SplitResult {
  /** Elements to animate: the inner word span (masked) or the word span (unmasked). */
  words: HTMLElement[];
  /** Highlight spans (.hl) that are kept whole. */
  marks: HTMLElement[];
}

interface SplitOptions {
  mask: boolean;
  label: boolean;
}

export function splitWords(el: HTMLElement, { mask, label }: SplitOptions): SplitResult {
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  const words: HTMLElement[] = [];
  const marks: HTMLElement[] = [];

  const wrapper = document.createElement("span");
  wrapper.setAttribute("aria-hidden", "true");
  while (el.firstChild) wrapper.appendChild(el.firstChild);

  if (label) {
    el.setAttribute("aria-label", text);
  } else {
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    el.appendChild(sr);
  }
  el.appendChild(wrapper);

  const walk = (node: Node): void => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (child as Text).data.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            continue;
          }
          const w = document.createElement("span");
          w.className = mask ? "sw mask" : "sw";
          if (mask) {
            const inner = document.createElement("span");
            inner.className = "swi";
            inner.style.display = "inline-block";
            inner.textContent = part;
            w.appendChild(inner);
            words.push(inner);
          } else {
            w.textContent = part;
            words.push(w);
          }
          frag.appendChild(w);
        }
        node.replaceChild(frag, child);
      } else if (child instanceof HTMLElement) {
        if (child.classList.contains("hl")) marks.push(child);
        else if (child.tagName !== "BR") walk(child);
      }
    }
  };
  walk(wrapper);

  return { words, marks };
}
