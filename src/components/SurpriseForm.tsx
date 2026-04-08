import React from "react";
import { SurpriseDetails } from "@/types/wish";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  details: SurpriseDetails;
  onChange: (details: SurpriseDetails) => void;
  senderName: string;
  receiverName: string;
  message: string;
  onGlobalChange: (field: string, value: string) => void;
}

const brutalInput = "bg-white border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black font-bold h-12 text-base md:text-lg transition-transform focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

const SurpriseForm = ({ details, onChange, senderName, receiverName, message, onGlobalChange }: Props) => {
  const updateDetail = (field: keyof SurpriseDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-6 w-full text-black">
      <div className="space-y-2">
        <label className="font-black uppercase tracking-widest text-sm bg-[#ff90e8] inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          Page Title
        </label>
        <Input
          value={details.pageTitle}
          onChange={(e) => updateDetail("pageTitle", e.target.value.slice(0, 50))}
          placeholder="e.g. Happy Best Friend Day!"
          className={brutalInput}
        />
        <p className="text-xs font-bold text-gray-500 text-right">{details.pageTitle.length}/50</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-black uppercase tracking-widest text-sm bg-[#fde047] inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1">
            Theme Style
          </label>
          <select
            value={details.theme}
            onChange={(e) => updateDetail("theme", e.target.value)}
            className={`w-full px-3 py-2 ${brutalInput}`}
          >
            <option value="brutalist">Brutalist (Default)</option>
            <option value="neon">Neon Cyberpunk</option>
            <option value="elegant">Elegant Minimal</option>
            <option value="romantic">Soft Romantic</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-black uppercase tracking-widest text-sm bg-[#86efac] inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            Animation Effect
          </label>
          <select
            value={details.animationStyle}
            onChange={(e) => updateDetail("animationStyle", e.target.value)}
            className={`w-full px-3 py-2 ${brutalInput}`}
          >
            <option value="confetti">Confetti Explosion</option>
            <option value="sparkles">Floating Sparkles</option>
            <option value="hearts">Rising Hearts</option>
            <option value="balloons">Party Balloons</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-black uppercase tracking-widest text-sm bg-[#c4b5fd] inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1">
            Who is it for?
          </label>
          <Input
            value={receiverName}
            onChange={(e) => onGlobalChange("receiverName", e.target.value.slice(0, 30))}
            placeholder="Their Name"
            className={brutalInput}
          />
        </div>
        
        <div className="space-y-2">
          <label className="font-black uppercase tracking-widest text-sm bg-white inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            From Who?
          </label>
          <Input
            value={senderName}
            onChange={(e) => onGlobalChange("senderName", e.target.value.slice(0, 30))}
            placeholder="Your Name"
            className={brutalInput}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="font-black uppercase tracking-widest text-sm bg-black text-white inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_#fde047] rotate-1">
          Your Personal Message
        </label>
        <Textarea
          value={message}
          onChange={(e) => onGlobalChange("message", e.target.value.slice(0, 300))}
          placeholder="Write whatever you want here..."
          className={`${brutalInput} h-32 md:h-40 resize-none`}
        />
        <p className="text-xs font-bold text-gray-500 text-right">{message.length}/300 limit</p>
      </div>
    </div>
  );
};

export default SurpriseForm;
