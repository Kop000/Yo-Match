const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
const USER = 'groups-info';
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  return await db.collection(USER).doc(openid).set({
    data:{
      openid,
      tag: event.tag,
      other_tag:'',
      start_time: new Date().getTime(),
      space: ''
    }
  })
}