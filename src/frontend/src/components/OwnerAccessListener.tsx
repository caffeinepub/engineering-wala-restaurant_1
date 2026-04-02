import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const OWNER_PASSWORD = "aadarshshukla8800";
const SECRET_WORD = "owner";

export default function OwnerAccessListener() {
  const navigate = useNavigate();
  const { setAuthorized } = useOwnerAuth();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);
  const typed = useRef("");
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (showModal) return;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      typed.current = (typed.current + e.key).slice(-SECRET_WORD.length);
      if (typed.current.toLowerCase() === SECRET_WORD) {
        setShowModal(true);
        typed.current = "";
      }
    },
    [showModal],
  );

  const handleTap = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const isBottomLeft =
      touch.clientX < 60 && touch.clientY > window.innerHeight - 80;
    if (!isBottomLeft) return;
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("touchstart", handleTap);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("touchstart", handleTap);
    };
  }, [handleKeyPress, handleTap]);

  const handleSubmit = () => {
    if (password === OWNER_PASSWORD) {
      sessionStorage.setItem("ownerAccess", "true");
      setAuthorized(true);
      setShowModal(false);
      setPassword("");
      navigate({ to: "/owner" });
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword("");
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            role="presentation"
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={closeModal}
            onKeyDown={(e) => e.key === "Escape" && closeModal()}
          />
          <motion.div
            className="relative w-full max-w-sm"
            initial={{ scale: 0.8, y: 30 }}
            animate={
              shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { scale: 1, y: 0 }
            }
            exit={{ scale: 0.8, y: 30 }}
            transition={{ type: "spring", damping: 20 }}
            data-ocid="owner.dialog"
          >
            <div
              className="absolute -inset-1 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 25 / 0.7), oklch(0.45 0.25 15 / 0.5))",
                filter: "blur(12px)",
              }}
            />
            <div className="relative bg-card/95 backdrop-blur-xl border border-red-900/40 rounded-3xl p-8 space-y-6">
              <div className="flex justify-center">
                <motion.div
                  className="w-20 h-20 bg-red-900/20 rounded-3xl flex items-center justify-center border border-red-700/40"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <Lock className="w-9 h-9 text-red-400" />
                </motion.div>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-display font-bold">
                  Owner Access
                </h2>
                <p className="text-muted-foreground text-sm">
                  Enter password to access the dashboard
                </p>
              </div>

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 pr-12 text-foreground outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  data-ocid="owner.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && (
                <motion.p
                  className="text-destructive text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Incorrect password. Try again.
                </motion.p>
              )}

              <motion.button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-ocid="owner.submit_button"
              >
                Access Dashboard
              </motion.button>

              <p className="text-center text-xs text-muted-foreground">
                Authorized personnel only
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
