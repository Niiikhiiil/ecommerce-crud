import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({ children, onClose }) {
  useEffect(() => {
    function keyHandler(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white  rounded-2xl shadow-xl w-full max-w-3xl sm:p-6 p-4 transform transition-transform scale-95 animate-in fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {children}
      </div>
    </div>
  );
}

export default Modal;
