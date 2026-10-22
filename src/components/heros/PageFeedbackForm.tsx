import { useFeedbackForm } from "@hooks/useFeedbackForm";
import { Button } from "@components/Button";
import FeedbackFormFields from "./FeedbackFormFields";

type PageFeedbackFormProps = {
  /** Префикс идентификаторов HTML-элементов формы. */
  idPrefix?: string;
  /** Начальный текст сообщения. */
  initialMessage?: string;
};

/**
 * Форма обратной связи, отображаемая непосредственно на странице.
 */
export default function PageFeedbackForm({
  idPrefix = "feedback-page",
  initialMessage = "",
}: PageFeedbackFormProps): JSX.Element {
  const form = useFeedbackForm({ idPrefix, initialMessage });

  return (
    <>
      <h3 className="mb-6 text-center text-[28px]/[32px] font-manrope-bold sm:text-left sm:text-3xl/10 sm:text-grey-1000 xl:text-[38px]/[45px]">
        Свяжитесь с нами
      </h3>
      {form.submitSuccess && (
        <div className="p-4 mb-6 text-sm text-green-800 border border-green-200 rounded-2xl bg-green-50">
          Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
        </div>
      )}
      {form.submitError && (
        <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50" role="alert">
          {form.submitError}
        </div>
      )}
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
              className="w-full h-16 px-6 mt-4 text-xl rounded-3xl font-manrope-semibold sm:text-2xl"
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
