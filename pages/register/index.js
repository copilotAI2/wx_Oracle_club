// pages/register/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {

  },
  onShow: function () {

  },
  //
  formSubmit: function (e) {
    const {input_account, input_nickname, input_password} = e.detail.value;
    if(!input_account||!input_nickname||!input_password){
      console.log('失败');
      wx.showToast({
        title: '请检查输入信息是否有误',
        icon: 'none',
        mask: true,
      });
    }else{
      console.log('成功');
      wx.request({
        url: 'https://www.barteam.cn:7705/api/user/register',
        data: {
          account:input_account,
          nickname:input_nickname,
          pwd:input_password
        },
        header: {'content-type':'application/json'},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          console.log(result);
          const msg = result.data.Msg;
          if(result.data.Msg==='SUCCESS'){
            console.log('注册成功');
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              mask: true,
              success: (result) => {
                wx.navigateBack({
                  delta: 1
                });
              },
            });
          }else{
            wx.showToast({
              title: msg,
              icon: 'none',
              mask: true,
            });
          }
        },
        fail: () => {},
        complete: () => {}
      });

    }
  },
})