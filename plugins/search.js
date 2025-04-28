const { getJson, getBuffer, command, isPrivate, sleep } = require("../lib/");
command({
  pattern: "ssearch?(.*)",
  fromMe: isPrivate,
  desc: "Search and play a song from Spotify",
  type: "downloader",
}, async (message, match) => {
  const input = match?.trim();
  const userId = message.sender;

  if (!input) {
    await react(message, "❌");
    return await message.reply("❌ *Please enter a song name or index to play.*", { quoted: message });
  }

  if (!isNaN(input)) {
    const index = parseInt(input) - 1;
    const tracks = searchCache[userId];

    if (!tracks || !tracks[index]) {
      await react(message, "❌");
      return await message.reply("❌ No previous search results found or invalid index.", { quoted: message });
    }

    const track = tracks[index];

    try {
      await react(message, "⬇️");
      await message.reply(`⬇️ Downloading *${track.name}* by *${track.artists}*...`, { quoted: message });

      let song = track.downloadData;
      if (!song) {
        const res = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(track.link)}`);
        const data = res.data;

        if (!data || data.status !== true || !data.data?.download) {
          await react(message, "❌");
          return await message.reply("❌ Could not download this track. Try another one.", { quoted: message });
        }

        song = data.data;
        track.downloadData = song;
      }

      await message.sendFromUrl(song.download, {
        mimetype: "audio/mpeg",
        fileName: `${song.title}.mp3`,
        quoted: message,
        caption: `🎶 *${song.title}*\n👤 ${song.artists}`
      });

      await react(message, "✅");

    } catch (err) {
      console.error("Download error:", err.message);
      await react(message, "❌");
      await message.reply("❌ Error downloading the track.", { quoted: message });
    }

  } else {
    try {
      // React with searching emoji
      await react(message, "🔍");

      const res = await axios.get(`https://oggy-api.vercel.app/spotify?search=${encodeURIComponent(input)}`);
      const allTracks = res.data.data || [];
      const filteredTracks = allTracks.filter(t => [1, 2, 5].includes(t.index));

      if (filteredTracks.length === 0) {
        await react(message, "❌");
        return await message.reply("❌ No matching indexed Spotify tracks found.", { quoted: message });
      }

      // Fetch all download links in parallel
      const results = await Promise.all(filteredTracks.map(async track => {
        try {
          const dlRes = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(track.link)}`);
          const dlData = dlRes.data;
          return {
            ...track,
            downloadData: dlData.status === true ? dlData.data : null
          };
        } catch {
          return { ...track, downloadData: null };
        }
      }));

      // Cache the results for the user
      searchCache[userId] = results;

      let msg = `🎧 *Spotify Results (Index 1, 2 & 5) for:* ${input}\n\n`;
      results.forEach((track, i) => {
        msg += `*${i + 1}. ${track.name}*\n`;
        msg += ` ${track.artists}\n`;
        msg += ` ${track.link}\n`;
        msg += track.downloadData
          ? ` _Use_ \`.song ${i + 1}\` _to download this track._\n\n`
          : ` _This track cannot be downloaded._\n\n`;
      });

      // Remove the searching emoji and send the results
      await react(message, "✅");
      await message.reply(msg, { quoted: message });

    } catch (err) {
      console.error("Search error:", err.message);
      await react(message, "❌");
      await message.reply("❌ Error fetching results from Spotify.", { quoted: message });
    }
  }
});
