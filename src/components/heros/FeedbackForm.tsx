import { useEffect, useRef, useState } from 'react';
import { barrierFeedback } from '@utils/barrierFeedback';

// интерфейсы для данных формы
interface FormData {
  name: string;
  email: string;
  message: string;
}

// интерфейсы для ошибок валидации
interface FormErrors {
  email?: string;
  message?: string;
}

// интерфейсы пропсов компонента
interface FeedbackFormProps {
  // префикс id элементов формы
  idPrefix?: string;
  // начальное сообщение, которое будет установлено в поле сообщения
  initialMessage?: string;
}

/**
 * Компонент формы обратной связи
 * @param idPrefix - префикс для id элементов формы
 * @return {JSX.Element} JSX-элемент, представляющий форму обратной связи
 */
const FeedbackForm = ({ idPrefix = 'feedback', initialMessage = '' }: FeedbackFormProps): JSX.Element => {
  const pendingMessage = idPrefix === 'open-modal-sale-barrier'
    ? barrierFeedback.consume()
    : '';
  const [formData, setFormData] = useState<FormData>(() => ({
    name: '',
    email: '',
    message: initialMessage || pendingMessage,
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const messageFieldRef = useRef<HTMLTextAreaElement>(null);

  // Синхронизация сообщения из props initialMessage в состояние формы
  useEffect(() => {
    if (initialMessage) {
      setFormData((prev) => ({ ...prev, message: initialMessage }));
    }
  }, [initialMessage]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (messageFieldRef.current && messageFieldRef.current.value !== formData.message) {
        messageFieldRef.current.value = formData.message;
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [formData.message]);

  /**
   * Функция для валидации email
   * @param email - email для проверки
   * @return {boolean} true, если email корректный, иначе false
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Функция для валидации формы обратной связи
   * @return {boolean} true, если форма валидна, иначе false
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Обработчик изменения полей формы
   * @param event - событие изменения поля
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Обработчик отправки формы
   * @param event - событие отправки формы
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Здесь можно добавить отправку данных на сервер
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(formData) })
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Скрыть сообщение об успехе через 5 секунд
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Ошибкa отправки формы:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email.trim() && formData.message.trim();

  return (
    <div className="rounded-3xl max-w-[684px]">
      <h3 className="text-center sm:text-left text-lg/6 sm:text-[38px]/[46px] font-manrope-semibold text-shadow-grey-800 sm:text-grey-1000 mb-6">Свяжитесь с&nbsp;нами</h3>

      {submitSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm">
          Спасибо! Ваше сообщение отправлено. Мы&nbsp;свяжемся с&nbsp;вами в&nbsp;ближайшее время.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm sm:text-lg">
        {/* Имя */}
        <div>
          <label htmlFor={`${idPrefix}-name`} className="block text-xs sm:text-md/6 font-manrope-semibold text-grey-1000 mb-1">
            Имя
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
            className="w-full px-4 h-11 sm:h-13 rounded-lg sm:rounded-[20px] border border-grey-300 bg-white text-grey-1000 placeholder-grey-800 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`${idPrefix}-email`} className="block text-xs sm:text-md/6 font-manrope-semibold text-grey-1000 mb-1">
            Email<span className="text-cta">*</span>
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full px-4 h-11 sm:h-13 rounded-lg sm:rounded-[20px] border bg-grey-50 text-grey-1000 text-sm sm:text-lg bg-white placeholder-grey-800 focus:outline-none transition-colors ${
              errors.email
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-grey-300 focus:border-cta focus:ring-1 focus:ring-cta'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Сообщение */}
        <div>
          <label htmlFor={`${idPrefix}-message`} className="block text-xs sm:text-md/6 font-manrope-semibold text-grey-1000 mb-1">
            Сообщение<span className="text-cta">*</span>
          </label>
          <textarea
            ref={messageFieldRef}
            id={`${idPrefix}-message`}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Сообщение"
            rows={5}
            className={`w-full px-4 py-2 sm:p-5 h-30 sm:h-[190px] rounded-lg sm:rounded-[20px] border bg-grey-50 bg-white text-grey-1000 text-sm sm:text-lg placeholder-grey-800 focus:outline-none transition-colors resize-none ${
              errors.message
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-grey-300 focus:border-cta focus:ring-1 focus:ring-cta'
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`mt-4 w-full h-12 sm:h-16 px-6 rounded-2xl font-manrope-semibold text-white text-lg transition-colors ${
            isFormValid && !isSubmitting
              ? 'rounded-2xl bg-cta px-8 text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-cta-disabled cursor-pointer text-lg'
              : 'bg-cta-disabled cursor-not-allowed opacity-50'
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
