"use client";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/auth/createbussinessprofile2");
  };

  return (
    <form>
      <fieldset>
        <UploadPhoto />
        <label>Postal Code</label>
        <InputField
          type="number"
          id="number"
          placeholder="12345670"
          classInput="classInput"
        />
        <label>Cooking Time</label>
        <InputField
          type="time"
          id="time"
          placeholder="25min to 30min"
          classInput="classInput"
        />
        <AuthBtn title="Next" type="button" onClick={handleLogin} />
      </fieldset>
    </form>
  );
}