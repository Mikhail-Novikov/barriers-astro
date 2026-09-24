import { cloneElement, isValidElement, useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  title?: string;
  triggerLabel?: string;
  triggerClassName?: string;
}

const Modal = ({
  children,
  title = 'Модальное окно',
  triggerLabel = 'Открыть окно',
  triggerClassName = 'btn--outline mr-16 lg:mr-0 hidden lg:block',
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  const openModal = () => {
    setInitialMessage('');
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const closeModal = () => {
    setIsVisible(false);
    setIsOpen(false);
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

  useEffect(() => {
    const handleExternalOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      setInitialMessage(customEvent.detail?.message ?? '');
      setIsOpen(true);
      requestAnimationFrame(() => setIsVisible(true));
    };

    window.addEventListener('open-feedback-modal', handleExternalOpen);
    return () => window.removeEventListener('open-feedback-modal', handleExternalOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={openModal}
      >
        {triggerLabel}
      </button>

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
              className="absolute right-4 top-4 p-2 text-3xl leading-none text-grey-700 transition-colors hover:text-cta"
              aria-label="Закрыть форму обратной связи"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
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
