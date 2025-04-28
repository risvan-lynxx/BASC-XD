const { command, isPrivate } = require("../lib");
command(
  {
    pattern: "onwa ?(.*)",
    fromMe: true,
    desc: "To check if a given ID is on WhatsApp.",
    type: "whatsapp",
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match) return await message.reply("_Need Number!_")
    match = match.replace(/[^0-9]/g, "")
    if (!match) return await message.reply("_Need Number!_")
    const [result] = await message.client.onWhatsApp(match)
    if (!result) await message.reply(match + " doest exists on WhatsApp")
    if (result && result.exists) return await message.reply("*" + match + " exists on WhatsApp*,\njid: " + result.jid)
  );
  }
);*/
