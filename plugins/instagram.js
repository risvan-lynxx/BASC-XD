const { command, isPrivate } = require("../lib");
const fetch = require("node-fetch");

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
