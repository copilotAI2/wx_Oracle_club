// pages/article_info/index.js
//1.在onload中options中获取到文章列表传过来的参数
//将这个参数放在data中
//用这个参数去请求数据
//然后渲染

//二.获取文章评论
//1.
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',//输入框内容
    articleId:'',//上一个页面传来的文章id
    articleInfo:{},//获取到的文章详情
    commentsList:[], //获取到的评论
    isLike:false, //文章是否被收藏
  },
  articleObj:{}, //文章详情对象
  //这是请求获取评论时所需要的参数对象
  commentsParams:{
    pagesize:5,
    pageindex:1,
    articleId:''
  },
  totalPages:'', //这是评论总页数
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const {articleId} = options;
    // this.commentsParams.articleId = articleId;
    // this.setData({articleId});
    // this.getArticleInfo(articleId);
    // this.getCommentList();
  },
  onShow: function (options) {
    console.log('onshow触发');
    let currentPages =  getCurrentPages();
    const {articleId} = currentPages[currentPages.length-1].options;
    // console.log(articleId);
    this.commentsParams.articleId = articleId;
    this.setData({articleId});
    this.getArticleInfo(articleId);
    this.getCommentList();
    
    //看看文章是否被收藏
    const likeList = wx.getStorageSync('likeList') || [];
    console.log(likeList);
    let isLike = likeList.some(v=>v.articleId==articleId);
    console.log(articleId);
    console.log(isLike);
    this.setData({
      isLike
    })
  },
  //获取文章详情
  getArticleInfo(articleId){
    wx.request({
      url: 'https://www.barteam.cn:7705/api/article',
      data: {articleId},
      header: {
        'content-type': 'application/json' ,
        'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
      },
      method: 'GET',
      success: (result) => {
        this.setData({
          articleInfo:result.data.Data[0].article,
        });
        this.articleObj = result.data.Data[0].article;
        //这是页面打开控制isCollect的逻辑开始
        const collect = wx.getStorageSync('collect')||[];
        let isCollect = collect.some(v=>v.articleId===this.articleObj.articleId);
        // console.log(isCollect);
        this.setData({
          isCollect
        })
        //这是页面打开控制isCollect的逻辑结束
      },
      fail: () => {}
    });
      
  },
  //获取评论
  getCommentList(){
    wx.request({
      url: 'https://www.barteam.cn:7705/api/comment',
      data: this.commentsParams,
      header: {
        'content-type': 'application/json' ,
        'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
      },
      method: 'GET',
      success: (result) => {
        // console.log(result);
        this.setData({
          commentsList:[...this.data.commentsList,...result.data.Data[0].comments]
        });
        this.totalPages = result.data.Data[0].totalPages;
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  //点击加载更多评论
  getMoreComments(){
    if(this.commentsParams.pageindex>=this.totalPages){
      wx.showToast({
        title: '没有更多评论',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }else{
      this.commentsParams.pageindex++;
      this.getCommentList();
    }
  },
  //点击点赞文章
  handlelikeArticle(){
    if(wx.getStorageSync('accountInfo').Guid){
      //如果已登录
      this.likeArticle();
    }else{
      //未登录
      wx.showToast({
        title: '您还没有登录，请先登录',
        icon: 'none',
        mask: true,
      });
    }
  },
  likeArticle(){
    // console.log('点击喜欢');
    //1.首先把缓存中的likeList数组拿过来
    //2.查找当前文章是否在likeList中
    //3.如果不在则发请求点赞文章，并把这文章加入缓存的likeList中，并改变页面点赞的图标
    //3.如果在则发送请求取消点赞，并把这文章从缓存的likeList中删除，并改变页面点赞的图标
    let likeList = wx.getStorageSync('likeList') || [];
    let index = likeList.findIndex(v=>v.articleId==this.data.articleId);
    console.log(this.data.articleId);
    console.log(index);
    if(index === -1){
      //文章没有被点赞--发送请求点赞
      console.log('文章没有被点赞--发送请求点赞');
      wx.request({
        url: 'https://www.barteam.cn:7705/api/like/add',
        data: {
          guid:wx.getStorageSync('accountInfo').Guid,
          ArticleId:this.data.articleId,
          userid:wx.getStorageSync('accountInfo').UserId,
        },
        header: {
          'content-type': 'application/json' ,
          'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          console.log(result);
          wx.showToast({
            title: '点赞成功',
            mask: true,
          });
        },
        fail: () => {},
        complete: () => {}
      });
      let newLike = {articleId:this.data.articleId, title:this.data.articleInfo.title};
      // likeList = likeList.concat(newLike);
      // likeList = [...likeList,...newLike];
      likeList.push(newLike);
      this.setData({
        isLike:true
      })
    }else{
      //文章已被点过赞--发送请求取消点赞
      console.log('文章已被点过赞--发送请求取消点赞');
      wx.request({
        url: 'https://www.barteam.cn:7705/api/like/delete',
        data: {
          guid:wx.getStorageSync('accountInfo').Guid,
          ArticleId:this.data.articleId,
          userid:wx.getStorageSync('accountInfo').UserId,
        },
        header: {
          'content-type': 'application/json' ,
          'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          console.log(result);
          wx.showToast({
            title: '取消点赞',
            icon: 'none',
            mask: true,
          });
        },
        fail: () => {},
        complete: () => {}
      });
      likeList.splice(index, 1);
      this.setData({
        isLike:false
      })
    }
    wx.setStorageSync('likeList', likeList);
  },
  //点击发送评论事件
  postCommentParams:{
    guid: '',  //这个参数传guid
    articleId:'',
    authorid:'',
    content:''
  },
  //获取文本框内容事件
  handleTextarea(e){
    console.log(e);
    const {value} = e.detail;
    this.setData({
      inputValue:value
    });
  },
  //发送评论
  postComment(){
    console.log('发送评论');
    //将本篇文章的id赋值给发送评论所需参数对象
    this.postCommentParams.articleId = this.data.articleId;
    //获取guid和userid
    const {Guid, UserId} = wx.getStorageSync('accountInfo');
    this.postCommentParams.guid = Guid;
    this.postCommentParams.authorid = UserId;
    //获取文本框内的文字
    const content = this.data.inputValue;
    this.postCommentParams.content = content;
    console.log(this.postCommentParams);
    //1.如果文本框中内容不为空，则发送进行；否则showtoast
    if(this.postCommentParams.content.length>0 && wx.getStorageSync('accountInfo').Guid){
      wx.request({
        url: 'https://www.barteam.cn:7705/api/comment/add',
        data: this.postCommentParams,
        header: {
          'content-type': 'application/json' ,
          'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
        },
        method: 'POST',
        success: (result) => {
          let commentsList = this.data.commentsList;
          //每次评论成功以后就自己造一个评论对象
          //{commentId:3, publishTime:2020-03-15T20:32:00.7, content:'5', articleId:13, nickName:''}
          let newComment = {
            commentId:new Date().getMilliseconds(), 
            publishTime:new Date().toString(), 
            content:this.postCommentParams.content, 
            articleId:this.data.articleId, 
            nickName:wx.getStorageSync('user').nickName,
            avatarUrl:wx.getStorageSync('user').avatarUrl,
          };
          // console.log(newComment);
          commentsList.unshift(newComment);
          this.setData({
            commentsList
          })
          //评论成功后showtoast显示添加成功
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1500,
            mask: true,
            success: (result) => {
              //清空评论框中的内容
              this.setData({
                inputValue:''
              })
            },
          });
            
        },
        fail: (err) => {
          console.log(err);
        },
        complete: (com) => {
          console.log(com);
        }
      });
    }else{
      wx.showToast({
        title: '出错了，请检查是否输入评论或是否登录',
        icon: 'none',
        mask: true,
      });
    }
  }
})
//文章点赞逻辑
//1.登录的时候直接把用户喜欢的文章加载到缓存中likeList
//2.点开喜欢页面的时候直接从缓存中拿数据渲染(这里使用onshow，页面每显示一次就从缓存中拿数据)
//3.当用户在文章详情中点赞时，先发送请求把服务器中的数据点赞，然后自己组建一个对象插入到缓存中
//4.取消点赞时，先发送请求把服务器中的赞取消了，在把该文章重缓存中删除
//5.用户每次打开文章详情页面都从缓存中查找文章是否被喜欢