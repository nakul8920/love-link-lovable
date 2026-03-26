import { useParams } from "react-router-dom";
import { getPage } from "@/lib/store";
import AnimatedTemplate from "@/components/AnimatedTemplate";

const WishViewer = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getPage(slug) : undefined;

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black mb-2">Page not found</h1>
          <p className="text-sm sm:text-base text-gray-600">This wish page doesn't exist or has expired.</p>
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
    />
  );
};

export default WishViewer;
