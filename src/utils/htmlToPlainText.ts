/**
 * Преобразует HTML в обычный текст, сохраняя переносы строк.
 * @param html - входная строка с HTML
 * @returns текст без HTML-тегов
 */
export function htmlToPlainText(html: string): string {
  const body = new DOMParser().parseFromString(html, "text/html").body;
  body.querySelectorAll("br").forEach((lineBreak) => lineBreak.replaceWith("\n"));
  body.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6").forEach((block) => {
    block.append("\n");
  });

  return (body.textContent ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
