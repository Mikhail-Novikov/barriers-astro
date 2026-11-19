import { useEffect, useRef, useState } from "react";
import { Button } from "@components/Button";

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_CONSENT_TITLE_ID = "cookie-consent-title";

type CookieConsentDialogProps = {
  // Опция для отключения диалога согласия на использование cookie.
  disabled?: boolean;
};

/**
 * Диалог согласия на использование cookie.
 * @param disabled - если true, диалог не отображается.
 * @returns JSX.Element | null - компонент диалога или null, если он отключен.
 */
export default function CookieConsentDialog({
  disabled = false,
}: CookieConsentDialogProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      return;
    }

    try {
      setIsOpen(window.localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted");
    } catch (error) {
      console.error(
        "Не удалось проверить сохраненное согласие на использование cookie.",
        error,
      );
      setIsOpen(true);
    }
  }, [disabled]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !disabled && !dialog.open) {
      dialog.showModal();
    } else if ((disabled || !isOpen) && dialog.open) {
      dialog.close();
    }
  }, [disabled, isOpen]);

  const acceptCookies = (): void => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch (error) {
      console.error(
        "Не удалось сохранить согласие на использование cookie.",
        error,
      );
    }

    setIsOpen(false);
  };

  if (disabled) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={COOKIE_CONSENT_TITLE_ID}
      onCancel={(event) => event.preventDefault()}
      onClose={() => setIsOpen(false)}
      className="m-auto w-[calc(100%-2rem)] max-w-[600px] rounded-2xl p-6 text-left backdrop:bg-black/50 sm:p-10"
    >
      <h2
        id={COOKIE_CONSENT_TITLE_ID}
        className="mb-4 text-xl font-manrope-bold text-grey-1000 sm:text-2xl"
      >
        Использование файлов cookie
      </h2>
      <p className="mb-8 text-md/6 text-grey-1000">
        Мы&nbsp;используем файлы cookie, чтобы улучшить работу сайта, повысить его
        эффективность и&nbsp;удобство. Используя этот сайт, вы&nbsp;соглашаетесь с{" "}
        <a
          href="https://www.perco.ru/politika-konfidentsialnosti/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-cta"
        >
          Политикой конфиденциальности
        </a>{" "}
        и&nbsp;
        <a
          href="https://new.perco.ru/politika-konfidentsialnosti/cookies.php"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-cta"
        >
          Политикой cookie
        </a>.
      </p>
      <Button type="button" className="px-6 py-3 w-[200px]" onClick={acceptCookies}>
        Принимаю
      </Button>
    </dialog>
  );
}
