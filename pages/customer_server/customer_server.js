// pages/customer_server/customer_server.js
var app = getApp()
var MD5 = require('../../utils/MD5.js');
var GUID = require('../../utils/GUID.js');
var queryExpress = require('../../utils/queryExpress.js');
//OLAMI自然语言处理接口
const requestUrl = "https://cn.olami.ai/cloudservice/api";
//聊天API
const Appkey = "39ef23d4577740879a2516e464d97e9f";
const Appsecret = "0c79e48e753b4c138ab923fe5cef8434";
const api = "nli";
var userId = GUID.NewGuid();

//API访问失败等不正常情况的提示
const API_data_error = '亲爱的，估计服务器罢工了，快联系我主人吧。';
const API_Fail = '我崩溃了，您待会再来吧';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msglist: [],
    scrollTop: 0,
    inputValue: '', //用于显示输入语句
    text: '', //查询结果显示
    // expresshead: titletext_default, //查询标题显示
    searchinput: '', //用户输入的查询语句
    // buttonValue: searchbuttonvalue_default, //查询按钮的默认值
    isDisableInput: false, //输入框是否可用
    //dialogtype: search_type //工具公式，默认是查询模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(app.globalData.username);
    var msg = {
      'type': 1,
      'msg': "您好，欢迎来咨询"
    }
    var msglist = this.data.msglist;
    msglist.push(msg);
    that.setData({
      msglist: msglist,
      scrollTop: this.data.scrollTop
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 实时输出用户输入的句子
   */
  acquire_input: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 对应“查询”button
   */
  BeginSearch: function(e) {
    console.log(this.data.inputValue)
    var msg = {
      'type': 0,
      'msg': this.data.inputValue
    };
    //将发送数据存放到list中
    var msglist = this.data.msglist;
    msglist.push(msg);
    //更新视图
    this.setData({
      msglist: msglist

    });
    this.setData({
      searchinput: '',
    })
    this.parseCorpus(this.data.inputValue, this);

  },
  /**
   * 当用户输入完语句，确认时直接查询
   */
  bindConfirmControl: function(e) {

    var corpus = e.detail.value;
    console.log(corpus)
    var msg = {
      'type': 0,
      'msg': corpus
    };
    //将发送数据存放到list中
    var msglist = this.data.msglist;
    msglist.push(msg);
    //更新视图
    this.setData({
      msglist: msglist

    });
    this.setData({
      searchinput: '',
    })
    this.parseCorpus(corpus, this);
  },
  /**
   * 将输入语句通过post方式提交到OLAMI语义开放平台
   */
  /**
   * 将输入语句通过post方式提交到OLAMI语义开放平台
   */
  parseCorpus: function(corpus, object) {
    var that = this
    var usekey = Appkey;
    var usesecret = Appsecret;
    //     if(object.data.dialogtype == chat_type){
    //   usekey = ChatAppkey;
    //   usesecret = ChatAppsecret;
    // }

    //获取sign的MD5值
    object.setData({
      text: '请稍后......'
    })
    var timestamp = new Date().getTime();

    var originalSign = usesecret + "api=" + api + "appkey=" + usekey + "timestamp=" + timestamp + usesecret;
    var sign = MD5.md5(originalSign);

    var rqdata = {
      "data": {
        "input_type": 1,
        "text": corpus
      },
      "data_type": "stt"
    };
    console.log(JSON.stringify(rqdata))
    console.log('\r\n')
    wx.request({
      url: requestUrl,
      data: {
        appkey: usekey,
        api: api,
        timestamp: timestamp,
        sign: sign,
        rq: JSON.stringify(rqdata),
        cusid: userId,
        changebuttoncolor: "#d0e0e3"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(result) {
        var data = result.data.data;
        console.log(data)
        if (result.data != null && result.data.status != null && result.data.status == 'ok') {
          console.log('欧拉蜜有效数据', data.nli[0].desc_obj.result);
          console.log('数据类型', data.nli[0].type);
          var msglist = that.data.msglist;
          var msg = {
            'type': 1,
            'msg': data.nli[0].desc_obj.result
          }
          msglist.push(msg);
          that.setData({
            msglist: msglist,
            scrollTop: that.data.scrollTop + 100
          });
          

          //如果是闲聊就只显示闲聊内容
          if (data.nli[0].type =='nonsense') {
          
          } else if (data.nli[0].type == 'joke'){//讲笑话
            var msg2 = {
              'type': 1,
              'msg': data.nli[0].data_obj[0].content
            }
          } else if (data.nli[0].type == 'selection'){//多个选择
          var msg3=''
          var j=0;
            console.log(data.nli[0].data_obj[8].title)
            for (var i = 0; i < data.nli[0].data_obj.length;i++){
           j=j+1;
              var tempTitle = data.nli[0].data_obj[i].title
              var tmag = j + "." + tempTitle+' \n'
              msg3 = msg3 + tmag
          }

            var msg2 = {
              'type': 1,
              'msg': msg3
            }
          } else if (data.nli[0].type == 'news'){//选中了第几条
            var msg2 = {
              'type': 1,
              'msg': data.nli[0].data_obj[0].detail
            }
          }

          msglist.push(msg2);
          that.setData({
            msglist: msglist,
            scrollTop: that.data.scrollTop + 100
          });

        } else {
          console.log('欧拉蜜返回失败', result.data.status);
          object.setData({
            text: API_data_error
          })
        }
      },

      fail: function({
        errMsg
      }) {
        console.log('request fail', errMsg)
        object.setData({
          text: API_data_error
        })
      }
    })
  },

})