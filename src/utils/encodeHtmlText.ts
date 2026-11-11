/** Утилита защиты от «плохих» символов */
export const encodeHtmlText = (text: string): string =>
  Array.from(text)
    .filter((ch) => {
      const cp = ch.codePointAt(0)!;
      // убираем одиночные суррогаты и сам U+FFFD
      return cp !== 0xfffd && !(cp >= 0xd800 && cp <= 0xdfff);
    })
    .join('');