import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageSquareHeart, ImagePlus, X, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const brutalBorder = "border-[3px] border-black";
const brutalShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]";

const MAX_IMAGES = 6;
const MAX_MB = 8;

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.username) setName(String(data.username));
          if (data?.email) setEmail(String(data.email));
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const revokePreviews = useCallback((urls: string[]) => {
    urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const next: File[] = [...files];
    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image.`);
        continue;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`${f.name} is too large (max ${MAX_MB} MB).`);
        continue;
      }
      if (next.length >= MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images.`);
        break;
      }
      next.push(f);
    }
    revokePreviews(previews);
    setFiles(next);
    setPreviews(next.map((file) => URL.createObjectURL(file)));
  };

  const removeAt = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    revokePreviews(previews);
    setFiles(next);
    setPreviews(next.map((file) => URL.createObjectURL(file)));
  };

  useEffect(() => {
    return () => revokePreviews(previews);
  }, [previews, revokePreviews]);

  const uploadOne = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: fd,
    });
    const raw = await res.text();
    if (!res.ok) {
      let msg = "Upload failed";
      try {
        const j = JSON.parse(raw);
        if (j?.message) msg = j.message;
      } catch {
        if (raw) msg = raw;
      }
      throw new Error(msg);
    }
    const path = raw.trim();
    if (!path.startsWith("/uploads/")) {
      throw new Error("Unexpected upload response");
    }
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const text = message.trim();
    if (!text) {
      toast.error("Please write your feedback.");
      return;
    }

    const userToken = localStorage.getItem("token");
    setSending(true);
    try {
      const imagePaths: string[] = [];
      for (const file of files) {
        imagePaths.push(await uploadOne(file));
      }

      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          images: imagePaths,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || `Could not submit (${res.status})`);
        return;
      }

      setSent(true);
      toast.success(data.message || "Submitted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[100dvh] bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black">
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full bg-[#c4b5fd] ${brutalBorder} ${brutalShadow} flex items-center justify-center mb-8`}>
            <CheckCircle2 className="w-10 h-10 text-black" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-4"
            style={{ textShadow: "3px 3px 0 #ff90e8" }}
          >
            Thank you!
          </h1>
          <p className="text-base sm:text-lg font-bold text-black/90 mb-10">
            Your feedback was saved. We read every message and use it to improve Wishlink.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button
              type="button"
              onClick={() => navigate("/")}
              className={`bg-[#fde047] text-black font-black uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} h-12 px-8`}
            >
              Home
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/support")}
              className={`rounded-none ${brutalBorder} font-black uppercase tracking-widest h-12 px-8 bg-white`}
            >
              Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <header className={`relative z-10 w-full bg-[#ff90e8] ${brutalBorder} border-t-0 border-l-0 border-r-0`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 bg-white px-3 py-2 font-black uppercase text-sm ${brutalBorder} ${brutalShadowHover} transition-all`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Link
            to="/"
            className={`flex items-center gap-2 bg-white px-3 py-2 rounded-full ${brutalBorder} ${brutalShadow} font-display font-bold text-sm`}
          >
            <Heart className="w-4 h-4 fill-[#ff90e8]" />
            Wishlink
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12 pb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 bg-black ${brutalBorder}`}>
            <MessageSquareHeart className="w-6 h-6 text-[#ff90e8]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter" style={{ textShadow: "4px 4px 0 #fde047" }}>
            Feedback
          </h1>
        </div>
        <p className="text-sm sm:text-base font-bold text-black/80 mb-8 max-w-xl">
          Tell us what you love, what we should fix, or ideas for new features. You can add screenshots (optional).
        </p>

        <form onSubmit={handleSubmit} className={`bg-white ${brutalBorder} ${brutalShadow} p-4 sm:p-8 space-y-6`}>
          <div className="space-y-2">
            <Label htmlFor="fb-name" className="font-black uppercase tracking-widest text-xs">
              Name (optional)
            </Label>
            <Input
              id="fb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How we should address you"
              className={`rounded-none ${brutalBorder} font-bold h-12`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fb-email" className="font-black uppercase tracking-widest text-xs">
              Email (optional — so we can reply)
            </Label>
            <Input
              id="fb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`rounded-none ${brutalBorder} font-bold h-12`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fb-msg" className="font-black uppercase tracking-widest text-xs">
              Your feedback
            </Label>
            <Textarea
              id="fb-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience, bugs, or wishes..."
              rows={6}
              required
              className={`rounded-none ${brutalBorder} font-bold resize-y min-h-[140px]`}
            />
          </div>

          <div className="space-y-3">
            <p className="font-black uppercase tracking-widest text-xs">Photos (optional, max {MAX_IMAGES})</p>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={src} className={`relative w-24 h-24 ${brutalBorder} bg-gray-50 shrink-0`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-[#ff0844] text-white border-2 border-black flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {files.length < MAX_IMAGES && (
                <label
                  className={`w-24 h-24 flex flex-col items-center justify-center cursor-pointer bg-[#c4b5fd] ${brutalBorder} ${brutalShadowHover} transition-all`}
                >
                  <ImagePlus className="w-7 h-7 mb-1" />
                  <span className="text-[10px] font-black uppercase text-center px-1">Add</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-xs font-bold text-black/60">JPEG, PNG or WebP · up to {MAX_MB} MB each</p>
          </div>

          <Button
            type="submit"
            disabled={sending}
            className={`w-full h-14 sm:h-16 bg-black text-white text-base sm:text-lg font-black uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} hover:bg-[#ff0844]`}
          >
            {sending ? (
              "Sending..."
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Submit feedback
              </span>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default FeedbackPage;
