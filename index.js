const express = require("express");
const { createMessage, 
        readMessages, 
        updateMessage,
        findOneMessage,
        findCommentsForMessage } = require('./dataBase');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

app.post("/", (request, response) => {
    console.log('Received request:', request.body);
    const base64Image = Buffer.from(request.body.MEDIA).toString('base64');
    createMessage(request.body.USER_NAME,
                     request.body.EMAIL,
                     request.body.HOME_PAGE,
                     request.body.MESSAGE,
                     base64Image,
                     request.body.ID_MESSAGE_KEY,
                     request.body.ID_IN_COMMENTS,
                     request.body.COMMENTS);
    response.send("<h2>Привет Express!</h2>");
});

app.post("/message/:messageID",async (request, response) => {
  console.log('Received request:', request.body);
  const base64Image = Buffer.from(request.body.MEDIA).toString('base64');
  try {
    // console.log(request.params["messageID"]);
    // updateMessage(request.params["messageID"])
    await createMessage(
      request.body.USER_NAME,
      request.body.EMAIL,
      request.body.HOME_PAGE,
      request.body.MESSAGE,
      base64Image,
      request.params["messageID"],
      await updateMessage(request.params["messageID"]),
      request.body.ID_IN_COMMENTS
    );
  
    response.send("<h2>Привет Express!</h2>");
  } catch (error) {
    console.error('Error creating message:', error);
    response.status(500).send('Internal server error');
  }
});

app.get("/page/:pageID", async (request, response) => {
  console.log('Received request:', request.body);
  try {
    let i = (request.params["pageID"] >= 2 ? request.params["pageID"] * 25 - 25 : 0);
    let messages = [];
    let message;
    do {
      i++;
      console.log("Fetching message for index:", i);
      message = await findOneMessage(i);
      console.log("Received message:", message);
      if (message) {
        messages.push(message);
      }
    } while (i != request.params["pageID"] * 25 && message != undefined);

    response.send(messages);
  } catch (error) {
    console.error('Error creating message:', error);
    response.status(500).send('Internal server error');
  }
});


app.get("/", async (request, response) => {
  try {
    const messages = await findCommentsForMessage(1);
    response.send(messages); 
  } catch (error) {
    console.error('Error handling request:', error);
    response.status(500).send('Internal server error'); 
  }
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
