const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
const $ = _.aggregate; 
// 云函数入口函数
exports.main = async (event) => {
    // 获取当前时间
    const currentTime = new Date();
    //获取当前用户openid
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    // 查询满足条件的用户ID
    return res = await db.collection('groups-info').aggregate()
        .lookup({
            from: "chat-users",
            localField: 'openid',
            foreignField: 'openid',
            as: 'users_group'
        })
        .replaceRoot({  
            newRoot: $.mergeObjects([$.arrayElemAt(['$users_group', 0]), '$$ROOT'])
        })
        .match({
            login: 1,
            tag: _.eq(event.tag),
            openid: _.neq(openid),
            start_time: _.gt(currentTime.getTime() - 5 * 60 * 1000) // groups-info表中的start_time属性和参数time差值小于5min
        })
        .project({
            userInfo: 1
        })
        .limit(event.idNum)
        .end();
}