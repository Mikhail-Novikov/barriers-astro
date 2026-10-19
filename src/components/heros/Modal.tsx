import { cloneElement, isValidElement, useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from '@components/Button';
import type { ButtonVariant } from '@components/Button';

/**
 * Пропсы модального окна и кнопки, которая его открывает.
 */
type ModalProps = {
  /** Содержимое модального окна. */
  children: ReactNode;
  /** Заголовок модального окна для доступного имени диалога. */
  title?: string;
  /** Текст кнопки, открывающей модальное окно. */
  triggerLabel?: string;
  /** Дополнительные CSS-классы кнопки открытия. */
  triggerClassName?: string;
  /** Визуальный вариант кнопки открытия. */
  triggerVariant?: ButtonVariant;
  /** Начальное сообщение, передаваемое дочерней форме при открытии. */
  initialMessage?: string;
  /** HTML-идентификатор кнопки открытия. */
  triggerId?: string;
  /** Вызывается при закрытии модального окна. */
  onClose?: () => void;
};

/**
 * Компонент модального окна
 * @param props - Содержимое диалога, настройки кнопки открытия и обработчик закрытия.
 * @returns Кнопка открытия и модальное окно при активном состоянии.
 */
const Modal = ({
  children,
  title = 'Модальное окно',
  triggerLabel = 'Открыть окно',
  triggerClassName = 'btn--outline mr-16 lg:mr-0 hidden lg:block',
  triggerVariant = 'outline',
  initialMessage: initialMessageProp = '',
  triggerId,
  onClose,
}: ModalProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  /** Открывает модальное окно и передаёт дочернему содержимому начальное сообщение. */
  const openModal = () => {
    setInitialMessage(initialMessageProp);
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  /** Закрывает модальное окно и вызывает внешний обработчик закрытия. */
  const closeModal = () => {
    setIsVisible(false);
    setIsOpen(false);
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <>
      <Button
        type="button"
        id={triggerId}
        variant={triggerVariant}
        className={triggerClassName.replace('btn--outline', '')}
        onClick={openModal}
      >
        {triggerLabel}
      </Button>

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-grey-1000/70 p-4 transition-opacity duration-200 ease-out sm:p-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className={`relative my-auto w-full max-w-[760px] rounded-3xl bg-white p-6 transition-all duration-200 ease-out sm:p-10 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute p-2 text-xl leading-none transition-colors sm:text-3xl perco-icons shrink-0 top-2 right-2 sm:right-4 sm:top-4 text-grey-700 hover:text-cta"
              aria-label="Закрыть форму обратной связи"
              onClick={closeModal}
            >
              <span className='perco-icon-close' aria-hidden="true" />
            </button>
            {isValidElement(children)
              ? cloneElement(children as ReactElement<{ initialMessage?: string }>, { initialMessage })
              : children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
