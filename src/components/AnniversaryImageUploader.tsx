import { useCallback } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";

interface AnniversaryImageUploaderProps {
  images: (File | null)[];
  onChange: (images: (File | null)[]) => void;
}

const sectionCard = "bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6";
const sectionTitle = "text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6";

const AnniversaryImageUploader = ({ images, onChange }: AnniversaryImageUploaderProps) => {

  const slots = images.length === 18 ? images : Array(18).fill(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const newSlots = [...slots];
        newSlots[index] = file;
        onChange(newSlots);
      }
    },
    [slots, onChange]
  );

  const handleMultipleGalleryUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        let files = Array.from(e.target.files);
        const newSlots = [...slots];
        
        // We only process up to 12 files max from this selection
        files = files.slice(0, 12);
        
        let fileIndex = 0;
        // 1st pass: fill empty slots
        for (let i = 5; i < 17 && fileIndex < files.length; i++) {
           if (!newSlots[i]) {
               newSlots[i] = files[fileIndex];
               fileIndex++;
           }
        }
        
        // 2nd pass: if we still have files, start overwriting from slot 5
        for (let i = 5; i < 17 && fileIndex < files.length; i++) {
           newSlots[i] = files[fileIndex];
           fileIndex++;
        }
        
        onChange(newSlots);
        e.target.value = '';
      }
    },
    [slots, onChange]
  );

  const removeImage = (index: number) => {
    const newSlots = [...slots];
    newSlots[index] = null;
    onChange(newSlots);
  };

  const renderSlot = (index: number, label: string, icon: React.ReactNode, helperText: string = "Click to Upload") => {
    const file = slots[index];
    return (
      <div className="relative flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg bg-slate-50 aspect-square group hover:border-slate-400 hover:bg-slate-100 transition-colors overflow-hidden">
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 z-10">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="w-3 h-3 mr-1" /> Remove
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white font-medium text-[11px] px-2 py-1 text-center">
              {label}
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-3 text-center absolute inset-0 text-slate-500 hover:text-slate-700 transition-colors">
            <div className="mb-2">
               {icon}
            </div>
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs text-slate-400 mt-0.5">{helperText}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, index)}
            />
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto pb-32">
      
      {/* SECTION 1: Couple Profiles */}
      <div className={sectionCard}>
        <h3 className={sectionTitle}>1. Partner Profiles (2 Images)</h3>
        <p className="text-sm text-slate-500 mb-6 -mt-2">Upload portraits for each partner to display on their profiles.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
          {renderSlot(0, "Partner One", <Upload className="w-5 h-5" />)}
          {renderSlot(1, "Partner Two", <Upload className="w-5 h-5" />)}
        </div>
      </div>

      {/* SECTION 2: Love Story Timeline */}
      <div className={sectionCard}>
        <h3 className={sectionTitle}>2. Timeline Highlights (3 Images)</h3>
        <p className="text-sm text-slate-500 mb-6 -mt-2">Upload an image for each of the 3 events in your love story timeline.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {renderSlot(2, "Event 1", <Camera className="w-5 h-5" />)}
          {renderSlot(3, "Event 2", <Camera className="w-5 h-5" />)}
          {renderSlot(4, "Event 3", <Camera className="w-5 h-5" />)}
        </div>
      </div>

      {/* SECTION 3: Advanced Options - Gallery */}
      <div className={sectionCard}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-6 gap-4">
           <h3 className="text-lg font-bold text-slate-900 border-none pb-0 mb-0">3. Bonus Photo Gallery (Optional)</h3>
           <label className="cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
             <ImageIcon className="w-4 h-4" /> Select Multiple (Max 12)
             <input
               type="file"
               multiple
               accept="image/*"
               className="hidden"
               onChange={handleMultipleGalleryUpload}
             />
           </label>
        </div>
        <p className="text-sm text-slate-500 mb-6 -mt-2">Upload up to 12 additional photos. These will be displayed in a gallery grid at the bottom of your page.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => 
            renderSlot(5 + i, `Gallery Image ${i + 1}`, <ImageIcon className="w-5 h-5" />)
          )}
        </div>
      </div>

      <div className="w-full h-[200px]" aria-hidden="true" />

    </div>
  );
};

export default AnniversaryImageUploader;
