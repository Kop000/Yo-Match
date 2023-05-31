//app.js
const config = require('config');
const Cloud = require('common/util/cloud-call');
App({
  onLaunch: function () {
    console.log("onlaunch我上线啦，现在设置这个人数据库在线字段为1")
    this.InitCloud(); //初始化云服务 / ESC
    this.InitCustom(); //初始化custom所需配置信息
  },
  InitCloud() {
    var that = this;
    wx.cloud.init({
      env: config.CloudID,
      traceUser: true
    })
    Cloud.GetOpenData().then(res => {
      console.log(res)
      that.globalData.openid = res.result.openid;
      //异步配置缓存
      wx.setStorageSync('openid', res.result.openid);
    })
  },
  InitCustom() {
    wx.getSystemInfo({
      success: e => {
        //console.log(e)
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        // console.log(custom)
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData:{
      // 登录判断
      login: false,
      // 当前高亮项
      selected: 0,
  },
  config,
  Cloud,
  
  onTabItemTap(item) {
    // 监听页面切换事件，在切换时更新选中的索引值
    this.globalData.selected = item.index;
  },

  onHide(){
      console.log("我退出到后台了，设置数据库字段为0")
      wx.cloud.callFunction({
        name: 'cloud-user-logout',
      })
  },
  onShow(){
    console.log("onshow，判断用户是否授权，更改全局login")
    this.userAuth().then( () => {
        if(this.globalData.login){
            wx.cloud.callFunction({
                name: 'cloud-user-login',
            })
        }
    })
    
  },

  login_check: function(){
    var that = this
    return new Promise(function(resolve,reject){
        if(that.globalData.login){
            console.log("用户已授权");
            wx.cloud.callFunction({
                name: 'cloud-user-login'
            });
            resolve();
        }
        else{   //如果未授权，弹出授权窗口
            console.log("用户未授权");
            wx.getUserProfile({
                desc: '获取用户聊天头像',
                success: res => {
                    let userInfo = res.userInfo;
                    wx.showLoading({
                    title: '获取用户信息',
                    })
                    that.userRegister(userInfo).then(r => {
                    console.log(r);
                    wx.hideLoading();
                    that.globalData["login"] = true;
                    resolve();
                    })
                },
                fail: res => {
                    console.log("用户授权失败"+res);
                    reject();
                }
            })
        }
    })
  },

  //身份校验函数
  userAuth() {
    let that = this
    return new Promise(function(resolve,reject){
        //身份校验
        wx.cloud.callFunction
        ({
            name: 'auth',
            success: res => {
            if (res.result.errCode == -1) {
                console.log('--未登录--')
                that.globalData.login = false
                } else {
                console.log('--已登录--')
                that.globalData.login = true
                }
                resolve();
            },
            fail: res => {
                console(res)
                reject();
            }
        })
    })
    
  },
  //用户授权注册函数
  userRegister(userInfo) {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'cloud-user',
        data: {
          userInfo: userInfo
        },
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }
})