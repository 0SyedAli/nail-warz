"use client";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13+
import { FiPlusCircle } from "react-icons/fi";

export default function AddYourTechnician() {
  const router = useRouter(); // Initialize router for navigation

  const handleLogin = () => {
    router.push("/auth/uploadservice"); // Navigate to OTP page on click
  };

  return (
    <form>
      <h3>Add Your Technician</h3>
      <label htmlFor="email">Full Name</label>
      <InputField
        type="number"
        placeholder="Enter name"
        id="number"
        classInput="classInput"
      />
      <label htmlFor="file">Photo Upload</label>
      <div className="input_file mb-3">
        <p>Upload Images</p>
        <span>
          <FiPlusCircle />
        </span>
        <input
          type="file"
          placeholder="Upload Images"
          id="file"
        />
      </div>
      <label htmlFor="phone">Phone Number</label>
      <InputField
        type="text"
        placeholder="+1 415 555 0132"
        id="phone"
        classInput="classInput"
      />
      <label htmlFor="email">Email</label>
      <InputField
        type="email"
        placeholder="dummyemail55.com"
        id="email"
        classInput="classInput"
      />
      <label htmlFor="email">
        Available Time
      </label>
      <div className="cs-form time_picker d-flex gap-3 align-items-center">
        <InputField
          type="time"
          id="time"
          placeholder="25min to 30min"
          classInput="classInput"
        />
        <span>To</span>
        <InputField
          type="time"
          id="time"
          placeholder="25min to 30min"
          classInput="classInput"
        />
      </div>
      <label htmlFor="availableData">Available Date</label>
      <InputField
        type="date"
        placeholder="Mon to Fri"
        id="availableData"
        classInput="classInput"
      />
      <label htmlFor="desc">Description/Bio</label>
      <InputField
        type="text"
        placeholder="Lorem street..."
        id="desc"
        classInput="classInput"
      />
      <AuthBtn title="Continue" type="button" onClick={handleLogin} />
    </form>
  );
}
