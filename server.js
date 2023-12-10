const express = require("express");

const cors = require("cors");

const ytdl = require("ytdl-core");

const contentDisposition = require("content-disposition");

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

app.get("/download", (req, res) => {
  try {
    const URL = req.query.URL;
    const name = req.query.name;

    res.writeHead(200, {
      "Content-Disposition": contentDisposition(`${name}.mp4`),
      "x-youtube-identity-token":
        "QUFFLUhqblVveUdMNGhRVVByd2pabzg2T1FUeUM0Z2pmUXw=",
    });

    ytdl(URL, {
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
    const URL = req.query.URL;

    ytdl
      .getBasicInfo(URL, {
        requestOptions: {
          "x-youtube-identity-token":
            "QUFFLUhqblVveUdMNGhRVVByd2pabzg2T1FUeUM0Z2pmUXw=",
        },
      })
      .then((info) => {
        res.json(info);
      });
  } catch (error) {
    console.error(error);

    res.json({
      error,
    });
  }
});
