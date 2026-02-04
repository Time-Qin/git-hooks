import { buildPrompt } from "./prompt.js"
import OpenAI from "openai"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// 获取当前文件的路径和目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 .env 文件并设置环境变量
try {
  const envPath = join(__dirname, "../.env")
  const envFile = readFileSync(envPath, "utf8")
  const envVars = envFile.split("\n")

  envVars.forEach((line) => {
    if (line.trim() && line.includes("=")) {
      const [key, ...valueParts] = line.split("=")
      const trimmedKey = key.trim()
      let value = valueParts.join("=").trim() // 处理值中包含等号的情况

      // 移除值两端的引号（如果有的话）
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1)
      }

      // 如果环境变量尚未设置，则设置它
      if (!process.env[trimmedKey]) {
        process.env[trimmedKey] = value
      }
    }
  })
} catch (err) {
  console.error("Failed to load .env file:", err.message)
}

const AI_ENDPOINT = process.env.AI_REVIEW_ENDPOINT
const AI_KEY = process.env.AI_REVIEW_KEY

export async function reviewByAI(diff) {
  try {
    const prompt = buildPrompt(diff)
    const openai = new OpenAI({
      apiKey: AI_KEY,
      baseURL: AI_ENDPOINT,
    })
    const completion = await openai.chat.completions.create({
      model: "qwen3-max", //模型列表: https://help.aliyun.com/model-studio/getting-started/models
      messages: [{ role: "user", content: prompt }],
    })
    const content =
      typeof completion.choices[0].message.content == "string"
        ? completion.choices[0].message.content
        : JSON.stringify({ status: "fail", issues: [{ reason: "api error" }] })
    return JSON.parse(content)
  } catch (error) {
    console.warn(`错误信息：${error}`)
    console.warn(
      "请参考文档：https://help.aliyun.com/model-studio/developer-reference/error-code"
    )
    return { status: "fail", issues: [{ reason: error.message }] }
  }
}
