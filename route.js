const Router = require('./server/handler')

let r = new Router();

r.get('/', (req, res) => {
    res.status(201).json(req.headers)
})


r.get('/lion/:lo', (req, res) => {
    res.status(201).json(req.params)
})

r.get('/lion/:lo/:wee', (req, res) => {
    res.status(201).json(req.params)
})

r.post('/api/v1', (req, res)=> {
    res.status(200).json(req.body)
})
module.exports=r