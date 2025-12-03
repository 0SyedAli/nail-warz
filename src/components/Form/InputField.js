'use client';

import { useState, useEffect } from "react";
import styles from "./form.module.css";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  type,
  icon: Icon,
  imageSrc,
  show: initialShow = false,
  handleClick,
  classInput,
  placeholder,
  ...rest
}) => {
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(initialShow);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    if (handleClick) handleClick();
  };

  return (
    <div className={`inputField ${styles.inputField}`}>
      <Stack>
        <InputGroup>
          <InputLeftElement pointerEvents="none" className={styles.icon}>
            <img src={imageSrc} alt="" className={styles.iconImage} />
          </InputLeftElement>

          {/* Input field */}
          <Input
            type={showPassword && type === "password" ? "text" : type}
            {...rest}
            className={`${classInput ? classInput : ""}`}
            placeholder={placeholder}
          />

          {/* Only render on client side to avoid hydration mismatch */}
          {isClient && type === "password" ? (
            <InputRightElement width="4.5rem" className={styles.icon2}>
              <Button h="1.75rem" size="sm" onClick={handleToggle}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          ) : null}
        </InputGroup>
      </Stack>
    </div>
  );
};

export default InputField;