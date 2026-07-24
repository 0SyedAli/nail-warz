"use client";
import Modal from "./layout";
import { IoWarningOutline, IoCloseCircle } from "react-icons/io5";
import { MdOutlineFlag, MdAccessTime } from "react-icons/md";
import "./AbuseWarningModal.css";

function AbuseWarningModal({ isOpen, onClose, abuseReasons = [], activeAbuseFlags = [] }) {

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTriggerType = (type) => {
    if (!type) return "Unknown";
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="abuse_warning_modal_wrapper">
      <div className="abuse_warning_modal">
        {/* Header */}
        <div className="awm_header">
          <div className="awm_icon_wrapper">
            <div className="awm_icon_pulse"></div>
            <IoWarningOutline className="awm_icon" />
          </div>
          <h2 className="awm_title">Account Under Review</h2>
          <p className="awm_subtitle">
            Your account has been flagged for review. Please read the details below carefully.
          </p>
        </div>

        {/* Abuse Reasons Section */}
        {/* {abuseReasons && abuseReasons.length > 0 && (
          <div className="awm_section">
            <div className="awm_section_header">
              <MdOutlineFlag className="awm_section_icon" />
              <h3>Reason{abuseReasons.length > 1 ? "s" : ""} for Review</h3>
            </div>
            <div className="awm_reasons_list">
              {abuseReasons.map((reason, index) => (
                <div key={index} className="awm_reason_card">
                  <div className="awm_reason_number">{index + 1}</div>
                  <p className="awm_reason_text">
                    {typeof reason === "string" ? reason : reason?.reason || reason?.message || JSON.stringify(reason)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Active Abuse Flags Section */}
        {activeAbuseFlags && activeAbuseFlags.length > 0 && (
          <div className="awm_section">
            {/* <div className="awm_section_header">
              <IoCloseCircle className="awm_section_icon awm_section_icon_red" />
              <h3>Active Flags ({activeAbuseFlags.length})</h3>
            </div> */}

            <div className="awm_section_header">
              <MdOutlineFlag className="awm_section_icon" />
              <h3>Reason{activeAbuseFlags.length > 1 ? "s" : ""} for Review</h3>
            </div>
            <div className="awm_flags_list">
              {activeAbuseFlags.map((flag, index) => (
                <div key={flag._id || index} className="awm_flag_card">
                  <div className="d-flex align-items-start gap-3 ">
                    <div className="awm_reason_number">{index + 1}</div>
                    <div className="w-100">
                      <div className="awm_flag_header">
                        <span className="awm_flag_badge">
                          {formatTriggerType(flag.triggerType)}
                        </span>
                        {flag.createdAt && (
                          <span className="awm_flag_date">
                            <MdAccessTime />
                            {formatDate(flag.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="awm_flag_reason">{flag.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="awm_footer">
          <p className="awm_footer_text">
            If you believe this is a mistake, please contact our support team for assistance.
          </p>
          <button className="awm_close_btn" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AbuseWarningModal;
