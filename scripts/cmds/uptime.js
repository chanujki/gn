const { GoatWrapper } = require("fca-liane-utils");
const os = require("os");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const startTime = new Date();

module.exports = {
  config: {
    name: "upt",
    author: "RAKIB MAMUDA",
    countDown: 0,
    role: 0,
    usePrefix: false,
    category: "system",
    longDescription: {
      en: "Get System Information",
    },
  },

  onStart: async function ({ api, event, message }) {
    try {
      const frames = [
        "🔄 𝗜𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘇𝗶𝗻𝗴...\n[░░░░░░░░░░]",
        "🔄 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗦𝘁𝗮𝘁𝘀...\n[███░░░░░░░]",
        "🔧 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗜𝗻𝗳𝗼...\n[██████░░░░]",
        "✅ 𝗗𝗼𝗻𝗲!\n[██████████]",
      ];

      const sent = await message.reply("⚙️ Gathering system info...");

      let step = 0;
      const animate = async () => {
        if (step < frames.length) {
          await api.editMessage(frames[step], sent.messageID);
          step++;
          return setTimeout(animate, 600);
        } else {
          const uptimeInSeconds = (new Date() - startTime) / 1000;
          const days = Math.floor(uptimeInSeconds / (3600 * 24));
          const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
          const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
          const secondsLeft = Math.floor(uptimeInSeconds % 60);
          const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;

          const cpuUsage =
            os
              .cpus()
              .map((cpu) => cpu.times.user)
              .reduce((acc, curr) => acc + curr, 0) / os.cpus().length;

          const totalMemoryGB = os.totalmem() / 1024 ** 3;
          const freeMemoryGB = os.freemem() / 1024 ** 3;
          const usedMemoryGB = totalMemoryGB - freeMemoryGB;

          const currentDate = new Date();
          const date = currentDate.toLocaleDateString("en-US");
          const time = currentDate.toLocaleTimeString("en-US", {
            timeZone: "Asia/Dhaka",
            hour12: true,
          });

          const timeStart = Date.now();
          await new Promise((res) => setTimeout(res, 100));
          const ping = Date.now() - timeStart;
          const pingStatus = ping < 1000 ? "✅| 𝖲𝗆𝗈𝗈𝗍𝗁 𝖲𝗒𝗌𝗍𝖾𝗆" : "⛔| 𝖡𝖺𝖽 𝖲𝗒𝗌𝗍𝖾𝗆";

          const systemInfo = `♡   ∩_∩
（„• ֊ •„)♡
╭─∪∪────────────⟡
│ 𝗨𝗣𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢
├───────────────⟡
│ ⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘
│  ${uptimeFormatted}
├───────────────⟡
│ 👑 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
│𝙾𝚂: ${os.type()} ${os.arch()}
│𝙻𝙰𝙽𝙶 𝚅𝙴𝚁: ${process.version}
│𝙲𝙿𝚄 𝙼𝙾𝙳𝙴𝙻: ${os.cpus()[0].model}
│𝚂𝚃𝙾𝚁𝙰𝙶𝙴: ${usedMemoryGB.toFixed(2)} GB / ${totalMemoryGB.toFixed(2)} GB
│𝙲𝙿𝚄 𝚄𝚂𝙰𝙶𝙴: ${cpuUsage.toFixed(1)}%
│𝚁𝙰𝙼 𝚄𝚂𝙶𝙴: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
├───────────────⟡
│ ✅ 𝗢𝗧𝗛𝗘𝗥 𝗜𝗡𝗙𝗢
│𝙳𝙰𝚃𝙴: ${date}
│𝚃𝙸𝙼𝙴: ${time}
│𝙿𝙸𝙽𝙶: ${ping}ms
│𝚂𝚃𝙰𝚃𝚄𝚂: ${pingStatus}
╰───────────────⟡`;

          const imageUrl = "https://files.catbox.moe/s4zazi.gif";
          const imagePath = path.join(__dirname, "upt_image.jpg");

          const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

          const attachment = fs.createReadStream(imagePath);
          await api.sendMessage({ body: systemInfo, attachment }, event.threadID, () => {
            fs.unlinkSync(imagePath); // cleanup
          }, sent.messageID);
        }
      };

      animate();
    } catch (err) {
      console.error("Error in upt command:", err);
      message.reply("❌ Error Upt info");
    }
  },
};
const wrapper = new GoatWrapper(module.exports); wrapper.applyNoPrefix({ allowPrefix: true });
