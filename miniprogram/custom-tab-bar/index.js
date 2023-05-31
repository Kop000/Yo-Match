// custom-tab-bar/index.js
const app = getApp();
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        //tabBar页面数据
        tabList:[
            {
                "pagePath": "pages/home/home",
                "text": "主页"
            },
            {
                "pagePath": "pages/talklist/talklist",
                "text": "列表"
            },
            {
                "pagePath": "pages/about/myself/myself",
                "text": "我的"
            }
        ],
        selected:0,

        
    },

    /**
   * 组件的生命周期函数
   */
  lifetimes: {
    attached() {
      // 组件被添加到页面时，从全局数据中获取选中的索引值并更新组件数据
      this.setData({
        selected: app.globalData.selected,
      });
    },
  },

    /**
     * 组件的方法列表
     */
    methods: {
        //底部切换
        switchTab(e){
            
            let key = Number(e.currentTarget.dataset.index);
            let tabList = this.data.tabList;
            let selected = app.globalData.selected;
            console.log("selected:"+selected)

            if(selected !== key){
                app.globalData.selected = key;
                wx.switchTab({
                  url: `/${tabList[key].pagePath}`,
                })
            }
            console.log("selected后:"+selected)
            
        }

    }
})
