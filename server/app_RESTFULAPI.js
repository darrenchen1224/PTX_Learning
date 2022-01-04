const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = 3000;

setTimeout(() => {
  const data = 'abc';
}, 5 * 1000);

io.on('connection', function (socket) {
  socket.on('send', function (obj) {
    console.log(obj.msg);
    // socket.emit('change', obj);
  });
});

const names = [
  {
    id: 1,
    name: 'Amy',
  },
  {
    id: 2,
    name: 'Ken',
  },
];

app.get('/', (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*');
  res.send(names);
});
// 取name的資料;

app.post('/post', (req, res) => {
  names.push(req.body);
  res.send(names);
});
// 前端新增一筆資料給name;

app.post('/search', (req, res) => {
  let i = 0,
    count = 0;
  let newnames = [
    {
      id: null,
      name: null,
    },
  ];
  for (i = 0; i < names.length; i++) {
    if (names[i].id == req.body.id || names[i].name == req.body.name) {
      newnames[count] = names[i];
      count++;
    }
  }
  res.send(newnames);
});
// 搜尋name中是否有前端要求的資料;

app.delete('/delete/:index', (req, res) => {
  names.splice(req.params.index, 1);
  res.send(names);
});
// 刪除前端指定的資料;

server.listen(port, function () {
  console.log('listening on :3000');
});
