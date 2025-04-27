const { command } = require('../lib');

command({
  pattern: 'shutdown',
  fromMe: true,
  desc: 'Shutdown the bot',
  type: 'system',
}, async (message) => {
  await message.reply('🛑 Shutting down bristo..!!!!');
  process.exit(0); // exit with success code (won't trigger auto-restart)
});
