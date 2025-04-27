import Button from "@/components/Button";
import { motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
// import { Cinzel_Decorative } from "next/font/google";
import DOMPurify from "dompurify";

// const cinzel = Cinzel_Decorative({
//   variable: "--Cinzel_Decorative",
//   display: "swap",
//   subsets: ["latin"],
//   weight: "400",
// });

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  header?: string;
  sub?: string;
  contentTitle?: string;
  contentItems?: string[];
  firstButtonText: string;
  secondButtonText?: string;
  onClick?: () => void;
  onTab?: () => void;
}

const Modal = ({
  isOpen,
  setIsOpen,
  header,
  sub,
  contentTitle,
  contentItems,
  firstButtonText,
  secondButtonText,
  onClick,
  onTab,
}: ModalProps) => {
  if (!isOpen) return null;

  // Dynamically generate the markdown content from the items
  const generateMarkdownContent = () => {
    if (!contentTitle || !contentItems || contentItems.length === 0) return "";

    // let htmlContent = `<h3>${contentTitle}</h3>`;
    // contentItems.forEach((item, index) => {
    //   const [title, description] = item.split(" – ");
    //   htmlContent += `<p><strong>${
    //     index + 1
    //   }. ${title}</strong> – ${description}</p>`;
    // });

    // Sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(contentItems[0]);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={() => setIsOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-gray-800 text-white py-6 rounded-2xl shadow-lg border-4 border-[#fcf8db] w-[400px] justify_auto gap-4 max-h-[85vh] max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-white"
        >
          <X size={24} />
        </button>
        <h2 className="max-h-max text-xl font-normal text-center px-6">
          {header}
        </h2>
        <div className="overflow-y-auto px-6 mr-2">
          {sub && (
            <p className="text-sm text-gray-300 text-center pb-5">{sub}</p>
          )}
          {contentItems && (
            <div
              className="rt-view"
              dangerouslySetInnerHTML={{ __html: generateMarkdownContent() }}
            ></div>
          )}
        </div>
        <div className="max-h-max flex flex-col space-y-4 px-6">
          <Button className="active" onClick={onClick}>
            {firstButtonText}
          </Button>
          {secondButtonText && (
            <Button className="active" variant="secondary" onClick={onTab}>
              {secondButtonText}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
