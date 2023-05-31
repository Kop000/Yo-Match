### 功能实现

- [x] 随机匹配
- [x] 聊天室
- [x] 匹配后传送到聊天室
- [x] 用户信息展示
- [x] 匹配前判断login 
- [x] 获取用户信息
- [x] 前端展示


### 项目部署

1. 按照下方`数据表设计`新建数据集合，并设置所有数据表为访问权限为`所有用户可读，仅创建者可读写`。
2. 修改`config.js`配置文件中`CloudID`为你自己的云环境ID。
3. 上传并部署全部云函数
4. 进入云开发后台，配置上传云函数环境变量 `TZ` 为 `Asia/Shanghai`
5. `cloud-blcak-timer`需要上传触发器
6. 重新编译项目


### 数据表设计

> chat-users  聊天室用户信息表

| 字段     | 说明                     | 类型   |
| -------- | ------------------------ | ------ |
| _id      | 数据库记录唯一ID         | string |
|login     | 0/1-未登录/已登录        | number |
| openid   | 用户唯一身份识别ID       | string |
| userInfo | 用户头像 昵称 地址等信息 | object |


> chat-msgs 消息记录表

| 字段        | 说明                                             | 类型   |
| ----------- | ------------------------------------------------ | ------ |
| _id         | 数据库记录唯一ID                                 | string |
| roomId      | 会话房间号                                       | number |
| openid      | 消息发送者openid                                 | string |
| msgType     | 消息类型 目前有 text image                       | string |
| content     | 消息内容 text ：对应消息内容 image：对应图片地址 | string |
| userInfo    | 用户头像 昵称 地址等信息                         | object |
| _createTime | 消息创建时间                                     | string |


> groups_info 圈子匹配记录表

| 字段        | 说明                                             | 类型   |
| ----------- | ------------------------------------------------ | ------ |
| _id         | 数据库记录唯一ID                                 | string |
| openid      | 消息发送者openid                                 | string |
| other_tag   | 其他类型                                         | string |
| space       | 用户位置                                         | string |
| start_time  | 匹配点击时间                                      | number |
| tag         | 圈子选择类型                                     | string |
