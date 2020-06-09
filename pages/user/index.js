// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}, //登录的用户信息(包含roleId,nickName,avatarUrl,account,powerNum,pwd)
    avatarUrl:'',
    Guid:'',//登陆后的guid
    collectCount:'',//收藏文章的数目
    accountInfo:'',//登录后的信息(包含guid，userId，account账号)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    //收藏数目的显示
    const likeList = wx.getStorageSync('likeList')||[];
    const likeCount = likeList.length;
    console.log(likeCount);
    //控制登录前后user页面的显示
    const accountInfo = wx.getStorageSync('accountInfo');
    this.setData({
      likeCount,
      accountInfo
    })
    //将登陆的账号信息拿过来
    const user = wx.getStorageSync('user');
    this.setData({
      user:user,
      avatarUrl:user.avatarUrl
    })
  },
  //点击上传用户头像
  upAvatar(){
    console.log('点击上传');
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
            const data = JSON.parse(result.data);
            const newAvatarUrl = data.Data[0];
            console.log(newAvatarUrl);
            this.setData({
              avatarUrl:newAvatarUrl
            })
            let user = wx.getStorageSync('user');
            user.avatarUrl = newAvatarUrl;
            wx.setStorageSync('user', user);
          },
          fail: () => {},
          complete: () => {}
        });
      }
    });
  }
})