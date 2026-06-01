// src/hooks/useUrlPrompt.ts
import Swal from "sweetalert2";

export const useUrlPrompt = () => {
  const askForUrl = async (): Promise<string | null> => {
    const { value: inputUrl } = await Swal.fire<string>({
      title: "Enter the Folder Path",
      input: "text",
      inputPlaceholder: "D:\\user\\GMS\\RPA\\App",
      showCancelButton: true,
      confirmButtonText: "Get Started",
      allowOutsideClick: false,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Enter a valid path!");
          return null;
        }
        return value;
      },
    });

    return inputUrl || null;
  };

  return { askForUrl };
};
