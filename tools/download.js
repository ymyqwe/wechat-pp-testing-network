var testImg = 'https://www.yumingyuan.me/img/maniau.ico';
var downloadSize = 442368;
function ShowProgressMessage(msg) {
  console.log(msg)
  return msg;
}
function InitiateSpeedDetection(callback) {
  var startTime, endTime;

  wx.downloadFile.call(this, {
    url: testImg,
    success: (res) => {
      console.log(res);
      endTime = (new Date()).getTime();
      showResults.call(this, callback);
    },
    fail: () => {
      ShowProgressMessage("Invalid image, or error downloading");
    }
  })
  

  startTime = (new Date()).getTime();

  function showResults(callback) {
    var duration = (endTime - startTime) / 1000;
    var bitsLoaded = downloadSize * 8;
    var speedBps = (bitsLoaded / duration).toFixed(2);
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    callback(speedMbps)
    return ShowProgressMessage([
      "Your connection speed is:",
      speedBps + " bps",
      speedKbps + " kbps",
      speedMbps + " Mbps"
    ]);
  }
}
module.exports.InitiateSpeedDetection = InitiateSpeedDetection;