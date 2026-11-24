import { publicAsset } from "@utils/publicAsset";

/**
 * Тип данных, представляющий результат отправки формы в модальном окне.
 * @property {boolean} success - Флаг, указывающий на успешность отправки.
 * @property {string} message - Сообщение, отображаемое пользователю.
 */
export type ModalSubmissionResult = {
  success: boolean;
  message: string;
};

/**
 * Компонент, отображающий результат отправки формы в модальном окне.
 * @param props - Результат отправки формы с флагом успеха и сообщением.
 * @returns JSX-элемент с изображением и текстом результата.
 */
export default function ModalStatusContent({
  success,
  message,
}: ModalSubmissionResult): JSX.Element {
  return (
    <div className="p-10 sm:p-24">
      <div className="mb-7 max-w-[400px]">
        {success ? (
          <img
            src={publicAsset("/img/feedback-img-response.webp")}
            alt="Успешная отправка сообщения"
            className="object-contain h-auto"
            width={400}
            height={260}
          />
        ) : (
          <img
            src={publicAsset("/img/empty-search.webp")}
            alt="Ошибка отправки сообщения"
            className="object-contain h-auto"
            width={424}
            height={307}
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <h3 className="mb-4 text-center text-[28px]/[32px] font-manrope-bold sm:text-grey-1000 xl:text-3xl/8">
          {success ? <>Спасибо за&nbsp;обращение!</> : <>Ошибка отправки сообщения</>}
        </h3>
        <p className="text-center text-lg/6 font-manrope-semibold text-grey-800 sm:text-grey-700">
          {message}
        </p>
      </div>
    </div>
  );
}
