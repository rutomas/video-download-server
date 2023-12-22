import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import contentDisposition from "content-disposition";

const COOKIE =
  "VISITOR_INFO1_LIVE=Pwc0rVCuXfM; LOGIN_INFO=AFmmF2swRgIhANa1Pyd4xG7Qnj8nrMjbFuPwDCwu8ucKpL8662ARBCryAiEA8OsSCFTjkR0kUyprKJQPVdPqhNnhFuAIr9SygwI47HI:QUQ3MjNmelBtQ1VxSU9obzY5eDJSWDNDVEVFX0MzSUpUWm1ZN1NteXNlNi03Sm5hcy1IQk81UElEZkRQSTNHQUtxTkpZNHkwdHBIci03RC1NUGhTNVllR0VKSk9hcWNNLVgweDZ0SjJVcGJoZjRrd0xJb3ZfWUpDOTM5cGZzRDVLSmNaNl94NnYwOHZQZm1TWTFJNWhPNkJQODhvWnNEb0ZhNnViYVc2b3VocVp1YWwtWVE4RllfTGh5SkZIYmk5ZUdHQkVPel9zcUlDMURibG9wdGFaUXhGZHZNY0JOUkppdw==; VISITOR_PRIVACY_METADATA=CgJVQRIEGgAgNA%3D%3D; SID=eAhvNdUv3lt1Gog5Kfrb-rNSR0CtWlzVKW0TVqkTVF6ugdfIGWKFvzNkw8TEZYX83wYyBA.; __Secure-1PSID=eAhvNdUv3lt1Gog5Kfrb-rNSR0CtWlzVKW0TVqkTVF6ugdfIyI1LPam0HcpHcqL3yq234w.; __Secure-3PSID=eAhvNdUv3lt1Gog5Kfrb-rNSR0CtWlzVKW0TVqkTVF6ugdfIUDwf6ORe3MOWS1X3YM-UDw.; HSID=AFTtPVTOiwvrUeO4e; SSID=AJ0hr8TM8agBVUjO9; APISID=ADid9XCkuNwSV3FX/AmqHcpIKcvlRnzveX; SAPISID=MpN_ySQlyW0QFxad/AYBV_jRx8fzlmbUMe; __Secure-1PAPISID=MpN_ySQlyW0QFxad/AYBV_jRx8fzlmbUMe; __Secure-3PAPISID=MpN_ySQlyW0QFxad/AYBV_jRx8fzlmbUMe; PREF=tz=Europe.Kiev&f7=100&f5=30000; YSC=nwI-gUQuaUg; __Secure-1PSIDTS=sidts-CjEBPVxjSjeRktVVBejSXOyfBunIhb6bf3YRdaUkUwbZq0LAcJnsa88_AoUXXYjA34MWEAA; __Secure-3PSIDTS=sidts-CjEBPVxjSjeRktVVBejSXOyfBunIhb6bf3YRdaUkUwbZq0LAcJnsa88_AoUXXYjA34MWEAA; SIDCC=ABTWhQHVFcx7GTN20l63QdDbjsyLWEOOvwnY96Js20icXlRgOsdsHANK-GH1ZBk3XWeGzrunFYk; __Secure-1PSIDCC=ABTWhQHuJbHJU1yWzEAyex1rk-P2d57mC73GtUY1_YoYcsTkG4Xgv95DnenmxjmsU76yn1iIuNKo; __Secure-3PSIDCC=ABTWhQGPOAcowxHaXxc0Dz8ifKFiqI3BGOMRarr-x6H7zqQEPgp2Z85l052Hw-APEdK9W6Zg8x5x";

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

app.get("/info", async ({ query: { id } }, res) => {
  try {
    const info = await ytdl.getInfo(id, {
      requestOptions: {
        headers: {
          cookie: COOKIE,
        },
      },
    });

    res.json(info);
  } catch (error) {
    console.error(error);

    res.json({ error });
  }
});

app.get("/info-with-quality", async ({ query: { id } }, res) => {
  try {
    const info = await ytdl.getInfo(id, {
      requestOptions: {
        headers: {
          cookie: COOKIE,
        },
      },
    });

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
      requestOptions: {
        headers: {
          cookie: COOKIE,
        },
      },
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
        requestOptions: {
          headers: {
            cookie: COOKIE,
          },
        },
      }).pipe(res);
    } catch (error) {
      console.error(error);

      res.json({ error });
    }
  }
);
