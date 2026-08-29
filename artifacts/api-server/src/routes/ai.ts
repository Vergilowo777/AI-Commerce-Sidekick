import { Router, type IRouter } from "express";
import {
  CreateAiChatBody,
  CreateAiChatResponse,
  GetAiStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const deepSeekApiUrl =
  process.env.DEEPSEEK_API_URL ?? "https://api.deepseek.com/chat/completions";

router.get("/ai/status", (_req, res) => {
  const configured = Boolean(process.env.DEEPSEEK_API_KEY);
  res.json(
    GetAiStatusResponse.parse({
      configured,
      provider: "DeepSeek",
      message: configured
        ? "DeepSeek 已配置，AI 会基于应用生成的结构化经营结果进行中文解释。"
        : "尚未配置 DEEPSEEK_API_KEY，当前使用本地规则化 Demo Analytics。",
    }),
  );
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = CreateAiChatBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid AI chat request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.json(
      CreateAiChatResponse.parse({
        answer: parsed.data.demoAnswer,
        source: "demo",
        configured: false,
        notice: "DeepSeek 密钥未配置，当前结果由本地 Demo Analytics 生成。",
      }),
    );
    return;
  }

  try {
    const response = await fetch(deepSeekApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "你是中国中小电商商家的经营分析解释助手。只能使用用户提供的结构化经营事实和应用已经生成的分析结论，不得补充、猜测或编造任何数字。请用简洁、易懂的中文说明现状、原因、风险和下一步建议。",
          },
          {
            role: "user",
            content: JSON.stringify({
              question: parsed.data.question,
              intent: parsed.data.intent,
              facts: parsed.data.facts,
              applicationAnalysis: parsed.data.demoAnswer,
            }),
          },
        ],
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      req.log.warn(
        { status: response.status, error: errorText.slice(0, 300) },
        "DeepSeek request failed; returning demo analysis",
      );
      res.json(
        CreateAiChatResponse.parse({
          answer: parsed.data.demoAnswer,
          source: "demo",
          configured: true,
          notice: "DeepSeek 暂时不可用，已自动返回本地 Demo Analytics 结果。",
        }),
      );
      return;
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = payload.choices?.[0]?.message?.content?.trim();

    res.json(
      CreateAiChatResponse.parse({
        answer: answer || parsed.data.demoAnswer,
        source: answer ? "deepseek" : "demo",
        configured: true,
        notice: answer ? null : "DeepSeek 未返回有效内容，已使用本地分析结果。",
      }),
    );
  } catch (error) {
    req.log.warn(
      { err: error instanceof Error ? error.message : String(error) },
      "DeepSeek request errored; returning demo analysis",
    );
    res.json(
      CreateAiChatResponse.parse({
        answer: parsed.data.demoAnswer,
        source: "demo",
        configured: true,
        notice: "DeepSeek 请求超时或失败，已自动返回本地 Demo Analytics 结果。",
      }),
    );
  }
});

export default router;