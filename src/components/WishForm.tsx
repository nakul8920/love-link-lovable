import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  senderName: string;
  receiverName: string;
  message: string;
  onChange: (field: string, value: string) => void;
}

const brutalBorder = "border-[3px] border-black";
const inputShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]";
const inputClass = `w-full h-14 bg-white text-black font-bold md:text-lg rounded-none ${brutalBorder} ${inputShadow} focus:outline-none focus:ring-0 focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all px-4`;

const WishForm = ({ senderName, receiverName, message, onChange }: Props) => {
  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-md mx-auto">
      {/* Sender Name */}
      <div className="relative pt-6">
        <label 
          htmlFor="senderName" 
          className="absolute top-0 left-4 z-10 bg-black text-white px-3 py-1 text-xs md:text-sm font-black uppercase tracking-wider"
        >
          Your Name
        </label>
        <Input
          id="senderName"
          placeholder="E.g. Romeo"
          value={senderName}
          onChange={(e) => onChange("senderName", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Receiver Name */}
      <div className="relative pt-6">
        <label 
          htmlFor="receiverName" 
          className="absolute top-0 left-4 z-10 bg-black text-white px-3 py-1 text-xs md:text-sm font-black uppercase tracking-wider"
        >
          Receiver's Name
        </label>
        <Input
          id="receiverName"
          placeholder="Who's this for?"
          value={receiverName}
          onChange={(e) => onChange("receiverName", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div className="relative pt-6">
        <label 
          htmlFor="message" 
          className="absolute top-0 left-4 z-10 bg-[#ff0844] text-white px-3 py-1 text-xs md:text-sm font-black uppercase tracking-wider"
        >
          Your Message
        </label>
        <Textarea
          id="message"
          placeholder="Write something nice..."
          value={message}
          onChange={(e) => onChange("message", e.target.value)}
          className={`w-full min-h-[140px] md:min-h-[160px] bg-white text-black font-bold md:text-lg rounded-none ${brutalBorder} ${inputShadow} focus:outline-none focus:ring-0 focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all resize-none p-4`}
        />
      </div>
    </div>
  );
};

export default WishForm;
