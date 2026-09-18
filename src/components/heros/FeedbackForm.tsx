import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  email?: string;
  message?: string;
}

const FeedbackForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Здесь можно добавить отправку данных на сервер
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(formData) })
      
      console.log('Отправка обратной связи:', formData);
      
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
      <h3 className="text-[38px]/[46px] font-manrope-semibold text-grey-1000 mb-6">Свяжитесь с&nbsp;нами</h3>

      {submitSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm">
          Спасибо! Ваше сообщение отправлено. Мы&nbsp;свяжемся с&nbsp;вами в&nbsp;ближайшее время.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Имя */}
        <div>
          <label htmlFor="name" className="block text-md/6 font-manrope-semibold text-grey-1000 mb-1">
            Имя
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
            className="w-full px-4 h-13 rounded-3xl border border-grey-300 bg-white text-grey-1000 placeholder-grey-800 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-md/6 font-manrope-semibold text-grey-1000 mb-1">
            Email<span className="text-cta">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full px-4 h-13 rounded-3xl border bg-grey-50 text-grey-1000 text-lg bg-white placeholder-grey-800 focus:outline-none transition-colors ${
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
          <label htmlFor="message" className="block text-md/6 font-manrope-semibold text-grey-1000 mb-1">
            Сообщение<span className="text-cta">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Сообщение"
            rows={5}
            className={`w-full px-4 h-[190px] pt-5 rounded-3xl border bg-grey-50 bg-white text-grey-1000 text-lg placeholder-grey-800 focus:outline-none transition-colors resize-none ${
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
          className={`mt-4 w-full py-3 px-6 rounded-2xl font-manrope-semibold text-white text-lg transition-colors ${
            isFormValid && !isSubmitting
              ? 'rounded-2xl bg-cta px-8 py-3 text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-cta-disabled cursor-pointer text-lg'
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
