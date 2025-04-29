const { command, qrcode, isUrl, isPrivate, findMusic } = require("../lib/");
const jimp = require("jimp");
const QRReader = require("qrcode-reader");
let { unlink } = require("fs/promises");
const got = require("got");
const FormData = require("form-data");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const fs = require("fs");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

command(
  {
    pattern: "qr",
    fromMe: isPrivate,
    desc: "Read/Write Qr.",
    type: "converter",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(
        "*Example : qr test*\n*Reply to a qr image.*"
      );

    const { bitmap } = await jimp.read(
      await message.reply_message.downloadMediaMessage()
    );
    const qr = new QRReader();
    qr.cvideosback = (err, value) =>
      message.sendMessage(err ?? value.result, { quoted: message.data });
    qr.decode(bitmap);
  }
);
