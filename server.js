const express = require("express");

const cors = require("cors");

const ytdl = require("ytdl-core");

const contentDisposition = require("content-disposition");

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

const cs = "YSC=hS9DrUTadOA";

app.get("/download", (req, res) => {
  try {
    const URL = req.query.URL;
    const name = req.query.name;

    res.writeHead(200, {
      "Content-Disposition": contentDisposition(`${name}.mp4`),
    });

    ytdl(URL, {
      format: "mp4",
      requestOptions: {
        cookie: cs,
      },
    }).pipe(res);
  } catch (error) {
    console.error(error);

    if (!error) {
      res.json({ error: "!download" });

      return;
    }

    res.json({
      error,
    });
  }
});

app.get("/info", (req, res) => {
  try {
    const URL = req.query.URL;

    ytdl
      .getBasicInfo(URL, {
        requestOptions: {
          cookie: cs,
        },
      })
      .then((info) => {
        res.json(info);
      });
  } catch (error) {
    console.error(error);

    if (!error) {
      res.json({ error: "!info" });

      return;
    }

    res.json(error);
  }
});
