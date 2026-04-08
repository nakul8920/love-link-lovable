import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnniversaryDetails, AnniversaryTimelineEvent } from "@/types/wish";

interface AnniversaryFormProps {
  details: AnniversaryDetails;
  onChange: (details: AnniversaryDetails) => void;
  senderName?: string;
  message?: string;
  onGlobalChange?: (field: string, value: string) => void;
}

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-white";
const textareaClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-white resize-y min-h-[100px]";
const labelClass = "text-sm font-semibold text-slate-800 mb-1.5 block";
const sectionCard = "bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6";
const sectionTitle = "text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6";

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const AnniversaryForm = ({ details, onChange, senderName = "", message = "", onGlobalChange }: AnniversaryFormProps) => {

  const handleTextChange = (field: keyof AnniversaryDetails, value: string) => {
    if ((field === "husbandBio" || field === "wifeBio") && countWords(value) > 250) {
      if (value.length > ((details[field] as string) || "").length) return;
    }
    onChange({ ...details, [field]: value });
  };

  const handleTimelineChange = (index: number, field: keyof AnniversaryTimelineEvent, value: string) => {
    if (field === "description" && countWords(value) > 250) {
      if (value.length > (details.timeline[index].description || "").length) return;
    }
    const newTimeline = [...details.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    onChange({ ...details, timeline: newTimeline });
  };

  const handleGlobalTextChange = (field: string, value: string) => {
    if (field === "message" && countWords(value) > 50) {
        if (value.length > message.length) return;
    }
    onGlobalChange?.(field, value);
  };

  return (
    <div className="w-full mx-auto pb-32">
      
      {/* Basic Setup */}
      <div className={sectionCard}>
        <h3 className={sectionTitle}>1. Basic Information</h3>
        <div className="grid grid-cols-1">
          <div>
            <Label className={labelClass}>Marriage / Relationship Start Date</Label>
            <Input
              value={details.date}
              type="date"
              onChange={(e) => handleTextChange("date", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Couple Information */}
      <div className={sectionCard}>
        <h3 className={sectionTitle}>2. Partner Profiles</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100 uppercase text-xs tracking-wider">Partner One</h4>
            <div>
              <Label className={labelClass}>Full Name</Label>
              <Input
                value={details.husbandName}
                onChange={(e) => handleTextChange("husbandName", e.target.value)}
                placeholder="e.g. John Doe"
                className={inputClass}
              />
            </div>
            <div>
              <Label className={labelClass}>Short Bio (Max 250 words)</Label>
              <textarea
                value={details.husbandBio}
                onChange={(e) => handleTextChange("husbandBio", e.target.value)}
                placeholder="A small description..."
                className={textareaClass}
              />
              <p className={`text-xs mt-1 text-right ${countWords(details.husbandBio || "") >= 250 ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                {countWords(details.husbandBio || "")} / 250 words
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100 uppercase text-xs tracking-wider">Partner Two</h4>
            <div>
              <Label className={labelClass}>Full Name</Label>
              <Input
                value={details.wifeName}
                onChange={(e) => handleTextChange("wifeName", e.target.value)}
                placeholder="e.g. Jane Smith"
                className={inputClass}
              />
            </div>
            <div>
              <Label className={labelClass}>Short Bio (Max 250 words)</Label>
              <textarea
                value={details.wifeBio}
                onChange={(e) => handleTextChange("wifeBio", e.target.value)}
                placeholder="A small description..."
                className={textareaClass}
              />
               <p className={`text-xs mt-1 text-right ${countWords(details.wifeBio || "") >= 250 ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                {countWords(details.wifeBio || "")} / 250 words
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Timeline Events */}
      <div className={sectionCard}>
        <h3 className={sectionTitle}>3. Love Story Timeline (3 Events)</h3>
        <div className="space-y-6">
          {details.timeline.map((event, index) => (
            <div key={index} className="p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-4 bg-white inline-block px-3 py-1 rounded shadow-sm border border-slate-200">Event {index + 1}</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>Event Title</Label>
                    <Input
                      value={event.title}
                      onChange={(e) => handleTimelineChange(index, "title", e.target.value)}
                      placeholder="e.g. Our First Meeting"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>Date/Timeframe</Label>
                    <Input
                      value={event.date}
                      onChange={(e) => handleTimelineChange(index, "date", e.target.value)}
                      placeholder="e.g. Summer 2018"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <Label className={labelClass}>Short Description (Max 250 words)</Label>
                  <textarea
                    value={event.description}
                    onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                    placeholder="Describe this moment briefly..."
                    className={`${textareaClass} min-h-[80px]`}
                  />
                  <p className={`text-xs mt-1 text-right ${countWords(event.description || "") >= 250 ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                    {countWords(event.description || "")} / 250 words
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Card Message */}
      <div className={sectionCard}>
        <h3 className={sectionTitle}>4. Final Card Message</h3>
        <p className="text-sm text-slate-500 mb-6 -mt-2">This note will appear elegantly at the end of the template.</p>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label className={labelClass}>Your Name (Sender)</Label>
            <Input
              value={senderName}
              onChange={(e) => handleGlobalTextChange("senderName", e.target.value)}
              placeholder="e.g. Secret Admirer"
              className={inputClass}
            />
          </div>
          <div>
            <Label className={labelClass}>Sweet Message (Max 50 words)</Label>
            <textarea
              value={message}
              onChange={(e) => handleGlobalTextChange("message", e.target.value)}
              placeholder="Write a sweet and memorable message..."
              className={textareaClass}
            />
             <p className={`text-xs mt-1 text-right ${countWords(message || "") >= 50 ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                {countWords(message || "")} / 50 words
              </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[200px]" aria-hidden="true" />
    </div>
  );
};

export default AnniversaryForm;
