# Goedge主控端模版
开源CDN系统GoEdge主控端模版，适用于1.3.9~1.4.3版本(edge-admin)

本项目也提供付费技术支持服务，有任何问题请联系TG：[@kuaien66][2]

## 在线演示
````shell
# 主控端：https://edge.console.aifan.top/
# 账 号：kdmin
# 密 码：kk54321
````

## 安装说明
```shell
# 1、进入goedge-admin（主控端）安装目录
cd $你的edge-admin安装目录/

# 2、备份该目录下的 web 文件夹
mv web web_bak

# 3、下载最新的模版文件
	# 如果你的主控端是1.4.2以下版本（含1.4.2）
	wget -O ./web.zip https://github.com/Kuaien/Goedge-Admin-Theme/releases/latest/download/goedge-admin-1.4.2.zip
	
	# 如果你的主控端是1.4.3版本
	wget -O ./web.zip https://github.com/Kuaien/Goedge-Admin-Theme/releases/latest/download/goedge-admin-1.4.3.zip

# 4、解压模版文件
unzip ./web.zip

# 5、重启 edge-admin 服务
./bin/edge-admin restart
```

## 模版预览
![多颜色切换][3]
![登录页][4]
![首页][5]
![列表页][6]
![表单页][7]
![TAB页][8]

## 用户端模版(goedge-user)

该模版有配套的用户端模版，付费提供（50U），需要的联系TG：[@kuaien66][9]

![用户端登录页][10]
![用户端首页][11]


AD: 接goedge模版、插件、脚本定制，需要的可联系TG：[@kuaien66][2]


  [1]: https://github.com/Kuaien/Goedge-Admin-Theme/tree/main/%E5%85%A8%E5%A5%97%E4%B8%BB%E9%A2%98%E6%A8%A1%E7%89%88%28%E5%90%AB%E4%B8%BB%E6%8E%A7,%E7%94%A8%E6%88%B7,%E5%AE%98%E7%BD%91%29
  [2]: https://t.me/kuaien66
  [3]: https://bbs.naixi.net/data/attachment/forum/202408/06/183449b3vuvkfbk8pku8ff.jpg
  [4]: https://bbs.naixi.net/data/attachment/forum/202408/06/183453udzpj5l5wsissdej.jpg
  [5]: https://bbs.naixi.net/data/attachment/forum/202408/06/183452mkahhyiai3agvvk6.jpg
  [6]: https://bbs.naixi.net/data/attachment/forum/202408/06/183456d394im3pm7ficfrm.jpg
  [7]: https://bbs.naixi.net/data/attachment/forum/202408/06/183459z2rmmqr2rll1oe1a.jpg
  [8]: https://bbs.naixi.net/data/attachment/forum/202408/06/183502kyelr1s219dzgtls.jpg
  [9]: https://t.me/kuaien66
  [10]: https://bbs.naixi.net/data/attachment/forum/202408/03/011840x9si2ff2d77biisk.png
  [11]: https://bbs.naixi.net/data/attachment/forum/202408/03/011845rs1krzl440mw4ukk.png