import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface LoginPageProps {
  onLogin: (name: string, phone: string) => void;
}

// Reduced to 8 particles (was 24) - static positions, no Math.random on render
const PARTICLES = [
  { id: 0, x: 10, size: 6, duration: 5, delay: 0 },
  { id: 1, x: 25, size: 4, duration: 6, delay: 1.2 },
  { id: 2, x: 40, size: 7, duration: 4.5, delay: 2.5 },
  { id: 3, x: 55, size: 5, duration: 5.5, delay: 0.8 },
  { id: 4, x: 68, size: 6, duration: 6, delay: 3 },
  { id: 5, x: 80, size: 4, duration: 4, delay: 1.8 },
  { id: 6, x: 90, size: 7, duration: 5, delay: 3.5 },
  { id: 7, x: 35, size: 5, duration: 6.5, delay: 2 },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewportH, setViewportH] = useState(800);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    setViewportH(window.innerHeight);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setError("");
    setSubmitting(true);
    setFlipped(true);

    setTimeout(() => {
      onLogin(trimmedName, trimmedPhone);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Dark red animated background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.18 0.08 20), oklch(0.08 0.04 20) 70%)",
          }}
        />
        {/* Two orbs only (was more) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            top: "10%",
            left: "5%",
            background:
              "radial-gradient(circle, oklch(0.35 0.12 20 / 0.3), transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            bottom: "5%",
            right: "5%",
            background:
              "radial-gradient(circle, oklch(0.4 0.15 50 / 0.25), transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        {/* Grid lines - CSS only, no JS animation */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.76 0.19 75 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.76 0.19 75 / 0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            transform: "perspective(600px) rotateX(15deg)",
            transformOrigin: "bottom center",
          }}
        />
      </div>

      {/* Floating particles - reduced & static */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: "oklch(0.76 0.19 75)",
            boxShadow: "0 0 8px oklch(0.76 0.19 75 / 0.8)",
          }}
          animate={{
            y: [0, -(viewportH + 100)],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Login card with 3D flip */}
      <motion.div
        style={{ perspective: 1200 }}
        initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="w-full max-w-sm mx-4"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Front face */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div
              className="relative rounded-3xl p-8 space-y-6"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.11 0.04 255 / 0.97), oklch(0.09 0.03 255 / 0.97))",
                border: "1.5px solid oklch(0.76 0.19 75 / 0.4)",
                boxShadow:
                  "0 0 40px oklch(0.76 0.19 75 / 0.2), 0 0 80px oklch(0.76 0.19 75 / 0.08), 0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {/* Logo & Title */}
              <div className="text-center space-y-3">
                <motion.div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.2 0.08 20), oklch(0.12 0.05 20))",
                    border: "1.5px solid oklch(0.76 0.19 75 / 0.5)",
                    boxShadow: "0 0 20px oklch(0.76 0.19 75 / 0.3)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px oklch(0.76 0.19 75 / 0.3)",
                      "0 0 40px oklch(0.76 0.19 75 / 0.6)",
                      "0 0 20px oklch(0.76 0.19 75 / 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  🍽️
                </motion.div>
                <div>
                  <h1
                    className="text-2xl font-display font-black tracking-tight"
                    style={{
                      color: "oklch(0.76 0.19 75)",
                      textShadow: "0 0 20px oklch(0.76 0.19 75 / 0.6)",
                    }}
                  >
                    Engineering Wala
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Restaurant — Welcome!
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.76 0.19 75 / 0.5), transparent)",
                }}
              />

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-name"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Your Name
                  </label>
                  <input
                    id="login-name"
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                    style={{
                      background: "oklch(0.14 0.03 255 / 0.8)",
                      border: "1.5px solid oklch(0.76 0.19 75 / 0.25)",
                      color: "oklch(0.95 0.01 240)",
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        "1.5px solid oklch(0.76 0.19 75 / 0.7)";
                      e.target.style.boxShadow =
                        "0 0 16px oklch(0.76 0.19 75 / 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        "1.5px solid oklch(0.76 0.19 75 / 0.25)";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="login-phone"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="login-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                    style={{
                      background: "oklch(0.14 0.03 255 / 0.8)",
                      border: "1.5px solid oklch(0.76 0.19 75 / 0.25)",
                      color: "oklch(0.95 0.01 240)",
                    }}
                    onFocus={(e) => {
                      e.target.style.border =
                        "1.5px solid oklch(0.76 0.19 75 / 0.7)";
                      e.target.style.boxShadow =
                        "0 0 16px oklch(0.76 0.19 75 / 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        "1.5px solid oklch(0.76 0.19 75 / 0.25)";
                      e.target.style.boxShadow = "none";
                    }}
                    disabled={submitting}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-xs font-medium text-red-400 px-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.6 0.18 50), oklch(0.5 0.18 30))",
                    color: "oklch(0.98 0.01 90)",
                    boxShadow: "0 0 24px oklch(0.76 0.19 75 / 0.4)",
                    border: "1px solid oklch(0.76 0.19 75 / 0.3)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 40px oklch(0.76 0.19 75 / 0.7)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      Entering...
                    </span>
                  ) : (
                    "Enter the Restaurant \u2192"
                  )}
                </motion.button>
              </form>

              <p className="text-center text-[11px] text-muted-foreground/60">
                By entering, you agree to our Terms of Service
              </p>
            </div>
          </div>

          {/* Back face (success message) */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              inset: 0,
            }}
            className="rounded-3xl flex items-center justify-center"
          >
            <div
              className="w-full rounded-3xl p-8 text-center space-y-4"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.11 0.04 255 / 0.97), oklch(0.09 0.03 255 / 0.97))",
                border: "1.5px solid oklch(0.76 0.19 75 / 0.5)",
                boxShadow: "0 0 60px oklch(0.76 0.19 75 / 0.3)",
              }}
            >
              <div className="text-5xl">✅</div>
              <h2
                className="text-xl font-display font-bold"
                style={{ color: "oklch(0.76 0.19 75)" }}
              >
                Welcome!
              </h2>
              <p className="text-muted-foreground text-sm">
                Loading your experience...
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
