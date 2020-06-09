// pages/login/index.js
Page({

  data: {

  },
  formSubmit: function(e){
    const {login_account, login_password} = e.detail.value;
    if(!login_account||!login_password){
      console.log('失败');
      wx.showToast({
        title: '请见检查账号密码是否输入正确',
        icon: 'none',
        mask: true,
      });
    }else{
      console.log('成功');
      wx.request({
        url: 'https://www.barteam.cn:7705/api/user/login',
        data: {
          account:login_account,
          pwd:login_password
        },
        method: 'POST',
        success: (result) => {
          console.log(result);
          //登录成功，data.Status===0
          if(result.data.Status===0){
            console.log('登录成功');
            //将sessionId保存到缓存中去
            const {Guid, UserId, Account} = result.data.Data[0];
            const accountInfo = {Guid:Guid,UserId:UserId, Account:Account};
            const cookies = result.cookies[0];
            wx.setStorageSync('cookies', cookies);
            wx.setStorageSync('accountInfo', accountInfo);
            this.getAccountMore(UserId);
            wx.showToast({
              title: '登录成功',
              mask: true,
            });
            wx.switchTab({
              url: '/pages/index/index',
            });
              
          }else{
            //登录失败，data.Status！=0
            wx.showToast({
              title: result.data.Msg,
              icon: 'none',
              mask: true,
            });
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            mask: true,
          });
        },
        complete: () => {}
      });
    }
  },
  //获取用户昵称请求
  getAccountMore(UserId){
    wx.request({
      url: 'https://www.barteam.cn:7705/api/user/show/' + UserId,
      data: {
       
      },
      header: {
        'content-type': 'application/json' ,
        'Cookie': wx.getStorageSync('cookies'),  //这个是cookies
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result);
        const user = result.data.Data[0].user[0];
        wx.setStorageSync('user', user);
        const likeList = result.data.Data[0].likeList;
        wx.setStorageSync('likeList', likeList);
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  // getOpenidParams:{
  //   appid:'',
  //   secret:'91b5ecc93747a1328ef81268ab8d5255',
  //   js_code:'',
  //   grant_type:'authorization_code',
  //   encryptedData:'',
  //   iv:'',
  // },
  // getUserInfo(e){
  //   //获取APPID
  //   const appid = wx.getAccountInfoSync().miniProgram.appId;
  //   this.getOpenidParams.appid = appid;
  //   console.log(e);
  //   //获取userinfo中的相关数据
  //   const {encryptedData, iv} = e.detail;
  //   this.getOpenidParams.encryptedData = encryptedData;
  //   this.getOpenidParams.iv = iv;
  //   let {userInfo} = e.detail;
  //   userInfo.appid = appid;
  //   //将获取到的简单信息加入缓存
  //   wx.setStorageSync('userInfo', userInfo);
  //   //获取openId
  //   wx.login({
  //     success: (result) => {
  //       console.log(result);
  //       this.getOpenidParams.js_code = result.code;
  //       wx.request({
  //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + this.getOpenidParams.appid + '&secret=' + this.getOpenidParams.secret + '&js_code=' + this.getOpenidParams.js_code + '&grant_type=authorization_code',
  //         data: {},
  //         method: 'GET',
  //         success: (result) => {
  //           console.log(result);
  //           const {openid, session_key} = result.data;
  //           wx.setStorageSync('openid', openid);
  //         },
  //         fail: () => {},
  //         complete: () => {}
  //       });
          
  //     },
  //   });
      
  //   //返回上一级
  //   wx.navigateBack({
  //     delta: 1
  //   });
  // },
})