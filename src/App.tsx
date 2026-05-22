import { useEffect, useState } from "react";

import { convertImageToPng } from "./utils/convertImage";

import { downloadBlob } from "./utils/downloadBlob";

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "image/jpeg") {
      alert("Please upload a JPG image");

      return;
    }

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);

    setPreviewUrl(url);
  }

  async function handleConvert() {
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
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-5xl font-bold mb-3">JPG to PNG Converter</h1>

          <p className="text-slate-400">
            Convert images locally in your browser
          </p>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="mb-6">
            <input
              type="file"
              accept="image/jpeg"
              onChange={handleFileChange}
              className="
                block
                w-full
                text-sm
                text-slate-300
                file:mr-4
                file:rounded-xl
                file:border-0
                file:bg-blue-600
                file:px-5
                file:py-3
                file:text-white
                file:font-semibold
                file:cursor-pointer
                hover:file:bg-blue-700
              "
            />
          </div>

          {previewUrl && (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-[500px] object-cover"
              />

              <div className="p-5">
                <p className="text-slate-300 mb-5 break-words">{file?.name}</p>

                <button
                  onClick={handleConvert}
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    transition
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                  "
                >
                  Convert to PNG
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
