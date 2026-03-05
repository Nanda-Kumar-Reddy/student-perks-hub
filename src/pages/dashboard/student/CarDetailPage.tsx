import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Fuel, Gauge, Calendar, Car, DollarSign, Info, Wrench } from "lucide-react";
import { useState } from "react";
import EnquiryPopup from "@/components/shared/EnquiryPopup";

const vehicles = [
  {
    id: 1, name: "Toyota Corolla 2022", weeklyPrice: "$250/week", monthlyPrice: "$900/month",
    location: "NSW", fuel: "Petrol", year: "2022", mileage: "15,000 km", reading: "45,000 km",
    desc: "Reliable sedan perfect for city driving.",
    type: "rent", badge: "Rent",
    features: ["Air Conditioning", "Bluetooth", "Cruise Control", "Reverse Camera", "USB Charging"],
    fullDesc: "This Toyota Corolla 2022 is an excellent choice for students and professionals looking for a reliable and fuel-efficient vehicle. Well-maintained with full service history. The car features a comfortable interior with modern technology including Bluetooth connectivity and a reverse camera for easy parking. Perfect for daily commuting or weekend trips around New South Wales.",
    images: ["🚗", "🏎️", "🚙"],
    transmission: "Automatic",
    seats: 5,
    doors: 4,
  },
  {
    id: 2, name: "Hyundai i30 2021", weeklyPrice: "$220/week", monthlyPrice: "$800/month",
    location: "SA", fuel: "Petrol", year: "2021", mileage: "22,000 km", reading: "60,000 km",
    desc: "Compact hatchback with great fuel economy.",
    type: "rent", badge: "Rent",
    features: ["Air Conditioning", "Apple CarPlay", "Lane Assist", "Parking Sensors", "Keyless Entry"],
    fullDesc: "The Hyundai i30 2021 is a versatile hatchback that combines style with practicality. Featuring excellent fuel economy and a spacious boot, this car is ideal for students who need an affordable yet comfortable ride. Comes with Apple CarPlay integration and advanced safety features including lane assist and parking sensors.",
    images: ["🚗", "🏎️", "🚙"],
    transmission: "Automatic",
    seats: 5,
    doors: 5,
  },
  {
    id: 3, name: "Mazda CX-5 2023", weeklyPrice: "$380/week", monthlyPrice: "$1400/month",
    location: "TAS", fuel: "Petrol", year: "2023", mileage: "8,000 km", reading: "24,000 km",
    desc: "Spacious SUV for weekend adventures.",
    type: "rent", badge: "Rent",
    features: ["All-Wheel Drive", "Sunroof", "Leather Seats", "Bose Sound System", "360° Camera"],
    fullDesc: "The Mazda CX-5 2023 is a premium SUV offering exceptional comfort and performance. With its sleek design and powerful engine, it's perfect for those who want to explore Tasmania's beautiful landscapes. Features include all-wheel drive, a panoramic sunroof, and a premium Bose sound system for the ultimate driving experience.",
    images: ["🚗", "🏎️", "🚙"],
    transmission: "Automatic",
    seats: 5,
    doors: 5,
  },
  {
    id: 4, name: "Nissan Leaf 2022", weeklyPrice: "$200/week", monthlyPrice: "$720/month",
    location: "ACT", fuel: "Electric", year: "2022", mileage: "12,000 km", reading: "36,000 km",
    desc: "Eco-friendly electric car.",
    type: "rent", badge: "Rent",
    features: ["Zero Emissions", "Regenerative Braking", "ProPilot Assist", "Fast Charging", "e-Pedal"],
    fullDesc: "The Nissan Leaf 2022 is the perfect electric vehicle for environmentally conscious drivers. With zero tailpipe emissions and impressive range, this car is ideal for city driving and daily commutes. Features include ProPilot Assist for semi-autonomous driving and fast charging capability to minimize downtime.",
    images: ["🚗", "🏎️", "🚙"],
    transmission: "Automatic",
    seats: 5,
    doors: 5,
  },
  {
    id: 5, name: "Ford Ranger 2020", weeklyPrice: "$18,500", monthlyPrice: "",
    location: "NSW", fuel: "Diesel", year: "2020", mileage: "5,000 km/yr", reading: "78,000 km",
    desc: "Rugged ute in great condition.",
    type: "sale", badge: "Sale",
    features: ["4x4", "Tow Bar", "Bull Bar", "Roof Rack", "Bed Liner"],
    fullDesc: "This Ford Ranger 2020 is a powerful and capable ute that's ready for any job. Whether you need it for work or adventure, this vehicle delivers with its robust diesel engine and 4x4 capability. Well-maintained with all service records available. Comes equipped with practical accessories including a tow bar and roof rack.",
    images: ["🚗", "🏎️", "🚙"],
    transmission: "Automatic",
    seats: 5,
    doors: 4,
  },
  {
    id: 6, name: "Honda Civic 2019", weeklyPrice: "$14,200", monthlyPrice: "",
    location: "NT", fuel: "Petrol", year: "2019", mileage: "8,000 km/yr", reading: "95,000 km",
    desc: "Reliable sedan, low running costs.",
    type: "sale", badge: "Sale",
    features: ["Honda Sensing Suite", "Adaptive Cruise", "Heated Seats", "Wireless Charging", "LED Headlights"],
    fullDesc: "The Honda Civic 2019 is a proven reliable sedan with low running costs. Known for its longevity and excellent resale value, this Civic comes with Honda's advanced safety suite including adaptive cruise control. Perfect for anyone looking for a dependable daily driver at an affordable price.",
    images: ["🚗", "🏎️", "🚙"],
    transmission: "CVT",
    seats: 5,
    doors: 4,
  },
];

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const vehicle = vehicles.find((v) => v.id === Number(id));

  if (!vehicle) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/student/cars")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Vehicles
        </Button>
        <div className="text-center py-20 text-muted-foreground">Vehicle not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/cars")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Vehicles
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left — Gallery & Info */}
        <div className="lg:col-span-3 space-y-4">
          {/* Image gallery */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="relative flex h-56 sm:h-72 items-center justify-center bg-secondary text-7xl">
              {vehicle.images[activeImage]}
              <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white ${vehicle.badge === "Rent" ? "bg-primary" : "bg-accent"}`}>
                {vehicle.badge}
              </span>
            </div>
            <div className="flex gap-2 p-3">
              {vehicle.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex h-16 w-16 items-center justify-center rounded-lg border text-2xl transition-all ${
                    activeImage === i ? "border-primary bg-primary/10" : "border-border bg-secondary hover:border-primary/50"
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Description
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{vehicle.fullDesc}</p>
          </div>

          {/* Features */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" /> Features
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vehicle.features.map((f) => (
                <span key={f} className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Specs & Action */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h1 className="font-display text-xl font-bold">{vehicle.name}</h1>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Location</span>
                <span className="ml-auto font-medium">{vehicle.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Fuel className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Fuel Type</span>
                <span className="ml-auto font-medium">{vehicle.fuel}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Gauge className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Odometer</span>
                <span className="ml-auto font-medium">{vehicle.reading}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Year</span>
                <span className="ml-auto font-medium">{vehicle.year}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Transmission</span>
                <span className="ml-auto font-medium">{vehicle.transmission}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Seats / Doors</span>
                <span className="ml-auto font-medium">{vehicle.seats} seats / {vehicle.doors} doors</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Gauge className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Avg. Mileage</span>
                <span className="ml-auto font-medium">{vehicle.mileage}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-display text-lg font-bold text-primary">{vehicle.weeklyPrice}</span>
              </div>
              {vehicle.monthlyPrice && (
                <p className="text-sm text-muted-foreground mt-1 ml-7">{vehicle.monthlyPrice}</p>
              )}
            </div>

            <Button className="w-full" size="lg" onClick={() => setEnquiryOpen(true)}>
              Enquire Now
            </Button>
          </div>
        </div>
      </div>

      <EnquiryPopup open={enquiryOpen} onOpenChange={setEnquiryOpen} title={vehicle.name} />
    </div>
  );
}
