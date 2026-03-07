import { useRef } from "react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

const coupons = [
  { id: 1, vendor: "Bean Counter Café", logo: "☕", offer: "Buy 1 Get 1 Free", discount: "50%", expiry: "Mar 15, 2026", desc: "On all hot beverages" },
  { id: 2, vendor: "The Green Bowl", logo: "🥗", offer: "Lunch Special", discount: "20%", expiry: "Mar 20, 2026", desc: "On salad combos" },
  { id: 3, vendor: "FitZone Gym", logo: "🏋️", offer: "Student Membership", discount: "30%", expiry: "Apr 1, 2026", desc: "Monthly subscription" },
  { id: 4, vendor: "Quick Print", logo: "🖨️", offer: "Free Binding", discount: "100%", expiry: "Mar 31, 2026", desc: "With any print order" },
  { id: 5, vendor: "Campus Bites", logo: "🍔", offer: "Meal Deal", discount: "25%", expiry: "Mar 18, 2026", desc: "Burger + drink combo" },
  { id: 6, vendor: "TechFix Hub", logo: "🔧", offer: "Screen Repair", discount: "15%", expiry: "Apr 10, 2026", desc: "Phone & laptop screens" },
  { id: 7, vendor: "BookWorm Store", logo: "📚", offer: "Textbook Sale", discount: "40%", expiry: "Mar 25, 2026", desc: "Selected textbooks" },
  { id: 8, vendor: "Clip & Style", logo: "💇", offer: "Haircut Special", discount: "20%", expiry: "Mar 22, 2026", desc: "Student haircut deal" },
];

export default function CouponCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-sm font-bold flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary" /> Exclusive Discounts</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll("right")} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <style>{`.coupon-scroll::-webkit-scrollbar { display: none; }`}</style>
        {coupons.map(c => (
          <div key={c.id} className="flex-shrink-0 w-[200px] sm:w-[220px] snap-start rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{c.logo}</span>
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{c.vendor}</div>
                <div className="text-[10px] text-muted-foreground">Expires {c.expiry}</div>
              </div>
            </div>
            <div className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-center mb-2">
              <div className="font-display text-lg font-bold text-primary">{c.discount} OFF</div>
              <div className="text-[10px] font-medium text-primary/80">{c.offer}</div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
