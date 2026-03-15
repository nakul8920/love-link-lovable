import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X } from "lucide-react";

interface Props {
  images: File[];
  onChange: (images: File[]) => void;
}

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
      <p className="text-sm font-medium text-foreground mb-3">Upload Photos (1–10)</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <AnimatePresence>
          {previews.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-background" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < 10 && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/30">
            <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Add</span>
            <input type="file" accept="image/*" multiple onChange={handleAdd} className="hidden" />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{images.length}/10 photos added</p>
    </motion.div>
  );
};

export default ImageUploader;
