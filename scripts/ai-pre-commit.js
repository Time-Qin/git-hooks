import { getStagedDiff } from './diff.utils.js'
import { reviewByAI } from './ai-review.client.js'

async function main(){
    const diff  = getStagedDiff()
    
    if(!diff.trim()) process.exit(0)
    
    // Diff 太大直接跳过 (防止提交卡死)
    if(diff.length > 12000) {
        console.log('⚠️ Diff too large, skip AI review')
        process.exit(0)
    }
    console.log('🤖 AI reviewing staged changes...\n')

    const result = await reviewByAI(diff)
    console.log('************result*************',result);
    

    if(result.status == 'fail'){
        console.log('❌ AI Code Review Failed\n')

        result.issues.forEach(i=>{
            console.log(`🔴 ${i.file}:${i.line}`)
            console.log(`   ${i.reason}`)
            console.log(`   👉 ${i.fix}\n`)
        })
        process.exit(1)
    }
    console.log('✅ AI Code Review Passed')
}

main().catch(err => {
    console.log('⚠️ AI review error, skip commit')
    console.error(err.message)
    process.exit(0)
  })