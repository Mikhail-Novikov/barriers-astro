import { cloneElement, isValidElement, useState, useRef, useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { Button } from '@components/Button';
import type { ButtonVariant } from '@components/Button';

import { publicAsset } from "@utils/publicAsset";

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
  /** Управляемое состояние окна. Если не задано, окном управляет кнопка-триггер. */
  isOpen?: boolean;
  /** Показывать ли кнопку-триггер. */
  showTrigger?: boolean;
  /** Блокировать прокрутку страницы при открытом окне. */
  lockScroll?: boolean;
  /** Вызывается при закрытии модального окна. */
  onClose?: () => void;
};

type ModalSubmissionResult = {
  success: boolean;
  message: string;
};

type ModalChildProps = {
  initialMessage?: string;
  onSubmitResult?: (result: ModalSubmissionResult) => void;
};

type ModalStatusContentProps = ModalSubmissionResult;

const ModalStatusContent = ({ success, message }: ModalStatusContentProps): JSX.Element => (
  <div className="p-10 sm:p-24 min-h-[70vh]">
    <div className="mb-7 max-w-[400px]">
      {success ? (
        <img
          src={publicAsset('/img/feedback-img-response.webp')}
          alt="Успешная отправка сообщения"
          className="object-contain h-auto"
          width={400}
          height={260}
        /> 
      ) : (
        <img
          src={publicAsset('/img/empty-search.webp')}
          alt="Ошибка отправки сообщения"
          className="object-contain h-auto"
          width={424}
          height={307}
        />
      )}
    </div>
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-center text-[28px]/[32px] font-manrope-bold sm:text-grey-1000 xl:text-3xl/8">
        {success ? (<>Спасибо за&nbsp;обращение!</>) : (<>Ошибка отправки сообщения</>)}
      </h3>
      <p className="text-center text-lg/6 font-manrope-semibold text-grey-800 sm:text-grey-700">
        {success ? (<>Наш сотрудник свяжется с&nbsp;вами в&nbsp;ближайшее рабочее время</>) : (<>Попробуйте отправить сообщение позже</>)} 
      </p>
    </div>
  </div>
);

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
  isOpen: controlledIsOpen,
  showTrigger = true,
  lockScroll = true,
  onClose,
}: ModalProps): JSX.Element => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [submissionResult, setSubmissionResult] = useState<ModalSubmissionResult | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  /** Открывает модальное окно и передаёт дочернему содержимому начальное сообщение. */
  const openModal = () => {
    setInitialMessage(initialMessageProp);
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    requestAnimationFrame(() => setIsVisible(true));
  };

  /** Закрывает модальное окно и вызывает внешний обработчик закрытия. */
  const closeModal = () => {
    setIsVisible(false);
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onClose?.();
  };

  const handleSubmitResult = (result: ModalSubmissionResult) => {
    setSubmissionResult(result);
    closeModal();
  };

  useEffect(() => {
    if (controlledIsOpen === undefined) {
      return undefined;
    }

    if (!controlledIsOpen) {
      setIsVisible(false);
      return undefined;
    }

    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [controlledIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
        if (dialogs[dialogs.length - 1] !== dialogRef.current) {
          return;
        }
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const handleSubmissionEvent = (event: Event) => {
      const submissionEvent = event as CustomEvent<ModalSubmissionResult>;
      handleSubmitResult(submissionEvent.detail);
    };
    window.addEventListener('feedback-form:result', handleSubmissionEvent);
    if (lockScroll) {
      document.body.classList.add('overflow-hidden');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('feedback-form:result', handleSubmissionEvent);
      if (lockScroll) {
        document.body.classList.remove('overflow-hidden');
      }
    };
  }, [isOpen, lockScroll]);

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          id={triggerId}
          variant={triggerVariant}
          className={triggerClassName.replace('btn--outline', '')}
          onClick={openModal}
        >
          {triggerLabel}
        </Button>
      )}

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-grey-1000/70 p-0 transition-opacity duration-200 ease-out sm:p-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className={`relative my-auto h-full sm:h-auto w-full max-w-[760px] sm:rounded-3xl bg-grey-200 p-[64px_16px_32px] transition-all duration-200 ease-out sm:p-[64px_40px] ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(event) => event.stopPropagation()}
            ref={dialogRef}
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
              ? cloneElement(children as ReactElement<ModalChildProps>, {
                  initialMessage,
                  onSubmitResult: handleSubmitResult,
                })
              : children}
          </div>
        </div>
      )}
      {submissionResult && (
        <Modal
          title={submissionResult.success ? 'Сообщение отправлено' : 'Ошибка отправки сообщения'}
          isOpen
          showTrigger={false}
          lockScroll={false}
          onClose={() => setSubmissionResult(null)}
        >
          <ModalStatusContent {...submissionResult} />
        </Modal>
      )}
    </>
  );
};

export default Modal;
