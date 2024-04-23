const express = require("express");
const cors = require('cors');
const dataBase = require('./dataBase');
const app = express();

app.use(cors());
app.use(express.json()); 

app.post("/", (request, response) => {
    const base64Image = Buffer.from(request.body.MEDIA).toString('base64');
    dataBase.createMessage(request.body.USER_NAME,
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
  const base64Image = Buffer.from(request.body.MEDIA).toString('base64');
  try {
    await dataBase.createMessage(
      request.body.USER_NAME,
      request.body.EMAIL,
      request.body.HOME_PAGE,
      request.body.MESSAGE,
      base64Image,
      request.params["messageID"],
      await dataBase.updateMessage(request.params["messageID"]),
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
      message = await dataBase.findOneMessage(i);
      if (message) {
        messages.push(message);
        const comments = await dataBase.findCommentsForMessage(i);
        if (comments != null) {
          messages.push(comments); 
        }
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
    const messages = await dataBase.findCommentsForMessage(1);
    response.send(messages); 
  } catch (error) {
    console.error('Error handling request:', error);
    response.status(500).send('Internal server error'); 
  }
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
