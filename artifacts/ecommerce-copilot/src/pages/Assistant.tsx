import { Bot, Send, User, ChevronRight, Cpu, CloudOff, MessageSquare, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { createAiChat, useGetAiStatus } from "@workspace/api-client-react";
import { analyzeDemoQuestion } from "@/lib/demoAnalytics";
import { useI18n } from "@/lib/i18n";

type PendingAction = {
  sku: string;
  oldLevel: number;
  newLevel: number;
};

export default function Assistant() {
  const store = useStore() as any;
  const { language, t } = useI18n();
  const {
    messages = [],
    addMessage,
    skus = [],
    products = [],
    metrics,
    trendData,
    channelPerformance,
    updateSKUAlertLevelWithActivity,
    conversations = [{ id: 'default', title: 'Current Session', updatedAt: new Date().toISOString() }],
    activeConversationId = 'default',
    sidekickContext = null,
    createConversation,
    setActiveConversation,
    setSidekickContext
  } = store;

  const { data: aiStatus } = useGetAiStatus();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const languageNames = {
    "zh-CN": "Simplified Chinese (zh-CN)",
    "zh-TW": "Traditional Chinese (zh-TW)",
    en: "English (en)",
    ja: "Japanese (ja)",
    ko: "Korean (ko)",
  };
  const interpolate = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
      template,
    );

  const currentMessages = messages.filter((m: any) => !m.conversationId || m.conversationId === activeConversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    addMessage({ role: 'user', content: text, conversationId: activeConversationId });
    setInput("");
    setIsTyping(true);
    
    await new Promise((resolve) => setTimeout(resolve, 650));

    const isAgentAction =
      /A102/i.test(text) && /(调整|調整|调到|調到|改成|改為|设置|設定|预警|預警|阈值|閾值|adjust|change|set|変更|変更する|조정|변경|설정)/i.test(text);

    if (isAgentAction) {
      const skuToUpdate = "A102-WHT";
      const currentSku = skus.find((sku: any) => sku.sku === skuToUpdate);
      const currentLevel = currentSku?.alertLevel ?? 15;
      setPendingAction({ sku: skuToUpdate, oldLevel: currentLevel, newLevel: 30 });
      setIsTyping(false);
      addMessage({
        role: 'assistant',
        source: 'demo',
        conversationId: activeConversationId,
        content: interpolate(t("assistant.actionIdentified"), { sku: skuToUpdate, oldLevel: currentLevel, newLevel: 30 }),
      });
      return;
    }

    const contextualQuestion = sidekickContext?.query
      ? `${text}\n${t("assistant.businessContext")}：${sidekickContext.page}（${sidekickContext.entityId || t("assistant.currentPage")}）— ${sidekickContext.query}`
      : text;
    const languageInstruction = `\n\nSystem language instruction: Reply in ${languageNames[language]}. If the user's input is clearly in a different language, follow the user's input language instead.`;
    const questionWithLanguage = `${contextualQuestion}${languageInstruction}`;
    const analysis = analyzeDemoQuestion({
      question: contextualQuestion,
      products,
      skus,
      metrics,
      trendData,
      channelPerformance,
    });

    try {
      const response = await createAiChat({
        question: questionWithLanguage,
        intent: analysis.intent,
        demoAnswer: language === "zh-CN" ? analysis.demoAnswer : interpolate(t("assistant.localResponse"), { intent: t(`assistant.intent.${analysis.intent}`) }),
        facts: analysis.facts,
      });
      addMessage({
        role: 'assistant',
        content: response.answer,
        source: response.source,
        notice: response.notice,
        conversationId: activeConversationId,
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: interpolate(t("assistant.localResponse"), { intent: t(`assistant.intent.${analysis.intent}`) }),
        source: 'demo',
        notice: t("assistant.fallbackNotice"),
        conversationId: activeConversationId,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;

    updateSKUAlertLevelWithActivity?.(pendingAction.sku, pendingAction.newLevel);
    addMessage({
      role: 'assistant',
      source: 'demo',
      conversationId: activeConversationId,
      content: interpolate(t("assistant.actionCompleted"), pendingAction)
    });
    setPendingAction(null);
  };

  const handleClearContext = () => {
    setSidekickContext?.(null);
  };

  const suggestedPrompts = [
    t("assistant.suggestions.stock"),
    t("assistant.suggestions.best"),
    t("assistant.suggestions.profit"),
    t("assistant.suggestions.margin"),
    t("assistant.suggestions.threshold"),
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="w-72 border-r border-slate-100 bg-slate-50/50 flex-col hidden md:flex shrink-0">
        <div className="p-5 border-b border-slate-100">
          <button 
            onClick={() => createConversation?.(`${t("assistant.newChat")} ${conversations.length + 1}`, sidekickContext)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t("assistant.newChat")}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 mb-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("assistant.recent")}</h3>
          </div>
          {conversations.map((conv: any) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation?.(conv.id)}
              className={`w-full text-left px-3 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                activeConversationId === conv.id 
                  ? 'bg-white border-slate-200 shadow-sm text-slate-900 border' 
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <MessageSquare className={`w-4 h-4 shrink-0 ${activeConversationId === conv.id ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-white shrink-0 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Bot className="w-6 h-6 text-indigo-600" /> {t("assistant.title")}
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">{t("assistant.subtitle")}</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase ${
            aiStatus?.configured
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}>
            {aiStatus?.configured ? <Cpu className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />}
            {aiStatus?.configured ? t("assistant.deepseekActive") : t("assistant.localFallback")}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {currentMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{t("assistant.emptyTitle")}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t("assistant.emptyDescription")}
              </p>
            </div>
          )}

          {currentMessages.map((msg: any) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5 text-indigo-700" />
                </div>
              )}
              
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}>
                {msg.id === "1" ? t("assistant.welcome") : msg.content}
                {msg.role === 'assistant' && msg.source && (
                  <div className="mt-3 border-t border-slate-100 pt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {msg.source === 'deepseek' ? t("assistant.deepseekLogic") : t("assistant.localLogic")}
                    </span>
                    {msg.notice && <span className="text-[11px] text-slate-500 truncate">· {msg.notice}</span>}
                  </div>
                )}
              </div>
              
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 w-fit h-[52px] shadow-sm">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100 shrink-0">
          {sidekickContext && (
            <div className="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                <span className="flex w-2 h-2 rounded-full bg-indigo-600"></span>
                {t("assistant.context")}：{sidekickContext.page}
                <button onClick={handleClearContext} className="ml-2 hover:bg-indigo-200 p-0.5 rounded transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => void handleSend(prompt)}
                className="text-[12px] font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {prompt} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
          
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleSend(input)}
              placeholder={sidekickContext
                ? interpolate(t("assistant.contextPlaceholder"), { page: sidekickContext.page })
                : t("assistant.placeholder")}
              className="w-full pl-5 pr-14 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-[15px] shadow-sm"
            />
            <button 
              onClick={() => void handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1.5">{t("assistant.actionRequired")}</p>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{t("assistant.updateThreshold")}</h2>
              </div>
              <div className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 uppercase tracking-wider border border-amber-200">{t("assistant.critical")}</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-[15px] text-slate-700 leading-relaxed shadow-inner">
              {interpolate(t("assistant.updateConfirm"), pendingAction)}
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-slate-500">{t("assistant.actionWarning")}</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 text-center"
              >
                {t("action.cancel")}
              </button>
              <button
                onClick={confirmPendingAction}
                className="w-full sm:w-auto rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 text-center"
              >
                {t("assistant.confirmExecute")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
