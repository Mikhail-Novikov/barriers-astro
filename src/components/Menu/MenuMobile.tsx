import { useState } from "react";
import Modal from "../heros/Modal";
import ModalFeedbackForm from "../heros/ModalFeedbackForm";
import BurgerIcon from "./BurgerIcon";
import Items from "./Items";

const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>
      <Items
        isMobile
        isOpen={isOpen}
        onItemClick={() => setIsOpen(false)}
        onConsultationClick={() => setIsConsultationOpen(true)}
      />
      <BurgerIcon isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      <Modal
        isOpen={isConsultationOpen}
        showTrigger={false}
        title="Форма обратной связи"
        onClose={() => setIsConsultationOpen(false)}
      >
        <ModalFeedbackForm idPrefix="mobile-menu-consultation" />
      </Modal>
    </>
  );
};

export default MenuMobile;