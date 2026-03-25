import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X } from "lucide-react";

interface Props {
  images: File[];
  onChange: (images: File[]) => void;
}

const brutalBorder = "border-4 border-black";
const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]";

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black uppercase tracking-widest text-black bg-white px-2 py-1 border-2 border-black inline-block rotate-1">
          Add Photos
        </h3>
        <span className="font-black text-lg bg-black text-white px-3 py-1 border-2 border-white -rotate-2">
          {images.length}/10
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <AnimatePresence>
          {previews.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative aspect-square ${brutalBorder} ${brutalShadow} bg-white p-2 group bg-[#fde047] rotate-${i % 2 === 0 ? '2' : '-2'}`}
            >
              <img src={src} alt="" className={`w-full h-full object-cover border-2 border-black`} />
              <button
                onClick={() => handleRemove(i)}
                className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#ff0844] text-white flex items-center justify-center ${brutalBorder} opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110`}
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < 10 && (
          <label className={`aspect-square ${brutalBorder} ${brutalShadow} ${brutalShadowHover} flex flex-col items-center justify-center cursor-pointer transition-all bg-white text-black p-4 rotate-1`}>
            <ImagePlus className="w-10 h-10 mb-2" strokeWidth={2.5} />
            <span className="text-sm font-black uppercase tracking-widest text-center">UPLOAD</span>
            <input type="file" accept="image/*" multiple onChange={handleAdd} className="hidden" />
          </label>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUploader;
