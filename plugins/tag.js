const { command, isPrivate, isAdmin, sleep, parsedJid } = require("../lib/");
const config = require("../config");
command(
      {
    pattern: "hidetag ?(.*)",
    fromMe: false,
    onlyGroup: true,
    desc: "send given text with mention",
    type: "group",
},
async (message, match) => {
    if (!(await checkPermissions(message))) return;
    if (!match) {
        return await message.reply("_Eg .hidetag Hello_")
    };
    var group = await message.client.groupMetadata(message.jid);
    var jids = [];
    group.participants.map(user => {
        jids.push(user.id.replace('c.us', 's.whatsapp.net'));
    });
    await message.send(match, {
        mentions: jids
    });
});
