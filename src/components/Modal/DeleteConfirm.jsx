import Modal from "./layout";
import { ImCross } from "react-icons/im";

function DeleteConfirm({ isOpen, onClose, onConfirm }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="aus_dialog text-center">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 p-4 rounded-circle" style={{ background: "#C11111" }}>
                    <ImCross size={24} color="#FFF" />
                </div>
                <h3 className="px-4 mb-3">Are You Sure?</h3>
                <p className="mb-4">
                    This action cannot be undone. Do you really want to delete this technician?
                </p>

                <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                        className="btn themebtn4 green w-100"
                        style={{ borderRadius: "12px" }}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn themebtn4 red w-100 border fw-bold"
                        style={{
                            borderRadius: "12px",
                            color: "#C11111",
                            background: "transparent",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#C11111";
                            e.currentTarget.style.color = "#fff";
                            e.currentTarget.style.borderColor = "#C11111";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#C11111";
                            e.currentTarget.style.borderColor = "";
                        }}
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteConfirm;
