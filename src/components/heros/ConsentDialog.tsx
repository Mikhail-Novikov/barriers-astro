import { useEffect, useRef } from "react";
import { Button } from "@components/Button";

type ConsentDialogProps = {
  titleId: string;
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
};

/**
 * Диалоговое окно с согласием на обработку персональных данных.
 * param titleId - идентификатор заголовка для доступного имени диалога.
 * param isOpen - открыто ли диалоговое окно.
 * param onAccept - вызывается при принятии согласия.
 * param onReject - вызывается при отклонении согласия.
 * param onClose - вызывается при закрытии диалога (например, по клику вне окна).
 * returns JSX.Element - компонент диалогового окна.
 */
export default function ConsentDialog({
  titleId,
  isOpen,
  onAccept,
  onReject,
  onClose,
}: ConsentDialogProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      className="sm:m-auto h-md mt-auto sm:w-[calc(100%-2rem)] max-w-[760px] sm:rounded-2xl p-[32px_16px] text-left backdrop:bg-grey-1000/70 sm:p-10"
    >
      <h3
        id={titleId}
        className="pr-8 mb-4 text-xl lg:text-2xl font-manrope-bold text-grey-1000"
      >
        В&nbsp;соответствии с&nbsp;Федеральным законом &#8470;&nbsp;152-ФЗ
      </h3>
      <p className="mb-8 text-grey-1000 text-xl/8">
        В соответствии с Федеральным законом № 152-ФЗ «О персональных данных» от
        27.07.2006 года свободно, своей волей и в своем интересе выражаю свое
        безусловное согласие на обработку моих персональных данных ООО «ПЭРКО»,
        ИНН 7806437448, ОГРН 1107847252611, зарегистрированным в соответствии с
        законодательством РФ по адресу: 194021, Санкт-Петербург, ул.
        Политехническая, дом 4, корпус 2, строение 1.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="primary-outline"
          className="px-6 py-3"
          onClick={onReject}
        >
          Не принимаю
        </Button>
        <Button
          type="button"
          className="px-6 py-3"
          onClick={onAccept}
        >
          Принимаю
        </Button>
      </div>
    </dialog>
  );
}
