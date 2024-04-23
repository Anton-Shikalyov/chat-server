const { Sequelize} = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database',
});

const Message = sequelize.define('Message', {
  ID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  USER_NAME: {
    type: Sequelize.STRING,
    allowNull: false
  },
  EMAIL:{
    type: Sequelize.STRING,
    allowNull: false
  },
  HOME_PAGE:{
    type: Sequelize.STRING,
    allowNull: false
  },
  MESSAGE:{
    type: Sequelize.STRING,
    allowNull: false
  },
  MEDIA:{
    type: Sequelize.STRING,
    allowNull: false
  },
  ID_MESSAGE_KEY:{
    type: Sequelize.INTEGER,
    allowNull: true
  },
  ID_IN_COMMENTS: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  COMMENTS:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
});


sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

async function createMessage(USER_NAME, EMAIL, HOME_PAGE, MESSAGE, MEDIA, ID_MESSAGE_KEY, ID_IN_COMMENTS) {
  try {
    await Message.create({
      USER_NAME: USER_NAME,
      EMAIL: EMAIL,
      HOME_PAGE: HOME_PAGE,
      MESSAGE: MESSAGE,
      MEDIA: MEDIA,
      ID_MESSAGE_KEY: ID_MESSAGE_KEY,
      ID_IN_COMMENTS: ID_IN_COMMENTS,
      COMMENTS: 0
    });
    console.log('Message created successfully.');
  } catch (error) {
    console.error('Error creating message:', error);
  }
}

async function updateMessage(ID) {
  try {
    const message = await Message.findByPk(ID);
    console.log("ID:" + ID);
    if (!message) { 
      return;
    }
    await Message.update(
      { COMMENTS: message.COMMENTS + 1 }, 
      { where: { ID: ID } }
    );
    console.log('Message updated successfully.');
    return message.COMMENTS + 1;
  } catch (error) {
    console.error('Error updating message:', error);
  }
}

async function findOneMessage(ID) {
  try {
    const message = await Message.findByPk(ID);
    console.log("ID:" + ID);
    if (!message) { 
      return;
    }
    console.log('Message found successfully.');
    console.log(message);
    return message;
  } catch (error) {
    console.error('Error updating message:', error);
  }
}

async function findCommentsForMessage(ID) {
  try {
    const messages = await Message.findAll({ where: { ID_MESSAGE_KEY: ID }, raw: true });
    return messages;
  } catch (error) {
    console.error('Error finding comments:', error);
    throw error; // Вы можете бросить ошибку или вернуть null, в зависимости от ваших потребностей
  }
}


async function readMessages() {
  try {
    const messages = await Message.findAll({ raw: true });
    console.log(messages);
    return messages;
  } catch (error) {
    console.error('Error reading messages:', error);
    throw error;
  }
}



module.exports = {
  createMessage: createMessage,
  readMessages: readMessages,
  updateMessage: updateMessage,
  findOneMessage: findOneMessage,
  findCommentsForMessage: findCommentsForMessage
};
