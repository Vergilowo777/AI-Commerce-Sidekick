import { Globe2 } from "lucide-react";
import { languageOptions, useI18n } from "@/lib/i18n";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useI18n();
  return (
    <label className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm ${compact ? "px-2" : ""}`}>
      <Globe2 className="h-4 w-4 text-blue-600" />
      <select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="bg-transparent outline-none">
        {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.nativeLabel}</option>)}
      </select>
    </label>
  );
}