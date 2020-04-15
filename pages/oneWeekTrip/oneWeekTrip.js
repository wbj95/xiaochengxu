// pages/oneWeekTrip/oneWeekTrip.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var config = require('../../libs/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onecar:[],
    uhide: 0,
    imageurl1: "../../images/down.png",
    imageurl2: "../../images/up.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 20000 });
    var vin=options.vin;
    console.log(vin);
    wx.request({
      url: 'http://120.26.174.202:8080/carmanage/CarInfo/QueryTrip?vin=' + vin,
      method: 'GET',
      data: {},
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
       var onecar=res.data.Trip
        console.log(onecar);
        that.setData({
          Trip: onecar
        });
      //   for (var i = 0; i < onecar.length;i++){
      //      var beginGPS =onecar[i].beginGPS
      //      var endGPS = onecar[i].endGPS
      //      //console.log(beginGPS+endGPS);
      //     var beginlng = beginGPS.match(/(\S*),/)[1];
      //     var beginlat = beginGPS.match(/,(\S*)/)[1];
      //     var endlng = beginGPS.match(/(\S*),/)[1];
      //     var endlat = beginGPS.match(/,(\S*)/)[1];
      //     // console.log(beginlng);
      //     // console.log(beginlat);
      //     qqmapsdk.reverseGeocoder({
      //       location: {
      //         latitude: beginlat,
      //         longitude: beginlng
      //       },
      //       success: function (res) {
      //         console.log(res.result.address);
      //         var startadress = res.result.address
      //       },
      //        fail: function (error) {
      //         console.error(error);
      //       },
      //     })
      //     qqmapsdk2.reverseGeocoder({
      //       location: {
      //         latitude: endlat,
      //         longitude: endlng
      //       },
      //       success: function (res) {
      //         console.log(res.result.address);
             
      //       },
      //       fail: function (error) {
      //         console.error(error);
      //       },
      //     })
         
      //   }
      //   console.log(onecar);
      
       }
    })
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

  },
  //点击切换隐藏和显示
  toggleBtn: function (event) {
    console.log("111");
    console.log(event.currentTarget.id)
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0,
        //imageurl1:"../../images/up.png"
      })
    } else {
      that.setData({
        uhide: itemId,
       // imageurl1:"../../images/down.png"
      })
    }
  }
})