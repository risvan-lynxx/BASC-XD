const { command, isPrivate } = require("../lib");
const axios = require("axios");

// Custom react function
const react = async (msg, emoji) => {
  if (typeof msg.react === "function") {
    await msg.react(emoji);
  } else if (typeof msg.sendReaction === "function") {
    await msg.sendReaction(emoji); // for some custom bot frameworks
  } else {
    try {
      await msg.client.sendMessage(msg.chat || msg.jid, {
        react: { text: emoji, key: msg.key }
      });
    } catch (e) {
      console.error("Failed to send reaction:", e.message);
    }
  }
};

// Function to validate Instagram URLs
const isValidInstaUrl = (url) => {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_\-]+/.test(url);
};

// Instagram media downloader
command(
    {
        pattern: "insta",
        fromMe: isPrivate,
        desc: "Download Instagram videos",
        type: "downloader",
    },
    async (message, match) => {
        if (!match) {
            return await message.reply("*_Please provide an Instagram video link_*");
        }

        try {
            const api = `https://viper.devstackx.in/api/v1/insta?query=${encodeURIComponent(match)}`;
            const response = await fetch(api);
            if (!response.ok) throw new Error("API request failed");

            const result = await response.json();
            if (!result.status || !result.data || !result.data.length) {
                return await message.reply("*_Failed to fetch the video. Please try another link_*");
            }

            const videoData = result.data.find(item => item.type === "video");
            if (!videoData) {
                return await message.reply("*_No video found in the provided link_*");
            }

            const { url: dl, thumbnail } = videoData;
            await message.reply(`*_Downloading..._*`);
            await message.client.sendMessage(
                message.jid,
                {
                    video: { url: dl },
                    caption: "Here is your Instagram video",
                    mimetype: "video/mp4",
                    thumbnail: await (await fetch(thumbnail)).buffer(),
                },
                { quoted: message.data }
            );
        } catch (error) {
            console.error("Error:", error);
            await message.reply("*_An error occurred while processing your request. Try again later_*");
        }
    }
);


// MAIN COMMANDS
// XNXX Command
command({
    pattern: "xnxx",
    fromMe: isPrivate,
    desc: "Download media from XNXX by search or URL",
    type: "downloader",
}, async (m, text, client) => {
    try {
        const query = text || m.quoted?.text;
        if (!query) {
            await react(m, "💀");
            return await m.reply("Please enter a search term or URL.");
        }

        await react(m, "🔎");

        const searchRes = await getJson(`https://api-aswin-sparky.koyeb.app/api/search/xnxx?search=${encodeURIComponent(query)}`);
        const firstResult = searchRes?.result?.result?.[0];
        if (!firstResult?.link) return await m.reply("No results found.");

        await react(m, "⬇️");

        const videoData = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${firstResult.link}`);
        const videoUrl = videoData?.data?.files?.high;
        const title = videoData?.data?.title;

        if (!videoUrl) return await m.reply("Failed to get download link.");

        await m.sendFromUrl(videoUrl, { caption: title || "Downloaded from XNXX" });
        await react(m, "✅");
    } catch (err) {
        console.error("XNXX Error:", err);
        await react(m, "❌");
        await m.reply("Failed to download the video.");
    }
});

// Pinterest Command
command({
    pattern: "pintrest",
    fromMe: isPrivate,
    desc: "Download images and content from Pinterest",
    type: "downloader",
}, async (m, text, client) => {
    try {
        const url = text || m.quoted?.text;
        if (!url) {
            await react(m, "❌");
            return await m.reply("Please provide a Pinterest URL.");
        }

        await react(m, "⬇️");

        const result = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/pin?url=${url}`);
        await m.sendFromUrl(result.data.url, { caption: result.data.created_at });

        await react(m, "✅");
    } catch (err) {
        console.error("Pinterest Error:", err);
        await react(m, "❌");
        await m.reply("Failed to download content from Pinterest.");
    }
});

// Facebook Command
command({
    pattern: "fb",
    fromMe: isPrivate,
    desc: "Download videos from Facebook by URL",
    type: "downloader",
}, async (m, text, client) => {
    try {
        const url = text || m.quoted?.text;
        if (!url) {
            await react(m, "❌");
            return await m.reply("Please provide a Facebook video URL.");
        }

        await react(m, "⬇️");

        const data = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${url}`);
        await m.sendFromUrl(data.data.high, { caption: data.data.title });

        await react(m, "✅");
    } catch (err) {
        console.error("Facebook Error:", err);
        await react(m, "❌");
        await m.reply("Failed to download the Facebook video.");
    }
});
