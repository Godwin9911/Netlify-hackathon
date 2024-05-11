export const copyText = ({ text, toast }) => {
  const textarea = document.createElement("textarea");
  textarea.textContent = text;
  textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(textarea);
  toast.success("Copied to clipboard");
};
