import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DishData } from "@/data/dishes";
import { useCart } from "@/hooks/useCart";
import { Leaf, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  dish: DishData | null;
  onClose: () => void;
}

export default function DishOverlay({ dish, onClose }: Props) {
  const { addToCart } = useCart();
  const [isHalf, setIsHalf] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dish) {
      setIsHalf(false);
      setQty(1);
      setAdded(false);
    }
  }, [dish]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleAdd = () => {
    if (!dish) return;
    for (let i = 0; i < qty; i++) addToCart(dish, isHalf);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const price = dish
    ? isHalf
      ? (dish.halfPrice ?? dish.price)
      : dish.price
    : 0;

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            role="presentation"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
          <motion.div
            className="relative bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
            initial={{ y: 80, opacity: 0, rotateX: -5 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            style={{ perspective: "1000px" }}
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-t-3xl sm:rounded-t-3xl h-56 sm:h-72">
              <motion.img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/generated/thali.dim_400x300.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors"
                data-ocid="dish.close_button"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge className="bg-green-600/90 text-white border-0">
                  <Leaf className="w-3 h-3 mr-1" />
                  Pure Veg
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-card/80 backdrop-blur-sm"
                >
                  {dish.category}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-display font-bold">
                    {dish.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {dish.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{price}</p>
                  {isHalf && dish.halfPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      ₹{dish.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {dish.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dish.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-primary/50 text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {dish.description}
              </p>

              {/* Half / Full selector */}
              {dish.halfPrice && (
                <div>
                  <p className="text-sm font-medium mb-2">Choose Portion</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsHalf(false)}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        !isHalf
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                      data-ocid="dish.toggle"
                    >
                      Full ₹{dish.price}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHalf(true)}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        isHalf
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                      data-ocid="dish.toggle"
                    >
                      Half ₹{dish.halfPrice}
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                    data-ocid="dish.button"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold w-6 text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                    data-ocid="dish.button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleAdd}
                  className="w-full h-12 text-base font-semibold"
                  data-ocid="dish.primary_button"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {added ? "Added to Cart! ✓" : `Add to Cart · ₹${price * qty}`}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
