const PORT = process.env.PORT || 8000;

const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express()

const corsOptions = {
   origin: 'https://gemini-genie.vercel.app',
   methods: 'POST',
};

app.use(cors(corsOptions))

app.use(express.json())

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
   const model = genAI.getGenerativeModel({ model: "gemini-pro" })
   const chat = model.startChat({
      history: req.body.history
   })
   const msg = req.body.message;

   const result = await chat.sendMessage(msg);
   const response = await result.response;
   const text = response.text();
   res.send(text)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))