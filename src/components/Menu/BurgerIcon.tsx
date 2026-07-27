/**
 * Компонент иконки бургера
 * @param isOpen - признак открытости меню
 * @return {JSX.Element}
 */
export default function BurgerIcon({ isOpen }: { isOpen?: boolean }): JSX.Element {
  return (
    // <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path d="M4 6H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    //   <path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    //   <path d="M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    // </svg>
    <div className="text-white text-5xl absolute top-1/2 -translate-y-1/2 right-0">
      {(isOpen && <i className="icon-close" />) || <i className="icon-burger" />}
    </div>
  );
}