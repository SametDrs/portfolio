// Draggable stickers via Pointer Events (mouse, touch and pen share one code path).
const board = document.getElementById("board");

if (board) {
  const stickers = Array.from(board.querySelectorAll<HTMLElement>(".sticker"));
  let z = 1;

  const clamp = (el: HTMLElement, x: number, y: number) => ({
    x: Math.max(0, Math.min(x, board.clientWidth - el.offsetWidth)),
    y: Math.max(0, Math.min(y, board.clientHeight - el.offsetHeight)),
  });

  const keepInside = () => {
    for (const el of stickers) {
      const { x, y } = clamp(el, el.offsetLeft, el.offsetTop);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  };

  keepInside();
  window.addEventListener("resize", keepInside);

  for (const el of stickers) {
    el.addEventListener("pointerdown", (e: PointerEvent) => {
      e.preventDefault();
      const b = board.getBoundingClientRect();
      const offX = e.clientX - b.left - el.offsetLeft;
      const offY = e.clientY - b.top - el.offsetTop;
      el.setPointerCapture(e.pointerId);
      el.style.zIndex = String(++z);

      const move = (ev: PointerEvent) => {
        const r = board.getBoundingClientRect();
        const { x, y } = clamp(el, ev.clientX - r.left - offX, ev.clientY - r.top - offY);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      };
      const up = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }
}
