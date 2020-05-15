const Router = require('./server/handler')

let r = new Router();

r.get('/', (req, res) => {
    res.status(201).end(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>There was an error</title>
    </head>
    <body>
        <h1>Lion Server</h1>
    
    <h3 class="trace">
        Trace
    </h3>
    
    <ul class="error">
    
    </ul>
    
    </body>
    </html>`)
})


r.get('/lion/:lo', (req, res) => {
    res.status(201).json(req.params)
})

r.get('/lion/:lo/:wee', (req, res) => {
    res.status(201).json(req.params)
})
module.exports=r