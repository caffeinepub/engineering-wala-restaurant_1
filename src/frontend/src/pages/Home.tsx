import DishOverlay from "@/components/DishOverlay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES, dishes } from "@/data/dishes";
import type { DishData } from "@/data/dishes";
import { reviews } from "@/data/reviews";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  Phone,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const FEATURED_IDS = ["p1", "t2", "s1", "c1", "si1", "b1", "d2", "s7"];
const featuredDishes = dishes.filter((d) => FEATURED_IDS.includes(d.id));

const CATEGORY_ICONS: Record<string, string> = {
  "Rice & Biryani": "\u{1F35A}",
  "Paneer Dishes": "\u{1F9C0}",
  "Dal & Curries": "\u{1F372}",
  "Snacks & Street Food": "\u{1F35F}",
  Thalis: "\u{1F37D}\uFE0F",
  "Wraps & Sandwiches": "\u{1F32F}",
  Chinese: "\u{1F961}",
  "South Indian": "\u{1F95E}",
  Breakfast: "\u{1F373}",
  Beverages: "\u{1F964}",
  Desserts: "\u{1F36E}",
};

const TICKER_ITEMS = [
  "\u{1F525} Special Thali @ \u20B9199 | All Inclusive!",
  "\u{1F389} Student Thali @ \u20B9149 | Best Value!",
  "\u{1F374} Free Home Delivery | WhatsApp: +91 97132 25322",
  "\u{1F3F7}\uFE0F Use Code EWALA10 for 10% Off First Order!",
  "\u2B50 Open Every Day | 10 AM \u2013 11 PM",
];

const ROTATING_QUOTES = [
  {
    text: "Engineering Wala \u2014 where every bite tells a story of Indore's soul.",
    author: "Our Promise",
    emoji: "\u{1F374}",
  },
  {
    text: "Good food is the foundation of genuine happiness.",
    author: "Auguste Escoffier",
    emoji: "\u{1F60A}",
  },
  {
    text: "A recipe has no soul. You as the cook must bring soul to the recipe.",
    author: "Thomas Keller",
    emoji: "\u{1F468}\u200D\u{1F373}",
  },
  {
    text: "People who love to eat are always the best people.",
    author: "Julia Child",
    emoji: "\u2764\uFE0F",
  },
  {
    text: "Food is not just eating energy. It\u2019s an experience.",
    author: "Guy Fieri",
    emoji: "\u{1F31F}",
  },
  {
    text: "One cannot think well, love well, sleep well, if one has not dined well.",
    author: "Virginia Woolf",
    emoji: "\u{1F4AB}",
  },
  {
    text: "Cooking is love made visible.",
    author: "Anonymous",
    emoji: "\u{1F525}",
  },
  {
    text: "70+ authentic dishes crafted fresh every day with love by Aadarsh Shukla.",
    author: "Engineering Wala Restaurant",
    emoji: "\u{1F451}",
  },
];

const SPARKLE_POSITIONS = [
  { top: "12%", left: "8%", delay: 0 },
  { top: "25%", right: "10%", delay: 0.8 },
  { bottom: "15%", right: "8%", delay: 1.5 },
  { top: "8%", right: "25%", delay: 1.0 },
];

function MotivationalQuotesSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % ROTATING_QUOTES.length);
        setIsFlipping(false);
      }, 400);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = (i: number) => {
    setIsFlipping(true);
    setTimeout(() => {
      setQuoteIndex(i);
      setIsFlipping(false);
    }, 300);
    startTimer();
  };

  const current = ROTATING_QUOTES[quoteIndex];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Section background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.76 0.19 75 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4">
        {/* Section heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="text-3xl"
            >
              {"💬"}
            </motion.div>
            <h2
              className="text-4xl font-display font-bold"
              style={{ textShadow: "0 0 30px oklch(0.76 0.19 75 / 0.5)" }}
            >
              Words of Wisdom
            </h2>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="text-3xl"
            >
              \u2728
            </motion.div>
          </div>
          <p className="text-muted-foreground">
            Inspiration served fresh, every bite of the day
          </p>
        </motion.div>

        {/* 3D Quote Card */}
        <motion.div
          className="max-w-3xl mx-auto relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ perspective: "1200px" }}
        >
          {/* Floating sparkles */}
          {SPARKLE_POSITIONS.map((pos, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: static sparkle positions
              key={i}
              className="absolute pointer-events-none text-base select-none z-20"
              style={{ ...pos }}
              animate={{
                y: [0, -12, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: pos.delay,
                ease: "easeInOut",
              }}
            >
              {i % 2 === 0 ? "\u2728" : "\u2B50"}
            </motion.div>
          ))}

          {/* Main 3D card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden cursor-default select-none"
            animate={{
              rotateX: isFlipping ? 90 : 0,
              scale: isFlipping ? 0.95 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            whileHover={{ rotateY: 4, rotateX: 2, scale: 1.02 }}
            style={{
              transformStyle: "preserve-3d",
              background:
                "linear-gradient(135deg, oklch(0.10 0.04 260 / 0.98) 0%, oklch(0.14 0.05 280 / 0.97) 50%, oklch(0.10 0.03 240 / 0.98) 100%)",
              border: "2px solid oklch(0.76 0.19 75 / 0.6)",
              boxShadow:
                "0 0 40px oklch(0.76 0.19 75 / 0.35), 0 0 80px oklch(0.76 0.19 75 / 0.15), 0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px oklch(0.76 0.19 75 / 0.08)",
            }}
          >
            {/* Animated corner accents */}
            <div
              className="absolute top-0 left-0 w-14 h-14 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.76 0.19 75 / 0.3), transparent 60%)",
              }}
            />
            <div
              className="absolute top-0 right-0 w-14 h-14 pointer-events-none"
              style={{
                background:
                  "linear-gradient(225deg, oklch(0.76 0.19 75 / 0.3), transparent 60%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-14 h-14 pointer-events-none"
              style={{
                background:
                  "linear-gradient(45deg, oklch(0.76 0.19 75 / 0.3), transparent 60%)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none"
              style={{
                background:
                  "linear-gradient(315deg, oklch(0.76 0.19 75 / 0.3), transparent 60%)",
              }}
            />

            {/* Top glow bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.76 0.19 75), transparent)",
                boxShadow: "0 0 20px oklch(0.76 0.19 75 / 0.8)",
              }}
            />

            {/* Radial glow backdrop */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 20%, oklch(0.76 0.19 75 / 0.18), transparent 65%)",
              }}
            />

            {/* WORDS OF WISDOM label */}
            <div className="flex justify-center pt-6">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: "oklch(0.76 0.19 75 / 0.15)",
                  border: "1px solid oklch(0.76 0.19 75 / 0.5)",
                  color: "oklch(0.76 0.19 75)",
                  textShadow: "0 0 12px oklch(0.76 0.19 75 / 0.7)",
                  boxShadow: "0 0 16px oklch(0.76 0.19 75 / 0.2)",
                }}
              >
                \u2728 Words of Wisdom \u2728
              </motion.div>
            </div>

            {/* Big decorative quote mark */}
            <span
              className="absolute top-12 left-6 font-display font-black select-none pointer-events-none"
              style={{
                fontSize: "7rem",
                lineHeight: 1,
                color: "oklch(0.76 0.19 75 / 0.12)",
              }}
            >
              \u201C
            </span>

            <div className="relative px-10 py-8 pb-6 min-h-[180px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 24, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -24, rotateX: 20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="text-center"
                >
                  {/* Emoji */}
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    {current.emoji}
                  </motion.div>

                  <p
                    className="text-lg sm:text-xl font-medium leading-relaxed italic"
                    style={{
                      color: "oklch(0.94 0.01 240)",
                      textShadow: "0 0 25px oklch(0.76 0.19 75 / 0.35)",
                    }}
                  >
                    \u201C{current.text}\u201D
                  </p>
                  <motion.p
                    className="text-sm font-bold mt-4 uppercase tracking-wider"
                    style={{
                      color: "oklch(0.76 0.19 75)",
                      textShadow: "0 0 15px oklch(0.76 0.19 75 / 0.7)",
                    }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    \u2014 {current.author}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              {/* Progress bar */}
              <div
                className="mt-6 h-0.5 w-full rounded-full overflow-hidden"
                style={{ background: "oklch(0.76 0.19 75 / 0.15)" }}
              >
                <motion.div
                  key={`bar-${quoteIndex}`}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.76 0.19 75), oklch(0.85 0.15 75))",
                    boxShadow: "0 0 8px oklch(0.76 0.19 75 / 0.7)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>

              {/* Dot indicators */}
              <div className="flex gap-2 mt-4 justify-center">
                {ROTATING_QUOTES.map((_q, i) => (
                  <button
                    type="button"
                    // biome-ignore lint/suspicious/noArrayIndexKey: static ordered quote dots
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === quoteIndex ? "24px" : "7px",
                      height: "7px",
                      background:
                        i === quoteIndex
                          ? "oklch(0.76 0.19 75)"
                          : "oklch(0.76 0.19 75 / 0.3)",
                      boxShadow:
                        i === quoteIndex
                          ? "0 0 10px oklch(0.76 0.19 75 / 0.8)"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom glow bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.76 0.19 75 / 0.4), transparent)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedDish, setSelectedDish] = useState<DishData | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* Announcement ticker */}
      <div className="bg-primary text-primary-foreground text-sm py-2 overflow-hidden">
        <motion.div
          className="whitespace-nowrap flex gap-16"
          animate={{ x: ["-0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static duplicated ticker list
            <span key={i} className="inline-block">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1200x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="max-w-xl space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Flame className="w-3 h-3 mr-1" />
              Indore's Favourite Restaurant
            </Badge>
            <h1
              className="text-5xl sm:text-6xl font-display font-black leading-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              Engineering
              <br />
              <span
                className="text-primary"
                style={{ textShadow: "0 0 30px oklch(0.76 0.19 75 / 0.6)" }}
              >
                Wala
              </span>{" "}
              Restaurant
            </h1>

            <div className="flex flex-wrap gap-4">
              <Link to="/menu" search={{ category: undefined }}>
                <Button
                  size="lg"
                  className="h-13 px-8 text-base"
                  data-ocid="hero.primary_button"
                >
                  <UtensilsCrossed className="w-5 h-5 mr-2" />
                  Explore Menu
                </Button>
              </Link>
              <Link to="/orders">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base border-primary/40 hover:border-primary"
                  data-ocid="hero.secondary_button"
                >
                  Place Order
                </Button>
              </Link>
            </div>
            <div className="flex gap-8 pt-2">
              <div>
                <p className="text-2xl font-bold text-primary">70+</p>
                <p className="text-xs text-muted-foreground">Dishes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">4.8\u2605</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">5000+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-display font-bold">Featured Dishes</h2>
          <p className="text-muted-foreground mt-2">Our most-loved creations</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredDishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03, rotateY: 2 }}
              style={{ perspective: "800px" }}
              onClick={() => setSelectedDish(dish)}
              data-ocid={`featured.item.${i + 1}`}
            >
              <div className="relative overflow-hidden h-40">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/generated/thali.dim_400x300.jpg";
                  }}
                />
                {dish.tags[0] && (
                  <Badge className="absolute top-2 left-2 text-xs bg-primary/90">
                    {dish.tags[0]}
                  </Badge>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{dish.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-bold">
                    \u20B9{dish.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {dish.quantity}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/menu" search={{ category: undefined }}>
            <Button variant="outline" data-ocid="featured.primary_button">
              View Full Menu
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-2">
              Find exactly what you're craving
            </p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => {
              const count = dishes.filter((d) => d.category === cat).length;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  style={{ perspective: "600px" }}
                >
                  <Link
                    to="/menu"
                    search={{ category: cat }}
                    className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
                    data-ocid={`category.item.${i + 1}`}
                  >
                    <span className="text-3xl">
                      {CATEGORY_ICONS[cat] ?? "\u{1F374}"}
                    </span>
                    <p className="text-xs font-medium leading-tight">{cat}</p>
                    <p
                      className="text-[10px] font-normal"
                      style={{
                        color: "oklch(0.76 0.19 75)",
                        textShadow: "0 0 8px oklch(0.76 0.19 75 / 0.7)",
                      }}
                    >
                      {count} items
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Motivational Quotes — above Reviews */}
      <MotivationalQuotesSection />

      {/* Reviews */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-display font-bold">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              4.8 avg from 20+ reviews
            </span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-card border border-border rounded-2xl p-5 space-y-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              whileHover={{ scale: 1.02 }}
              data-ocid={`review.item.${i + 1}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={`star-${s}`}
                    className={`w-4 h-4 ${s < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {review.review}
              </p>
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary"
              >
                {review.dishName}
              </Badge>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet Our Founder — 3D Glow Section */}
      <section className="py-24 container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="founder-card relative rounded-3xl p-10 text-center space-y-6 overflow-hidden"
            style={{
              perspective: "1000px",
              background:
                "linear-gradient(135deg, oklch(0.13 0.03 255 / 0.98), oklch(0.17 0.04 255 / 0.95))",
              border: "1.5px solid oklch(0.76 0.19 75 / 0.35)",
            }}
            whileHover={{ rotateY: 5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            {/* Radial glow backdrop */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.76 0.19 75 / 0.15), transparent 65%)",
              }}
            />

            {/* Spinning ring avatar */}
            <div className="relative w-24 h-24 mx-auto">
              {/* Spinning gradient ring */}
              <div
                className="spin-ring absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(oklch(0.76 0.19 75), oklch(0.68 0.20 195), oklch(0.76 0.19 75))",
                  padding: "3px",
                }}
              />
              {/* Inner avatar */}
              <div
                className="relative w-full h-full rounded-full flex items-center justify-center font-display font-black text-2xl"
                style={{
                  background: "oklch(0.15 0.03 255)",
                  color: "oklch(0.76 0.19 75)",
                  textShadow: "0 0 20px oklch(0.76 0.19 75 / 0.8)",
                  boxShadow:
                    "0 0 0 3px oklch(0.76 0.19 75 / 0.5), 0 0 30px oklch(0.76 0.19 75 / 0.4)",
                  zIndex: 1,
                }}
              >
                AS
              </div>
            </div>

            {/* Founder name with glow underline */}
            <div className="relative">
              <h2
                className="text-3xl font-display font-bold"
                style={{ textShadow: "0 0 30px oklch(0.76 0.19 75 / 0.5)" }}
              >
                Meet Our Founder
              </h2>
              <div
                className="glow-underline mx-auto mt-2 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.76 0.19 75), transparent)",
                  boxShadow: "0 0 12px oklch(0.76 0.19 75 / 0.8)",
                }}
              />
            </div>

            <p className="text-muted-foreground leading-relaxed relative">
              Hi! I'm{" "}
              <strong
                className="font-bold"
                style={{
                  color: "oklch(0.76 0.19 75)",
                  textShadow: "0 0 15px oklch(0.76 0.19 75 / 0.6)",
                }}
              >
                Aadarsh Shukla
              </strong>
              , the Founder &amp; Head Chef of Engineering Wala Restaurant. My
              passion is crafting authentic, wholesome flavours at prices
              everyone can enjoy. Every dish we serve is made with care, fresh
              ingredients, and a whole lot of love.
            </p>

            <div className="flex flex-wrap gap-4 justify-center relative">
              <a href="tel:+919713225322">
                <Button
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: "oklch(0.76 0.19 75 / 0.5)",
                    boxShadow: "0 0 12px oklch(0.76 0.19 75 / 0.2)",
                  }}
                  data-ocid="owner.primary_button"
                >
                  <Phone className="w-4 h-4" />
                  +91 97132 25322
                </Button>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Near Bhawarkua Square, Indore MP
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Mon\u2013Sun 10 AM \u2013 11 PM
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <DishOverlay dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}
