import { useEffect, useState } from "react";

import { convertImageToPng } from "./utils/convertImage";

import { downloadBlob } from "./utils/downloadBlob";

export default function App() {
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

  const handleConvert = async () => {
    if (!file || !previewUrl) {
      alert("No image selected");
      return;
    }

    try {
      const blob = await convertImageToPng(previewUrl);
      const fileName = file.name.replace(/\.jpe?g$/i, "");
      downloadBlob(blob, `${fileName}.png`);
    } catch (error) {
      console.error(error);
      alert("Conversion failed");
    }
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
      <h1>JPG to PNG Converter</h1>

      <input type="file" accept="image/jpeg" onChange={handleFileChange} />

      {previewUrl && (
        <div>
          <p>{file?.name}</p>
          <img src={previewUrl} alt="Preview" width={300} />
          <br />
          <button onClick={handleConvert}>Convert to PNG</button>
        </div>
      )}
    </main>
  );
}
