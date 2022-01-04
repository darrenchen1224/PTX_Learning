const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const events = require('events');
const em = new events.EventEmitter();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const indexRouter = require('./routes/index');
const { getBusinfo } = require('./modules/api');
app.use('/api/', indexRouter);

const port = 3000;

io.on('connection', function (socket) {
  socket.on('search', async function (busName, dircrtion) {});
  socket.on('sendstopname', async function (StopSequence) {
    let businfoData = null;
    businfoData = await getBusinfo(StopSequence);
    socket.emit('getbusInfo', businfoData);
  });
});

server.listen(port, console.log('sucess'));
///////

//取得1573站牌API
//計算出3站內將到站的公車車牌
//每10秒更新一次
