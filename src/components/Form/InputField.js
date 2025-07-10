import styles from "./form.module.css"; // Assuming you have a CSS module for styling
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons
const InputField = ({
  type,
  icon: Icon,
  imageSrc,
  show,
  handleClick,
  classInput,
  placeholder,
  ...rest
}) => {
  return (
    <div className={`inputField ${styles.inputField}`}>
      <Stack>
        <InputGroup>
          <InputLeftElement pointerEvents="none" className={styles.icon}>
            <img src={imageSrc} alt="" className={styles.iconImage} />
          </InputLeftElement>

          {/* Input field */}
          <Input
            type={type}
            {...rest}
            className={`${classInput ? classInput : ""}`}
            placeholder={placeholder}
          />

          {/* Conditionally render the show/hide button only for password fields */}
          {type === "password" ? (
            <InputRightElement width="4.5rem" className={styles.icon2}>
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? <FaEyeSlash /> : <FaEye />} {/* Toggle icons */}
              </Button>
            </InputRightElement>
          ) : null}
        </InputGroup>
      </Stack>
    </div>
  );
};

export default InputField;