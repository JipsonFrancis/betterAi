/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express"
import axios from "axios"
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())

const { VERIFY_TOKEN, API_TOKEN, PORT } = process.env

console.log(`VERIFY_TOKEN :${VERIFY_TOKEN}`)
console.log(`API_TOKEN :${API_TOKEN}`)
console.log(`PORT :${PORT}`)

app.post("/webhook", async (req, res) => {
  try {
    // log incoming messages
    //console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2))

    // check if the webhook request contains a message
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0]

    // check if the incoming message contains text
    if (message?.type === "text") {
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id
      
        // sending to the brain to get a response first

        console.log(`user message before brain: ${message.text.body}`)

        let data = JSON.stringify(message.text.body);

        console.log(`data varable is : ${data} is before sending.`)
      
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:5000/api/v1/prompt?=',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios.request(config)
        .then(async (response) => {
          //message.text.body = response.data
          //console.log(`respoonse from brain inside its api :${JSON.stringify(response.data)}`);
          await axios({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
            data: {
              messaging_product: "whatsapp",
              to: message.from,
              text: { body: "Echo: " + response.data },
              context: {
                message_id: message.id,
              },
            },
          })

        })
        .catch((error) => {
          console.log(error);
        });

        console.log(`user message response from brain: ${message.text.body}`)
        
        
        // send a reply message the person who just texted the bot
      // await axios({
      //   method: "POST",
      //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      //   headers: {
      //     Authorization: `Bearer ${API_TOKEN}`,
      //   },
      //   data: {
      //     messaging_product: "whatsapp",
      //     to: message.from,
      //     text: { body: "Echo: " + message.text.body },
      //     context: {
      //       message_id: message.id,
      //     },
      //   },
      // })

      // mark incoming message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      })

    }

    console.log(`ganster`)

    res.sendStatus(200)
  } catch (error) {
    console.error("Error processing webhook request:", error.message)
    res.sendStatus(500)
  }
})

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge)
    console.log("Webhook verified successfully!")
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403)
  }
})

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`)
})

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})