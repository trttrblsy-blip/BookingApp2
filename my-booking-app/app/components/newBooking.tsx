import type { BookingDTO } from "~/utils/BookingDTO";
import Modal from 'react-modal';

export default function naewBooking({ value}:{value:BookingDTO}){
     <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
      </Modal>
}
