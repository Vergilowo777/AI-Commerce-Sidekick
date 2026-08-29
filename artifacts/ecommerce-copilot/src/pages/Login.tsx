import { useState, type FormEvent } from "react";
import { Activity, ArrowRight, Bot, Eye, EyeOff, ShieldCheck, TrendingUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocation } from "wouter";

const isIdentifierValid = (value: string) => value === "demo_admin" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[+]?[\d\s-]{6,}$/.test(value);

export default function Login() {
  const { login, updateProfile } = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("demo_admin");
  const [password, setPassword] = useState("demo1234");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [contactName, setContactName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (mode === "login") {
      if (!isIdentifierValid(identifier) || password.length < 6) {
        setError(t("login.invalid"));
        return;
      }
      setIsLoading(true);
      window.setTimeout(() => { login(remember); setIsLoading(false); setLocation("/"); }, 450);
      return;
    }
    if (!merchantName.trim() || !contactName.trim() || !isIdentifierValid(identifier) || password.length < 6 || !confirmPassword) {
      setError(t("login.required"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("login.passwordMismatch"));
      return;
    }
    setIsLoading(true);
    window.setTimeout(() => {
      updateProfile({ merchantName: merchantName.trim(), displayName: contactName.trim(), contact: identifier.trim(), avatarLabel: contactName.trim().slice(0, 2).toUpperCase() });
      login(remember);
      setIsLoading(false);
      setLocation("/");
    }, 450);
  };

  const forgotPassword = () => {
    setError("");
    setNotice(t("login.forgotMessage"));
  };

  const features = [
    { icon: Activity, title: t("login.feature.anomaly"), desc: t("login.feature.anomalyHint") },
    { icon: ShieldCheck, title: t("login.feature.inventory"), desc: t("login.feature.inventoryHint") },
    { icon: TrendingUp, title: t("login.feature.actions"), desc: t("login.feature.actionsHint") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl justify-end"><LanguageSwitcher /></div>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-8 md:grid-cols-2">
        <div className="hidden space-y-8 p-8 md:flex md:flex-col md:justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600"><Bot className="h-4 w-4" />{t("login.hero.badge")}</div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">{t("login.hero.title")}<br /><span className="text-blue-600">{t("login.hero.highlight")}</span></h1>
          <p className="max-w-md text-lg text-slate-600">{t("login.hero.description")}</p>
          <div className="space-y-4 pt-4">{features.map(({ icon: Icon, title, desc }) => <div key={title} className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 shadow-sm"><Icon className="h-5 w-5" /></div><div><h3 className="font-semibold text-slate-900">{title}</h3><p className="text-sm text-slate-500">{desc}</p></div></div>)}</div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Bot className="h-6 w-6" /></div>
            <h2 className="text-2xl font-bold text-slate-900">{mode === "login" ? t("login.title") : t("login.registerTitle")}</h2>
            <p className="mt-2 text-sm text-slate-500">{t("login.subtitle")}</p>
          </div>

          {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</div>}
          {notice && <div role="status" className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-700">{notice}</div>}

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && <><div><label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.merchantName")}</label><input required value={merchantName} onChange={(e) => setMerchantName(e.target.value)} className="field" placeholder="智营优选旗舰店" /></div><div><label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.contactName")}</label><input required value={contactName} onChange={(e) => setContactName(e.target.value)} className="field" placeholder="Alex" /></div></>}
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.identifier")}</label><input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="field" placeholder="demo_admin / name@example.com" autoComplete="username" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.password")}</label><div className="relative"><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="field pr-11" autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-slate-400 hover:bg-slate-100">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            {mode === "register" && <div><label className="mb-1.5 block text-sm font-medium text-slate-700">{t("login.confirmPassword")}</label><div className="relative"><input required minLength={6} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="field pr-11" autoComplete="new-password" /><button type="button" aria-label="Toggle confirmation visibility" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-slate-400 hover:bg-slate-100">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>}
            {mode === "login" && <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-600"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-slate-300 text-blue-600" />{t("login.remember")}</label><button type="button" onClick={forgotPassword} className="font-medium text-blue-600 hover:text-blue-700">{t("login.forgot")}</button></div>}
            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>{mode === "login" ? t("login.submit") : t("login.registerSubmit")}<ArrowRight className="h-4 w-4" /></>}</button>
          </form>
          {mode === "login" && <p className="mt-3 text-center text-xs text-slate-400">{t("login.demoHint")}</p>}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">{mode === "login" ? <>{t("login.noAccount")} <button onClick={() => { setMode("register"); setError(""); setNotice(""); }} className="font-semibold text-blue-600">{t("login.register")}</button></> : <>{t("login.hasAccount")} <button onClick={() => { setMode("login"); setError(""); setNotice(""); }} className="font-semibold text-blue-600">{t("login.back")}</button></>}</div>
        </div>
      </div>
    </div>
  );
}