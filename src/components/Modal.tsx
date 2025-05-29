type ModalProps = {
  isOpen: boolean;
  onRequestClose?: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, children, onRequestClose }: ModalProps) => {
  if (!isOpen) return null;
  if (!onRequestClose) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
      {children}
    </div>
  );
};

export default Modal;
