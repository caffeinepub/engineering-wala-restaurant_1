import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Offer } from "../backend";
import { useActor } from "../hooks/useActor";

const FALLBACK_OFFERS: Offer[] = [
  {
    title: "Engineering Special Combo",
    description:
      "Burger + Fries + Cold Drink at just ₹199. Perfect engineering-grade meal deal!",
    discountText: "₹199 Combo",
    promoCode: "ENGINEER",
    isActive: true,
    validUntil: BigInt(0),
  },
  {
    title: "Biryani Bonanza",
    description:
      "Get 2 Biryanis of your choice (Chicken or Veg) at just ₹399. Perfect for sharing!",
    discountText: "2 Biryanis ₹399",
    promoCode: "BIRYANI2",
    isActive: true,
    validUntil: BigInt(0),
  },
  {
    title: "20% Off on ₹299+",
    description:
      "Order above ₹299 and get 20% off on your total bill. Valid on all menu items!",
    discountText: "20% OFF",
    promoCode: "ENGINEER20",
    isActive: true,
    validUntil: BigInt(0),
  },
  {
    title: "Student Discount",
    description:
      "Show your student ID and get 15% off on orders above ₹150. Study hard, eat well!",
    discountText: "15% OFF",
    promoCode: "STUDENT15",
    isActive: true,
    validUntil: BigInt(0),
  },
  {
    title: "Midnight Munchies",
    description:
      "₹30 off on orders placed between 10 PM and 12 AM. Night owls eat better!",
    discountText: "₹30 OFF",
    promoCode: "MIDNIGHT",
    isActive: true,
    validUntil: BigInt(0),
  },
];

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(offer.promoCode);
    setCopied(true);
    toast.success(`Code "${offer.promoCode}" copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      data-ocid={`offers.item.${index + 1}`}
    >
      <Card className="border-border/60 bg-card hover:border-primary/40 transition-colors overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary shrink-0" />
              <h3 className="font-display font-bold text-foreground text-lg leading-tight">
                {offer.title}
              </h3>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0">
              {offer.discountText}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            {offer.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 border border-dashed border-primary/40 bg-primary/5 rounded-lg px-4 py-2 flex items-center justify-between">
              <span className="font-mono font-bold text-primary tracking-wider">
                {offer.promoCode}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10 gap-2"
              onClick={copyCode}
              data-ocid={`offers.button.${index + 1}`}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Offers() {
  const { actor, isFetching } = useActor();

  const { data: offers } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      if (!actor) return FALLBACK_OFFERS;
      const data = await actor.getAllOffers();
      return data.filter((o) => o.isActive).length > 0
        ? data.filter((o) => o.isActive)
        : FALLBACK_OFFERS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: FALLBACK_OFFERS,
  });

  const activeOffers = offers ?? FALLBACK_OFFERS;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Special <span className="text-primary">Offers</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Exclusive deals engineered to save you money
        </p>
      </motion.div>

      {activeOffers.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="offers.empty_state"
        >
          No active offers at the moment. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {activeOffers.map((offer, i) => (
            <OfferCard key={offer.promoCode} offer={offer} index={i} />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-center bg-primary/10 border border-primary/20 rounded-xl p-8 max-w-2xl mx-auto"
      >
        <h3 className="font-display text-2xl font-bold mb-2">
          Order via WhatsApp
        </h3>
        <p className="text-muted-foreground mb-4">
          Mention your promo code while ordering on WhatsApp to avail the
          discount.
        </p>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="offers.primary_button"
        >
          <a
            href="https://wa.me/919713225322"
            target="_blank"
            rel="noopener noreferrer"
          >
            Order Now
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
