import { useState } from "react";

export default function InputWithLabels() {
  const [inputValue, setInputValue] = useState("");
  const [labels, setLabels] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Predefined options for the hint
  const options = ["mango", "banana", "orange"];

  const handleAddLabel = () => {
    if (inputValue.trim() !== "" && !labels.includes(inputValue)) {
      setLabels([...labels, inputValue]);
      setInputValue("");
      setIsDropdownOpen(false); // Close dropdown after adding a label
    }
  };

  const handleRemoveLabel = (index) => {
    const updatedLabels = labels.filter((_, i) => i !== index);
    setLabels(updatedLabels);
  };

  const handleOptionClick = (option) => {
    setInputValue(option); // Set clicked option as input value
    setIsDropdownOpen(false); // Close dropdown after selecting an option
  };

  const handleFocus = () => {
    setIsDropdownOpen(true); // Show the dropdown when input is focused
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddLabel(); // Save the input when Enter is pressed
    }
  };

  return (
    <div style={{ padding: "20px", position: "relative", width: "300px" }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown} // Detect Enter key press
        placeholder="Enter a word (or choose from options)"
        style={{
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      />

      {/* Dropdown for Predefined Options */}
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginTop: "5px",
            zIndex: 1,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
                borderBottom: index !== options.length - 1 ? "1px solid #eee" : "none",
                backgroundColor: "#f9f9f9",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {/* Labels */}
      <div style={{ marginTop: "20px" }}>
        {labels.map((label, index) => (
          <div
            key={index}
            style={{
              display: "inline-flex",
              alignItems: "center",
              margin: "5px",
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
            }}
          >
            {label}
            <button
              onClick={() => handleRemoveLabel(index)}
              style={{
                marginLeft: "10px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: "red",
              }}
            >
              &#10005;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
