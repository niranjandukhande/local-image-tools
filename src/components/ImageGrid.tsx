import type { ImageItem } from "../types/image";

import ImageCard from "./ImageCard";

type Props = {
  images: ImageItem[];
  onConvert: (image: ImageItem) => void;
  isConverting: boolean;
};

export default function ImageGrid({ images, onConvert, isConverting }: Props) {
  if (images.length === 0) {
    return (
      <div className="border border-dashed border-slate-700 rounded-2xl p-16 text-center text-slate-500">
        No images uploaded yet
      </div>
    );
  }

  return (
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
        <ImageCard
          key={image.id}
          image={image}
          onConvert={onConvert}
          isConverting={isConverting}
        />
      ))}
    </div>
  );
}
