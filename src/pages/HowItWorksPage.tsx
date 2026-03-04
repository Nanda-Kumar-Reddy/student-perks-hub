import { motion } from "framer-motion";
import { QrCode, Gift, Store, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Store className="h-8 w-8" />,
    title: "1. Discover Vendors",
    desc: "Browse our curated list of partner vendors near your campus — restaurants, cafés, gyms, and more.",
  },
  {
    icon: <QrCode className="h-8 w-8" />,
    title: "2. Shop & Scan",
    desc: "Visit the vendor, make your purchase, and scan the unique barcode provided by the vendor to verify your transaction.",
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "3. Transaction Verified",
    desc: "Our system instantly verifies the transaction, linking it to your account and the vendor.",
  },
  {
    icon: <Gift className="h-8 w-8" />,
    title: "4. Earn Rewards",
    desc: "Points are automatically credited to your wallet. Accumulate points and redeem them for discounts and exclusive perks.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold">How CampusPerks Works</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            A simple, rewarding experience from discovery to rewards.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex gap-6"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {step.icon}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
