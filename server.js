import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import contentDisposition from "content-disposition";

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

const COOKIE =
  "VISITOR_INFO1_LIVE=Pwc0rVCuXfM; PREF=tz=Europe.Kiev; LOGIN_INFO=AFmmF2swRgIhANa1Pyd4xG7Qnj8nrMjbFuPwDCwu8ucKpL8662ARBCryAiEA8OsSCFTjkR0kUyprKJQPVdPqhNnhFuAIr9SygwI47HI:QUQ3MjNmelBtQ1VxSU9obzY5eDJSWDNDVEVFX0MzSUpUWm1ZN1NteXNlNi03Sm5hcy1IQk81UElEZkRQSTNHQUtxTkpZNHkwdHBIci03RC1NUGhTNVllR0VKSk9hcWNNLVgweDZ0SjJVcGJoZjRrd0xJb3ZfWUpDOTM5cGZzRDVLSmNaNl94NnYwOHZQZm1TWTFJNWhPNkJQODhvWnNEb0ZhNnViYVc2b3VocVp1YWwtWVE4RllfTGh5SkZIYmk5ZUdHQkVPel9zcUlDMURibG9wdGFaUXhGZHZNY0JOUkppdw==; VISITOR_PRIVACY_METADATA=CgJVQRIEGgAgNA%3D%3D; SID=eAhvNdUv3lt1Gog5Kfrb-rNSR0CtWlzVKW0TVqkTVF6ugdfIGWKFvzNkw8TEZYX83wYyBA.; __Secure-1PSID=eAhvNdUv3lt1Gog5Kfrb-rNSR0CtWlzVKW0TVqkTVF6ugdfIyI1LPam0HcpHcqL3yq234w.; __Secure-3PSID=eAhvNdUv3lt1Gog5Kfrb-rNSR0CtWlzVKW0TVqkTVF6ugdfIUDwf6ORe3MOWS1X3YM-UDw.; HSID=AFTtPVTOiwvrUeO4e; SSID=AJ0hr8TM8agBVUjO9; APISID=ADid9XCkuNwSV3FX/AmqHcpIKcvlRnzveX; SAPISID=MpN_ySQlyW0QFxad/AYBV_jRx8fzlmbUMe; __Secure-1PAPISID=MpN_ySQlyW0QFxad/AYBV_jRx8fzlmbUMe; __Secure-3PAPISID=MpN_ySQlyW0QFxad/AYBV_jRx8fzlmbUMe; YSC=bAKjO6DOsZ8; __Secure-1PSIDTS=sidts-CjEBPVxjSro7ccsu_JkS_LVSFmDsAMueFho7C5e-thPDh9iHuaVcTUhQUpN3864uykGvEAA; __Secure-3PSIDTS=sidts-CjEBPVxjSro7ccsu_JkS_LVSFmDsAMueFho7C5e-thPDh9iHuaVcTUhQUpN3864uykGvEAA; SIDCC=ACA-OxOACobd_Vtc6qVfphcAUbnPwYFEs2CtTlGp3ImI53w-XVJrgduUqUPBYNv163PDinKD6g; __Secure-1PSIDCC=ACA-OxNiFiJBKlWJgb1u0XrBwicnzskKAT92lKREEAPFJLcqxwOacSnlRqXASluhHgL4wH9Oa5s; __Secure-3PSIDCC=ACA-OxNchK7_zhru6bir7u94ldlKsiFnNTHwHaDOjeXPWNYNgHOaA1UQO3SUt4__5hYNtDyIucI";

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
        headers: {
          cookie: COOKIE,
        },
      },
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
          headers: {
            cookie: COOKIE,
          },
        },
      })
      .then((info) => {
        res.json(info);
      });
  } catch (error) {
    console.error(error);

    res.json(error);
  }
});
