import OpenAI from 'openai'

const openai=new OpenAI({
    baseURL:'http://localhost:11434/v1',
    apiKey:'ollama'
})
export default openai