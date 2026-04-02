import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 97132 25322",
    href: "tel:9713225322",
    color: "text-blue-400",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@engineeringwala.in",
    href: "mailto:hello@engineeringwala.in",
    color: "text-green-400",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/919713225322",
    color: "text-emerald-400",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Near Bhawarkua Square, Indore MP 452010",
    href: "#",
    color: "text-orange-400",
  },
];

export default function Contact() {
  const { actor } = useActor();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      if (actor) {
        await actor.submitContactMessage({
          name: form.name,
          phone: form.phone,
          message: form.message,
          timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        });
      }
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          We'd love to hear from you. Drop us a message or visit us!
        </p>
      </motion.div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {CONTACT_CARDS.map((card, i) => (
          <motion.a
            key={card.label}
            href={card.href}
            target={card.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            data-ocid={`contact.button.${i + 1}`}
          >
            <Card className="border-border/60 bg-card hover:border-primary/40 transition-colors h-full cursor-pointer">
              <CardContent className="p-5">
                <card.icon className={`w-7 h-7 ${card.color} mb-3`} />
                <p className="font-semibold text-foreground text-sm">
                  {card.label}
                </p>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl font-bold mb-6">
            Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium mb-1.5 block"
              >
                Name *
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="bg-card border-border/60"
                data-ocid="contact.input"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-medium mb-1.5 block"
              >
                Phone
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Your phone number"
                className="bg-card border-border/60"
                data-ocid="contact.input"
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="text-sm font-medium mb-1.5 block"
              >
                Message *
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you?"
                className="bg-card border-border/60 min-h-[120px]"
                data-ocid="contact.textarea"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="contact.submit_button"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </motion.div>

        {/* Hours + Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Opening Hours</h3>
            </div>
            <div className="space-y-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{day}</span>
                  <span className="text-foreground font-medium">
                    10:00 AM – 11:00 PM
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Location</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Near Bhawarkua Square, Indore,
              <br />
              Madhya Pradesh 452010
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-4 border-primary/40 hover:bg-primary/10"
              data-ocid="contact.button"
            >
              <a
                href="https://maps.google.com/?q=Bhawarkua+Square+Indore"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
