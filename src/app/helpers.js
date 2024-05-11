export const copyText = ({ text, toast }) => {
  console.log(text);
  /*  const textarea = document.createElement("textarea");
  textarea.textContent = `${text}`;
  textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(textarea); */
  toast.success("Copied to clipboard");
};

export const imagePreloader = (path) => {
  return new Promise(function (resolve, reject) {
    // Create a new image from JavaScript
    var image = new Image();
    // Bind an event listener on the load to call the `resolve` function
    image.onload = resolve;
    // If the image fails to be downloaded, we don't want the whole system
    // to collapse so we `resolve` instead of `reject`, even on error
    image.onerror = resolve;
    // Apply the path as `src` to the image so that the browser fetches it
    image.src = path;
  });
};

export function waitFor(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
