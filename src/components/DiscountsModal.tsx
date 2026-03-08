import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tag, Percent } from "lucide-react";

interface DiscountsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: string;
}

const categories = ["Lifeline Liquor", "Lifeline Airport", "Lifeline Car", "Lifeline Accounting"];

const discountData: Record<string, { title: string; desc: string; discount: string }[]> = {
  "Lifeline Liquor": [
    { title: "Weekend Special", desc: "10% off all premium wines every Friday-Sunday", discount: "10% OFF" },
    { title: "Student Night", desc: "15% discount on selected spirits with valid student ID", discount: "15% OFF" },
    { title: "Bundle Deal", desc: "Buy 2 get 1 free on craft beers", discount: "B2G1" },
  ],
  "Lifeline Airport": [
    { title: "Airport Pickup", desc: "$20 off your first airport pickup booking", discount: "$20 OFF" },
    { title: "Group Transfer", desc: "25% off for groups of 3+ passengers", discount: "25% OFF" },
    { title: "Return Trip", desc: "Book return trip and save 15%", discount: "15% OFF" },
  ],
  "Lifeline Car": [
    { title: "Weekly Rental", desc: "First week rental at 20% off for new users", discount: "20% OFF" },
    { title: "Weekend Getaway", desc: "Flat $50 off weekend car rentals", discount: "$50 OFF" },
    { title: "Long Term Deal", desc: "Monthly rentals starting from $199/week", discount: "SPECIAL" },
  ],
  "Lifeline Accounting": [
    { title: "Tax Return", desc: "Student tax returns from $49 — save up to $100", discount: "$100 OFF" },
    { title: "ABN Setup", desc: "Free ABN registration with any tax package", discount: "FREE" },
    { title: "Bookkeeping", desc: "First month bookkeeping at 50% off", discount: "50% OFF" },
  ],
};

export default function DiscountsModal({ open, onOpenChange, initialCategory }: DiscountsModalProps) {
  const [active, setActive] = useState(initialCategory || categories[0]);

  useEffect(() => {
    if (initialCategory) setActive(initialCategory);
  }, [initialCategory]);

  const offers = discountData[active] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[calc(100vw-2rem)] max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
          <DialogTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
            <Tag className="h-5 w-5 text-primary" /> Discounts & Offers
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row h-full min-h-0 sm:min-h-[350px]">
          {/* Left menu - horizontal scroll on mobile */}
          <div className="sm:w-48 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border p-2 sm:p-3 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors text-left flex-shrink-0 ${
                  active === cat ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Right content */}
          <div className="flex-1 p-3 sm:p-4 space-y-3 overflow-y-auto min-h-0">
            {offers.map((offer) => (
              <div key={offer.title} className="rounded-xl border border-border bg-secondary/30 p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Percent className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-bold">{offer.title}</h4>
                    <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent whitespace-nowrap">
                      {offer.discount}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{offer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
