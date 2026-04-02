import { Link } from "@tanstack/react-router";
import { Clock, Instagram, MapPin, Phone, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { SiWhatsapp } from "react-icons/si";
import HeartAnimation from "./HeartAnimation";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* Heart animation section */}
      <HeartAnimation />

      <div className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/logo-engineering-wala-transparent.dim_200x200.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">
                  Engineering Wala
                </h3>
                <p className="text-xs text-primary">Restaurant</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Authentic flavours crafted with love. From street food classics to
              royal thalis — we serve happiness on every plate.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919713225322"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-green-600/20 rounded-xl flex items-center justify-center text-green-400 hover:bg-green-600/30 transition-colors"
              >
                <SiWhatsapp className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 hover:bg-pink-500/30 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Owner Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-base text-primary">
              Owner Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">
                  AS
                </div>
                <div>
                  <p className="font-semibold text-sm">Aadarsh Shukla</p>
                  <p className="text-xs text-muted-foreground">
                    Founder & Head Chef
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href="tel:+919713225322"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +91 97132 25322
                </a>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Near Bhawarkua Square, Indore, MP 452010</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Mon–Sun: 10:00 AM – 11:00 PM
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-base text-primary">
              Quick Links
            </h4>
            <nav className="grid grid-cols-2 gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/menu", label: "Menu" },
                { to: "/offers", label: "Offers" },
                { to: "/orders", label: "Orders" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4">
              <a
                href="https://wa.me/919713225322"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-xl px-4 py-2 text-sm hover:bg-green-600/30 transition-colors"
              >
                <SiWhatsapp className="w-4 h-4" />
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Engineering Wala Restaurant. Made with{" "}
            <span className="text-primary">❤️</span> by{" "}
            <span className="text-primary font-medium">Aadarsh Shukla</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
