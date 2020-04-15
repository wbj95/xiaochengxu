// pages/navigation_walk/navigation_walk.js
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:null,
    latitude:null,
    currentlo:null,
    currentla:null,
    markers: [{
      iconPath: "../../images/mapicon_navi_s.png",
      id: 0,
      latitude: "",
      longitude: "",
      width: 23,
      height: 33
    }, {
      iconPath: "../../images/mapicon_navi_e.png",
      id: 0,
      latitude: "",
      longitude: "",
      width: 24,
      height: 34
    }],
    distance: '',
    cost: '',
    polyline: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var longitude = options.longitude;//目的地经纬度
   var latitude = options.latitude;
    that.setData({
      'markers[1].latitude': latitude,
      'markers[1].longitude': longitude,
    })

    console.log(longitude);
    console.log(latitude);
    //当前位置经纬度
   wx.getLocation({
     type: 'wgs84',
     success: function(res) {
      // console.log("当前位置经纬度"+res.latitude,res.longitude);
      that.setData({
        currentlo: res.longitude,
        currentla: res.latitude,
        'markers[0].latitude': res.latitude,
        'markers[0].longitude': res.longitude,
      })
     },
   })
    console.log(wx.getStorageSync('currentla'));
    console.log(wx.getStorageSync('currentlo'));
    console.log(that.data.markers[1].longitude);
    console.log(that.data.markers[1].latitude);
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getDrivingRoute({
      origin: that.currentlo + "," + that.currentla,
      destination: that.data.markers[1].longitude+ "," + that.data.markers[1].latitude,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }

      },
      fail: function (info) {
     console.log("1111")
      },
    
    })
    console.log("222")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})