import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, Gift, Store, Star, Users, TrendingUp, Shield } from "lucide-react";
import heroImg from "@/assets/hero-illustration.png";
import PartnerModal from "@/components/PartnerModal";

const categories = [
  { icon: "🍕", label: "Restaurants", count: 45 },
  { icon: "☕", label: "Cafés", count: 32 },
  { icon: "🏋️", label: "Gyms", count: 18 },
  { icon: "🏨", label: "Hostels", count: 12 },
  { icon: "💇", label: "Services", count: 27 },
  { icon: "📚", label: "Bookstores", count: 9 },
];

const steps = [
  { icon: <Store className="h-6 w-6" />, title: "Discover", desc: "Browse verified vendors near your campus" },
  { icon: <QrCode className="h-6 w-6" />, title: "Purchase & Scan", desc: "Buy at the store, scan the verification barcode" },
  { icon: <Gift className="h-6 w-6" />, title: "Earn Rewards", desc: "Get points on every verified transaction" },
];

const stats = [
  { value: "2,500+", label: "Active Students" },
  { value: "180+", label: "Partner Vendors" },
  { value: "50K+", label: "Transactions" },
  { value: "$120K+", label: "Rewards Earned" },
];

const vendors = [
  { name: "The Green Bowl", cat: "Restaurant", rating: 4.8, offer: "15% off on meals", emoji: "🥗" },
  { name: "Bean Counter Café", cat: "Café", rating: 4.9, offer: "Free cookie with coffee", emoji: "☕" },
  { name: "FitZone Gym", cat: "Gym", rating: 4.7, offer: "First month free", emoji: "🏋️" },
  { name: "Page Turner Books", cat: "Bookstore", rating: 4.6, offer: "10% on textbooks", emoji: "📚" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  const [partnerOpen, setPartnerOpen] = useState(false);

  return (
    <>
      <PartnerModal open={partnerOpen} onOpenChange={setPartnerOpen} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="container grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Star className="h-3 w-3" /> Student Services Platform
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Lifeline in{" "}
              <span className="text-gradient">Australia.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              LifelineAustralia connects students with essential services — airport pickups, accommodation, jobs, and exclusive discounts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">
                  Join as Student <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => setPartnerOpen(true)}>
                Partner with Us
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <img src={heroImg} alt="Students connecting with local businesses" className="w-full max-w-lg mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
              <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to start earning</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div key={step.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative rounded-2xl border border-border bg-card p-8 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">{step.icon}</div>
                <div className="absolute -top-3 right-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">{i + 1}</div>
                <h3 className="font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/30 py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold">Browse Categories</h2>
          <p className="mt-2 text-muted-foreground">Find your favorite spots near campus</p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="cursor-pointer rounded-xl border border-border bg-card p-5 text-center shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
                <div className="text-3xl">{cat.icon}</div>
                <div className="mt-2 text-sm font-semibold">{cat.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{cat.count} vendors</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Featured Vendors</h2>
              <p className="mt-2 text-muted-foreground">Top-rated spots loved by students</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/vendors">View All</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vendors.map((v, i) => (
              <motion.div key={v.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all hover:shadow-card-hover">
                <div className="flex h-32 items-center justify-center bg-secondary text-5xl">{v.emoji}</div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold">{v.name}</h3>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                      <Star className="h-3 w-3 fill-primary" /> {v.rating}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{v.cat}</p>
                  <div className="mt-3 inline-flex rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">🎁 {v.offer}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LifelineAustralia */}
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Why LifelineAustralia?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Gift className="h-6 w-6" />, title: "Instant Rewards", desc: "Earn points on every verified purchase" },
              { icon: <Shield className="h-6 w-6" />, title: "Verified Vendors", desc: "Every partner is vetted and approved" },
              { icon: <Users className="h-6 w-6" />, title: "Student Community", desc: "Join thousands of rewarded students" },
              { icon: <TrendingUp className="h-6 w-6" />, title: "Vendor Growth", desc: "Drive foot traffic and loyalty" },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm p-6 text-primary-foreground">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">{item.icon}</div>
                <h3 className="font-display font-bold">{item.title}</h3>
                <p className="mt-2 text-sm opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold">Ready to Start Earning?</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Join LifelineAustralia today and unlock rewards at your favorite local spots.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Sign Up Free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
