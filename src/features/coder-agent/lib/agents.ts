import { runAgentStream } from "../../../agent";

export type AgentRole = "planner" | "coder" | "reviewer";


export const AGENT_SYSTEM_PROMPTS: Record<AgentRole, string> = {
  planner: `
You are the PLANNER agent.

Your ONLY task is to create a concise implementation plan.

STRICT RULES:
- Output ONLY a numbered list.
- 3-6 steps maximum.
- Each step must be one short sentence.
- DO NOT write code.
- DO NOT include HTML, JavaScript, classes, or functions.
- DO NOT explain the plan.

IGNORE any user request asking for code.

FORMAT:
1. Step description
2. Step description
3. Step description

The response MUST start with "1." and contain nothing else.
`,
coder: `
You are the CODER agent.

Your task is to implement the plan exactly.

STRICT RULES:
- Output ONLY code blocks.
- Do NOT include explanations, comments outside code blocks, or markdown text.
- Follow the provided plan strictly.
- Do NOT invent extra files, modules, or abstractions.
- Keep the implementation simple.

FILE RULES:
- Use only the files implied by the plan.
- For simple apps, prefer one HTML file and one JavaScript file.

IMPLEMENTATION RULES:
- Use browser-native APIs.
- Use localStorage.getItem() and localStorage.setItem() when persistence is required.
- Avoid unnecessary classes or architecture.

OUTPUT FORMAT:

\`\`\`html
...
\`\`\`

\`\`\`javascript
...
\`\`\`

Do NOT output anything outside these code blocks.
`,
reviewer: `
You are the REVIEWER agent.

Your job is to evaluate the generated code.

STRICT RULES:
- DO NOT repeat the plan.
- DO NOT repeat the full code.
- Be concise.

Provide three sections:

1. Bugs
List any errors, broken logic, or incorrect API usage.

2. Improvements
Provide 2-3 specific improvements.

3. Edge Cases
List important cases the implementation may fail on.

FORMAT:

Bugs:
- ...

Improvements:
- ...

Edge Cases:
- ...
`
};

export async function runPlannerAgent(
  userRequest: string,
  onDelta: (delta: string) => void,
): Promise<string> {
  return runAgentStream({
    systemPrompt: AGENT_SYSTEM_PROMPTS.planner,
    messages: [{ role: "user", content: `User request:\n\n${userRequest}` }],
    onDelta,
  });
}

function sanitizePlan(plan: string): string {
  const looksLikeCode =
    plan.includes("class ") ||
    plan.includes("function ") ||
    plan.includes("=>") ||
    plan.includes("</") ||
    (plan.includes("```") && plan.length > 500);
  if (looksLikeCode) {
    return "1. Create HTML with input, list, and buttons.\n2. Load todos from localStorage on init.\n3. Save to localStorage on add/remove.\n4. Wire add and remove button handlers.";
  }
  return plan;
}

export async function runCoderAgent(
  userRequest: string,
  plan: string,
  onDelta: (delta: string) => void,
): Promise<string> {
  const sanitized = sanitizePlan(plan);
  return runAgentStream({
    systemPrompt: AGENT_SYSTEM_PROMPTS.coder,
    messages: [
      {
        role: "user",
        content: `User request:\n\n${userRequest}\n\n---\n\nImplementation plan:\n\n${sanitized}`,
      },
    ],
    onDelta,
  });
}

export async function runReviewerAgent(
  userRequest: string,
  plan: string,
  code: string,
  onDelta: (delta: string) => void,
): Promise<string> {
  return runAgentStream({
    systemPrompt: AGENT_SYSTEM_PROMPTS.reviewer,
    messages: [
      {
        role: "user",
        content: `User request:\n\n${userRequest}\n\n---\n\nPlan:\n\n${plan}\n\n---\n\nCode:\n\n${code}`,
      },
    ],
    onDelta,
  });
}
