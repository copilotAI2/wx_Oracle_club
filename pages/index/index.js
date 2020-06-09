// pages/index/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[
      {img_url:'http://y1.ifengimg.com/haina/2015_38/4e0994285ae7f0b_w640_h427.jpg'},
      {img_url:'http://imgsrc.baidu.com/baike/pic/item/d4628535e5dde71158f9c5fba9efce1b9d166190.jpg'},
      {img_url:'http://5b0988e595225.cdn.sohucs.com/images/20171110/dd1acb36546f4bf2ab2a49bbde318e97.jpg'}
    ],
    displayList:[
      {id:0, img_url:'http://www.jgwbwg.com/cn/up/yga3o2mrt5hm7mwl7xcwuczhvtri24rop1t6x2jrvbps.jpg'},
      {id:2, img_url:'http://www.jgwbwg.com/cn/up/mc0gt1ehberoki42s5pp0sv511ipka6tvvwrhlayc40o.jpg'},
      {id:3, img_url:'http://www.jgwbwg.com/cn/up/7nyqna0ihqr3tse0hs8xxoq6wu7p0ylwn0voevulk5r1.jpg'},
      {id:4, img_url:'http://www.jgwbwg.com/cn/up/f98v1i2b88u6swa50zc40i0bnc1a1984ppwtbu7gz8q6.jpg'},
      {id:5, img_url:'http://www.jgwbwg.com/cn/up/7f9q97fdb3rhwmvaingaqtuhim4mgeneyo3uexitxe3u.jpg'}
    ],
  },
  //点击预览甲骨大图
  handlePreviewImg(e){
    const current = e.currentTarget.dataset.url;
    const urls = this.data.displayList.map(v => v.img_url);
    wx.previewImage({
      current,
      urls
    })
  },
  handlePreviewSwiper(e){
    const current = e.currentTarget.dataset.url;
    const urls = this.data.swiperList.map(v => v.img_url);
    wx.previewImage({
      current,
      urls
    })
  },
  //点击最新
  isUseTimeTrue(){
    app.globalData.goToFindParams = true;
  },
  //点击推荐
  isUseTimeFalse(){
    app.globalData.goToFindParams = false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})