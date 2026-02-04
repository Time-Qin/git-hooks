import { buildPrompt } from "./prompt.js"
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的路径和目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 .env 文件并设置环境变量
try {
  const envPath = join(__dirname, '../.env');
  const envFile = readFileSync(envPath, 'utf8');
  const envVars = envFile.split('\n');

  envVars.forEach(line => {
    if (line.trim() && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const trimmedKey = key.trim();
      let value = valueParts.join('=').trim(); // 处理值中包含等号的情况
      
      // 移除值两端的引号（如果有的话）
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      // 如果环境变量尚未设置，则设置它
      if (!process.env[trimmedKey]) {
        process.env[trimmedKey] = value;
      }
    }
  });
} catch (err) {
  console.error('Failed to load .env file:', err.message);
}

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