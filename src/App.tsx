import { useEffect, useState } from "react";
import JSZip from "jszip";

import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import ImageGrid from "./components/ImageGrid";
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
        <Header />

        <UploadSection
          onFileChange={handleFileChange}
          onConvertAll={handleConvertAll}
          isConverting={isConverting}
          hasImages={images.length > 0}
        />

        <ImageGrid
          images={images}
          onConvert={handleConvert}
          isConverting={isConverting}
        />
      </div>
    </main>
  );
}
