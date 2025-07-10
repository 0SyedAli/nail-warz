"use client";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";
import { Input, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
export default function LoginPage() {
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const router = useRouter();
  const handleLogin = () => {
    router.push("/auth/createbussinessprofile3");
  };

  const onEnterTag = (e) => {
    const value = e.target.value;
    if (value.includes(",")) {
      setTags(() => [...tags, value.split(",").shift()]);
      setTag("");
    } else {
      setTag(value);
    }
  };

  return (
    <form>
      <fieldset>
        <label htmlFor="email" className="mb-2">Add Category</label>
        <div>
          <Input
            value={tag}
            type="text"
            className="input_field2"
            placeholder="Search Category"
            onChange={onEnterTag}
          />
          <div className="d-flex my-2 flex-wrap" style={{ gap: 10 }}>
            {tags.map((t, index) => {
              return (
                <div
                  key={index}
                  onClick={() =>
                    setTags(() => tags.filter((_, i) => i !== index))
                  }
                  className="tags_category"
                >
                  {t}
                  <span>
                    <RxCross2 />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <Textarea placeholder="Bar Details" className="textarea_field2 mb-4" />
        <AuthBtn title="Next" type="button" onClick={handleLogin} />
      </fieldset>
    </form>
  );
}
