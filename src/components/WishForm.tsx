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

const WishForm = ({ senderName, receiverName, message, onChange }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="senderName" className="text-sm font-medium text-foreground">Your Name</Label>
        <Input
          id="senderName"
          placeholder="Enter your name"
          value={senderName}
          onChange={(e) => onChange("senderName", e.target.value)}
          className="h-12 rounded-xl bg-secondary/50 border-border focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="receiverName" className="text-sm font-medium text-foreground">Receiver's Name</Label>
        <Input
          id="receiverName"
          placeholder="Who is this for?"
          value={receiverName}
          onChange={(e) => onChange("receiverName", e.target.value)}
          className="h-12 rounded-xl bg-secondary/50 border-border focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Write your heartfelt message..."
          value={message}
          onChange={(e) => onChange("message", e.target.value)}
          className="min-h-[120px] rounded-xl bg-secondary/50 border-border focus:border-primary resize-none"
        />
      </div>
    </motion.div>
  );
};

export default WishForm;
