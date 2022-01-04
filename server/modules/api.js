const jsSHA = require('jssha');
const axios = require('axios');
const events = require('events');
// const res = require('express/lib/response');
const em = new events.EventEmitter();

function getAuthorizationHeader() {
  var AppID = 'd88637e25cfe4aa1bcfe05495129d1cd';
  var AppKey = 'tDcYNLoZWpnR-QR7We6-FAIgTE4';

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}
module.exports = {
  async getBusinfo(StopSequence) {
    let businfoData = [];
    try {
      await axios
        .get(
          'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/InterCity/1573?%24filter=Direction%20eq%201&%24top=30&%24format=JSON',
          {
            headers: getAuthorizationHeader(),
          },
        )
        .then((data) => {
          let businfo = data.data;
          businfo.forEach((element) => {
            if (element.StopSequence < StopSequence) {
              businfoData.push({
                PlateNumb: element.PlateNumb,
                StopSequence: StopSequence - element.StopSequence,
              });
            }
          });
        })
        .catch((err) => {
          res.send(err);
        });
      return businfoData;
    } catch (error) {
      console.log(error);
    }
  },

  getStopinfo(req, res) {
    let busName = req.params.busName;
    let dircrtion = req.params.dircrtion;
    axios
      .get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/InterCity/${busName}?%24filter=Direction%20eq%20${dircrtion}&%24top=30&%24format=JSON`,
        {
          headers: getAuthorizationHeader(),
        },
      )
      .then((data) => {
        const stopinfo = data.data[0].Stops;
        const stopinfoData = [];
        stopinfo.forEach((element) => {
          stopinfoData.push({
            StopName: element.StopName.Zh_tw,
            StopSequence: element.StopSequence,
          });
        });
        res.send(stopinfoData);
      })
      .catch((err) => {
        res.send(err);
      });
  },
};
