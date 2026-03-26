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
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="border-b border-black">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff90e8] fill-[#ff90e8]" />
            <span className="font-display font-semibold text-black">Admin Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-card border border-black">
            <p className="text-xs sm:text-sm text-gray-600">Total Pages</p>
            <p className="text-2xl sm:text-3xl font-bold text-black mt-1">{pages.length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-card border border-black">
            <p className="text-xs sm:text-sm text-gray-600">Paid Pages</p>
            <p className="text-2xl sm:text-3xl font-bold text-black mt-1">{pages.filter(p => p.paymentStatus === "success").length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-card border border-black">
            <p className="text-xs sm:text-sm text-gray-600">Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-black mt-1">₹{pages.filter(p => p.paymentStatus === "success").length * 49}</p>
          </div>
        </div>

        {/* Pages List */}
        <h2 className="text-lg sm:text-xl font-display font-bold text-black mb-3 sm:mb-4">All Pages</h2>
        {pages.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-gray-600">
            <p className="text-sm sm:text-base">No pages created yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.slug} className="bg-white border border-black rounded-xl p-3 sm:p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-black truncate text-sm sm:text-base">
                    {page.senderName} → {page.receiverName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {page.templateType} · /p/{page.slug} · {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => window.open(`/p/${page.slug}`, "_blank")} className="text-black hover:text-[#ff90e8]">
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(page.slug)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
