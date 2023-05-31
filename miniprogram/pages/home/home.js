const app = getApp();
// 监听chat-users集合的变化
const db = wx.cloud.database();
const chatUsersCollection = db.collection('chat-users');
Page({
    onLoad(){
        // 更改当前online值为当前在线人数值
        chatUsersCollection.where({
            login:1
        }).count().then(res =>{
            this.setData({
                online:res.total
            })
        }).catch(err =>{
            console.error('获取login为1的字段数出错：', err);
        });
        // 监听chat-users集合的变化
        const watcher = chatUsersCollection.where({
            login: 1
        }).watch({
            onChange: snapshot => {
            // 获取login为1的字段数
            const count = snapshot.docs.length;
            // 更新online的值
            this.setData({
                online: count
            });
            },
            onError: err => {
            console.error('监听chat-users集合出错：', err);
            }
        });
      },
    data: {
        choose_circle:"",
        iconList: [{
            icon: 'footprint',
            color: 'red',
            badge: 0,
            name: '徒步'
          }, {
              icon: 'shop',
              color: 'red',
              badge: 0,
              name: '二手市场'
          }, {
              icon: 'group',
              color: 'blue',
              badge: 0,
              name: '拼团'
          }, {
              icon: 'taxi',
              color: 'blue',
              badge: 0,
              name: '拼车'
            }, {
            icon: 'voicefill',
            color: 'olive',
            badge: 22,
            name: 'KTV'
          }, {
            icon: 'activity',
            color: 'cyan',
            badge: 0,
            name: '户外活动'
          }, {
              icon: 'game',
              color: 'yellow',
              badge: 0,
              name: '游戏'
            }, {
            icon: 'friendfavor',
            color: 'mauve',
            badge: 0,
            name: '征友'
          }, {
            icon: 'weibo',
            color: 'purple',
            badge: 0,
            name: '八卦'
          }, {
            icon: 'cart',
            color: 'orange',
            badge: 0,
            name: '购物'
          }, {
              icon: 'discoverfill',
              color: 'olive',
              badge: 0,
              name: '科幻'
          }, {
              icon: 'musicfill',
              color: 'pink',
              badge: 0,
              name: '音乐分享'
          }, {
              icon: 'recharge',
              color: 'black',
              badge: 0,
              name: '有偿求助'
          }, {
              icon: 'camerafill',
              color: 'orange',
              badge: 1,
              name: '摄影'
            }
          ],
        gridCol: 3,
        skin: false,
        touchguy: 0,
        roomid: 0
    },
    showModal(e) {
        this.setData({
        modalName: e.currentTarget.dataset.target
        });
    },
    hideModal(e) {
        this.setData({
        modalName: null
        });
    },
    gridchange(e) {
        // 切换设置
        this.setData({
        gridCol: e.detail.value,
        choose_circle:"",
        });
    },
    ListTouchStart(e) {
        this.setData({
        ListTouchStart: e.touches[0].pageX
        });
    },
    ListTouchMove(e) {
        this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
        });
    },
    ListTouchEnd(e) {
        if (this.data.ListTouchDirection == 'left') {
        this.setData({
            modalName: e.currentTarget.dataset.target
        });
        } else {
        this.setData({
            modalName: null
        });
        }
        this.setData({
        ListTouchDirection: null
        });
    },
    excute(event){
        console.log(event.currentTarget.dataset.item)
        const index = event.currentTarget.dataset.index;
        const name = event.currentTarget.dataset.item.name;
        const selectedItem = this.data.iconList[index];

        // 更改选择后的属性
        this.setData({
            [`iconList[${index}]`]: selectedItem,
            choose_circle:name
        })
        
    },
    onHide(){
        this.setData({
            choose_circle:""
        })
    },
    match(){
        // 选中了圈子就进行匹配
        if(this.data.choose_circle!=""){
            this.touch(this.data.choose_circle).then(()=>{
                wx.showToast({
                    title: '匹配成功',
                    icon: 'success',
                    duration: 2000
                })
                this.jump2room();
            })
        }
        else{
            wx.showToast({
            title: '您没有选择圈子',
            duration:1000,
            icon:'none'
            })
        }  
    },
  //匹配模块 待完善...
    touch: function(circle_name) {
        var that = this; 
        return new Promise(function (resolve, reject) {
            //登录函数
                app.login_check().then( () => {
                    //开始匹配
                    console.log('form发生了submit事件');
                    //上传该用户请求记录
                    let tag = circle_name;
                    console.log("tag:"+tag)
                    //返回5个匹配id供随机选择,要求小于10
                    let idNum = 5;
                    new Promise(function (resolve, reject) {
                        wx.cloud.callFunction({
                            name: 'cloud-group',
                            data: {
                                tag: tag
                            },
                            success: res => {
                                resolve(res)
                                console.log('上传用户请求记录成功'+res)
                            },
                            fail: res => {
                                reject(res)
                                console.log('上传用户请求记录失败'+res)
                            }
                        })
                    })
                    
                    //获取匹配范围内所有用户信息 在线用户，匹配项目，时间范围，空间范围
                    wx.showLoading({
                        title: '正在为您匹配',
                        mask: true
                    }),
                    new Promise(function () {
                        wx.cloud.callFunction({
                            name: 'cloud-getgroup',
                            data: {
                                tag: tag,
                                idNum: idNum
                            },//返回匹配[userid],在云端过滤出时间范围和空间范围,本地随机
                            success: res => {
                                if(res.result.list.length > 0){
                                    let idgroup = res.result.list;
                                    let len = res.result.list.length;
                                    console.log('满足条件的用户ID:', idgroup);
                                    
                                    //根据匹配规则匹配到用户 随机✔，位置最近，时间最近
                                    //待创建房间...
                                    let touchguy = 0;
                                    let roomid = 0;
                                    if(len < idNum){
                                        touchguy = idgroup[0].userInfo.nickName;
                                        roomid = idgroup[0]._id;
                                        console.log("匹配到的用户是"+touchguy);
                                    }
                                    else{
                                        let rand = Math.floor(Math.random() * idNum);
                                        touchguy = idgroup[rand].userInfo.nickName;
                                        roomid = idgroup[rand]._id;
                                        console.log("匹配到的用户是"+touchguy);
                                    }
                                    that.setData({
                                        touchguy: touchguy,
                                        roomid: roomid
                                    })
                                    resolve();
                                }else {
                                    console.log("啊哦...暂时没人与你匹配"+res);
                                    //查无数据
                                    wx.showToast({
                                        title: '啊哦...暂时没人与你匹配',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    reject()
                                }

                            },
                            fail: err => {
                                console.error('调用云函数失败:', err);
                                reject();
                            }
                        })
                    })
                    
                })
            })
        },
    jump2room: function(){
        wx.navigateTo({
            url: '/pages/index/index?name='+this.data.touchguy+'&roomId='+new Date().getTime()
        })
    }
});
