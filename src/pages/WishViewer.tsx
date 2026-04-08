import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPage } from "@/lib/store";
import AnimatedTemplate from "@/components/AnimatedTemplate";
import { API_BASE_URL } from "@/config";
import { WishPage } from "@/types/wish";

const WishViewer = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<WishPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/page/${slug}`);

        if (res.ok) {
          const data = await res.json();
          const content = data?.content || {};
          setPage({
            id: data?._id || slug,
            slug: data?.customUrlData || slug,
            templateType: content.templateType || "valentine",
            senderName: content.senderName || "",
            receiverName: content.receiverName || "",
            message: content.message || "",
            imageUrls: Array.isArray(data?.images) ? data.images : [],
            createdAt: data?.createdAt || new Date().toISOString(),
            paymentStatus: content.paymentStatus || "success",
            orderId: content.orderId || "unknown",
            anniversaryDetails: content.anniversaryDetails,
            surpriseDetails: content.surpriseDetails,
          });
        } else {
          // Fallback for locally-created pages not pushed to backend.
          const localPage = getPage(slug);
          setPage(localPage || null);
        }
      } catch {
        const localPage = getPage(slug);
        setPage(localPage || null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <p className="text-sm sm:text-base text-gray-700 font-medium">Loading your wish page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black mb-2">Page not found</h1>
          <p className="text-sm sm:text-base text-gray-600">This wish page doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatedTemplate
      type={page.templateType}
      senderName={page.senderName}
      receiverName={page.receiverName}
      message={page.message}
      imageUrls={page.imageUrls}
      anniversaryDetails={page.anniversaryDetails}
      surpriseDetails={page.surpriseDetails}
    />
  );
};

export default WishViewer;
