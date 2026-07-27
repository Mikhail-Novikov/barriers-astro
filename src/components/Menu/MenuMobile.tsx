import BurgerIcon from "./BurgerIcon";
import Items from "./Items";
export default function MenuMobile() {
  return (
    <>
      <Items isMobile />
      <BurgerIcon isOpen />
    </>
  );
}