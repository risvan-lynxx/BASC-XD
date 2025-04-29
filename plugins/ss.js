const { command, isPrivate } = require("../lib/");
const X = require("../config");
command(
  {
    pattern: "fullss ?(.*)",
    fromMe: isPrivate,
    desc: "Capture full mobile view screenshot of a website",
    type: "downloader",
  },
  async (message, match) => {
    const input = match || message.reply_message?.text;

    if (!input) {
      await react(message, "");
      return await message.reply(
        "* Please provide a valid URL.*\n_E.g: .fullss https://example.com_"
      );
    }

    await react(message, "♻️");

    try {
      const url = await getUrl(input);
      const ssUrl = `https://oggy-api.vercel.app/fullss?url=${encodeURIComponent(url)}&type=phone&full=true`;
      await message.sendFromUrl(ssUrl, { quoted: message });
      await react(message, "✅");
    } catch (error) {
      await react(message, "");
      await message.reply(" *Failed to capture mobile screenshot. Try again later.*");
    }
  }
);

// DESKTOP SCREENSHOT
command(
  {
    pattern: "ss ?(.*)",
    fromMe: isPrivate,
    desc: "Capture desktop view screenshot of a website",
    type: "downloader",
  },
  async (message, match) => {
    const input = match || message.reply_message?.text;

    if (!input) {
      await react(message, "");
      return await message.reply(
        "* Please provide a valid URL.*\n_E.g: .ss https://example.com_"
      );
    }

    await react(message, "♻️");

    try {
      const url = await getUrl(input);
      const ssUrl = `https://oggy-api.vercel.app/ss?url=${encodeURIComponent(url)}&type=desktop`;
      await message.sendFromUrl(ssUrl, { quoted: message });
      await react(message, "✅");
    } catch (error) {
      await react(message, "");
      await message.reply(" *Failed to capture desktop screenshot. Try again later.*");
    }
  }
);
