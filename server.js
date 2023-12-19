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

app.get("/download", ({ query: { id, name } }, res) => {
  try {
    res.writeHead(200, {
      "Content-Disposition": contentDisposition(`${name}.mp4`),
    });

    ytdl(id, { format: "mp4" }).pipe(res);
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});
