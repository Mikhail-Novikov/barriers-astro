import { useEffect, useRef } from "react";
import { useFeedbackForm } from "@hooks/useFeedbackForm";
import { Button } from "@components/Button";
import FeedbackFormFields from "./FeedbackFormFields";
import { publicAsset } from "@utils/publicAsset";

type FeedbackSubmissionResult = {
  success: boolean;
  message: string;
};

type ModalFeedbackFormProps = {
  /** Префикс идентификаторов HTML-элементов формы. */
  idPrefix?: string;
  /** Начальный текст сообщения. */
  initialMessage?: string;
  /** Вызывается с результатом отправки формы. */
  onSubmitResult?: (result: FeedbackSubmissionResult) => void;
};

/**
 * Форма обратной связи для модального окна.
 */
export default function ModalFeedbackForm({
  idPrefix = "modal-feedback",
  initialMessage = "",
  onSubmitResult,
}: ModalFeedbackFormProps): JSX.Element {
  const form = useFeedbackForm({ idPrefix, initialMessage });
  const onSubmitResultRef = useRef(onSubmitResult);

  useEffect(() => {
    onSubmitResultRef.current = onSubmitResult;
  }, [onSubmitResult]);

  useEffect(() => {
    if (form.submitSuccess) {
      const result = {
        success: true,
        message: "Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.",
      };
      if (onSubmitResultRef.current) {
        onSubmitResultRef.current(result);
      } else {
        window.dispatchEvent(new CustomEvent("feedback-form:result", { detail: result }));
      }
    } else if (form.submitError) {
      const result = {
        success: false,
        message: form.submitError,
      };
      if (onSubmitResultRef.current) {
        onSubmitResultRef.current(result);
      } else {
        window.dispatchEvent(new CustomEvent("feedback-form:result", { detail: result }));
      }
    }
  }, [form.submitSuccess, form.submitError]);

  return (
    <div className="flex flex-col items-center text-center bg-grey-200">
      <img 
        src={publicAsset('/img/ill-feedback.webp')}
        alt="Техническая поддержка" 
        className="block h-auto max-w-[188px] mb-6 object-contain"
        loading="lazy"
      />
      <h3 className="mb-2 text-center text-[28px]/[32px] font-manrope-bold sm:text-left sm:text-grey-1000 xl:text-3xl/8">
        Нужна помощь с&nbsp;выбором?
      </h3>
      <p className="text-lg/6 font-manrope-semibold sm:text-left text-grey-800 sm:text-grey-700">
        Мы&nbsp;свяжемся с&nbsp;вами в&nbsp;ближайшее рабочее время
      </p>
      <form
        noValidate
        onSubmit={form.handleSubmit}
        className="flex flex-col gap-6 max-w-[500px] mt-7 rounded-3xl text-sm text-left sm:text-lg"
      >
        <FeedbackFormFields
          idPrefix={idPrefix}
          formData={form.formData}
          errors={form.errors}
          hasConsent={form.hasConsent}
          barrierOptions={form.barrierOptions}
          onFieldChange={form.setField}
          onMessageChange={form.setMessage}
          onConsentChange={form.setConsent}
          submitButton={
            <Button
              type="submit"
              className="w-full px-6 mt-1 text-xl sm:h-16 font-manrope-semibold"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          }
        />
      </form>
    </div>
  );
}
