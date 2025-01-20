项目的基本需求

开发一款DAPP，实现停车位租赁，基于 Next.js、TailwindCSS、Ant Design,和 RainbowKit 构建的 Web3 应用，支持多链和多钱包连接,主要功能如下：

1、总览:
    用地图呈现,地图上有车位信息,显示所有所有车位信息,显示车位状态(可用、不可用).
    车位信息从后端获取，用户可点击选中某个车位进行租赁

2、我的租赁：
    显示用户租到的车位,有退租、结算等功能。

3、我的车位：
    可用创建、删除、修改车位信息、用户收益。
    车位提交表单：
        车位图片
        定位（经纬度，获取浏览器定位权限），
        地址详情
        租金价格，月/年，30天，年365天，计算一天的价格。

4、我的：
    用户个人信息profile,绑定了邮箱、手机号、用户昵称等信息。
    个人信息
        钱包地址
        邮箱或手机号
        昵称
        头像
