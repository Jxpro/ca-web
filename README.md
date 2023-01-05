# X509CA UI

## 介绍

此为课程设计（CA 系统）的 UI 界面，项目采用了前后端分离进行开发，后端 API 参见[ca-api](https://github.com/Jxpro/ca-api)

> 设计要求：
>
> 1. 展示有效证书列表和撤销列表，提供证书文件和 CRL 的下载
> 2. 接受用户的提交申请，包括用户信息和公钥，公钥由用户自己产生
> 3. 用户申请认证的过程，（可选）储存相应的电子文档，如营业执照 PDF
> 4. 管理员审核认证信息，给通过的用户颁发证书，拒绝的用户则需重新申请
> 5. 用户密钥丢失或其他情况时，可以吊销证书，密钥作废，并更新撤销列表和 CRL

## 使用说明

下载项目

```
git clone https://github.com/Jxpro/ca-web
```

进入项目

```
cd ca-web
```

下载依赖

```
npm install
```

运行项目

```
npm start
```

打包项目

```
npm run build
```

## 联系方式

如果有任何问题，欢迎到 [github issue](https://github.com/Jxpro/damai-tickets/issues) 进行讨论，或发送电子邮件到 [jxpro@qq.com](mailto:jxpro@qq.com) 来联系我
