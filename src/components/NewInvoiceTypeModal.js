import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableList,
  faXmark,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/HomePage.css";

const newInvoiceTypeModal = forwardRef(function (props, ref) {
  // Close the choosing invoice type modal
  const closeModal = () => {
    console.log("close invoice type modal");
    ref.current.close();
  };
  return (
    <dialog
      className="database-submit-dialog invoice-type-modal-container"
      role="alert"
      id="database-submit-dialog"
      ref={ref}
    >
      <h1 className="new-invoice__page-title form-page-title--lg-1">
        Create New Invoice
      </h1>
      <div className="close-modal-icon" onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <section className="new-invoice-type-selection">
        <button
          type="submit"
          className="new-invoice-type new-ts-invoice-choice"
          name="new-timesheet-invoice"
          onClick={() => {
            props.chooseInvoiceType("new-timesheet-invoice");
            closeModal();
          }}
        >
          <h6>From Timesheet Data</h6>
          <FontAwesomeIcon icon={faTableList} />
        </button>

        <button
          type="submit"
          className="new-invoice-type new-blank-invoice-choice"
          name="new-blank-invoice"
          onClick={() => {
            props.chooseInvoiceType("new-blank-invoice");
            closeModal();
          }}
        >
          <h6>Blank Invoice</h6>
          <FontAwesomeIcon icon={faFileInvoice} />
        </button>

        {/* <div>
          <button
            className="dialog-modal-confirm-button invoice-type-modal-button"
            id="dialog-modal-confirm-button"
            value="confirm"
            style={{ marginTop: "15px" }}
            onClick={props.close}
          >
            CLOSE
          </button>
        </div> */}
      </section>
    </dialog>
  );
});

export default newInvoiceTypeModal;
