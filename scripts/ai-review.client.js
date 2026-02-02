import fetch from 'node-fetch'
import { buildPrompt } from './prompt.js'

const AI_ENDPOINT = process.env.AI_REVIEW_ENDPOINT
const AI_KEY = process.env.AI_REVIEW_KEY

export async function reviewByAI(diff) {
  const prompt = buildPrompt(diff)

  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_KEY}`
    },
    body: JSON.stringify({
      model: 'Deepseek-V3.1-H200',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    })
  })

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}