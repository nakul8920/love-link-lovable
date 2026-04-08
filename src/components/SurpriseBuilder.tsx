import React, { useState } from "react";
import { SurpriseDetails, SurpriseSection, SectionType } from "@/types/wish";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash, ArrowUp, ArrowDown, LayoutTemplate, Palette, Image as ImageIcon, Type, Sparkles, Video, Clock, Music, ListOrdered } from "lucide-react";
import SurpriseTemplate from "./SurpriseTemplate";
import { API_BASE_URL } from "@/config";
import { X } from "lucide-react"; 

interface Props {
  details: SurpriseDetails;
  onChange: React.Dispatch<React.SetStateAction<SurpriseDetails>>;
  senderName: string;
  receiverName: string;
  onGlobalChange: (field: string, value: string) => void;
  onPublish: () => void;
  isPublishing: boolean;
}

const brutalInput = "bg-white border-[2px] md:border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black font-bold h-10 md:h-12 text-[10px] md:text-sm transition-transform focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none w-full";
const brutalBtn = "bg-[#86efac] text-black font-black uppercase tracking-widest border-[2px] md:border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-none text-[10px] md:text-sm";

const SurpriseBuilder = ({ details, onChange, senderName, receiverName, onGlobalChange, onPublish, isPublishing }: Props) => {
  const [activeTab, setActiveTab] = useState<"content" | "theme" | "preview">("content");
  const [uploadingCount, setUploadingCount] = useState(0);

  const addSection = (type: SectionType) => {
    let defaultContent = "";
    if (type === "paragraph" || type === "quote") defaultContent = "Write something lovely here...";
    if (type === "video") defaultContent = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const newSection: SurpriseSection = {
      id: Date.now().toString(),
      type,
      title: type === "hero" ? "New Highlight" : "",
      content: defaultContent,
      images: type === "gallery" ? [] : undefined,
      events: type === "timeline" ? [{ title: "First Met", date: "2020", description: "It was magical." }] : undefined
    };
    onChange(prev => ({ ...prev, sections: [...(prev.sections || []), newSection] }));
  };

  const updateSection = (id: string, updates: Partial<SurpriseSection>) => {
    onChange(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const removeSection = (id: string) => {
    onChange(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    onChange(prev => {
      const sections = [...prev.sections];
      if (index + direction < 0 || index + direction >= sections.length) return prev;
      const temp = sections[index];
      sections[index] = sections[index + direction];
      sections[index + direction] = temp;
      return { ...prev, sections };
    });
  };

  const handleTimelineChange = (sectionId: string, eventIndex: number, field: string, value: string) => {
    const section = details.sections.find(s => s.id === sectionId);
    if (!section || !section.events) return;
    const newEvents = [...section.events];
    newEvents[eventIndex] = { ...newEvents[eventIndex], [field]: value };
    updateSection(sectionId, { events: newEvents });
  };

  const addTimelineEvent = (sectionId: string) => {
    const section = details.sections.find(s => s.id === sectionId);
    if (!section || !section.events) return;
    updateSection(sectionId, { events: [...section.events, { title: "New Event", date: "", description: "" }] });
  };

  const removeTimelineEvent = (sectionId: string, eventIndex: number) => {
    const section = details.sections.find(s => s.id === sectionId);
    if (!section || !section.events) return;
    const newEvents = [...section.events];
    newEvents.splice(eventIndex, 1);
    updateSection(sectionId, { events: newEvents });
  };

  const handleImageUpload = async (sectionId: string, files: FileList) => {
    const section = details.sections.find(s => s.id === sectionId);
    if (!section) return;

    const currentImageCount = section.images?.length || 0;
    const filesArray = Array.from(files);
    const availableSlots = 12 - currentImageCount;
    if (availableSlots <= 0) return;

    const filesToUpload = filesArray.slice(0, availableSlots);
    const tempUrls = filesToUpload.map(f => URL.createObjectURL(f));
    
    onChange(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === sectionId) return { ...s, images: [...(s.images || []), ...tempUrls] };
        return s;
      })
    }));

    setUploadingCount(prev => prev + filesToUpload.length);

    await Promise.all(filesToUpload.map(async (file, index) => {
      const tempUrl = tempUrls[index];
      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const text = await res.text();
          const finalUrl = `${API_BASE_URL}${text}`;
          onChange((prevDetails) => {
            const updtSections = prevDetails.sections.map(s => {
               if(s.id === sectionId && s.images) {
                  return { ...s, images: s.images.map(img => img === tempUrl ? finalUrl : img) };
               }
               return s;
            });
            return { ...prevDetails, sections: updtSections };
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploadingCount(prev => prev - 1);
      }
    }));
  };

  const removeImage = (sectionId: string, imgIndex: number) => {
    const section = details.sections.find(s => s.id === sectionId);
    if (!section || !section.images) return;
    const newImages = [...section.images];
    newImages.splice(imgIndex, 1);
    updateSection(sectionId, { images: newImages });
  };

  const previewPage = {
    id: "preview",
    slug: "preview",
    templateType: "surprise" as const,
    senderName: senderName || "Your Name",
    receiverName: receiverName || "Their Name",
    message: "",
    imageUrls: [],
    createdAt: new Date().toISOString(),
    paymentStatus: "success" as const,
    orderId: "preview",
    surpriseDetails: details
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[100dvh] bg-white overflow-hidden text-black font-body relative">
      
      {/* LEFT PANEL - CONTROLS */}
      <div className={`w-full lg:w-[450px] lg:min-w-[450px] flex flex-col bg-[#FFFDF7] z-20 shadow-[8px_0_0_0_rgba(0,0,0,1)] lg:border-r-[4px] border-black transition-all ${activeTab === 'preview' ? 'h-auto lg:h-full border-b-[4px] lg:border-b-0' : 'h-full border-b-0'}`}>
        <div className="p-4 border-b-[3px] border-black bg-[#c4b5fd] flex justify-between items-center shrink-0">
           <h2 className="font-black text-xl uppercase tracking-widest flex items-center gap-2">
             <LayoutTemplate className="w-5 h-5" /> Editor
           </h2>
           <Button onClick={onPublish} disabled={isPublishing || uploadingCount > 0} className={`${brutalBtn} bg-[#fde047] h-8 px-4 text-xs`}>
             {uploadingCount > 0 ? `Uploading (${uploadingCount})...` : isPublishing ? "Publishing..." : "Publish"}
           </Button>
        </div>

        {/* SHARED TABS FOR MOBILE AND DESKTOP */}
        <div className="flex border-b-[3px] border-black bg-white shrink-0">
          <button 
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-[10px] sm:text-xs border-r-[3px] border-black ${activeTab === "content" ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            Content
          </button>
          <button 
            onClick={() => setActiveTab("theme")}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-[10px] sm:text-xs border-r-[3px] lg:border-r-0 border-black ${activeTab === "theme" ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            Theme
          </button>
          <button 
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-[10px] sm:text-xs lg:hidden ${activeTab === "preview" ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            Preview
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
          {activeTab === "theme" && (
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <label className="font-black uppercase tracking-widest text-[10px] md:text-sm bg-[#ff90e8] inline-block px-1 md:px-2 py-0.5 md:py-1 border-[2px] border-black shadow-[2px_2px_0px_#000] -rotate-1">
                  Browser Title
                </label>
                <Input
                  value={details.pageTitle}
                  onChange={(e) => onChange({ ...details, pageTitle: e.target.value })}
                  placeholder="Appears in browser tab"
                  className={brutalInput}
                />
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="font-black uppercase tracking-widest text-[10px] md:text-sm bg-[#fde047] inline-block px-1 md:px-2 py-0.5 md:py-1 border-[2px] border-black shadow-[2px_2px_0px_#000] rotate-1">
                  Aesthetic Theme
                </label>
                <select
                  value={details.theme}
                  onChange={(e) => onChange({ ...details, theme: e.target.value as any })}
                  className={`w-full px-2 py-1 md:px-3 md:py-2 ${brutalInput}`}
                >
                  <option value="brutalist">Brutalist (Bold & Raw)</option>
                  <option value="neon">Neon Cyberpunk</option>
                  <option value="elegant">Elegant & Minimal</option>
                  <option value="romantic">Soft Romantic</option>
                  <option value="vintage">Vintage Sepia</option>
                  <option value="cyberpunk">Digital Matrix</option>
                  <option value="minimalist">Ultra Minimal</option>
                  <option value="space">Deep Space</option>
                </select>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="font-black uppercase tracking-widest text-[10px] md:text-sm bg-[#86efac] inline-block px-1 md:px-2 py-0.5 md:py-1 border-[2px] border-black shadow-[2px_2px_0px_#000] -rotate-1">
                  Particle Effects
                </label>
                <select
                  value={details.animationStyle}
                  onChange={(e) => onChange({ ...details, animationStyle: e.target.value as any })}
                  className={`w-full px-2 py-1 md:px-3 md:py-2 ${brutalInput}`}
                >
                  <option value="confetti">Party Confetti 🔥</option>
                  <option value="sparkles">Golden Sparkles ✨</option>
                  <option value="hearts">Floating Hearts ♥</option>
                  <option value="balloons">Bouncing Balloons 🎈</option>
                  <option value="snow">Falling Snow ❄️</option>
                  <option value="fireflies">Glowing Fireflies 🟡</option>
                  <option value="rain">Pouring Rain 🌧️</option>
                  <option value="matrix">Matrix Code 📟</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-300">
                <div className="space-y-2">
                  <label className="font-black uppercase tracking-widest text-sm bg-white inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">
                    From Who?
                  </label>
                  <Input value={senderName} onChange={(e) => onGlobalChange("senderName", e.target.value)} placeholder="Your Name" className={brutalInput} />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase tracking-widest text-sm bg-white inline-block px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">
                    To Whom?
                  </label>
                  <Input value={receiverName} onChange={(e) => onGlobalChange("receiverName", e.target.value)} placeholder="Their Name" className={brutalInput} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6 pb-20">
              
              <div className="bg-gray-100 border-[3px] border-black p-4 space-y-3">
                <p className="font-bold uppercase tracking-widest text-sm text-center">Add New Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => addSection('hero')} className="border-2 border-black flex items-center justify-start gap-2 bg-white hover:bg-gray-200 rounded-none h-12 px-4 shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] font-bold text-xs transition-shadow"><Type className="w-5 h-5" /> Hero Text</Button>
                  <Button variant="outline" onClick={() => addSection('paragraph')} className="border-2 border-black flex items-center justify-start gap-2 bg-white hover:bg-gray-200 rounded-none h-12 px-4 shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] font-bold text-xs transition-shadow"><LayoutTemplate className="w-5 h-5" /> Paragraph</Button>
                  <Button variant="outline" onClick={() => addSection('gallery')} className="border-2 border-black flex items-center justify-start gap-2 bg-[#ff90e8] hover:bg-[#ff7ae0] rounded-none h-12 px-4 shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] font-bold text-xs transition-shadow"><ImageIcon className="w-5 h-5" /> Image Gallery</Button>
                  <Button variant="outline" onClick={() => addSection('quote')} className="border-2 border-black flex items-center justify-start gap-2 bg-[#fde047] hover:bg-yellow-400 rounded-none h-12 px-4 shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] font-bold text-xs transition-shadow"><Sparkles className="w-5 h-5" /> Blockquote</Button>
                  <Button variant="outline" onClick={() => addSection('video')} className="border-2 border-black flex items-center justify-start gap-2 bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-none h-12 px-4 shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] font-bold text-xs transition-shadow"><Video className="w-5 h-5" /> YouTube Video</Button>
                  <Button variant="outline" onClick={() => addSection('timeline')} className="border-2 border-black flex items-center justify-start gap-2 bg-[#f97316] text-white hover:bg-[#ea580c] rounded-none h-12 px-4 shadow-[2px_2px_0_#000] hover:shadow-[4px_4px_0_#000] font-bold text-xs transition-shadow"><ListOrdered className="w-5 h-5" /> Timeline</Button>
                </div>
              </div>

              {(details.sections || []).length === 0 ? (
                <div className="text-center py-10 opacity-50 font-bold border-2 border-dashed border-gray-400">
                  No sections yet. Add one above!
                </div>
              ) : (
                <div className="space-y-4">
                  {(details.sections || []).map((section, idx) => (
                    <div key={section.id} className="border-[3px] border-black bg-white shadow-[4px_4px_0_#93c5fd] flex flex-col">
                      <div className="flex justify-between items-center bg-black text-white px-3 py-1">
                        <span className="font-black uppercase tracking-widest text-xs">{section.type.toUpperCase()}</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveSection(idx, -1)} className="hover:text-[#fde047]"><ArrowUp className="w-4 h-4"/></button>
                          <button onClick={() => moveSection(idx, 1)} className="hover:text-[#fde047]"><ArrowDown className="w-4 h-4"/></button>
                          <button onClick={() => removeSection(section.id)} className="ml-2 hover:text-[#ff0844]"><Trash className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        {section.type === 'hero' ? (
                          <Input value={section.title || ""} onChange={(e) => updateSection(section.id, { title: e.target.value })} placeholder="Massive Headline" className="font-black text-xl border-2 border-dashed border-gray-300 rounded-none focus-visible:ring-0" />
                        ) : (
                          <div className="space-y-1 mb-2">
                            <label className="text-[10px] font-black uppercase text-gray-500">Section Heading (Optional)</label>
                            <Input value={section.title || ""} onChange={(e) => updateSection(section.id, { title: e.target.value })} placeholder="Default Heading" className="font-bold text-sm border-2 border-dashed border-gray-200 rounded-none focus-visible:ring-0 h-8" />
                          </div>
                        )}
                        {(section.type === 'paragraph' || section.type === 'quote') && (
                          <Textarea value={section.content || ""} onChange={(e) => updateSection(section.id, { content: e.target.value })} placeholder={section.type === 'quote' ? "An inspiring quote..." : "Write your heart out..."} className="font-medium min-h-[100px] border-2 border-dashed border-gray-300 rounded-none focus-visible:ring-0 resize-none" />
                        )}
                        {section.type === 'video' && (
                          <Input value={section.content || ""} onChange={(e) => updateSection(section.id, { content: e.target.value })} placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)" className="font-medium border-2 border-dashed border-gray-300 rounded-none focus-visible:ring-0" />
                        )}
                        {section.type === 'timeline' && (
                          <div className="space-y-3">
                            <span className="text-xs font-bold uppercase block opacity-60">Timeline Events</span>
                            {section.events?.map((ev, evIdx) => (
                              <div key={evIdx} className="border border-black p-2 bg-gray-50 relative group">
                                <button onClick={() => removeTimelineEvent(section.id, evIdx)} className="absolute top-1 right-1 text-red-500 hidden group-hover:block"><X className="w-4 h-4" /></button>
                                <Input value={ev.date} onChange={(e) => handleTimelineChange(section.id, evIdx, 'date', e.target.value)} placeholder="Date / Timestamp" className="h-8 text-xs font-bold border-black rounded-none mb-1 shadow-none" />
                                <Input value={ev.title} onChange={(e) => handleTimelineChange(section.id, evIdx, 'title', e.target.value)} placeholder="Event Title" className="h-8 text-xs font-bold border-black rounded-none mb-1 shadow-none" />
                                <Textarea value={ev.description} onChange={(e) => handleTimelineChange(section.id, evIdx, 'description', e.target.value)} placeholder="Description" className="min-h-[50px] text-xs font-medium border-black rounded-none shadow-none resize-none" />
                              </div>
                            ))}
                            <Button variant="outline" onClick={() => addTimelineEvent(section.id)} className="w-full border-black rounded-none h-8 text-xs font-bold shadow-[2px_2px_0_0_#000]">
                               + Add Event
                            </Button>
                          </div>
                        )}
                        {section.type === 'gallery' && (
                          <div className="space-y-2 relative">
                            {uploadingCount > 0 && <div className="absolute top-2 right-2 flex items-center gap-2 bg-yellow-400 text-black px-2 py-1 text-[10px] font-black uppercase border border-black z-10 animate-pulse">Uploading...</div>}
                            <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase tracking-widest opacity-60">{section.images?.length || 0} / 12 Images</span></div>
                            <label className={`cursor-pointer inline-flex w-full items-center justify-center p-4 border-2 border-dashed border-black ${((section.images?.length || 0) >= 12) ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'} font-bold uppercase text-xs transition-colors`}>
                              <ImageIcon className="w-4 h-4 mr-2" /> {((section.images?.length || 0) >= 12) ? 'Gallery Full' : 'Upload Photos'}
                              <input type="file" accept="image/*" multiple className="hidden" disabled={(section.images?.length || 0) >= 12} onChange={(e) => { if (e.target.files && e.target.files.length > 0) handleImageUpload(section.id, e.target.files); }} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} />
                            </label>
                            {section.images && section.images.length > 0 && (
                               <div className="flex flex-wrap gap-2 py-2">
                                 {section.images.map((img, imgIdx) => (
                                    <div key={imgIdx} className="relative w-16 h-16 shrink-0 border-2 border-black group">
                                       <img src={img} className={`w-full h-full object-cover ${img.startsWith('blob:') ? 'opacity-50 blur-sm' : ''}`} />
                                       <button onClick={() => removeImage(section.id, imgIdx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 border border-black opacity-0 group-hover:opacity-100 transition-opacity z-10"><X className="w-3 h-3" /></button>
                                    </div>
                                 ))}
                               </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={`${activeTab === "preview" ? "flex" : "hidden"} lg:flex flex-1 h-full bg-[#f1f5f9] overflow-y-auto relative custom-scrollbar`}>
         <SurpriseTemplate page={previewPage as any} previewMode={true} />
      </div>
    </div>
  );
};

export default SurpriseBuilder;
