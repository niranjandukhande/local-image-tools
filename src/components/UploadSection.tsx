type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConvertAll: () => void;
  isConverting: boolean;
  hasImages: boolean;
};

export default function UploadSection({
  onFileChange,
  onConvertAll,
  isConverting,
  hasImages,
}: Props) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="file"
          multiple
          accept="image/jpeg"
          onChange={onFileChange}
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
            disabled:opacity-50
          "
        />

        <button
          onClick={onConvertAll}
          disabled={!hasImages || isConverting}
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
          {isConverting ? "Converting..." : "Convert All & ZIP"}
        </button>
      </div>
    </section>
  );
}
