
const BodyHandler = require("./server/body-handler");
const Servere = require('./server/server')
const print = require('./server/print')
const server = new Servere();
const handler = new BodyHandler();
const route = require("./route");
const route2 = require("./route2");
const file = require("./file");


server.use(handler);
server.use("/", route);
server.use("/leon", route2);
 server.use("/file", file);

server.use((req, res, next)=> {
    print(`${req.method} ${req.url} `)
    next()
})
server.listen(8080, () => {
  print("listening on http://127.0.0.1:8080");
 // server.emit('listening')
});

