import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import contentDisposition from "content-disposition";

const COOKIE =
  "VISITOR_PRIVACY_METADATA=CgJVQRIEGgAgIQ%3D%3D; VISITOR_INFO1_LIVE=TdPPCVXaOPE; VISITOR_PRIVACY_METADATA=CgJVQRIEGgAgIQ%3D%3D; PREF=tz=Europe.Kiev; GPS=1; YSC=Ar8LsrDo9Fw; HSID=AvKtNVESJ5B2YCEkP; SSID=AIZfVqG_1xWxP5fJy; APISID=gsJnkIjLjeDXn9X5/AvStlO1Xp68U6Qq0I; SAPISID=D9-qEmSXZg_pG4WJ/Avuyr2rbU40jlOjmC; __Secure-1PAPISID=D9-qEmSXZg_pG4WJ/Avuyr2rbU40jlOjmC; __Secure-3PAPISID=D9-qEmSXZg_pG4WJ/Avuyr2rbU40jlOjmC; SID=fQgdw1Gbym3xl7d5Wg8IwKAbePtvlr0lA9B9pHfJnjw0He0k5m0hXnZ4slZCl5J946moEw.; __Secure-1PSID=fQgdw1Gbym3xl7d5Wg8IwKAbePtvlr0lA9B9pHfJnjw0He0kehSurOoMP5uAT7bUCbOr_Q.; __Secure-3PSID=fQgdw1Gbym3xl7d5Wg8IwKAbePtvlr0lA9B9pHfJnjw0He0kNkKrXz42AJSVcyUQbHkGUA.; LOGIN_INFO=AFmmF2swRAIgeYqRvfVzN2WFLRuy5WPi5_kB490Yg146C4ngijbS9bYCIDM9OwM7t2_Xv_1jDJEXj13MoXwqZ7NQCOCVy1wpRtMG:QUQ3MjNmeG11c3ZKZkN0MWQ0anI2MEk5ZFBDTjhKTG5OTHI2OG9kYjRERThodUIwVWJYbERMaHY5eHplbUFZSVZwV0F3TTZXWWZSTHhicVVZUzh0ZXBQX09VM2xyNFMxb3FvaTF1c1Fpa0VWTGNMYVNTZkNEd1E1SWtIakRWa2RRVkxBSktIaDRFdTlmcEExV0ZnUzlJZ0RBX2JyTjNPOVdR; __Secure-1PSIDTS=sidts-CjEBPVxjSmbn6VJ1zRnYmqgsPjLPsrBLnpDQPvIUSA54Odo1Shxn7e3IdLL5bZks7V45EAA; __Secure-3PSIDTS=sidts-CjEBPVxjSmbn6VJ1zRnYmqgsPjLPsrBLnpDQPvIUSA54Odo1Shxn7e3IdLL5bZks7V45EAA; SIDCC=ABTWhQFR1610HD47RkOhL4kYR7_RVN2stdJJd7MFGfLqquXiF2x5qkAw0tFBbZZ1p9ZwXB5Bhg; __Secure-1PSIDCC=ABTWhQHHx3f4DLyXoTf6rmdziF8Zoax5__Az_0aQ4NCr5JGPIuf27fjoz4KXffBt8ybnOjCI; __Secure-3PSIDCC=ABTWhQHD1-bbifbau5PZ2c3svX7BCkRDreXrhIQZsuL1khrxChRr0zvQd0BPUE9ESRsR8iKy6g";

const requestOptions = {
  headers: {
    cookie: COOKIE,
  },
};

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

app.get("/info", async ({ query: { id } }, res) => {
  try {
    const info = await ytdl.getInfo(id, { requestOptions });

    res.json(info);
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});

app.get("/info-with-quality", async ({ query: { id } }, res) => {
  try {
    const info = await ytdl.getInfo(id, { requestOptions });

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
      requestOptions,
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
        filter: (format) => format.itag == itag,
        requestOptions,
      }).pipe(res);
    } catch (error) {
      console.error(error);

      res.json({ error });
    }
  }
);
