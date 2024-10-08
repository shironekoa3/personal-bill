# 首页

![](/doc/images/1.png)

# 项目简介

`Personal Bill` 是一套基于 Java 技术栈 Spring Boot 2 + Vue 3 开发的前后端分离个人账单项目。

包含基本的账单增删改查、账单分类、账单标签、导入支付宝微信账单信息功能。


# 项目地址

后台 SpringBoot 2 仓库：https://github.com/shironekoa3/personal-bill-api

前端 Vue 3 仓库：https://github.com/shironekoa3/personal-bill


# 开发环境

+ MySQL 8.0
+ JDK 8
+ Maven 3.8
+ IntelliJ IDEA 2022.3.3
+ Node.js 16.16.0

# 后端技术选型

| 技术         | 版本    | 说明             | 官网                                    |
| :----------- | :------ | :--------------- | :-------------------------------------- |
| Spring Boot  | 2.7.17  | 容器 + MVC 框架  | https://spring.io/projects/spring-boot  |
| MyBatis-Plus | 3.5.2   | MyBatis 增强工具 | https://baomidou.com/                   |
| Lombok       | 1.18.24 | 简化对象封装工具 | https://github.com/projectlombok/lombok |
| MySQL        | 8.0     | 数据库服务       | https://www.mysql.com                   |

# 前端技术选型

| 技术         | 版本  | 说明                                   | 官网                        |
| :----------- | :---- | :------------------------------------- | :-------------------------- |
| Vue.js       | 3.3.4 | 渐进式 JavaScript 框架                 | https://vuejs.org           |
| Vue Router   | 4.2.5 | Vue.js 的官方路由                      | https://router.vuejs.org    |
| axios        | 1.5.1 | 基于 promise 的网络请求库              | https://axios-http.com      |
| element-plus | 2.4.1 | 基于 Vue 3，面向设计师和开发者的组件库 | https://element-plus.org    |
| pinia        | 2.1.7 | Vue 的存储库，跨组件/页面共享状态。    | https://pinia.vuejs.org/zh/ |
| echarts      | 5.4.3 | 一个基于 JavaScript 的开源可视化图表库 | https://echarts.apache.org  |

# 编码规范

+ 规范方式：严格遵守阿里编码规约。
+ 命名统一：简介最大程度上达到了见名知意。
+ 分包明确：层级分明可快速定位到代码位置。
+ 注释完整：描述性高大量减少了开发人员的代码阅读工作量。
+ 工具规范：使用统一jar包避免出现内容冲突。
+ 代码整洁：可读性、维护性高。
+ 依赖版本：所有依赖均使用当前最新可用版本以便新技术学习。

# 使用说明

> 后端配置好数据库信息后启动会自动创建数据库。

前端项目打包后放入后端项目 `resources/static` 目录下，直接运行后端项目。

也可以部署为前后端分离的模式。

# 截图

![](/doc/images/1.png)
![](/doc/images/2.png)
![](/doc/images/3.png)
![](/doc/images/4.png)

