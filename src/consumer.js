const amqp = require('amqplib');
const Listener = require('./Listener');
const MailSender = require('./MailSender');
const PlaylistService = require('./PlaylistService');

require('dotenv').config();

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:songsInPlaylist', {
    durable: true,
  });

  channel.consume('export:songsInPlaylist', listener.listen, { noAck: true });
};

init();
