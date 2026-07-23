export default function MenuItems() {
  return (
    <>
      <ul className="flex items-center gap-20">
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
    </>
  );
}
