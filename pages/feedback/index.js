// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    email:'',
    phone:'',
    feed_content:'',
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },
  //点击提交
  formSubmit(e){
    const {name, email, phone, feed_content} = e.detail.value;
    this.setData({
      name,
      email,
      phone,
      feed_content,
    });
    wx.showToast({
      title: '提交成功',
      mask: true,
    });
    this.setData({
      name:'',
      email:'',
      phone:'',
      feed_content:''
    });
  },
  //点击重置
})