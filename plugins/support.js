const { getJson, getBuffer, command, isPrivate, sleep } = require("../lib/");

command({
    pattern: "help",
    fromMe: isPrivate,
    desc: "Support",
    type: "support"
}, async (message) => {
    const name = '𝙶𝙾𝙳 𝙻𝚈𝙽𝚇', title = "𝐁𝐑𝐈𝐒𝐓𝐎 𝐒𝐔𝐏𝐏𝐎𝐑𝐓🦋", number = '918138898059', body = "𝙶𝙾𝙳 𝙻𝚈𝙽𝚇⛒";
    const image = "https://files.catbox.moe/yvt6ld.png", sourceUrl = 'https://instagram.com/lynxiiii';
    const logo = await getBuffer(image);
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG: 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐍𝐞𝐳𝐮𝐤𝐨⛭;\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`;
    const adon = { title, body, thumbnail: logo, mediaType: 1, mediaUrl: sourceUrl, sourceUrl, showAdAttribution: true, renderLargerThumbnail: false };
    await message.client.sendMessage(message.jid, { contacts: { displayName: name, contacts: [{ vcard }] }, contextInfo: { externalAdReply: adon } }, { quoted: message });
});
