import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import contentDisposition from "content-disposition";

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

app.get("/download", (req, res) => {
  try {
    const id = req.query.id;
    const name = req.query.name;

    res.writeHead(200, {
      "Content-Disposition": contentDisposition(`${name}.mp4`),
    });

    ytdl(id, {
      format: "mp4",
    }).pipe(res);
  } catch (error) {
    console.error(error);

    res.json({
      error,
    });
  }
});

app.get("/info", (req, res) => {
  try {
    const id = req.query.id;

    ytdl.getBasicInfo(id).then((info) => {
      res.json(info);
    });
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});
