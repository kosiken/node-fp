
const qs = require("querystring")
const fs= require('fs')
const path = require('path')
module.exports.countSlashes = function(txt) {
  let c = 0;
  for (let i = 0; i < txt.length; i++) {
    if (txt[i] == "/") {
      c++;
    }
  }

  return c;
};

module.exports.verifyRoute = function(r, p) {
  let v = r.split(":"),
    regex = new RegExp(v[0]);
  return regex.test(p);
};

module.exports.makeParams = function(route, pathname) {
  let matches = route
    .split(":")
    .slice(1)
    .map(s => s.replace("/", ""));
  //  (pathname)
//int(matches);
  let keys = pathname.split("/").slice(2);
//int(matches);
let params = {}
   matches.forEach((s, i) => {
    
    
   params[s]= decodeURIComponent(keys[i])
   
    
  });
  return params
};

module.exports.parseMultipart =  function(buffer, boundary) {
 //(buffer)
  let str = "",
    i = 0,
    keys = [],
    files = [],
    nc = false,
    nf = false,
    nt = false,
    waitForLine = false;

  while (i < buffer.length) {
    str += buffer[i];
    if (buffer[i] === "\n") {
      
      if (new RegExp(boundary.trim()).test(str)) {
       // (1);
        str = "";
        i++;

        continue;
      }

      if (/Content-Disposition/.test(str)) {
        //   (str)
        let name = str.match(/name="(.*)"/),
          fn = str.match(/filename="(.*)"/);
        if (fn) {
          files.push({
            name: name[1].replace(/";.*/, ""),
            filename: fn[1],
            data: ""
          });
          nc = true;
          nt = false;
        } else if (name) {
          keys.push({ name: name[1], data: "" });
          nt = true;
          nf = false;
        }

        //

        str = "";
        //   i++
      } else {
        //   (str, nf, nt)
        if (nt) {
          if (str == "\r\n") {
            str = "";
            i++;
            continue;
          }

          keys[keys.length - 1].data = str;
        }

        if (nc) {
          let n = str.match(/Content-Type:\s(.+)\r\n/);
          if (n) {
            files[files.length - 1].type = n[1];
            waitForLine = true;
            nf = true;
            nc = false;
            i++;
            continue;
          }
        }
        if (nf) {
          if (waitForLine) {
            str = "";
            i++;
            waitForLine = false;
            continue;
          }
          let b = files[files.length - 1];
          b.data += str;
          //   b.file.write(Buffer.from(str, 'utf-8'))
          str = "";
        }
      }
    }
    i++;
  }
  // (files);
  if(files.length){
    if(!fs.existsSync('./uploads')){
      try{
        fs.mkdirSync('./uploads')
      }
      catch(err) {
        console.log(err)
        throw new Error('Cannot create file')
      }
    }
  }
  files.forEach(f => {
    //   (f.data)

    f.data = f.data.slice(0, f.data.length - 2);
 
    fs.writeFileSync(
      path.join('./','uploads', f.filename),
      new Uint8Array(Buffer.from(f.data, "utf8"))
    );

    f.data = undefined;
  });

  let fields = {};
  keys.forEach((v, i) => {
    fields[v.name]= v.data.slice(0, v.data.length - 2)
  })

  return {
    fields,
    files
  }
};

module.exports.parseUrlEncoded = function(data) {
  return qs.parse(data);
};

module.exports.defaultNotFound = function(req, res) {

   
    
let text = 'resource'

let resp= `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cannot find ${text}</title>
</head>
<body>
    <h1>Lion Server</h1>

    <p>
        Sorry cannot ${req.method} <code>${req.url}</code>
    </p>
</body>
</html>`
res.setHeader("Content-Length", resp.length);
req.handled = true
res.status(404).end(resp);

}




/**
 * @param {Error} err
 * @param {ServerResponse} res
 */
module.exports.defaultErrorHandler = function(err, req, res) {
  let errString = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>There was an error</title>
  </head>
  <body>
      <h1>Lion Server</h1>
  
  <h3 class="trace">
      ${err.message}
  </h3>
  
  <ul class="error">`

  err.stack.split('\n').forEach(e=> {
    errString+= ('<li>' +e + '</li>')
  })

  errString+=`</ul>

  </body>
  </html>`
//if(req.handled) return
  res.setHeader('Content-type', 'text/html')
  res.setHeader('Content-Length', errString.length)

  res.status(500).end(errString)
  req.handled = true
}

class LionServerError extends Error {
  constructor(message, req, res) {
    super(message)
    this.req = req
    this.res = res
  }
}

module.exports.LionServerError = LionServerError