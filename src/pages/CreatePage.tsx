import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, CreditCard, Sparkles, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishForm from "@/components/WishForm";
import ImageUploader from "@/components/ImageUploader";
import { TemplateType, AnniversaryDetails, SurpriseDetails } from "@/types/wish";
import { generateSlug } from "@/lib/generateSlug";
import { savePage } from "@/lib/store";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import AnniversaryForm from "@/components/AnniversaryForm";
import AnniversaryImageUploader from "@/components/AnniversaryImageUploader";
import SurpriseForm from "@/components/SurpriseForm";
import SurpriseBuilder from "@/components/SurpriseBuilder";
const steps = ["Details", "Photos", "Publish"];

// Responsive brutal classes for mobile only
const brutalBorder = "border-[3px] border-black md:border-[4px]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]";

const CreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const themeParam = (searchParams.get("theme") as TemplateType) || "valentine";

  const [step, setStep] = useState(0);
  const [templateType] = useState<TemplateType>(themeParam);
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  // Anniversary State
  const [anniversaryDetails, setAnniversaryDetails] = useState<AnniversaryDetails>({
    years: "6",
    date: "11 November 2008",
    husbandName: "",
    wifeName: "",
    husbandBio: "",
    wifeBio: "",
    timeline: [
      { date: "", title: "", description: "" },
      { date: "", title: "", description: "" },
      { date: "", title: "", description: "" }
    ]
  });
  const [anniversaryImages, setAnniversaryImages] = useState<(File | null)[]>(Array(18).fill(null));

  // Surprise State
  const [showSurprisePayment, setShowSurprisePayment] = useState(false);
  const [surpriseDetails, setSurpriseDetails] = useState<SurpriseDetails>({
    theme: "brutalist",
    animationStyle: "confetti",
    pageTitle: "It's a Surprise!",
    sections: []
  });

  const canNext = () => {
    if (templateType === "surprise") {
      if (step === 0) return Boolean(surpriseDetails.pageTitle?.trim() && receiverName?.trim());
      if (step === 1) return true;
      return true;
    }
    if (templateType === "anniversary") {
      if (step === 0) {
        const hasHusband = Boolean(anniversaryDetails.husbandName?.trim());
        const hasWife = Boolean(anniversaryDetails.wifeName?.trim());
        const hasDate = Boolean(anniversaryDetails.date?.trim());
        return hasHusband && hasWife && hasDate;
      }
      if (step === 1) {
        return true; // Allow proceeding with placeholders if no images uploaded
      }
      return true;
    }
    
    if (step === 0) return Boolean(senderName?.trim() && receiverName?.trim() && message?.trim());
    if (step === 1) return true; // Standard templates also can proceed
    return true;
  };

  const handleFormChange = (field: string, value: string) => {
    if (field === "senderName") setSenderName(value);
    if (field === "receiverName") setReceiverName(value);
    if (field === "message") setMessage(value);
  };

  const handlePublish = async () => {
    setProcessing(true);

    try {
      const slug = generateSlug();
      const uploadedImageUrls: string[] = [];

      const imagesToUpload = templateType === "anniversary" ? anniversaryImages : images;

      for (const file of imagesToUpload) {
        if (!file) {
          uploadedImageUrls.push(""); // preserve index for sparse array
          continue;
        }
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const text = await res.text();
          uploadedImageUrls.push(`${API_BASE_URL}${text}`);
        } else {
          // If upload fails, just push empty to not break slots
          uploadedImageUrls.push("");
        }
      }

      // Final images resolution
      const finalImages = uploadedImageUrls.length > 0 
        ? uploadedImageUrls 
        : imagesToUpload.map((f) => f ? URL.createObjectURL(f) : "");

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
        orderId: "free_publish",
        ...(templateType === "anniversary" && { anniversaryDetails }),
        ...(templateType === "surprise" && { surpriseDetails })
      };

      savePage(pageData);

      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Auth token missing");
      }

      const pageSaveRes = await fetch(`${API_BASE_URL}/api/page`, {
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
              orderId: "free_publish",
              ...(templateType === "anniversary" && { anniversaryDetails }),
              ...(templateType === "surprise" && { surpriseDetails })
            },
            images: finalImages,
          }),
        });

      if (!pageSaveRes.ok) {
        const data = await pageSaveRes.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to save page on server");
      }

      setProcessing(false);
      navigate(`/success/${slug}`);
    } catch (err) {
      console.error("Publish flow failed:", err);
      setProcessing(false);
      const message = err instanceof Error ? err.message : "Publishing failed. Please try again.";
      toast.error(message);
    }
  };

  // Extra safety: redirect users to login if they try to open this page without auth.
  // (Even if server APIs are protected, we want the payment UI to be blocked too.)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  if (templateType === "surprise") {
    if (showSurprisePayment) {
      return (
        <div className="min-h-[100dvh] w-full bg-[#fde047] flex flex-col items-center justify-center p-4 relative font-body text-black overflow-hidden selection:bg-black selection:text-white">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
           
           <div className="w-full max-w-4xl relative z-10 text-center flex flex-col items-center">
              <div className={`w-28 h-28 md:w-36 md:h-36 bg-[#86efac] border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-8 md:mb-12 rotate-6`}>
                 <CreditCard className="w-12 h-12 md:w-16 md:h-16 text-black" />
              </div>
              <h1 className="text-5xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] mb-8 md:mb-12" style={{ textShadow: "4px 4px 0px #ff90e8" }}>
                SEAL IT.
              </h1>
              
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-12 bg-white border-[4px] md:border-[6px] border-black px-6 md:px-10 py-4 md:py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1 tracking-widest text-center mx-4">
                 <span className="text-2xl md:text-4xl font-bold uppercase">PAY</span>
                 <span className="text-4xl md:text-6xl font-black bg-black text-white px-4 md:px-6 py-2">₹49</span>
                 <span className="text-2xl md:text-4xl font-bold uppercase">TO PUBLISH.</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full justify-center px-4 md:px-0">
                 <Button
                   size="lg"
                   onClick={() => setShowSurprisePayment(false)}
                   disabled={processing}
                   className="h-16 md:h-24 bg-white text-black text-xl md:text-3xl font-black uppercase tracking-widest rounded-none border-[4px] md:border-[6px] border-black hover:bg-gray-100 transition-colors shadow-[6px_6px_0_0_#000] md:shadow-[10px_10px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none w-full md:w-auto md:min-w-[200px]"
                 >
                   BACK
                 </Button>
                 <Button
                   size="lg"
                   onClick={handlePublish}
                   disabled={processing}
                   className="h-16 md:h-24 bg-black text-white text-xl md:text-3xl font-black uppercase tracking-widest rounded-none border-[4px] md:border-[6px] border-black hover:bg-[#ff0844] transition-colors shadow-[6px_6px_0_0_#fff] md:shadow-[10px_10px_0_0_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none w-full md:w-auto md:min-w-[400px]"
                 >
                      {processing ? "PROCESSING..." : "PUBLISH LINK"}
                 </Button>
              </div>
           </div>
        </div>
      );
    }

    return (
      <SurpriseBuilder
        details={surpriseDetails}
        onChange={setSurpriseDetails}
        senderName={senderName}
        receiverName={receiverName}
        onGlobalChange={handleFormChange}
        onPublish={() => setShowSurprisePayment(true)}
        isPublishing={false}
      />
    );
  }

  return (
    <>
      <div className="min-h-[100dvh] bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black overflow-x-hidden flex flex-col lg:hidden">
        {/* MOBILE ONLY LAYOUT (Identical to before) */}
        
        {/* Background Texture globally on mobile */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}></div>

        {/* Sleek Mobile Brutalist Header */}
        <div className={`relative z-10 w-full bg-[#c4b5fd] border-b-[3px] border-black py-2 sm:py-3 px-3 sm:px-4 flex justify-between items-center`}>
          <button 
            onClick={() => navigate("/")} 
            className={`flex items-center gap-1 bg-white px-2 sm:px-3 py-1 sm:py-1.5 font-black uppercase text-[10px] sm:text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5" />
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-[#ff0844]" />
            <span className="hidden sm:inline">HOME</span>
          </button>
          
          <div className="bg-black text-white px-2 sm:px-3 py-0.5 sm:py-1 font-black uppercase text-[8px] sm:text-[10px] tracking-widest flex items-center gap-1 sm:gap-1.5 rotate-1">
            <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#fde047]" />
            <span>{templateType}</span>
          </div>
        </div>

        {/* Main Content Area - Mobile */}
        <div className="relative z-10 flex-1 flex flex-col max-w-xl sm:max-w-2xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
          
          <div className="flex justify-between items-center mb-6 w-full">
            <div className="bg-white border-[2px] sm:border-[3px] border-black font-black uppercase tracking-widest text-[10px] sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <span className="bg-black text-white px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-xs">STEP {step + 1}</span>
              <span>{steps[step]}</span>
            </div>
            
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 sm:h-3 w-6 sm:w-8 border-2 border-black transition-colors ${
                    i < step ? 'bg-[#86efac]' : i === step ? 'bg-[#ff90e8]' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-1 bg-[#fde047] inline-block px-2 sm:px-3 py-1 border-[2px] sm:border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                      THE DETAILS
                    </h2>
                    <p className="text-sm font-bold mt-4 mb-6 text-gray-800 ml-1">
                      Who is this masterpiece for?
                    </p>
                      {templateType === "anniversary" ? (
                        <AnniversaryForm details={anniversaryDetails} onChange={setAnniversaryDetails} senderName={senderName} message={message} onGlobalChange={handleFormChange} />
                      ) : (
                        <WishForm senderName={senderName} receiverName={receiverName} message={message} onChange={handleFormChange} />
                      )}
                  </div>
                )}

                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-1 bg-[#93c5fd] inline-block px-2 sm:px-3 py-1 border-[2px] sm:border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
                      THE VISUALS
                    </h2>
                    <p className="text-sm font-bold mt-4 mb-6 text-gray-800 ml-1">
                      Upload your best moments.
                    </p>
                    <div className="w-full">
                      {templateType === "anniversary" ? (
                        <AnniversaryImageUploader images={anniversaryImages} onChange={setAnniversaryImages} />
                      ) : (
                        <ImageUploader images={images} onChange={setImages} />
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center pt-4 text-center w-full max-w-md mx-auto">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-[#86efac] ${brutalBorder} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4 sm:mb-6 rotate-3`}>
                      <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2 sm:mb-3 leading-none" style={{ textShadow: "2px 2px 0px #ff90e8" }}>
                      SEAL THE DEAL.
                    </h2>
                    <p className="text-xs sm:text-sm font-bold mb-4 sm:mb-6">Ready to publish your link. 🎉</p>
                    
                    <div className={`bg-black text-white px-6 sm:px-8 py-2 sm:py-3 font-black text-2xl sm:text-3xl uppercase tracking-widest border-2 sm:border-4 border-white shadow-[4px_4px_0px_0px_#fde047] sm:shadow-[6px_6px_0px_0px_#fde047] mb-4 sm:mb-6`}>
                      FREE
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={handlePublish}
                      disabled={processing}
                      className={`w-full h-12 sm:h-16 bg-[#ff90e8] text-black text-sm sm:text-lg font-black uppercase tracking-widest rounded-none ${brutalBorder} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${brutalShadowHover} transition-all`}
                    >
                      {processing ? "PUBLISHING..." : "PUBLISH LINK"}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 2 && (
            <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t-2 sm:border-t-4 border-black border-dashed flex justify-between items-center w-full relative bottom-0">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className={`h-10 sm:h-12 px-4 sm:px-6 bg-white text-black font-black uppercase tracking-widest rounded-none border-[2px] sm:border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0`}
              >
                BACK
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className={`h-10 sm:h-12 px-4 sm:px-6 bg-[#86efac] text-black font-black uppercase tracking-widest rounded-none border-[2px] sm:border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 flex items-center`}
              >
                NEXT <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 
        ========================================
        DESKTOP LAYOUT (Hidden on Mobile)
        Epic Cinematic Horizontal Carousel Flow
        ========================================
      */}
      <div className="hidden lg:block w-full h-screen overflow-hidden bg-black text-black font-body selection:bg-[#ff0844] selection:text-white relative">
        
        {/* Floating Top Nav (Glassmorphism + Brutal) */}
        <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center pointer-events-none">
          <button 
            onClick={() => navigate("/")} 
            className="pointer-events-auto flex items-center gap-2 font-black uppercase tracking-widest text-sm bg-white border-[3px] border-black px-4 py-2 shadow-[4px_4px_0px_0px_#ff90e8] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#ff90e8] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            HOME
          </button>

          <div className="pointer-events-auto flex gap-3">
             {steps.map((label, index) => (
                <div key={index} className={`flex items-center gap-2 px-4 py-2 border-[3px] border-black font-black uppercase tracking-widest text-sm transition-colors ${
                  index === step ? 'bg-white shadow-[4px_4px_0px_0px_#fde047]' : 
                  index < step ? 'bg-[#ff90e8] opacity-100' : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}>
                   <span className={`w-6 h-6 text-xs flex items-center justify-center border-[2px] border-black ${index === step ? 'bg-black text-white' : 'bg-transparent'}`}>{index + 1}</span>
                   {label}
                </div>
             ))}
          </div>
        </div>

        {/* Massive Horizontal Sliding Track */}
        <motion.div 
          className="flex h-full w-[300vw]"
          animate={{ x: `-${step * 100}vw` }}
          transition={{ type: "spring", stiffness: 70, damping: 20, mass: 1 }}
        >
          {/* SLIDE 1: Details */}
          <div className={`w-[100vw] h-full flex items-center justify-center relative ${templateType === 'anniversary' ? 'bg-slate-50 items-start' : 'bg-[#c4b5fd]'}`}>
             {templateType !== 'anniversary' && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />}
             
             {templateType === "anniversary" ? (
                <div className="w-full h-full overflow-y-auto pt-32 px-4 flex justify-center z-10 custom-scrollbar">
                   <div className="w-full pb-64 px-2 sm:px-8">
                     <div className="mb-10 text-center">
                       <span className="text-blue-600 font-extrabold tracking-widest text-sm block mb-3 uppercase">STEP 01: THE DETAILS</span>
                       <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight">Anniversary Setup</h2>
                       <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">Fill in the specifics below to personalize your beautiful anniversary template.</p>
                     </div>
                     <AnniversaryForm details={anniversaryDetails} onChange={setAnniversaryDetails} senderName={senderName} message={message} onGlobalChange={handleFormChange} />
                   </div>
                </div>
             ) : (
                <div className="w-full max-w-5xl flex gap-16 relative z-10">
                   <div className="flex-1 flex flex-col justify-center">
                     <span className="text-[#ff0844] font-black tracking-widest text-2xl mb-4">STEP 01</span>
                     <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8" style={{ textShadow: "6px 6px 0px #FFFDF7" }}>
                       WHO IS<br/>THIS FOR?
                     </h1>
                     <p className="text-2xl font-bold border-l-[8px] border-black pl-8 py-2 w-4/5 text-gray-800">
                       Type out their name, your name, and a heartfelt message. We'll handle making it look spectacular.
                     </p>
                   </div>
                   
                   <div className="w-[600px] shrink-0 bg-white border-[6px] border-black p-8 shadow-[16px_16px_0px_0px_#fde047] rotate-1 max-h-[80vh] overflow-y-auto">
                      <WishForm senderName={senderName} receiverName={receiverName} message={message} onChange={handleFormChange} />
                   </div>
                </div>
             )}
          </div>

          {/* SLIDE 2: Photos */}
          <div className={`w-[100vw] h-full flex items-center justify-center relative ${templateType === 'anniversary' ? 'bg-slate-50 items-start' : 'bg-[#ff90e8]'}`}>
             {templateType !== 'anniversary' && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)", backgroundSize: "60px 60px" }} />}
             
             {templateType === "anniversary" ? (
                <div className="w-full h-full overflow-y-auto pt-32 px-4 flex justify-center z-10 custom-scrollbar">
                   <div className="w-full pb-64 px-2 sm:px-8">
                     <div className="mb-10 text-center">
                       <span className="text-blue-600 font-extrabold tracking-widest text-sm block mb-3 uppercase">STEP 02: THE PHOTOS</span>
                       <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight">Upload Memories</h2>
                       <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">Upload your memories to slot them directly into your Anniversary page.</p>
                     </div>
                     <AnniversaryImageUploader images={anniversaryImages} onChange={setAnniversaryImages} />
                   </div>
                </div>
             ) : (
                <div className="w-full max-w-6xl flex gap-12 relative z-10">
                   <div className="flex-1 flex flex-col justify-center text-right border-r-[8px] border-black pr-12 pb-8">
                     <span className="text-[#fde047] font-black tracking-widest text-2xl mb-4 block">STEP 02</span>
                     <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8" style={{ textShadow: "-6px 6px 0px #FFFDF7" }}>
                       VISUALS<br/>MATTER.
                     </h1>
                     <p className="text-2xl font-bold w-4/5 ml-auto text-gray-800">
                       Drop up to 10 photos of your best memories together. They will be animated smoothly into your magic link.
                     </p>
                   </div>
                   
                   <div className="w-[600px] shrink-0 bg-[#FFFDF7] border-[6px] border-black p-8 shadow-[-16px_16px_0px_0px_#86efac] -rotate-1 max-h-[80vh] overflow-y-auto">
                      <ImageUploader images={images} onChange={setImages} />
                   </div>
                </div>
             )}
          </div>

          {/* SLIDE 3: Payment */}
          <div className="w-[100vw] h-full bg-[#fde047] flex items-center justify-center relative">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
             
             <div className="w-full max-w-4xl relative z-10 text-center flex flex-col items-center">
                <div className={`w-36 h-36 bg-[#86efac] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-12 rotate-6`}>
                   <CreditCard className="w-16 h-16 text-black" />
                </div>
                <h1 className="text-[9rem] font-black uppercase tracking-tighter leading-[0.8] mb-12" style={{ textShadow: "8px 8px 0px #ff90e8" }}>
                  SEAL IT.
                </h1>
                
                <div className="flex items-center gap-6 mb-12 bg-white border-[6px] border-black px-10 py-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1 tracking-widest">
                   <span className="text-4xl font-bold uppercase">PUBLISH</span>
                   <span className="text-6xl font-black bg-black text-white px-6 py-2">FREE</span>
                   <span className="text-4xl font-bold uppercase">NOW.</span>
                </div>

                <Button
                  size="lg"
                  onClick={handlePublish}
                  disabled={processing}
                  className={`min-w-[400px] h-28 bg-black text-white text-4xl font-black uppercase tracking-widest rounded-none border-[6px] border-black hover:bg-[#ff0844] hover:text-white transition-colors shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none`}
                >
                  {processing ? "PROCESSING..." : "PUBLISH LINK"}
                </Button>
             </div>
          </div>
        </motion.div>

        {/* Floating Bottom Navigator (Mac-like dock but brutalist) */}
        {step < 2 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white border-[3px] border-black p-2.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`h-12 px-6 bg-white text-black text-sm font-black uppercase tracking-widest rounded-none border-[3px] border-black transition-all disabled:opacity-30 hover:bg-black hover:text-white`}
            >
              BACK
            </Button>

            <div className="px-6 font-black text-sm uppercase tracking-widest border-x-[3px] border-black h-12 flex items-center justify-center">
               <Smile className="w-5 h-5 mr-2 text-[#ff90e8] fill-[#ff90e8]" />
               ALMOST THERE
            </div>
            
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className={`h-12 px-8 bg-[#86efac] text-black text-sm font-black uppercase tracking-widest rounded-none border-[3px] border-black transition-all disabled:opacity-30 hover:bg-[#4ade80] flex items-center group`}
            >
              NEXT <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatePage;
