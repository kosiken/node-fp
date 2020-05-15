

const { countSlashes, verifyRoute, makeParams } = require("./helpers");
/**
 * @property {string} req
 */
class Router {
  constructor() {
    //this.server = ser
    this.methods = [];
  }
  use(path, req, res, next) {
    this.path = path == "/" ? path : path.replace(/\/$/, "");
    this.res = res;
    this.req = req;
    
    
    this.req.on('nexteee', ()=>{
    this.handle()
    })
next()
    
    return true;
    //this.handle()
  }

  get(path, fn) {
    this.methods.push({
      method: "GET",
      path: path,
      //    opts: typeof opts==='function'? {}:opts,
      fn: fn
    });
  }

  post(path, fn) {
    this.methods.push({
      method: "POST",
      path: path,

      fn: fn
    });
  }

  handle() {

      
    let urlObj = this.req.urlObj;

    let methode = this.req.method;

    let pathe = urlObj.pathname;
  pathe =  pathe == "/" ? pathe : pathe.replace(/\/$/, "");

    let handled = false;
    


    for (let { method, path, fn } of this.methods) {
        let norm = path.replace(/\/$/, "")
if(this.req.handled) {
  break
}
        if(this.path =='/' &&/^\//.test(norm)) norm = norm.slice(1)

  
let long = this.path + norm
      if (methode === method) {
        if(/\*/.test(this.path+path)) {
          if(new RegExp(this.path).test(pathe))        {
            fn(this.req, this.res);
            this.req.handled = true
            break;
          }
        }
        if (long == pathe) {
       
          fn(this.req, this.res);
          this.req.handled = true
          break;
        }

        if (/:/.test(norm)) {

          let index = long.indexOf(':') - 1
        

         if(long.slice(0, index) === pathe.slice(0, index)){
         
          

            

            if(verifyRoute(long, pathe)&& (countSlashes(long)== countSlashes(pathe))) {
              long =  long.replace(this.path, '')
              long = long[0] == '/'? long: '/'+long
           if(this.path.length > 1)   pathe = pathe.slice(this.path.length)
          

          
                this.req.params = makeParams(long, pathe)
               
                
                fn(this.req, this.res);
                this.req.handled = true
                break;
            }
        }
        }
      }
    }

 return handled

  }

}

module.exports = Router;
