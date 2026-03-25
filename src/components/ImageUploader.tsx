import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, Heart } from "lucide-react";

interface Props {
  images: File[];
  onChange: (images: File[]) => void;
}

const brutalBorder = "border-[3px] border-black";
const boxShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

const ImageUploader = ({ images, onChange }: Props) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleAdd = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const total = [...images, ...files].slice(0, 10);
      onChange(total);

      const newPreviews = total.map((f) => URL.createObjectURL(f));
      setPreviews(newPreviews);
    },
    [images, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const updated = images.filter((_, i) => i !== index);
      onChange(updated);
      setPreviews(updated.map((f) => URL.createObjectURL(f)));
    },
    [images, onChange]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Top Bar showing count */}
      <div className="flex justify-between items-center mb-6 bg-black text-white px-4 py-2 text-sm font-black uppercase tracking-wider">
        <span className="flex items-center gap-2"><Heart className="w-4 h-4 fill-[#ff90e8] text-[#ff90e8]" /> VISUALS</span>
        <span>{images.length}/10</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {previews.map((src, i) => (
            <motion.div
              layout
              key={src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative aspect-square ${brutalBorder} ${boxShadow} bg-white group hover:scale-[1.02] transition-transform`}
            >
              <img src={src} alt="" className="w-full h-full object-cover p-1" />
              <button
                onClick={() => handleRemove(i)}
                className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#ff0844] text-white flex items-center justify-center border-2 border-black opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < 10 && (
          <label className={`aspect-square ${brutalBorder} ${boxShadow} bg-[#ff90e8] hover:bg-white flex flex-col items-center justify-center cursor-pointer transition-colors active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}>
            <ImagePlus className="w-8 h-8 md:w-10 md:h-10 text-black mb-1 md:mb-2" strokeWidth={2.5} />
            <span className="text-xs md:text-sm font-black uppercase text-center text-black">ADD PHOTO</span>
            <input type="file" accept="image/*" multiple onChange={handleAdd} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
