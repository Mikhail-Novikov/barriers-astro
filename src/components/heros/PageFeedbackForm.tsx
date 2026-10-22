import { useEffect, useState } from "react";
import { useFeedbackForm } from "@hooks/useFeedbackForm";
import { Button } from "@components/Button";
import FeedbackFormFields from "./FeedbackFormFields";
import Modal from "./Modal";
import ModalStatusContent from "./ModalStatusContent";

type PageFeedbackFormProps = {
  /** Префикс идентификаторов HTML-элементов формы. */
  idPrefix?: string;
  /** Начальный текст сообщения. */
  initialMessage?: string;
};

/**
 * Форма обратной связи, отображаемая непосредственно на странице.
 * @param props - Префикс идентификаторов и начальный текст сообщения.
 * @returns JSX-элемент формы обратной связи с полями, кнопкой отправки и модальным окном для статуса.
 */
export default function PageFeedbackForm({
  idPrefix = "feedback-page",
  initialMessage = "",
}: PageFeedbackFormProps): JSX.Element {
  const form = useFeedbackForm({ idPrefix, initialMessage });
  const [isStatusModalDismissed, setIsStatusModalDismissed] = useState(false);

  useEffect(() => {
    setIsStatusModalDismissed(false);
  }, [form.submitSuccess, form.submitError]);

  return (
    <>
      <h3 className="mb-6 text-center text-[28px]/[32px] font-manrope-bold sm:text-left sm:text-3xl/10 sm:text-grey-1000 xl:text-[38px]/[45px]">
        Свяжитесь с нами
      </h3>
      <Modal
        title={form.submitSuccess ? "Сообщение отправлено" : "Ошибка отправки сообщения"}
        isOpen={(form.submitSuccess || Boolean(form.submitError)) && !isStatusModalDismissed}
        showTrigger={false}
        onClose={() => setIsStatusModalDismissed(true)}
      >
        <ModalStatusContent
          success={form.submitSuccess}
          message={
            form.submitSuccess
              ? "Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время."
              : form.submitError
          }
        />
      </Modal>
      <form
        noValidate
        onSubmit={form.handleSubmit}
        className="flex flex-col gap-6 text-sm rounded-3xl bg-grey-200 sm:text-lg"
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
              className="w-full h-16 px-6 mt-4 text-xl font-manrope-semibold sm:text-2xl"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          }
        />
      </form>
    </>
  );
}
