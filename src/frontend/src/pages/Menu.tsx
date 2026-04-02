import CartDrawer from "@/components/CartDrawer";
import DishOverlay from "@/components/DishOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES, dishes } from "@/data/dishes";
import type { DishData } from "@/data/dishes";
import { useCart } from "@/hooks/useCart";
import { useSearch } from "@tanstack/react-router";
import { Filter, Leaf, Plus, Search, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export default function Menu() {
  const searchParams = useSearch({ from: "/menu" }) as { category?: string };
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams?.category ?? "All",
  );
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedDish, setSelectedDish] = useState<DishData | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart, itemCount } = useCart();

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      const matchCat =
        selectedCategory === "All" || d.category === selectedCategory;
      const matchQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.description.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchVeg = !vegOnly || d.isVeg;
      return matchCat && matchQuery && matchVeg;
    });
  }, [selectedCategory, query, vegOnly]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-card/50 border-b border-border py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-3"
          >
            <h1 className="text-4xl font-display font-bold">Our Full Menu</h1>
            <p className="text-muted-foreground">
              70+ dishes | All Pure Veg | Real Indore prices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 bg-card/95 backdrop-blur-xl border-b border-border z-10 py-3">
        <div className="container mx-auto px-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                data-ocid="menu.search_input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="veg-toggle"
                checked={vegOnly}
                onCheckedChange={setVegOnly}
                data-ocid="menu.switch"
              />
              <Label
                htmlFor="veg-toggle"
                className="text-sm flex items-center gap-1"
              >
                <Leaf className="w-3 h-3 text-green-500" />
                Veg
              </Label>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-secondary rounded-xl transition-colors"
              data-ocid="menu.cart.button"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", ...CATEGORIES].map((cat, i) => {
              const count =
                cat === "All"
                  ? dishes.length
                  : dishes.filter((d) => d.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                  data-ocid={`menu.tab.${i}`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <motion.div
            className="text-center py-20 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="menu.empty_state"
          >
            <Filter className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">No dishes match your filter</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
                setVegOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((dish, i) => (
              <motion.div
                key={dish.id}
                className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 10) * 0.04 }}
                whileHover={{ scale: 1.03, rotateY: 2, rotateX: -1 }}
                style={{ perspective: "600px" }}
                onClick={() => setSelectedDish(dish)}
                data-ocid={`menu.item.${i + 1}`}
              >
                {/* Dish image */}
                <div className="relative overflow-hidden h-44">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/generated/thali.dim_400x300.jpg";
                    }}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Veg indicator */}
                  <div className="absolute top-2 left-2">
                    <div className="w-5 h-5 bg-white rounded-sm border-2 border-green-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    </div>
                  </div>
                  {/* Tap to view hint on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-lg">
                      Tap for details
                    </span>
                  </div>
                </div>

                {/* Card info - only name + price */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-1 mb-2">
                    {dish.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-base">
                      \u20B9{dish.price}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dish);
                      }}
                      className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                      data-ocid={`menu.button.${i + 1}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <DishOverlay dish={selectedDish} onClose={() => setSelectedDish(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
