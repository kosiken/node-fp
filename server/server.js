const http = require("http");
const {EventEmitter} = require('events')

const url = require("url");

// let Router = require("./handler");
const qs = require("querystring");



const { defaultNotFound,defaultErrorHandler } = require("./helpers");


class Servere extends EventEmitter {
  constructor() {
    super()
    this.middlewares = []
    this.index = 0;
    this.move = false;
    this.errorHandler = defaultErrorHandler;
    this.isNotFoundHandler = defaultNotFound
  }


  use(path, obj) {
    this.middlewares.push({
      path,
      obj: typeof path == "string" ? obj : path
    });

    if(typeof path === 'string'){
      this.on('next', ()=> {
       
        obj.use(path, this.req, this.res,()=> {
          this.index++
         
          if(this.index == this.middlewares.length) {
            
          //  this.emit('next')
        
           
            if(!this.req.handled) {
              this.notFound()(this.req, this.res)
            }
            this.index = 0
          }
        })
      })
    }

    else if(typeof path == 'function') {
      this.on('next', () => {
        path(this.req, this.res, ()=> {
          this.index++
        
          if(this.index == this.middlewares.length) {
           // this.emit('next')
          
           this.req.emit('nexteee');
            if(!this.req.handled) {
              this.notFound()(this.req, this.res)
            }
            this.index = 0
          }
        })
        })
    }
    else {
      this.on('next', () => {
      path.use(this.req, this.res, ()=> {
        this.index++
      
        if(this.index == this.middlewares.length) {
         // this.emit('next')
        
          if(!this.req.handled) {
            this.notFound()(this.req, this.res)
          }
          this.index = 0
        }
      })
      })
    }

  
  }

  next() {
    this.move = true;
    this.index++;
  }
  defaults() {
    let dHeaders = {
      "Content-Type": "text/html",
      Date: Date()
    };
this.req.on('error', (error) => {
  this.error()(error, this.req, this.res)
})

this.req.on('missing', () => {
  this.notFound()(this.req, this.res)
})
    for (let key in dHeaders) {
      this.res.setHeader(key, dHeaders[key]);
    }

   // this.res.statusCode = 200;

    this.res.status = function(code) {
      this.statusCode = code;
      return this;
    };
    this.req.params = {};
    this.res.json = function(data) {
      this.setHeader("Content-Type", "application/json");
      let datae = JSON.stringify(data);
      this.setHeader("Content-Length", datae.length);
      this.end(datae);
    };
  }
  listen(port, cb) {
    const server = http.createServer((req, res) => {
  
      this.req = req;
      this.res = res;

      this.defaults();

      let l = false;

      this.req.urlObj = url.parse(this.req.url);
  

      this.req.query = this.req.urlObj.query
        ? qs.parse(this.req.urlOb.query)
        : {};

      this.emit('next')
      this.req.on('error', (err)=> {
      //  console.log(err)
        this.error()(err,this.req, this.res)
      })
    });



    server.listen(port, cb);
  }

  notFound() {
    return this.isNotFoundHandler;

   
  }

  error() { this.index = 0
    return this.errorHandler
  }

  
}

module.exports = Servere