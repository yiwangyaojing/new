# crm-api

小程序API服务

## 快速入门

<!-- 在此次添加使用文档 -->

如需进一步了解，参见 [egg 文档][egg]。

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org

### 安装的插件
```bash
npm i --save egg-sequelize
npm install --save mysql2
 npm i egg-session --save
 npm i --save egg-redis
```

## 数据库表结构反向生成model文件
```bash
egg-sequelize-auto -o "./model" -d xiaotaiyang -h 120.26.102.228 -u root -p 3306 -x accp  -e mysql

```

## 开发示例
### 1.设计表结构
先在数据库当中创建好表结构（关于表结构规范参见数据库设计规范文档）
### 2.自动生成model文件
使用egg-sequelize-auto命令生成model文件
### 3.编写service文件
对每个model文件编写一个独立的service文件，具备基本的crud、分页查询接口。
### 4.编写controller文件
对每个model文件编写对应的controller文件，要求按照rest规范命名方法名字。
### 5.编写router文件
根据rest规范编写router内容

    - 所有对外接口都使用/api开头,后接模型类名称如user
    - 新增对象使用post协议
    - 删除对象使用del协议，并在router当中增加/:id参数
    - 修改对象使用put协议
    - 查询列表使用get协议
    - 查询某个对象使用get协议，并在router当中增加/:id参数
### 6.为service和controller编写单元测试用例
### 7.代码提交前必须执行过单元测试用例和`npm run lint`代码规范检查，才可以提交
### 8.开发分支为master，测试分支为test,发布分支为release.
## git代码提交格式
https://eggjs.org/zh-cn/contributing.html#commit-%E6%8F%90%E4%BA%A4%E8%A7%84%E8%8C%83
```angular2html
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
示例：
```angular2html
aaaa
docs: 增加文档说明
```

### 小程序 开发流程
- 小程序版在2.0分支上提交代码。并去网页上新建一个merage request 将2.0分支合并到3.0分支即可
- 当需要进行测试环境发布时，去网页上新建一个merage request 将2.0分支合并到develop分支即可
- 当需要发布到生产是，同样去网页上新建merage request请求，将develop 分支合并到master

### pc 开发流程
-  日常代码提交在3.0分支上
-  当需要进行测试环境发布时，去网页上新建一个merage request 将3.0分支合并到2.0分支即可  2.0再合并到3.0
-  当需要发布到生产是，同样去网页上新建merage request请求，将develop 分支合并到master
