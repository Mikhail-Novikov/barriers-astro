import { useEffect, useRef, useState, type ReactNode } from "react";
import FilterCheckbox from "@components/FilterCheckbox";
import ConsentDialog from "./ConsentDialog";

/** Значения полей формы обратной связи. */
export type FeedbackFormData = {
  name: string;
  email: string;
  message: string;
};

/** Ошибки валидации общих полей формы. */
export type FeedbackFormErrors = {
  email?: string;
  message?: string;
  consent?: string;
};

type FeedbackFormFieldsProps = {
  /** Уникальный префикс идентификаторов элементов. */
  idPrefix: string;
  /** Текущие значения полей. */
  formData: FeedbackFormData;
  /** Текущие ошибки валидации. */
  errors: FeedbackFormErrors;
  /** Текущее состояние согласия на обработку данных. */
  hasConsent: boolean;
  /** Выбранные фильтры каталога, отправляемые в скрытом поле. */
  barrierOptions?: string;
  /** Обновляет значение имени или адреса электронной почты. */
  onFieldChange: (name: "name" | "email", value: string) => void;
  /** Обновляет текст сообщения. */
  onMessageChange: (message: string) => void;
  /** Обновляет состояние согласия. */
  onConsentChange: (checked: boolean) => void;
  /** Кнопка отправки, размещаемая между сообщением и согласием. */
  submitButton: ReactNode;
};

type FieldLabelProps = {
  fieldId: string;
  label: string;
  required?: boolean;
  labelId?: string;
};

type FieldInputProps = {
  id: string;
  name: "name" | "email";
  type: "text" | "email";
  value: string;
  placeholder: string;
  error?: string;
  onChange: (name: "name" | "email", value: string) => void;
};

function FieldLabel({
  fieldId,
  label,
  required = false,
  labelId,
}: FieldLabelProps): JSX.Element {
  return (
    <label
      id={labelId}
      htmlFor={fieldId}
      className="block mb-1 text-xs sm:text-md/6 font-manrope-semibold text-grey-1000"
    >
      {label}
      {required && <span className="text-cta">*</span>}
    </label>
  );
}

function FieldInput({
  id,
  name,
  type,
  value,
  placeholder,
  error,
  onChange,
}: FieldInputProps): JSX.Element {
  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={
        error === "Email обязателен"
          ? "Введите почту"
          : error
            ? "Некорректный email"
            : placeholder
      }
      aria-invalid={Boolean(error)}
      className={`flex h-[52px] w-full self-stretch items-center rounded-[16px] border bg-white px-5 text-md text-grey-1000 transition-[border-color,box-shadow] focus:outline-none focus:shadow-sm ${
        error
          ? "border-red-500 placeholder-red-500 focus:border-red-500"
          : "border-grey-200 placeholder-grey-800 focus:border-cta"
      }`}
    />
  );
}

/**
 * Общие поля формы обратной связи и чекбокс согласия.
 */
export default function FeedbackFormFields({
  idPrefix,
  formData,
  errors,
  hasConsent,
  barrierOptions = "",
  onFieldChange,
  onMessageChange,
  onConsentChange,
  submitButton,
}: FeedbackFormFieldsProps): JSX.Element {
  const messageFieldRef = useRef<HTMLDivElement>(null);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);

  useEffect(() => {
    const field = messageFieldRef.current;
    if (field && field.innerHTML !== formData.message) {
      field.innerHTML = formData.message;
    }
  }, [formData.message]);

  return (
    <>
      <input
        type="hidden"
        name="form_textarea_1159"
        value={barrierOptions}
        readOnly
      />
      <div>
        <FieldLabel fieldId={`${idPrefix}-name`} label="Имя" />
        <FieldInput
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          value={formData.name}
          placeholder="Имя"
          onChange={onFieldChange}
        />
      </div>

      <div>
        <FieldLabel fieldId={`${idPrefix}-email`} label="Email" required />
        <FieldInput
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          value={formData.email}
          placeholder="Email"
          error={errors.email}
          onChange={onFieldChange}
        />
      </div>

      <div>
        <FieldLabel
          fieldId={`${idPrefix}-message`}
          labelId={`${idPrefix}-message-label`}
          label="Сообщение"
          required
        />
        <div
          ref={messageFieldRef}
          id={`${idPrefix}-message`}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={`${idPrefix}-message-label`}
          aria-invalid={Boolean(errors.message)}
          data-placeholder={errors.message ? "Введите сообщение" : "Сообщение"}
          contentEditable
          suppressContentEditableWarning
          onInput={(event) => onMessageChange(event.currentTarget.innerHTML)}
          className={`w-full px-4 py-2 sm:p-5 h-30 sm:h-[190px] rounded-[16px] border bg-grey-50 bg-white text-grey-1000 text-sm sm:text-lg focus:outline-none transition-colors resize-none empty:before:content-[attr(data-placeholder)] empty:before:text-grey-800 empty:before:pointer-events-none ${
            errors.message
              ? "border-red-500 empty:before:text-red-500 focus:border-red-500"
              : "border-grey-200 focus:border-cta"
          }`}
        />
      </div>

      {submitButton}

      <div>
        <FilterCheckbox
          id={`${idPrefix}-consent`}
          checked={hasConsent}
          required
          invalid={Boolean(errors.consent)}
          onChange={() => {
            if (hasConsent) {
              onConsentChange(false);
              return;
            }

            setIsConsentDialogOpen(true);
          }}
          className="gap-3 px-2 text-sm/5 text-grey-700 sm:text-md/6"
          label={
            <span className="text-grey-700">
              Нажимая на кнопку, вы подтверждаете, что ознакомились с&nbsp;
              <a
                href="https://www.perco.ru/polzovatelskoe-soglashenie/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Пользовательским соглашением
              </a>{" "}
              и&nbsp;
              <a
                href="https://www.perco.ru/politika-konfidentsialnosti/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Политикой конфиденциальности
              </a>{" "}
              и&nbsp;согласны на&nbsp;обработку данных
            </span>
          }
        />
      </div>
      <ConsentDialog
        titleId={`${idPrefix}-consent-title`}
        isOpen={isConsentDialogOpen}
        onClose={() => setIsConsentDialogOpen(false)}
        onReject={() => {
          onConsentChange(false);
          setIsConsentDialogOpen(false);
        }}
        onAccept={() => {
          onConsentChange(true);
          setIsConsentDialogOpen(false);
        }}
      />
    </>
  );
}
