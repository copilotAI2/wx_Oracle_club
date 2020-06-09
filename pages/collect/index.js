// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      likeList:[], //喜欢的文章列表
  },

  // del_collect(e){
  //   console.log(e);
  //   console.log('删除');
  //   //获取缓存中的collect
  //   let collect = wx.getStorageSync('collect');
  //   let collectList = this.data.collectList;
  //   //1.获取到要删除文章的id
  //   const articleId = e.currentTarget.dataset.id;
  //   // console.log(articleId);
  //   //2.将该文章从data的colleList中删除
  //   const index = collectList.findIndex(v=>v.articleId===articleId);
  //   console.log(index);
  //   collectList.splice(index, 1);
  //   collect.splice(index, 1);
  //   //将新的数据设置回data和缓存中
  //   this.setData({
  //     collectList
  //   })
  //   wx.setStorageSync('collect', collect);
      
  // },

  onLoad: function (options) {
    console.log('onload触发');
    
  },
  onShow: function () {
    const likeList = wx.getStorageSync('likeList');
    this.setData({
      likeList
    })
  },
})