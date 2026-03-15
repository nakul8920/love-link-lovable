import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPages, deletePage } from "@/lib/store";
import { WishPage } from "@/types/wish";
import { toast } from "sonner";

const AdminPage = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<WishPage[]>([]);

  useEffect(() => {
    setPages(getAllPages());
  }, []);

  const handleDelete = (slug: string) => {
    deletePage(slug);
    setPages(getAllPages());
    toast.success("Page deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-semibold text-foreground">Admin Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground">Total Pages</p>
            <p className="text-3xl font-bold text-foreground mt-1">{pages.length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground">Paid Pages</p>
            <p className="text-3xl font-bold text-foreground mt-1">{pages.filter(p => p.paymentStatus === "success").length}</p>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-3xl font-bold text-foreground mt-1">₹{pages.filter(p => p.paymentStatus === "success").length * 49}</p>
          </div>
        </div>

        {/* Pages List */}
        <h2 className="text-xl font-display font-bold text-foreground mb-4">All Pages</h2>
        {pages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No pages created yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.slug} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {page.senderName} → {page.receiverName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {page.templateType} · /p/{page.slug} · {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => window.open(`/p/${page.slug}`, "_blank")}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(page.slug)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
