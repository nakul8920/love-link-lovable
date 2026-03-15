import { useParams } from "react-router-dom";
import { getPage } from "@/lib/store";
import AnimatedTemplate from "@/components/AnimatedTemplate";

const WishViewer = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getPage(slug) : undefined;

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Page not found</h1>
          <p className="text-muted-foreground">This wish page doesn't exist or has expired.</p>
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
