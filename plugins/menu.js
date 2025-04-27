const { tiny } = require("../lib/fancy_font/fancy");
const Jimp = require("jimp");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");
const plugins = require("../lib/event");
const {
    command,
    isPrivate,
    clockString,
    getUrl,
    parsedJid,
    isAdmin
    
} = require("../lib");
const {
    BOT_INFO
} = require("../config");
const config = require("../config");
command(
  {
    pattern: "menu",
    fromMe: isPrivate,
    desc: "Show All Commands",
    dontAddCommandList: true,
    type: "user",
  },
  async (message, match, m, client) => {
try{
    if (match) {
      for (let i of plugins.commands) {
        if (
          i.pattern instanceof RegExp &&
          i.pattern.test(message.prefix + match)
        ) {
          const cmdName = i.pattern.toString().split(/\W+/)[1];
let usern = message.pushName;
          message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
Description: ${i.desc}\`\`\``);
        }
      }
    } else {
      let { prefix } = message;
      let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",");

      let menu = `\n╭━━━〔 ${BOT_INFO.split(";")[0]} 〕━━━┈
    ╭──────────────
  〄 │  *OWNER*:  ${BOT_INFO.split(";")[1]}
  〄 │  *USER*: ${message.pushName}
  〄 │  *DATE*: ${date}
  〄 │  *TIME*: ${time}
  〄 │  *COMMANDS*: ${plugins.commands.length}
  〄 │  *MODE*: ${config.WORK_TYPE}
  〄 │  *VERSION*: ${require("../package.json").version}
    ╰──────────────
╰━━━━━━━━━━━━━━━\n`

menu +=`╭───────────┈⊷\n`;

      let cmnd = [];
      let cmd;
      let category = [];
      plugins.commands.map((command, num) => {
        if (command.pattern instanceof RegExp) {
          cmd = command.pattern.toString().split(/\W+/)[1];
        }

        if (!command.dontAddCommandList  && cmd !== undefined) {
          let type = command.type ? command.type.toLowerCase() : "misc";

          cmnd.push({ cmd, type });

          if (!category.includes(type)) category.push(type);
        }
      });
      cmnd.sort();
      category.sort().forEach((cmmd) => {
        menu += `│  ╭─────────────┈⊷`;
        menu += `\n│  │ 「 *${cmmd.toUpperCase()}* 」`;
        menu += `\n│  ╰┬────────────┈⊷`
menu += `\n   ╭┴────────────┈⊷`;
        let comad = cmnd.filter(({ type }) => type == cmmd);
        comad.forEach(({ cmd }) => {
          menu += `\n│   ||•➛   ${cmd.trim()}`;
        });
        menu += `\n│  ╰─────────────┈⊷`;
        menu += `\n`;
      });
      menu += `╰─────────────┈⊷`;

      let penu = tiny(menu)
      let img = config.BOT_INFO.split(';')[2]
      return await message.sendFromUrl(img, {fileLength: "5555544444", gifPlayback: true, caption: (penu)}, {quoted: message })
    }
}catch(e){
message.reply(e)
}
  }
);
