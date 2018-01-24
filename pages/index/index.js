//index.js
//获取应用实例
var download = require('../../tools/download.js')
const app = getApp()
const INTERVAL = 25

function randomInt(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    testingSpeed: false,
    speed: [],
    speedList: [],
    avgSpeed: 0,
    loading: false,
    speedStatus: '开始测速',
    speedButtonStatus: 'primary',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationShow: {},
    animationShow: {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function() {
    this.speedIndex = 0;
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.context = wx.createCanvasContext('firstCanvas');
    this.x = 0;
    this.y = 200;
    this.context.setStrokeStyle("#000000");
    this.context.setLineWidth(2);
    this.context.moveTo(0, 200);
    // this.init();
  },

  // 初始化
  // init: function() {

  //   // this.index = setInterval(this.move, 10);
  // },

  // 在canvas上移动绘制
  move: function () {
    // console.log(this.data.speed);
    // console.log(this.data.speed[this.data.speed.length -1]);
    if (this.data.speed[this.speedIndex]) {
      this.context.moveTo(this.x, this.y)

      console.log(this.data.speed);
      if (this.speedIndex > 1) {
        this.hideLoading();
        this.x = this.x + 1;
        
        var speed = (this.data.speed[this.speedIndex] ? this.data.speed[this.speedIndex].speed : 10) * 4
        var lastSpeed = (this.data.speed[this.speedIndex - 1] ? this.data.speed[this.speedIndex - 1].speed : 10) * 4
        this.y = (400 - ((speed - lastSpeed) * (1000 / INTERVAL - this.progress) / (1000 / INTERVAL) + lastSpeed))

        console.log(this.x, this.y)
        if ([5].indexOf(this.progress)) {
          this.y += randomInt(-5, 5)
        }
        
        console.log(this.x, this.y, speed, lastSpeed)
        this.context.lineTo(this.x, this.y);
        this.context.clearRect(this.x, 0, 20, 400)
        this.context.stroke();
        this.context.draw(true);
      } else if (this.speedIndex == 1 ) {
        this.y = 400 - this.data.speed[this.speedIndex - 1].speed * 4;
      }

      this.progress -= 1;
      if (this.progress === 0) {
        this.speedIndex += 1;
        this.progress = 1000 / INTERVAL;
      }

      if (this.x == 280) {
        this.context.clearRect(0, 0, 20, 400)
        this.x = 0;
      }
    }
  },
  hideLoading: function () {
    var animationShow = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 500
    })
    var animationHide = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    var moveDown = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    animationShow.opacity(1).step()
    animationHide.opacity(0).step()
    moveDown.translateY(120).step()
    this.setData({
      animationShow: animationShow.export(),
      animationHide: animationHide.export(),
      moveDown: moveDown.export()
    })
  },
  // 测速按钮
  testSpeed: function () {
    this.progress = 1000 / INTERVAL;
    var callback = data => {
      let avg = 0
      if (this.data.speedList.length > 0) {
        let sum = this.data.speedList.reduce((previous, current) => current += previous);
        avg = (sum / this.data.speedList.length).toFixed(2);
      }
      this.setData({
        speed: this.data.speed.concat([{
          time: (this.data.speed.length + 1) * 10, 
          speed: data, 
          timestamp: new Date().getSeconds()
        }]),
        speedList: this.data.speedList.concat([parseFloat(data)]),
        avgSpeed: avg,
      });
    }
    if (!this.data.testingSpeed) {
      this.index = setInterval(this.move, INTERVAL);
      this.speedInterval = setInterval(() => {
        download.InitiateSpeedDetection.call(this, callback);
      }, 1000)
      this.setData({
        speedStatus: '停止测速',
        speedButtonStatus: 'warn',
        testingSpeed: true,
        loading: true,
      })
    } else {
      clearInterval(this.index)
      clearInterval(this.speedInterval)

      this.setData({
        speedStatus: '开始测速',
        speedButtonStatus: 'primary',
        testingSpeed: false,
        
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '呵呵',
      path: '/page/user?id=123'
    }
  }
})
