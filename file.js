const Router = require("./server/handler");
const fsnp = require("fs");
const path = require("path");
let r = new Router();
const mime = require("mime");
const fs = fsnp.promises,
  { createReadStream } = fsnp;
const emoji = require("node-emoji");

const directory = emoji.get("file_folder"),
  audio = emoji.get("camera"),
  video = "🎞",
  pdf = emoji.get('book')
r.get("/*", async (req, res) => {
  let stream, dir;

  let pathe = process.env.HOME;

  let p = decodeURIComponent(req.url.slice(5));

  pathe = path.join(pathe, p);
 console.log(pathe);
  // res.end(pathe)
  let stats;
  try {
    stats = await fs.stat(pathe);

    // console.log(stats)

    if (stats.isDirectory()) {
      dir = await fs.readdir(pathe);
      let html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Path ${req.url}</title>
    <style>

    .item {
      margin: 15px 10px
    }
    a{
        text-decoration: none;
    }
    .directory {
        color: red;

    }
    .directory::before{
      content: "${directory}";
  }

  .audion::before{
      content: "${audio}";
  }
  .videon::before{
      content: "${video}";
  }
  .pdf::before{
      content: "${pdf}";
  }
    
    </style>
</head>
<body>`;

      let i = [];
      for (let line of dir) {
        try {
          let isDirectory = require("fs")
              .statSync(path.join(pathe, line))
              .isDirectory(),
            name = line;

          let typeFile = mime.getType(line),
            isUseful = !isDirectory && /audio|pdf|video/.test(typeFile);
          if (isUseful || isDirectory) {
            html += `
              <div class="item" >
                   <a class="${
                     isDirectory
                       ? "directory"
                       : /audio/.test(typeFile)
                       ? "audio"
                       : /pdf/.test(typeFile)
                       ? "pdf"
                       : "video"
                   }" href="${req.url + "/" + name}" > ${name}
                    </a>
                    </div>
           `;
          }
        } catch (er) {
          req.emit("error", er);
        }
      }

      html += `</body>
      </html>`;

      res.end(html);

      // res.setHeader('Content-Length', `${html.length}`)
    } else {
      let stream = createReadStream(pathe);

      res.setHeader("Content-Type", mime.getType(pathe));
      stream.pipe(res);
    }
  } catch (error) {
    if (error.code != "ENOENT") {
      req.emit("error", error);
    }

    req.emit("missing");
  }
});

module.exports = r;
