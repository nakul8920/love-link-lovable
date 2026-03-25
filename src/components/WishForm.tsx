import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface Props {
  senderName: string;
  receiverName: string;
  message: string;
  onChange: (field: string, value: string) => void;
}

const brutalBorder = "border-4 border-black";
const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
const brutalInput = `h-14 bg-white text-black font-bold uppercase tracking-wide rounded-none ${brutalBorder} ${brutalShadow} focus:outline-none focus:ring-0 focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`;

const WishForm = ({ senderName, receiverName, message, onChange }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <Label htmlFor="senderName" className="text-xl font-black uppercase tracking-widest text-black bg-white px-2 py-1 border-2 border-black inline-block -rotate-1">Your Name</Label>
        <Input
          id="senderName"
          placeholder="Who are you?"
          value={senderName}
          onChange={(e) => onChange("senderName", e.target.value)}
          className={brutalInput}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="receiverName" className="text-xl font-black uppercase tracking-widest text-black bg-white px-2 py-1 border-2 border-black inline-block rotate-1">Receiver's Name</Label>
        <Input
          id="receiverName"
          placeholder="Who is this for?"
          value={receiverName}
          onChange={(e) => onChange("receiverName", e.target.value)}
          className={brutalInput}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="message" className="text-xl font-black uppercase tracking-widest text-black bg-white px-2 py-1 border-2 border-black inline-block -rotate-1">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Write something nice..."
          value={message}
          onChange={(e) => onChange("message", e.target.value)}
          className={`min-h-[160px] bg-white text-black font-bold uppercase tracking-wide rounded-none ${brutalBorder} ${brutalShadow} focus:outline-none focus:ring-0 focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all resize-none p-4`}
        />
      </div>
    </motion.div>
  );
};

export default WishForm;
