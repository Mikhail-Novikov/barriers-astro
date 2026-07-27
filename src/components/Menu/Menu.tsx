import Items from "./Items";
import MenuMobile from "./MenuMobile";

import { useBreakpoint } from "@hooks/useBreakpoint";

export default function Menu() {
  const screen = useBreakpoint();

  return (
    <>
      {!screen.lg ? <MenuMobile /> : <Items /> }
    </>
  );
}