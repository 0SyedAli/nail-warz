import { useRouter } from "next/navigation";
import Modal from "./layout";
import Image from "next/image";

function AreYouSure({ isOpen, onClose }) {
  const router = useRouter();
  return (
    <>
      {/* Passing AddNewProduct as children to Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="aus_dialog">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <Image
              src="/images/check-icon.png"
              width={70}
              height={70}
              alt=""
            />
          </div>
          <div className="text-center">
            <h3 className="px-4 mb-3">You're All Set!</h3>
            <p className="mb-4">Your profile is live. You can now start receiving appointments.</p>
          </div>
          <div className="aus_btns d-flex align-items-center justify-content-center gap-3">
            <button className="btn themebtn4 green w-100" style={{ borderRadius: "12px" }} onClick={() => {
              router.push("/dashboard")
            }}>Go To Dashboard</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AreYouSure;
