const express = require("express");

const cors = require("cors");

const ytdl = require("ytdl-core");

const contentDisposition = require("content-disposition");

const app = express();

app.use(cors());

app.listen(1000, () => {
  console.log("Server Works !!! At port 1000");
});

const cs =
  "YSC=hS9DrUTadOA; VISITOR_INFO1_LIVE=RGxQC-ibplE; PREF=tz=Europe.Kiev; SID=eAhvNe0gRjetK6L92QK2J-2O2luf4usNLL8NIvVKjZyXSbweIN5fD_atH4-SH_guheEqFA.; __Secure-1PSID=eAhvNe0gRjetK6L92QK2J-2O2luf4usNLL8NIvVKjZyXSbweGec02wkyjWWCyXTN-S68ZQ.; __Secure-3PSID=eAhvNe0gRjetK6L92QK2J-2O2luf4usNLL8NIvVKjZyXSbwe8HKL_o44bPV82Iygzs8uWQ.; HSID=A7H7el5piMaPPIjef; SSID=Atu2kBHXieb9pxhxQ; APISID=ip2EZwfIviaTCkUX/A9_J_lZy_exdvWQIU; SAPISID=Hh8QGo8Dd3xWHcfa/ALfBmog-TKTsVM92p; __Secure-1PAPISID=Hh8QGo8Dd3xWHcfa/ALfBmog-TKTsVM92p; __Secure-3PAPISID=Hh8QGo8Dd3xWHcfa/ALfBmog-TKTsVM92p; LOGIN_INFO=AFmmF2swRgIhAJFip-vvJGvktYFuusTNGSyVweb_WLeMaFzMwotT-o1kAiEA6R_0XXcq6W-JlA0H6Z-aaaaA2TRhdz9V-WqHtpPX9JQ:QUQ3MjNmd2tTWjlrRDB3amYzTkM0QkVmUkNZU0pzNW5uallwTmI0V0o5VzdaVlVrNWlrYjNFeG02M0ZEMHMwTjBMRzFINnVISU5OcWVIZ0dQeUZEQV9TVE54UGJWMVlWT3JwdW9DNmdiRmszZUlEVFFJNWRRY29iRmxpLW1ELTBYaV9YSWF2V3J6ZUZucE5LYUxTQXJMb2lRQkNsTUZEZTBjbXpvTFB3RFkwWXNic2FwYjJkM2VKdTdWb1BqUjl2b0dBLWdyRjdUajgtZnVNeGRmQnlmQ05ZNUwxRktGOVZzUQ==; VISITOR_PRIVACY_METADATA=CgJVQRIEGgAgNg%3D%3D; __Secure-1PSIDTS=sidts-CjEBPVxjSiGiuVUjS1p_YWUODdSXHuWIjRf6BOSnrwtTX0QWHFsqVdlb5kypgghsGIZSEAA; __Secure-3PSIDTS=sidts-CjEBPVxjSiGiuVUjS1p_YWUODdSXHuWIjRf6BOSnrwtTX0QWHFsqVdlb5kypgghsGIZSEAA; SIDCC=ACA-OxN0KHzwO6AmKRxwsyliHD-cyw3sN4kFZNVy8yvfeUvSDStK0tQiWDA0V4F5d0L0hL3mdw; __Secure-1PSIDCC=ACA-OxM9b2ouXP0RJ0XtNUsMtZJfz1cX3y0cX57_cwUJZwFfs5fJkGQoULdsodrgbZJbTrgXmOQ; __Secure-3PSIDCC=ACA-OxMlWWRaC13jdIw-510MqBKh-5_uJPeXwgzsD_v8fChKcSz68r6RU7R304bWnKWVAGPcEnM";

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

    res.json({
      error,
    });
  }
});
