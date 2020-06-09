// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'', //输入框内容
    searchContent:{},//搜索到的内容
  },
  keyword:'',
  onLoad: function (options) {

  },

  onShow: function () {

  },
  //文本框事件-文字输入结束就自动触发
  handleinput(e){
    console.log(e);
    const keyword = e.detail.value;
    this.setData({
      inputValue:keyword
    })
    this.keyword = keyword;
  },
  //点击搜索
  handleSearch(){
    //如果输入框中有值，就发送请求
    if(this.data.inputValue){
      this.postRequest();
    }else{
      //没值就showtoast
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        mask: true,
      });
    }
    
  },
  //发送请求搜索内容
  postRequest(){
    wx.request({
      url: 'https://www.barteam.cn:7705/api/search/oracle',
      data: {
        keyword:this.keyword
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
          console.log(result);
          this.setData({
            searchContent:result.data.Data[0]
          })
      },
      fail: (err) => {
        wx.showToast({
          title: '抱歉，没有搜索到相关内容',
          icon: 'none',
          mask: true,
        });
      },
      complete: () => {}
    });
  },
  //点击查看字典大图
  handlePreviewImg(e){
    console.log(e);
    const current = e.currentTarget.dataset.url;
    const urls = [this.data.searchContent.CharUrl];
    wx.previewImage({
      current,
      urls,
    });
  }
})