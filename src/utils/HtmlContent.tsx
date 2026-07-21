import type React from "react";

export const HtmlContent = ({ children }: { children: string }) => (
  <span className="empty:hidden" dangerouslySetInnerHTML={{ __html: children }} />
);