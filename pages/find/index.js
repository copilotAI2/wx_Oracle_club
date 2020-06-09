// pages/find/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList:[],//获取到的文章内容
  },
  onLoad(options){
    
  },
  onShow: function () {
    //根据全局变量中传过来的isUserTime参数判断
      const isUseTime = app.globalData.goToFindParams;
      if(isUseTime===true){
        this.isUseTime = true;
      }else{
        this.isUseTime = false;
      }
      
      this.setData({
        articleList:[]
      })
      this.pageIndex = 1;
      this.getArticelList();
  },

  totalPages:'', //总页数
  pageSize:10, 
  pageIndex:1,
  isUseTime:'', //默认不根据时间排序，根据热度排序
  //获取文章列表
  getArticelList(){
    wx.request({
      url: 'https://www.barteam.cn:7705/api/article',
      header: {
        'content-type': 'application/json' ,
        'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
      },
      data: {
        pageSize:10,
        pageIndex:this.pageIndex,
        isUseTime:this.isUseTime
      },
      method: 'GET',
      success: (result) => {
        // console.log(result);
        this.setData({
          articleList: [...this.data.articleList,...result.data.Data[0].articles],
        })
        this.totalPages=result.data.Data[0].totalPages;
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => {}
    });
      
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1.获取最后一页，判断是否是最后一页数据，如果是就showToast，不是就pageindex++继续请求
    if(this.pageIndex>=this.totalPages){
      wx.showToast({
        title: '别滑了，没数据了',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }else{
      this.pageIndex++;
      this.getArticelList();
    }
  },
})