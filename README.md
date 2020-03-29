# init



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
1、目录文件夹(不包含node_Module)内打包压缩包文件，改名
$ npm install --production
$ tar -zcvf ../release.tgz .

2、放到服务器解压出来
(以上两个步骤可以考虑使用git更快捷进行)

3、执行命令开启
### 已经使用 egg-alinode 启动，登陆阿里云控制台地址 控制台地址：https://node.console.aliyun.com 可以进行监控。
$ npm start
$ npm stop
```

4、日志位于用户文件夹下的logs文件夹内

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org