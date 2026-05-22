import { useEffect, useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "image/jpeg") {
      alert("Please upload a JPG image");
      return;
    }

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const convertToPng = () => {
    console.log(previewUrl, file);
    if (!previewUrl || !file) {
      alert("No image selected");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      alert("Canvas not supported");
      return;
    }

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Conversion failed");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        const fileName = file.name.replace(/\.jpe?g$/i, "");
        a.href = url;
        a.download = `${fileName}.png`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }, "image/png");
    };

    img.onerror = () => {
      alert("Failed to load image");
    };

    img.src = previewUrl;
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <main>
      <h1>JPG to PNG converter</h1>

      <input type="file" accept="image/jpeg" onChange={handleFileChange} />

      {previewUrl && (
        <div>
          <p>{file?.name}</p>
          <img src={previewUrl} alt="Preview" width={300} />
          <br />

          <button onClick={convertToPng}>Convert to PNG</button>
        </div>
      )}
    </main>
  );
}

export default App;
