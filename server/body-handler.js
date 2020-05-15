
const {parseUrlEncoded, parseMultipart, LionServerError} = require('./helpers')



class BodyHandler {
  constructor(){
    this.canHandle= [
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ]  }

    use(req, res, next)  {
      
      if(req.method!= 'POST') {
       
        next();
        
        return
      }


    
        let ct = 'Content-Type', ctl = ct.toLowerCase()
       

        let contentType = req.headers[ct]||req.headers[ctl]

    
        let w = ''
       req.on('data', c => {
          w+=c;  
    
        }) 

        req.on('end', ()=> {
          //  k = true
          let data =w,honor=false
          for (let content of this.canHandle) {

            if(new RegExp(content).test(contentType)) {
              honor = true
              break
            }
          }
            if(!honor){  req.emit('error',new LionServerError('This server cannot handle ' + contentType + ' POST requests', req, res))
          return}
           
         
        
         
         try {
     
          if(contentType == 'application/x-www-form-urlencoded'){
            data = parseUrlEncoded(data)
     
          
            
          }
          else if(contentType == 'application/json') {
            
          }
          else {
        
           
         data = parseMultipart(data, contentType.split(';')[1].
         replace('boundary=', '').trim())
     
          }
       
          req.body = data
          req.emit('nexteee')
     
        //  return true
          next()
        }
        catch(err) {
          req.emit('error', err);
        }
          })
        

        
    }
}

module.exports = BodyHandler