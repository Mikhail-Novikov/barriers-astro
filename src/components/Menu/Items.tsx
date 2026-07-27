type ItemsProps = {
  isMobile?: boolean;
};

export default function Items({ isMobile }: ItemsProps) {
  return (
    <ul className={isMobile ? "flex flex-col gap-4 fixed z-10 w-full top-20 left-0 bg-grey-1000 p-8 md:pl-12" : "flex items-center gap-20"}>
      <li>
        <a href="#catalog" className="text-white font-semibold link--underline">Каталог</a>
      </li>
      <li>
        <a href="#complectation" className="text-white font-semibold link--underline">Комплектация</a>
      </li>
      <li>
        <a href="#execution" className="text-white font-semibold link--underline">Исполнение</a>
      </li>
      <li>
        <a href="#management" className="text-white font-semibold link--underline">Способы управления</a>
      </li>
    </ul>
  );
}
