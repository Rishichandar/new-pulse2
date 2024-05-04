import React, { useState, useEffect } from "react";
import "./animatedText.css";
const AnimatedText = ({ text, delay = 100 }) => {
  const [chars, setChars] = useState([]);

  useEffect(() => {
    text.split("").forEach((char, index) => {
      setTimeout(() => {
        setChars((prev) => [...prev, char]);
      }, index * delay);
    });

    // Clean up function to clear all timeouts if the component unmounts
    return () => {
      for (let i = 0; i < text.length; i++) {
        clearTimeout(i);
      }
    };
  }, [text, delay]);

  return (
    <h1>
      {chars.map((char, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            opacity: 0,
            animation: `fade-in 0.5s ${index * delay}ms forwards`,
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedText;
