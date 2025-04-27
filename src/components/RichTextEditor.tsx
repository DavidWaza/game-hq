"use client";
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
}) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (quillRef.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"], // Text formatting
              [{ list: "ordered" }, { list: "bullet" }], // Lists
              ["link"], // Links
              ["clean"], // Remove formatting
            ],
          },
          placeholder,
        });

        // Set initial value
        quillInstance.current.root.innerHTML = value;

        // Update the value on text change
        quillInstance.current.on("text-change", () => {
          const html = quillRef.current?.querySelector(".ql-editor")?.innerHTML;
          onChange(html || "");
        });
      }

      return () => {
        quillInstance.current = null; // Cleanup
      };
    }
  }, []);

  return <div ref={quillRef} className="quill-editor"></div>;
};

export default RichTextEditor;
