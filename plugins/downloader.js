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


//spotify 
command({
  pattern: "spotify ?(.*)",
  fromMe: isPrivate,
  desc: "Download Spotify track by URL or search query",
  type: "downloader",
}, async (message, match) => {
  const input = match?.trim();

  if (!input) {
    await react(message, "❌");
    return await message.reply("❌ *Please provide a song name or Spotify track URL.*");
  }

  await react(message, "🔍");

  try {
    let trackUrl = input;

    // If not a URL, treat as search query
    if (!input.includes("spotify.com/track/")) {
      const searchRes = await axios.get(`https://oggy-api.vercel.app/spotify?search=${encodeURIComponent(input)}`);
      const tracks = searchRes.data?.data;

      if (!tracks || tracks.length === 0) {
        await react(message, "❌");
        return await message.reply("❌ No matching Spotify songs found.");
      }

      trackUrl = tracks[0].link; // Take the first result
    }

    // Download the track
    const downloadRes = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(trackUrl)}`);
    const song = downloadRes.data?.data;

    if (!downloadRes.data.status || !song?.download) {
      await react(message, "❌");
      return await message.reply("❌ Could not download the track. Try another one.");
    }

    await react(message, "⬇️");

    await message.sendFromUrl(song.download, {
      mimetype: "audio/mpeg",
      fileName: `${song.title}.mp3`,
      quoted: message,
      caption: `🎶 *${song.title}*\n👤 ${song.artis}`
    });

    await react(message, "✅");

  } catch (err) {
    console.error("Spotify command error:", err.message);
    await react(message, "❌");
    await message.reply("❌ Failed to process your request.");
  }
});
