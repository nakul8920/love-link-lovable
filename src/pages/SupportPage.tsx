import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const brutalBorder = "border-[3px] border-black";
const brutalShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]";

const ISSUE_OPTIONS = [
  { id: "page_create" as const, label: "Page won't create / save error" },
  { id: "payment_no_link" as const, label: "I paid but didn't get my link" },
  { id: "link_broken" as const, label: "My link doesn't open or is broken" },
  { id: "other" as const, label: "Other" },
];

/** +91 8920183166 — digits only for wa.me */
const DEFAULT_SUPPORT_WHATSAPP_E164 = "918920183166";

function supportWhatsAppDigits(): string {
  const fromEnv = import.meta.env.VITE_SUPPORT_WHATSAPP?.replace(/\D/g, "");
  if (fromEnv && fromEnv.length >= 10) return fromEnv;
  return DEFAULT_SUPPORT_WHATSAPP_E164;
}

function buildSupportWhatsAppText(params: {
  username: string;
  phone: string;
  contactEmail: string;
  issueLabels: string[];
  customMessage: string;
}): string {
  const lines = [
    "*Wishlink — Support request*",
    "",
    `*Username:* ${params.username}`,
    `*Phone:* ${params.phone}`,
    params.contactEmail ? `*Email:* ${params.contactEmail}` : null,
    "",
    "*Issues:*",
    params.issueLabels.length ? params.issueLabels.map((l) => `• ${l}`).join("\n") : "• (message only)",
    "",
    "*Details:*",
    params.customMessage || "—",
    "",
    "_Sent from Wishlink support form_",
  ].filter(Boolean) as string[];
  return lines.join("\n");
}

const SupportPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
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
          if (data?.username) setUsername(String(data.username));
          if (data?.email) setContactEmail(String(data.email));
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const selectedIssues = ISSUE_OPTIONS.filter((o) => checked[o.id]).map((o) => o.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!username.trim()) {
      toast.error("Please enter your username.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number (at least 10 digits).");
      return;
    }
    if (selectedIssues.length === 0 && !customMessage.trim()) {
      toast.error("Select at least one issue or write a message.");
      return;
    }
    if (selectedIssues.length === 1 && selectedIssues[0] === "other" && !customMessage.trim()) {
      toast.error('Please describe your issue when you select "Other".');
      return;
    }

    setSending(true);
    try {
      const issueLabels = ISSUE_OPTIONS.filter((o) => selectedIssues.includes(o.id)).map((o) => o.label);
      const text = buildSupportWhatsAppText({
        username: username.trim(),
        phone: phone.trim(),
        contactEmail: contactEmail.trim(),
        issueLabels,
        customMessage: customMessage.trim(),
      });

      const maxLen = 1800;
      const safeText = text.length > maxLen ? `${text.slice(0, maxLen)}\n\n…(truncated)` : text;
      const waPhone = supportWhatsAppDigits();
      const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(safeText)}`;

      const popup = window.open(url, "_blank", "noopener,noreferrer");
      if (!popup) {
        window.location.href = url;
      }

      setSent(true);
      toast.success("WhatsApp khul gaya — wahan Send dabao, team reply karegi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[100dvh] bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full bg-[#86efac] ${brutalBorder} ${brutalShadow} flex items-center justify-center mb-8`}>
            <CheckCircle2 className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-4" style={{ textShadow: "3px 3px 0 #ff90e8" }}>
            Got it!
          </h1>
          <p className="text-base sm:text-lg font-bold text-black/90 mb-2">
            Almost done — message WhatsApp par bhej do.
          </p>
          <p className="text-sm font-medium text-black/70 mb-10">
            Agar WhatsApp na khula ho to popup blocker band karke dubara try karo. Team jald reply karegi.
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
              onClick={() => navigate("/profile")}
              className={`rounded-none ${brutalBorder} font-black uppercase tracking-widest h-12 px-8 bg-white`}
            >
              Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <header className={`relative z-10 w-full bg-[#c4b5fd] ${brutalBorder} border-t-0 border-l-0 border-r-0`}>
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
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-2" style={{ textShadow: "4px 4px 0 #fde047" }}>
          Support
        </h1>
        <p className="text-sm sm:text-base font-bold text-black/80 mb-8 max-w-xl">
          Fill the form and we will get back to you soon.
        </p>

        <form onSubmit={handleSubmit} className={`bg-white ${brutalBorder} ${brutalShadow} p-4 sm:p-8 space-y-6`}>
          <div className="space-y-2">
            <Label htmlFor="username" className="font-black uppercase tracking-widest text-xs">
              Username (as on your profile)
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              required
              className={`rounded-none ${brutalBorder} font-bold h-12`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-black uppercase tracking-widest text-xs">
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              className={`rounded-none ${brutalBorder} font-bold h-12`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="font-black uppercase tracking-widest text-xs">
              Email (optional — we pre-fill if you&apos;re logged in)
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
              className={`rounded-none ${brutalBorder} font-bold h-12`}
            />
          </div>

          <div className="space-y-3">
            <p className="font-black uppercase tracking-widest text-xs">What&apos;s the problem?</p>
            <div className="space-y-3">
              {ISSUE_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-start gap-3">
                  <Checkbox
                    id={opt.id}
                    checked={!!checked[opt.id]}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [opt.id]: v === true }))
                    }
                    className={`mt-0.5 rounded-none ${brutalBorder} data-[state=checked]:bg-[#ff90e8] data-[state=checked]:text-black`}
                  />
                  <Label htmlFor={opt.id} className="font-bold text-sm leading-tight cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="msg" className="font-black uppercase tracking-widest text-xs">
              Your message (optional if you ticked issues above)
            </Label>
            <Textarea
              id="msg"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Describe the issue, paste your link, or any error you saw..."
              rows={5}
              className={`rounded-none ${brutalBorder} font-bold resize-y min-h-[120px]`}
            />
          </div>

          <Button
            type="submit"
            disabled={sending}
            className={`w-full h-14 sm:h-16 bg-black text-white text-base sm:text-lg font-black uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} hover:bg-[#ff0844]`}
          >
            {sending ? (
              "Opening WhatsApp..."
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Send on WhatsApp
              </span>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default SupportPage;
