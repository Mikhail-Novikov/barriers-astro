import { useState } from "react";
import BurgerIcon from "./BurgerIcon";
import Items from "./Items";

export default function MenuMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Items isMobile isOpen={isOpen} onItemClick={() => setIsOpen(false)} />
      <BurgerIcon isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}