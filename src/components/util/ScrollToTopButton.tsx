import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
