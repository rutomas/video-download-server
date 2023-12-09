const express = require("express");

const cors = require("cors");

const ytdl = require("ytdl-core");

const app = express();

app.use(cors());

app.listen(4000, () => {
  console.log("Server Works !!! At port 4000");
});

app.get("/download", (req, res) => {
  try {
    const URL = req.query.URL;
    const name = req.query.name;

    res.header("Content-Disposition", `attachment; filename="${name}.mp4"`);

    ytdl(URL, {
      format: "mp4",
    }).pipe(res);
  } catch (error) {
    console.error(error);
  }
});

app.get("/info", (req, res) => {
  try {
    const URL = req.query.URL;

    ytdl.getBasicInfo(URL).then((info) => {
      res.json(info);
    });
  } catch (error) {
    console.error(error);
  }
});
