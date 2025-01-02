const TelegramApi = require('node-telegram-bot-api');
const token = '7653159684:AAH-JKD_rmuePxjmW0rKIJU_C7paQXtwlHs';
const bot = new TelegramApi(token, {polling: true});

const { gameOptions, againGameOptions } = require('./options.js');

const chats = {};
bot.setMyCommands([
  {command: '/start', description: 'Начало работы'},
  {command: '/info', description: 'Информация'},
  {command: '/game', description: 'Игра'}
]);


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Отгадай число от 0 до 9`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  console.log('id', chats[chatId]);
  await bot.sendMessage(chatId, `Отгадайте число`, gameOptions);
}

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') { 
      return bot.sendMessage(chatId, `Добро пожаловать в ZeroKayskasTools_bot!, ${msg.from.first_name}`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}! Я бот ZeroKayskasTools_bot!`);
    }
    if (text === '/game') {
      console.log(chatId);
      startGame(chatId);
    }
    bot.sendMessage(chatId, `Новое сообщение: ${text}`);
  });

  game();
};

const game = () => {
  bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    const userChoice = String(data);
    const correctNumber = String(chats[chatId]);
    if (userChoice === correctNumber) {
      return bot.sendMessage(chatId, `Поздравляю, вы угадали!`, againGameOptions);
    } else {
      return bot.sendMessage(chatId, `К сожалению, вы не угадали. Попробуйте еще раз!`, againGameOptions);
    }
  });
};

start();