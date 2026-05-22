import { useEffect, useState } from "react";
import { convertImageToPng } from "./utils/convertImage";
import { downloadBlob } from "./utils/downloadBlob";
import type { ImageItem } from "./types/image";

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) return;
    const validFiles = Array.from(files).filter(
      (file) => file.type === "image/jpeg",
    );

    if (validFiles.length === 0) {
      alert("Please upload JPG images");
      return;
    }

    const imageItems: ImageItem[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      prev.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });

      return imageItems;
    });
  }

  async function handleConvert(image: ImageItem) {
    try {
      const blob = await convertImageToPng(image.previewUrl);
      const fileName = image.file.name.replace(/\.jpe?g$/i, "");
      downloadBlob(blob, `${fileName}.png`);
    } catch (error) {
      console.error(error);
      alert("Conversion failed");
    }
  }

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-5xl font-bold mb-3">JPG to PNG Converter</h1>

          <p className="text-slate-400">
            Convert images locally in your browser
          </p>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10">
          <input
            type="file"
            multiple
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
        </section>

        {images.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-5
            "
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="
                  border
                  border-slate-800
                  rounded-2xl
                  overflow-hidden
                  bg-slate-900
                "
              >
                <img
                  src={image.previewUrl}
                  alt={image.file.name}
                  className="
                    w-full
                    h-48
                    object-cover
                  "
                />

                <div className="p-4">
                  <p className="text-slate-300 mb-4 break-words text-sm">
                    {image.file.name}
                  </p>

                  <button
                    onClick={() => handleConvert(image)}
                    className="
                      w-full
                      bg-blue-600
                      hover:bg-blue-700
                      transition
                      px-4
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >
                    Convert to PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
