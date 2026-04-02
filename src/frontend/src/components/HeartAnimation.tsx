import { motion } from "motion/react";
import { memo } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

const _HEARTS_LIST = ["❤️", "🧡", "💛", "💚", "💙", "💜", "💌", "🫶"];

// Static hearts - defined once, never recreated
const STATIC_HEARTS: Heart[] = [
  { id: 0, x: 5, size: 28, duration: 5, delay: 0, emoji: "❤️" },
  { id: 1, x: 14, size: 24, duration: 6, delay: 1, emoji: "🧡" },
  { id: 2, x: 23, size: 32, duration: 4.5, delay: 2, emoji: "💛" },
  { id: 3, x: 33, size: 26, duration: 5.5, delay: 0.5, emoji: "💚" },
  { id: 4, x: 44, size: 30, duration: 4, delay: 3, emoji: "💙" },
  { id: 5, x: 55, size: 28, duration: 6.5, delay: 1.5, emoji: "💜" },
  { id: 6, x: 65, size: 24, duration: 5, delay: 4, emoji: "💌" },
  { id: 7, x: 75, size: 34, duration: 4.5, delay: 2.5, emoji: "🫶" },
  { id: 8, x: 85, size: 26, duration: 6, delay: 0.8, emoji: "❤️" },
  { id: 9, x: 92, size: 30, duration: 5.5, delay: 3.5, emoji: "🧡" },
];

const HeartAnimation = memo(function HeartAnimation() {
  return (
    <div
      className="relative w-full overflow-hidden py-12 flex flex-col items-center gap-4"
      style={{ perspective: "600px" }}
    >
      <div className="relative h-48 w-full max-w-lg">
        {STATIC_HEARTS.map((heart) => (
          <motion.span
            key={heart.id}
            className="absolute bottom-0 select-none pointer-events-none"
            style={{
              left: `${heart.x}%`,
              fontSize: heart.size,
              filter: "drop-shadow(0 0 6px oklch(0.76 0.19 75 / 0.8))",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-10, -180],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          >
            {heart.emoji}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p
          className="text-2xl font-display font-bold text-primary"
          style={{
            textShadow:
              "0 0 40px oklch(0.76 0.19 75 / 0.9), 0 0 80px oklch(0.76 0.19 75 / 0.5)",
          }}
        >
          Thank You For Visiting Us! ❤️
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          We hope to see you again at Engineering Wala Restaurant
        </p>
      </motion.div>
    </div>
  );
});

export default HeartAnimation;
