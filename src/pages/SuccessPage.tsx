import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const SuccessPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const link = `${window.location.origin}/p/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this special wish I made for you! ${link}`)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Your wish page is ready! 🎉</h1>
        <p className="text-muted-foreground mb-8">Share this link with your special someone.</p>

        <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-center gap-3">
          <code className="flex-1 text-sm text-foreground truncate text-left">{link}</code>
          <Button size="sm" variant="outline" onClick={handleCopy} className="rounded-lg shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <Button onClick={handleWhatsApp} className="rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-primary-foreground">
            <Share2 className="w-4 h-4 mr-2" /> WhatsApp
          </Button>
          <Button variant="outline" onClick={handleCopy} className="rounded-full">
            <Copy className="w-4 h-4 mr-2" /> Copy Link
          </Button>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => navigate(`/p/${slug}`)} className="text-muted-foreground">
            Preview Page
          </Button>
          <Button variant="ghost" onClick={() => navigate("/create")} className="text-muted-foreground">
            Create Another
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-primary fill-primary" /> WishLink
        </p>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
