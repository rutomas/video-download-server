import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import contentDisposition from "content-disposition";

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

app.get("/info", async ({ query: { id } }, res) => {
  try {
    const info = await ytdl.getInfo(id);

    res.json(info);
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});

app.get("/info-with-quality", async ({ query: { id } }, res) => {
  try {
    const info = await ytdl.getInfo(id);

    const listOfVideoQuality = info.formats.filter(
      (item) => item.hasAudio && item.hasVideo
    );

    const listOfAudioQuality = info.formats
      .filter((item) => item.hasAudio && !item.hasVideo)
      .map((item) => ({
        ...item,
        qualityLabel: item.audioBitrate,
      }));

    res.json({ ...info, listOfVideoQuality, listOfAudioQuality });
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});

app.get("/download", ({ query: { id, name } }, res) => {
  try {
    res.writeHead(200, {
      "Content-Disposition": contentDisposition(`${name}.mp4`),
    });

    ytdl(id, {
      format: "mp4",
    }).pipe(res);
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});

app.get(
  "/download-with-quality",
  async ({ query: { id, name, itag, qualityLabel, container }, res }) => {
    try {
      res.writeHead(200, {
        "Content-Disposition": contentDisposition(
          `${name}_${qualityLabel}.${container}`
        ),
      });

      ytdl(id, {
        filter: (format) => (format.itag = itag),
      }).pipe(res);
    } catch (error) {
      console.error(error);

      res.json({ error });
    }
  }
);
