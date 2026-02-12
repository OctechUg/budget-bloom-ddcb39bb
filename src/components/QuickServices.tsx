import { useState } from "react";
import { Smartphone, Zap, Wifi, Droplets, Tv, GraduationCap, Bus, CreditCard } from "lucide-react";
import { ServicePurchaseModal } from "@/components/ServicePurchaseModal";
import { useToast } from "@/hooks/use-toast";

const services = [
  { icon: Smartphone, label: "Airtime", color: "text-primary" },
  { icon: Wifi, label: "Data", color: "text-secondary" },
  { icon: Zap, label: "Electricity", color: "text-warning" },
  { icon: Droplets, label: "Water", color: "text-blue-400" },
  { icon: Tv, label: "TV", color: "text-purple-400" },
  { icon: GraduationCap, label: "School Fees", color: "text-green-400" },
  { icon: Bus, label: "Transport", color: "text-orange-400" },
  { icon: CreditCard, label: "More", color: "text-muted-foreground" },
];

export function QuickServices() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast } = useToast();

  const handleServiceClick = (label: string) => {
    if (label === "More") {
      toast({ title: "More Services", description: "Additional services coming soon!" });
      return;
    }
    setSelectedService(label);
  };

  const activeService = services.find((s) => s.label === selectedService);
  const ActiveIcon = activeService?.icon;

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.label}
              onClick={() => handleServiceClick(service.label)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl glass-card hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className={`h-6 w-6 ${service.color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {service.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedService && ActiveIcon && (
        <ServicePurchaseModal
          open={!!selectedService}
          onOpenChange={(open) => { if (!open) setSelectedService(null); }}
          serviceName={selectedService}
          serviceIcon={
            <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center`}>
              <ActiveIcon className={`h-5 w-5 ${activeService?.color}`} />
            </div>
          }
        />
      )}
    </>
  );
}
