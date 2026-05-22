import { useEffect, useState } from "react";

import JSZip from "jszip";

import { convertImageToPng } from "./utils/convertImage";
import { downloadBlob } from "./utils/downloadBlob";
import { validateFiles } from "./utils/fileValidation";
import type { ImageItem } from "./types/image";

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  async function handleConvertAll() {
    if (images.length === 0 || isConverting) {
      return;
    }

    try {
      setIsConverting(true);
      const zip = new JSZip();

      for (const image of images) {
        const blob = await convertImageToPng(image.previewUrl);

        const fileName = image.file.name.replace(/\.jpe?g$/i, "");

        zip.file(`${fileName}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      downloadBlob(zipBlob, "converted-images.zip");
    } catch (error) {
      console.error(error);
      alert("Batch conversion failed");
    } finally {
      setIsConverting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) return;

    const filesArray = Array.from(files);
    const result = validateFiles(filesArray);
    if (!result.valid) {
      alert(result.message);
      return;
    }

    const imageItems: ImageItem[] = filesArray.map((file) => ({
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
    if (isConverting) return;
    try {
      setIsConverting(true);
      const blob = await convertImageToPng(image.previewUrl);
      const fileName = image.file.name.replace(/\.jpe?g$/i, "");
      downloadBlob(blob, `${fileName}.png`);
    } catch (error) {
      console.error(error);
      alert("Conversion failed");
    } finally {
      setIsConverting(false);
    }
  }

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [images]);

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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="file"
              multiple
              accept="image/jpeg"
              onChange={handleFileChange}
              disabled={isConverting}
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

            {/*{images.length > 0 && (*/}
            <button
              onClick={handleConvertAll}
              disabled={images.length === 0 || isConverting}
              className="
                bg-emerald-600
                hover:bg-emerald-700
                disabled:bg-slate-700
                disabled:cursor-not-allowed
                transition
                px-6
                py-3
                rounded-xl
                font-semibold
                whitespace-nowrap
              "
            >
              {isConverting ? "Converting..." : "  Convert All & ZIP"}
            </button>
            {/*)}*/}
          </div>
        </section>

        {images.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-2xl p-16 text-center text-slate-500">
            No images uploaded yet
          </div>
        ) : (
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
                  <p className="text-slate-300 mb-4 wrap-break-word text-sm">
                    {image.file.name}
                  </p>

                  <button
                    onClick={() => handleConvert(image)}
                    disabled={isConverting}
                    className="
                      w-full
                      bg-blue-600
                      hover:bg-blue-700
                      disabled:bg-slate-700
                      disabled:cursor-not-allowed
                      transition
                      px-4
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >
                    {isConverting ? "Converting..." : "Convert to PNG"}
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
