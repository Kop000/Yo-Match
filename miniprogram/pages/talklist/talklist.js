// pages/talklist/talklist.js
Page({
    // 页面的初始数据
    data: {
        userInfoList:[],
        loginList:[],
        msgLastList:[],
        msgLastTime: [],
        randomNum: []
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {
        const db = wx.cloud.database()
        let array = [];
        let login_array = [];
        let msglast_array = [];
        let msgtime_array = [];
        let randomNum_array = [];
        db.collection("chat-users").get().then(res=>{
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
                array.push(res.data[i]);
                if(res.data[i].login == 1){
                    login_array.push('在线');
                }
                else{
                    login_array.push('离线');
                }
                randomNum_array.push(Math.floor(Math.random() * 100));
                msglast_array.push("天空是蔚蓝色，窗外有千纸鹤");
            }
            this.setData({
                userInfoList: array,
                loginList: login_array,
                msgLastList: msglast_array,
                msgLastTime: msgtime_array,
                randomNum: randomNum_array
            })
        })
    },
    jump2room(event){
        console.log(event.currentTarget.dataset.item.userInfo.nickName)
        var nickName = event.currentTarget.dataset.item.userInfo.nickName
        wx.navigateTo({
          url: '/pages/index/index?name='+nickName,
          })
    }
})