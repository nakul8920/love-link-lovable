export type TemplateType = "valentine" | "birthday" | "anniversary" | "surprise";

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
}

export interface CreateWishData {
  templateType: TemplateType;
  senderName: string;
  receiverName: string;
  message: string;
  images: File[];
}
