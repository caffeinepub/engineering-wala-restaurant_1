import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Cog, Heart, MapPin, Users } from "lucide-react";
import { motion } from "motion/react";

const VALUES = [
  {
    icon: Heart,
    title: "Made with Love",
    desc: "Every dish is prepared with care and passion, using fresh ingredients sourced daily.",
  },
  {
    icon: Award,
    title: "Quality First",
    desc: "We never compromise on quality. Our recipes are perfected over years of culinary expertise.",
  },
  {
    icon: Users,
    title: "Community Focused",
    desc: "We're more than a restaurant — we're a gathering spot for Indore's food lovers.",
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Cog className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-primary">Engineering Wala</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Engineering Wala Restaurant, we believe that great food is an
              engineering feat — combining the perfect ingredients, the right
              techniques, and a whole lot of passion to create dishes that
              delight your senses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold mb-5">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded by <strong className="text-foreground">Aadarsh</strong>,
                Engineering Wala Restaurant started with a simple idea: serve
                the kind of food that makes people feel at home. Born in Indore
                — India's food capital — we've been crafting dishes that honor
                the city's rich culinary heritage.
              </p>
              <p>
                Our name reflects our approach. Like good engineering, cooking
                requires precision, the right components, and attention to
                detail. We apply this philosophy to every biryani, every curry,
                every cup of chai we serve.
              </p>
              <p>
                Today, we serve hundreds of happy customers daily, and our menu
                continues to grow with new dishes inspired by regional Indian
                cuisines and modern twists.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border/60 rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold mb-6">Visit Us</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Near Bhawarkua Square, Indore, Madhya Pradesh 452010
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Hours</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Monday – Sunday
                  </p>
                  <p className="text-muted-foreground text-sm">
                    10:00 AM – 11:00 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card border-y border-border/40 py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold text-center mb-10"
          >
            Our <span className="text-primary">Values</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="border-border/60 bg-background h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                      <v.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {v.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {v.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4 text-3xl">
            👨‍🍳
          </div>
          <h3 className="font-display text-2xl font-bold mb-1">Aadarsh</h3>
          <p className="text-primary text-sm mb-3">Founder & Head Chef</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            "I started Engineering Wala because I wanted to bring the best of
            Indore's street food culture into a proper restaurant experience.
            Every dish here tells a story."
          </p>
        </motion.div>
      </section>
    </div>
  );
}
