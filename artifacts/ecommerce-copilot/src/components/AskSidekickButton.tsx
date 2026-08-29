import { Bot } from "lucide-react";
import { useLocation } from "wouter";
import { useStore } from "@/store/useStore";

export function AskSidekickButton({ context }: { context: { type: string, id: string, label: string, facts: string[] } }) {
  const [, setLocation] = useLocation();
  const { setSidekickContext } = useStore();

  const handleClick = () => {
    const supportedTypes = ["product", "sku", "order", "customer", "alert", "report"] as const;
    const entityType = supportedTypes.find((type) => type === context.type);
    setSidekickContext({
      page: context.label,
      entityType,
      entityId: context.id,
      query: context.facts.join("；"),
    });
    setLocation("/sidekick");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
    >
      <Bot className="h-4 w-4" />
      Ask Sidekick
    </button>
  );
}
