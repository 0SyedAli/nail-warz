import Image from "next/image";
import styles from "./AuthBtn.module.css";
const loadingSvg = "/images/tube-spinner.svg";
export const AuthBtn = ({ disabled, title, type, onClick, location_btn }) => {
  return (
    <button
      className={`${styles.btntheme1} ${location_btn ? location_btn : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? <><Image  src={loadingSvg} width={40} height={40} alt="" /></> : title}
    </button>
  );
};
