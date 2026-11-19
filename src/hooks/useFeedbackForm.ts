import { useEffect, useState } from "react";
import { barrierFeedback } from "@utils/barrierFeedback";
import { htmlToPlainText } from "@utils/htmlToPlainText";
import type {
  FeedbackFormData,
  FeedbackFormErrors,
} from "@components/heros/FeedbackFormFields";

const BITRIX_FORM_URL =
  import.meta.env.PUBLIC_BARRIERS_FORM_URL ??
  "https://www.perco.des/php/barriers-config-form.php";
const BITRIX_FORM_PASSWORD =
  import.meta.env.PUBLIC_BARRIERS_FORM_PASSWORD ?? "";

/**
 * Параметры для хука useFeedbackForm.
 */
type UseFeedbackFormOptions = {
  idPrefix: string;
  initialMessage: string;
};

/**
 * Управляет значениями, валидацией и отправкой формы обратной связи.
 */
export function useFeedbackForm({
  idPrefix,
  initialMessage,
}: UseFeedbackFormOptions) {
  const [pendingBarrierFeedback] = useState(() =>
    idPrefix === "open-modal-sale-barrier"
      ? barrierFeedback.peekData()
      : { barrierType: "", options: "" },
  );
  useEffect(() => {
    if (idPrefix === "open-modal-sale-barrier") {
      barrierFeedback.clear();
    }
  }, [idPrefix]);
  const [formData, setFormData] = useState<FeedbackFormData>(() => ({
    name: "",
    email: "",
    message:
      initialMessage ||
      (pendingBarrierFeedback.barrierType
        ? `Здравствуйте!<br />Интересует модель <strong class="font-manrope-semibold">&ldquo;${pendingBarrierFeedback.barrierType}&rdquo;</strong>.`
        : ""),
  }));
  const [errors, setErrors] = useState<FeedbackFormErrors>({});
  const [hasConsent, setHasConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (initialMessage) {
      setFormData((previous) => ({ ...previous, message: initialMessage }));
    }
  }, [initialMessage]);

  const setField = (name: "name" | "email", value: string) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (name === "email" && errors.email) {
      setErrors((previous) => ({ ...previous, email: undefined }));
    }
  };

  const setMessage = (message: string) => {
    setFormData((previous) => ({ ...previous, message }));
    if (errors.message) {
      setErrors((previous) => ({ ...previous, message: undefined }));
    }
  };

  const setConsent = (checked: boolean) => {
    setHasConsent(checked);
    if (checked && errors.consent) {
      setErrors((previous) => ({ ...previous, consent: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: FeedbackFormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      nextErrors.email = "Email обязателен";
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = "Введите корректный email";
    }

    if (!htmlToPlainText(formData.message)) {
      nextErrors.message = "Сообщение обязательно";
    }

    if (!hasConsent) {
      nextErrors.consent = "Необходимо подтвердить согласие на обработку данных";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({
        pw: BITRIX_FORM_PASSWORD,
        name: formData.name,
        email: formData.email,
        phone: "",
        message: htmlToPlainText(formData.message),
        barriers: pendingBarrierFeedback.barrierType,
        options: pendingBarrierFeedback.options,
      });
      const response = await fetch(`${BITRIX_FORM_URL}?${params.toString()}`);
      const responseBody = await response.text();

      if (!response.ok || responseBody.trim() !== "ok") {
        throw new Error(
          `Bitrix form submission failed (${response.status}): ${responseBody.trim() || "empty response"}`,
        );
      }

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setHasConsent(false);
      window.setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Ошибкa отправки формы:", error);
      setSubmitError("Не удалось отправить сообщение. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    hasConsent,
    isSubmitting,
    submitSuccess,
    submitError,
    barrierOptions: pendingBarrierFeedback.options,
    setField,
    setMessage,
    setConsent,
    handleSubmit,
  };
}
