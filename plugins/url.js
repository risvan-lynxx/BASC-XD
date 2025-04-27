const { command, isPrivate } = require("../lib");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

command(
  {
    pattern: "url",
    fromMe: isPrivate,
    desc: "Uploads image/video/audio and returns URL",
    type: "misc",
  },
  async (message, match, m, client) => {
    if (!m.quoted) {
      return await message.sendMessage("**Reply to an image, video, or audio!**");
    }

    console.log("Quoted Message:", m.quoted);

    try {
      let filePath;
      let fileType;

      if (m.quoted.message.imageMessage) {
        filePath = "./dldImg.jpg";
        fileType = "image/jpeg";
      } else if (m.quoted.message.videoMessage) {
        filePath = "./dldVideo.mp4";
        fileType = "video/mp4";
      } else if (m.quoted.message.audioMessage) {
        if (m.quoted.duration > 90) {
          return await message.sendMessage("**Audio too large. Try below 90 seconds!**");
        }
        filePath = "./audio.mp3";
        fileType = "audio/mp3";
      } else {
        return await message.sendMessage("**Unsupported file type!**");
      }

      // Download the file
      fs.writeFileSync(filePath, await m.quoted.download());

      // Upload to Catbox
      let formData = new FormData();
      formData.append("reqtype", "fileupload");
      formData.append("fileToUpload", fs.createReadStream(filePath), {
        filename: filePath.split("/").pop(),
        contentType: fileType,
      });

      let res = await axios.post("https://catbox.moe/user/api.php", formData, {
        headers: formData.getHeaders(),
      });

      let uploadedUrl = res.data.trim();

      if (!uploadedUrl) {
        return await message.sendMessage("**Failed to upload file!**");
      }

      // Send the uploaded URL as text with quoted message
      await client.sendMessage(
        message.jid,
        { text: uploadedUrl },
        { quoted: message }
      );
    } catch (err) {
      console.error("Error:", err);
      return await message.sendMessage("**An error occurred!**");
    }
  }
);
