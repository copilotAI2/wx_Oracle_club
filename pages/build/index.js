Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '这里输入内容...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    articleTitle:'', //文章标题，用于判断用户是否输入内容然后决定是否发送post请求
    publish_titleValue:'',//文章标题文本框的内容
  },
  //自定义事件
  handlePublish(){
    if(wx.getStorageSync('accountInfo').Guid){
      //如果已登录
      if(this.data.articleTitle){
        //标题不为空，可以发送文章
        this.publishArticle();
      }else{
        //标题为空
        wx.showToast({
          title: '请输入标题',
          icon: 'none',
          mask: true,
        });
      }
    }else{
      //如果未登录
      wx.showToast({
        title: '您还没有登录，请先登录',
        icon: 'none',
        mask: true,
      });
    }
  },
  handleInput(e){
    const publish_title = e.detail.value;
    this.publishArticleObj.title = publish_title;
    this.setData({
      articleTitle:publish_title,
      publish_titleValue:publish_title
    })
  },
  //publish文章需要的参数对象
  publishArticleObj:{
    title:'',
    guid:'',
    content:'',
    authorId:''
  },
  //发布文章请求
  publishArticle(){
    var that = this;
    //从缓存中拿到所需参数并放到publishArticleObj
    that.editorCtx.getContents({
      success: function(res) {
        that.publishArticleObj.content = res.html;
        //1-----------
        const {Guid, UserId} = wx.getStorageSync('accountInfo');
        that.publishArticleObj.guid = Guid;
        that.publishArticleObj.authorId = UserId;
        //2.----------------
        wx.request({
          url: 'https://www.barteam.cn:7705/api/article/publish',
          data: that.publishArticleObj,
          header: {
            'content-type': 'application/json' ,
            'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
          },
          method: 'POST',
          success: (result) => {
            console.log(result);
            wx.showToast({
              title: '发布成功',
              mask: true,
            });
            //文章发布成功后清空文章标题和editor里面的内容
            that.editorCtx.clear({
              success: function(res) {
                console.log("清空成功")
              }
            });
            that.setData({
              articleTitle:''
            })
          },
          fail: () => {},
          complete: () => {}
        });
      }
    })
    console.log('发布文章事件触发');
    console.log(that.publishArticleObj);
    //参数获取完毕就发送publish的POST请求
  },

// 下面是editor组件的方法-----------------------------------------------
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  }
})
