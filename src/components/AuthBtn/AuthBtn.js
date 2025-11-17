import Image from "next/image";
import styles from "./AuthBtn.module.css";

const loadingSvg = "/images/tube-spinner.svg";

export const AuthBtn = ({
  disabled,
  title,
  type = "button",
  onClick,
  location_btn,
  style_btn
}) => {
  return (
    <button
      className={`${styles.btntheme1} ${location_btn ? location_btn : ""}`}
      type={type}
      onClick={type === "submit" ? undefined : onClick}  // ✔ FIX
      disabled={disabled}
      style={style_btn}  // <-- FIXED ✔️
    >
      {disabled ? (
        <Image src={loadingSvg} width={40} height={40} alt="loading" />
      ) : (
        title
      )}
    </button>
  );
};
