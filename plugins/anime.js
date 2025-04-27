const { command, isPrivate, getJson } = require("../lib");
const config = require("../config");
command(
  {
  pattern: "waifu",
  fromMe: isPrivate,
  desc: "Random anime images",
  type: "Anime",
}, async (message, match) => {
  var { url } = await getJson('https://api.waifu.pics/sfw/waifu');
  await message.sendFromUrl(url,{caption: `${config.CAPTION}`});
});
command(
  {
  pattern: "neko",
  fromMe: isPrivate,
  desc: "Random anime images",
  type: "Anime",
}, async (message, match) => {
  var { url } = await getJson('https://api.waifu.pics/sfw/neko');
  await message.sendFromUrl(url,{caption: `${config.CAPTION}`});
});
command(
  {
  pattern: "loli",
  fromMe: isPrivate,
  desc: "Random anime images",
  type: "Anime",
}, async (message, match) => {
  var { url } = await getJson('https://api.waifu.pics/sfw/neko');
  await message.sendFromUrl(url,{caption: `${config.CAPTION}`});
});
