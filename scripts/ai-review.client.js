import { buildPrompt } from "./prompt.js"

const AI_ENDPOINT = process.env.AI_REVIEW_ENDPOINT
const AI_KEY = process.env.AI_REVIEW_KEY

export async function reviewByAI(diff) {
  const prompt = buildPrompt(diff)
  console.log("----------------AI_ENDPOINT-----------------", AI_ENDPOINT)
  console.log("----------------AI_KEY-----------------", AI_KEY)
  console.log("----------------prompt-----------------", prompt)
  const _request = new Request(AI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_KEY}`,
    },
    body: JSON.stringify({
      model: "Deepseek-V3.1-H200",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    }),
  })

  const res = await fetch(_request)

  const data = await res.json()
  console.log("----------------data-----------------", JSON.stringify(data))

  return JSON.parse(data.choices[0].message.content)
}