"use client";
import React, { useCallback, useEffect, useRef } from "react";
import "quill/dist/quill.snow.css"; // Import Quill styles

interface QuillInstance {
  root: { innerHTML: string };
  on: (event: string, callback: () => void) => void;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  disabled = false,
}) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<unknown>(null);
  const onChangeRef = useRef(onChange);
  const intialValue = useRef(value);

  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setInstance = useCallback(async () => {
    if (typeof window === "undefined" || quillRef.current === null) return;
    const Quill = (await import("quill")).default;
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            // [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"], // Text formatting
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            ["link"], // Links
            ["clean"], // Remove formatting
          ],
        },
        placeholder,
      });
      (quillInstance.current as QuillInstance).root.innerHTML =
        intialValue.current;
      // Update the value on text change
      (quillInstance.current as QuillInstance).on("text-change", () => {
        const html = quillRef.current?.querySelector(".ql-editor")?.innerHTML;
        onChangeRef.current(html || "");
      });
    }
  }, [placeholder]);

  useEffect(() => {
    setInstance();

    return () => {
      quillInstance.current = null; // Cleanup
    };
  }, [setInstance]);

  return (
    <div className="wrapper relative">
      <div ref={quillRef} className="quill-editor"></div>
      {disabled && <div className="absolute inset-0 bg-black opacity-50"></div>}
    </div>
  );
};

export default RichTextEditor;
