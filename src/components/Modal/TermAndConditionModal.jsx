import { useState } from "react";
import Modal from "./layout";
import Image from "next/image";
import { AuthBtn } from "../AuthBtn/AuthBtn";

function TermAndConditionModal({ isOpen, onClose, onAgree, agree, setAgree }) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAgree = async () => {
    if (!agree) return; // ✅ prevent click if not checked
    setSubmitting(true);
    try {
      await onAgree();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="term_modal">
      <div className="aus_dialog">
        {/* Header */}
        <div className="term_body mb-3">
          <div className="d-flex align-items-center justify-content-center gap-4 p-3">
            <Image src="/images/docs-icon.png" width={25} height={32} alt="docs" />
            <h3 className=" mb-0">Terms & Conditions</h3>
          </div>

          {/* Terms Content */}
          <div className="term_content">
            <h4 className="fw-bolder">1. Terms</h4>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="mb-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="aus_btns d-flex align-items-center justify-content-start gap-3 mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="agreeTerms"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="agreeTerms">
              I agree to the Terms & Conditions
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex align-items-center justify-content-between gap-3 flex-nowrap">
          <AuthBtn
            title="Decline"
            type="button"
            onClick={onClose}
            location_btn="bg_remove2"
          />
          <AuthBtn
            title="Agree & Submit"
            type="button"
            disabled={submitting} // ✅ spinner only when submitting
            onClick={handleAgree}
          />
        </div>
      </div>
    </Modal>
  );
}

export default TermAndConditionModal;