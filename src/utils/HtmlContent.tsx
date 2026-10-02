import type React from "react";

/**
 * Компонент для безопасного отображения HTML-контента.
 * @param children HTML-контент в виде строки.
 * @returns JSX-элемент с безопасным HTML-контентом.
 */
export const HtmlContent = ({ children }: { children: string }) => (
  <span className="empty:hidden" dangerouslySetInnerHTML={{ __html: children }} />
);