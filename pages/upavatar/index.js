// pages/upavatar/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'',//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          image:result.tempFilePaths[0]
        })
        console.log(result.tempFilePaths[0]);
        wx.uploadFile({
          url: 'https://www.barteam.cn:7705/api/user/upload',
          filePath: result.tempFilePaths[0],
          name: 'image',
          header: {
            'content-type': 'multipart/form-data',
            'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
          },
          formData: {
            guid:wx.getStorageSync('accountInfo').Guid
          },
          success: (result) => {
            console.log(result);
          },
          fail: () => {},
          complete: () => {}
        });
      }
    });
    // const Guid = wx.getStorageSync('accountInfo').Guid;
    // let fd = new FormData();
    // fd.append('guid', Guid);
    // fd.append('image', result.tempFilePaths[0]); 
    // wx.request({
    //   url: 'https://www.barteam.cn:7705/api/user/upload',
    //   data: fd,
    //   header: {
    //     // 'content-type': 'application/json' ,
    //     // 'content-type': 'application/x-www-form-urlencoded',
    //     'content-type': 'multipart/form-data',
    //     'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (result) => {
    //     console.log(result);
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // }); 
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