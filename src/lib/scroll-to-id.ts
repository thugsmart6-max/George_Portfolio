export function scrollToId(id: string, offset = 96) {
  if (typeof window === "undefined" || !id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, duration: 0.9 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
