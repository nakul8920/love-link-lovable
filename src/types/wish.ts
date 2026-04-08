export type TemplateType = "valentine" | "birthday" | "anniversary" | "surprise";

export interface AnniversaryTimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface AnniversaryDetails {
  years: string;
  date: string;
  husbandName: string;
  wifeName: string;
  husbandBio: string;
  wifeBio: string;
  timeline: AnniversaryTimelineEvent[];

  // Customizable labels
  gotMarriedLabel?: string;
  nextAnniversaryLabel?: string;
  happyCoupleLabel?: string;
  loveStoryLabel?: string;
  galleryLabel?: string;
  thankYouLabel?: string;
}

export type SectionType = "hero" | "paragraph" | "gallery" | "quote" | "video" | "timeline";

export interface SurpriseSection {
  id: string; // unique identifier
  type: SectionType;
  title?: string; // used for hero or generic headings
  content?: string; // used for paragraphs or quotes or urls (video/music target)
  images?: string[]; // used for gallery or single images (base64 or remote URL)
  events?: { title: string; date: string; description: string }[]; // used for timeline
}

export interface SurpriseDetails {
  theme: "elegant" | "neon" | "brutalist" | "romantic" | "vintage" | "cyberpunk" | "minimalist" | "space";
  animationStyle: "confetti" | "sparkles" | "hearts" | "balloons" | "snow" | "fireflies" | "rain" | "matrix";
  pageTitle: string; // Used as the browser title or fallback hero
  sections: SurpriseSection[]; // Stores all user-added blocks in order
}


export interface WishPage {
  id: string;
  slug: string;
  templateType: TemplateType;
  senderName: string;
  receiverName: string;
  message: string;
  imageUrls: string[];
  createdAt: string;
  paymentStatus: "pending" | "success" | "failed";
  orderId: string;
  anniversaryDetails?: AnniversaryDetails;
  surpriseDetails?: SurpriseDetails;
}

export interface CreateWishData {
  templateType: TemplateType;
  senderName: string;
  receiverName: string;
  message: string;
  images: File[];
  anniversaryDetails?: AnniversaryDetails;
  surpriseDetails?: SurpriseDetails;
}
