import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishForm from "@/components/WishForm";
import ImageUploader from "@/components/ImageUploader";
import { TemplateType } from "@/types/wish";
import { generateSlug } from "@/lib/generateSlug";
import { savePage } from "@/lib/store";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const steps = ["Details", "Photos", "Payment"];

// Neo-Brutalist utility classes
const brutalShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]";
const brutalBorder = "border-[3px] border-black";

const CreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeParam = (searchParams.get("theme") as TemplateType) || "valentine";

  const [step, setStep] = useState(0);
  const [templateType] = useState<TemplateType>(themeParam);
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const canNext = () => {
    if (step === 0) return senderName.trim() && receiverName.trim() && message.trim();
    if (step === 1) return images.length >= 1;
    return true;
  };

  const handleFormChange = (field: string, value: string) => {
    if (field === "senderName") setSenderName(value);
    if (field === "receiverName") setReceiverName(value);
    if (field === "message") setMessage(value);
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const slug = generateSlug();
      const uploadedImageUrls: string[] = [];

      // Upload images to backend
      for (const file of images) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const text = await res.text();
          // The backend returns a path like "/uploads/..."
          uploadedImageUrls.push(`${API_BASE_URL}${text}`);
        }
      }

      const finalImages = uploadedImageUrls.length > 0 ? uploadedImageUrls : images.map((f) => URL.createObjectURL(f));

      const pageData = {
        id: slug,
        slug,
        templateType: templateType!,
        senderName,
        receiverName,
        message,
        imageUrls: finalImages,
        createdAt: new Date().toISOString(),
        paymentStatus: "success" as const,
        orderId: `order_${Date.now()}`,
      };

      // Save to local storage for backward compatibility
      savePage(pageData);

      // Save to backend
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_BASE_URL}/api/page`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customUrlData: slug,
            content: {
              templateType: templateType!,
              senderName,
              receiverName,
              message,
              paymentStatus: "success",
              orderId: pageData.orderId,
            },
            images: finalImages,
          }),
        });
      }

      setProcessing(false);
      toast.success("YOUR MAGIC IS READY! 🚀");
      navigate(`/success/${slug}`);
    } catch (error) {
      console.error(error);
      setProcessing(false);
      toast.error("Failed to create page. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black overflow-x-hidden pb-20">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      {/* Brutalist Header */}
      <div className={`relative z-10 bg-[#c4b5fd] ${brutalBorder} border-t-0 border-l-0 border-r-0`}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")} 
            className={`flex items-center gap-2 bg-white px-4 py-2 font-black uppercase text-sm ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <Heart className="w-5 h-5 text-black fill-[#ff90e8]" />
            <span className="font-display tracking-widest hidden sm:inline">WishLink</span>
          </button>
          
          <div className="bg-black text-white px-4 py-2 font-black uppercase text-sm tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fde047]" />
            CREATING {templateType.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12">
        
        {/* Progress Tracker (Brutalist style) */}
        <div className="flex items-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-10 h-10 flex items-center justify-center font-black text-lg transition-colors border-4 border-black ${
                i <= step ? "bg-[#ff90e8] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" : "bg-white text-black opacity-50"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm sm:text-base font-black uppercase tracking-widest hidden sm:block ${i <= step ? "text-black" : "text-gray-400"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={`flex-1 h-2 border-y-2 border-black ${i < step ? "bg-[#86efac]" : "bg-white opacity-50"}`} />}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className={`bg-white ${brutalBorder} ${brutalShadow} p-8 sm:p-12 min-h-[400px]`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div>
                  <div className="mb-8 border-b-4 border-black pb-4">
                    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter" style={{ textShadow: "2px 2px 0px #86efac" }}>THE DETAILS.</h2>
                    <p className="text-xl font-bold mt-2">Who is this masterpiece for?</p>
                  </div>
                  
                  <div className="bg-[#fde047] p-6 border-4 border-black mb-8 transform -rotate-1">
                    <WishForm senderName={senderName} receiverName={receiverName} message={message} onChange={handleFormChange} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="mb-8 border-b-4 border-black pb-4">
                    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter" style={{ textShadow: "2px 2px 0px #93c5fd" }}>THE VISUALS.</h2>
                    <p className="text-xl font-bold mt-2">Upload your best moments.</p>
                  </div>

                  <div className="bg-[#e9d5ff] p-6 border-4 border-black mb-8 transform rotate-1">
                    <ImageUploader images={images} onChange={setImages} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-8 flex flex-col items-center">
                  <div className={`w-24 h-24 bg-[#86efac] ${brutalBorder} ${brutalShadow} flex items-center justify-center mb-8 rotate-3 hover:rotate-12 transition-transform`}>
                    <CreditCard className="w-12 h-12 text-black" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4" style={{ textShadow: "2px 2px 0px #ff90e8" }}>SEAL THE DEAL.</h2>
                  <p className="text-xl font-bold mb-6">One-time payment. Infinite magic.</p>
                  
                  <div className={`bg-black text-white px-8 py-4 font-black text-4xl uppercase tracking-widest ${brutalBorder} border-white shadow-[6px_6px_0px_#fde047] mb-8`}>
                    ₹49
                  </div>
                  
                  <p className="text-sm font-bold uppercase text-gray-500 mb-8 max-w-sm">
                    *Razorpay integration required for production. Demo mode active.
                  </p>
                  
                  <Button
                    size="lg"
                    onClick={handlePayment}
                    disabled={processing}
                    className={`h-16 px-10 bg-[#ff90e8] text-black text-xl font-black uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all duration-200 w-full sm:w-auto`}
                  >
                    {processing ? "MAKING IT..." : "PAY & PUBLISH"}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {step < 2 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`h-14 px-8 bg-white text-black font-black uppercase tracking-widest rounded-none ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className={`h-14 px-10 bg-[#86efac] text-black font-black uppercase tracking-widest rounded-none ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              NEXT <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
