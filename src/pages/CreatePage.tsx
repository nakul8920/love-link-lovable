import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateSelector from "@/components/TemplateSelector";
import WishForm from "@/components/WishForm";
import ImageUploader from "@/components/ImageUploader";
import { TemplateType } from "@/types/wish";
import { generateSlug } from "@/lib/generateSlug";
import { savePage } from "@/lib/store";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const steps = ["Template", "Details", "Photos", "Payment"];

const CreatePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [templateType, setTemplateType] = useState<TemplateType | null>(null);
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const canNext = () => {
    if (step === 0) return !!templateType;
    if (step === 1) return senderName.trim() && receiverName.trim() && message.trim();
    if (step === 2) return images.length >= 1;
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
      toast.success("Your wish page is ready!");
      navigate(`/success/${slug}`);
    } catch (error) {
      console.error(error);
      setProcessing(false);
      toast.error("Failed to create page");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-semibold text-foreground">WishLink</span>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
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
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Choose an occasion</h2>
                <p className="text-muted-foreground mb-6">Pick the perfect template for your wish.</p>
                <TemplateSelector selected={templateType} onSelect={setTemplateType} />
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Add your details</h2>
                <p className="text-muted-foreground mb-6">Personalize your wish page.</p>
                <WishForm senderName={senderName} receiverName={receiverName} message={message} onChange={handleFormChange} />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Upload your photos</h2>
                <p className="text-muted-foreground mb-6">Add memorable photos to your wish page.</p>
                <ImageUploader images={images} onChange={setImages} />
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Complete Payment</h2>
                <p className="text-muted-foreground mb-2">One-time payment to create your wish page</p>
                <p className="text-3xl font-bold text-foreground mb-6">₹49</p>
                <p className="text-xs text-muted-foreground mb-8">Razorpay integration required for production. Demo simulates payment.</p>
                <Button
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing}
                  className="h-14 px-10 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90"
                >
                  {processing ? "Processing..." : "Pay ₹49 & Generate Link"}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between mt-10 pb-10">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="rounded-full gradient-primary text-primary-foreground hover:opacity-90"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
