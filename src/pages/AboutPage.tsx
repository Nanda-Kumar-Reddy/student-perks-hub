import { motion } from "framer-motion";
import { Star, Heart, Target, Lightbulb, Users, TrendingUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const testimonials = [
  { name: "Sarah Mitchell", role: "International Student", text: "LifelineAustralia made my move to Melbourne so much easier. Airport pickup, accommodation — all sorted!", rating: 5, avatar: "SM" },
  { name: "James Chen", role: "Business Student", text: "The discounts and services saved me hundreds of dollars in my first semester alone.", rating: 5, avatar: "JC" },
  { name: "Anita Desai", role: "Partner, Bean Counter Café", text: "We've seen a 30% increase in student footfall since joining. It's a win-win!", rating: 4, avatar: "AD" },
  { name: "Michael Park", role: "Engineering Student", text: "Got my driving licence sorted through the platform. Super convenient and affordable!", rating: 5, avatar: "MP" },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-20 bg-secondary/30">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Heart className="h-3 w-3" /> About LifelineAustralia
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Your Complete{" "}
              <span className="text-gradient">Student Support</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              LifelineAustralia is a comprehensive student services platform that connects international and local students with essential services — from airport pickups to jobs, accommodation, and exclusive discounts.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Target className="h-6 w-6" /></div>
              <h2 className="font-display text-3xl font-bold">Our Vision</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We envision a world where every student arriving in Australia has seamless access to essential services. Our long-term goal is to be the single platform students trust for everything — from landing at the airport to settling into their new life.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                By 2028, we aim to be present across every major Australian city, connecting hundreds of thousands of students with verified service providers and exclusive deals.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-2 gap-4">
              {[
                { icon: <Lightbulb className="h-5 w-5" />, title: "Innovation", desc: "Smart service matching" },
                { icon: <Users className="h-5 w-5" />, title: "Community", desc: "Building student networks" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "Growth", desc: "Scaling across Australia" },
                { icon: <Heart className="h-5 w-5" />, title: "Impact", desc: "Real savings for students" },
              ].map((item, i) => (
                <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{item.icon}</div>
                  <h3 className="font-display text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Our Impact</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">LifelineAustralia creates a support ecosystem for everyone</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "For Students", desc: "Access essential services, save money with exclusive discounts, find jobs, and settle into Australian life with confidence.", icon: "🎓" },
              { title: "For Vendors", desc: "Reach the student market, increase bookings, build loyalty, and gain powerful analytics to grow your business.", icon: "🏪" },
              { title: "For Communities", desc: "Strengthen local economies, support international students, and create thriving multicultural communities.", icon: "🏫" },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm p-8 text-primary-foreground text-left">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold">What People Say</h2>
            <p className="mt-2 text-muted-foreground">Hear from our students and partners</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{t.avatar}</div>
                  <div>
                    <div className="font-display text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className={`h-3.5 w-3.5 ${si < t.rating ? "fill-primary text-primary" : "text-border"}`} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
