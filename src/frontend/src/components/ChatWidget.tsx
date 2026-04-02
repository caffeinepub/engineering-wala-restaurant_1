import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  text: string;
  from: "user" | "bot";
}

function getAutoReply(msg: string): string {
  const lower = msg.toLowerCase();
  if (/menu|food|dish|eat/.test(lower)) {
    return "🍽️ Our menu has 70+ dishes! Categories: Rice & Biryani, Paneer Dishes, Dal & Curries, Snacks, Thalis, Wraps, Chinese, South Indian, Breakfast, Beverages & Desserts. Visit our Menu page to explore!";
  }
  if (/hour|time|open|close|timing/.test(lower)) {
    return "⏰ We are open every day — Mon to Sun, 10:00 AM to 11:00 PM. Come hungry!";
  }
  if (/location|address|where|place|find/.test(lower)) {
    return "📍 We are located Near Bhawarkua Square, Indore, Madhya Pradesh 452010. Landmark: Near Engineering College area.";
  }
  if (/order|delivery|deliver/.test(lower)) {
    return "🛒 You can order via WhatsApp: wa.me/919713225322 or use our Orders section in the app. We deliver within 5 km radius!";
  }
  if (/price|rate|cost|cheap|expensive|how much/.test(lower)) {
    return "💰 Our prices range from just ₹20 (Masala Chai) to ₹249 (Royal Thali). Very affordable for the quality we serve!";
  }
  if (/offer|discount|promo|coupon|deal/.test(lower)) {
    return "🏷️ Check our Offers page for current promos! We have great discounts and combo deals. Use code EWALA10 for 10% off your first order!";
  }
  if (/contact|phone|call|number/.test(lower)) {
    return "📞 You can reach us at +91 97132 25322. WhatsApp also available on the same number!";
  }
  if (/owner|manager|chef|aadarsh/.test(lower)) {
    return "👨‍🍳 Aadarsh Shukla is the Founder & Head Chef of Engineering Wala Restaurant. He personally ensures every dish meets the highest quality standards!";
  }
  if (/hello|hi|hey|namaste/.test(lower)) {
    return "👋 Namaste! Welcome to Engineering Wala Restaurant. How can I help you today? Ask about our menu, location, timings, or place an order!";
  }
  return "🙏 Thank you for reaching out! For quick response, WhatsApp us at +91 97132 25322. Or ask me about our menu, location, timings, or offers!";
}

let msgId = 0;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId++,
      text: "👋 Namaste! Welcome to Engineering Wala Restaurant! How can I help you today?",
      from: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: bottomRef is a stable ref
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: msgId++, text, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getAutoReply(text);
      setMessages((prev) => [
        ...prev,
        { id: msgId++, text: reply, from: "bot" },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            className="bg-card border border-border rounded-3xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            style={{ height: 420 }}
            data-ocid="chat.panel"
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-border p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                EW
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Engineering Wala</p>
                <p className="text-xs text-green-400">● Online now</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-secondary rounded-lg"
                data-ocid="chat.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.15,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex gap-2">
              <input
                className="flex-1 bg-secondary rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                data-ocid="chat.input"
              />
              <button
                type="button"
                onClick={send}
                className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                data-ocid="chat.button"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-ocid="chat.open_modal_button"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
