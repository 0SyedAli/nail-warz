"use client";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";
import { Input, useDisclosure } from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import AreYouSure from "@/components/Modal/AreYouSure";

export default function AddYourTechnician() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showForm, setShowForm] = useState(true); // <-- Control form visibility
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const onEnterTag = (e) => {
    const value = e.target.value;
    if (value.includes(",")) {
      setTags((prev) => [...prev, value.split(",").shift()]);
      setTag("");
    } else {
      setTag(value);
    }
  };

  const handleContinueClick = () => {
    setShowForm(false); // Hide the form
    onOpen(); // Open modal
  };

  return (
    <>
      {showForm && (
        <form>
          <h3>Upload Services</h3>

          <label htmlFor="service_name">Service Name</label>
          <InputField
            type="text"
            placeholder="Nail Art"
            id="service_name"
            classInput="classInput"
          />

          <label htmlFor="file">Photo Upload</label>
          <div className="input_file mb-3">
            <p>Upload Images</p>
            <span>
              <FiPlusCircle />
            </span>
            <input type="file" placeholder="Upload Images" id="file" />
          </div>

          <label htmlFor="phone">Service Pricing</label>
          <InputField
            type="number"
            placeholder="$40:00"
            id="service_pricing"
            classInput="classInput"
          />

          <label htmlFor="desc">Description/Bio</label>
          <InputField
            type="text"
            placeholder="Lorem street..."
            id="desc"
            classInput="classInput"
          />

          <label htmlFor="email" className="mb-2">
            Add Technicians
          </label>
          <div className="position-relative">
            <Input
              value={tag}
              type="text"
              className="input_field2"
              placeholder="Search Technicians"
              onChange={onEnterTag}
            />
            <div
              className="d-flex flex-wrap"
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                gap: 10,
              }}
            >
              {tags.map((t, index) => (
                <div
                  key={index}
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="tags_category"
                >
                  {t}
                  <span>
                    <RxCross2 />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <label htmlFor="email" className="mt-3">
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
          <AuthBtn title="Continue" onClick={handleContinueClick} type="button" />
        </form>
      )}

      {/* Modal appears after form is hidden */}
      <AreYouSure btntitle="Add Now" isOpen={isOpen} onClose={() => {
        setShowForm(true); // Re-show form when modal is closed
        onClose(); // Close modal
      }} />
    </>
  );
}
