// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'', //输入框内容
    searchContent:[],//搜索到的内容
    isHaveContent:true,  //是否有搜索内容
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },
  //文本框事件-文字输入结束就自动触发
  handleinput(e){
    const {value} = e.detail;
    this.setData({
      inputValue:value
    })
    this.SearchParams.keyword = value;
  },
  //请求参数
  SearchParams:{
    pagesize:999,
    pageindex:1,
    keyword:''
  },
  //点击搜索
  handleSearch(){
    console.log('搜索');
    if(this.data.inputValue.length>0){
      this.getSearchContent();
      this.setData({
        inputValue:''
      })
    }else{
      wx.showToast({
        title: '搜索内容不能为空',
        icon:'none',
        mask: true,
      });
    }
  },
  //请求搜索的内容
  getSearchContent(){
    wx.request({
      url: 'https://www.barteam.cn:7705/api/search',
      data: this.SearchParams,
      method: 'GET',
      success: (result) => {
        console.log(result);
        if(result.data.Data[0].articles.length>0){
          this.setData({
            searchContent:result.data.Data[0].articles,
            isHaveContent:false
          })
        }else{
          this.setData({
            isHaveContent:true
          })
          wx.showToast({
            title: '抱歉，没有搜索到相关内容',
            icon:'none',
            mask: true,
          });
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
})