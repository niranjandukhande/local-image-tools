import type { ImageItem } from "../types/image";

type Props = {
  image: ImageItem;
  onConvert: (image: ImageItem) => void;
  isConverting: boolean;
};

export default function ImageCard({ image, onConvert, isConverting }: Props) {
  return (
    <div
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
          onClick={() => onConvert(image)}
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
  );
}
