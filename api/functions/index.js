const functions = require("firebase-functions");
const OpenAI = require('openai-api')

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json()); // add this line to parse the request body as JSON
app.use(cors({ origin: true }))

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


app.get('/', (req, res) => {
    res.send('hello from express cloud functions')
})
app.post('/', async (req, res) => {
    const { message, api } = req.body;
    try {
        gptResponse = await callOpenAI(api, message);
        res.send({ reply: gptResponse });
    } catch (error) {
        // console.error(error);
        console.log("error occured with data:", req.body);
        res.status(500).send('Error processing message and API');
    }
});
exports.expressApi = functions.https.onRequest(app);

// module.exports = app;
