const OpenAI = require('openai-api')
require('dotenv').config()


async function callOpenAI(apiKey, prompt) {
    const openai = new OpenAI(apiKey)
    const gptResponse = await openai.complete({
        engine: 'text-davinci-003',
        prompt,
        maxTokens: 10,
        temperature: 0.9,
        // topP: 1,
        // presencePenalty: 0,
        // frequencyPenalty: 0,
        bestOf: 1,
        // n: 1,
        stream: false,
        // stop: ['\n', "testing"]
    });

    console.log(gptResponse.data);
    return gptResponse.data
}
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function main() {
    await callOpenAI(OPENAI_API_KEY, "how many months are in a year?")
}
main()