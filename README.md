# X509CA UI

## 介绍

此为课程设计（CA 系统）的 UI 界面，基于React+Ant Design开发。

项目采用了前后端分离进行开发，后端 API 参见[ca-api](https://github.com/Jxpro/ca-api)

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

## 界面展示

### 1.证书列表

#### 1.1列表展示

点击“下载证书”可下载，点击“查看详情”查看更多信息

![image-20230413151159129](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151159.png)

#### 1.2详情展示

点击pdf链接可下载查看营业执照，点击“下载”可下载证书，右下角可查看证书是否过期

![image-20230413151223554](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151223.png)

### 2.撤销列表

#### 2.1列表展示

点击“下载CRL”可下载Certificate Revocation List，其余与上述相似

![image-20230413151305403](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151305.png)

#### 2.2 CRL下载

使用Windows打开CRL文件，符合标准，结果如下：

![image-20230413151550188](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151550.png)

## 3.申请证书

#### 3.1填写主体信息

![image-20230413152341868](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-152342.png)

#### 3.2填写密钥信息（可选算法为RSA或ECC）

为保证安全，RSA需选择2048位或4096位：

![image-20230413151712890](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151713.png)

ECC需选择推荐安全的曲线参数，这里提供三种选择：secp256k1，sm2p256v1，prime256v1： 

![image-20230413151738890](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151739.png)

#### 3.3上传许可证

点击或拖动上传PDF类型的许可证或营业执照，也可以直接跳过

![image-20230413151843651](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151843.png)

## 4.审批证书

管理员可在后台看到用户通过如上方式发起的证书请求和填写的详细信息，进行审批

![image-20230413152429947](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-152430.png)

管理员可以选择通过或拒绝，结果将反馈给用户

![image-20230413151929150](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-151929.png)

## 5.下载证书和许可证

### 5.1下载证书

通过点击“下载证书”按钮：

![image-20230413152120103](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-152120.png)

我们可以成功下载到标准X509格式的证书，内容如下：

![image-20230413152049999](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-152050.png)

### 5.2下载许可证

通过点击许可证链接：

![image-20230413152530110](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-152530.png)

我们可以成功下载到上传的许可证文件，内容如下：

![image-20230413152540336](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/new2023-04-13-152540.png)

## 联系方式

如果有任何问题，欢迎到 [github issue](https://github.com/Jxpro/damai-tickets/issues) 进行讨论，或发送电子邮件到 [jxpro@qq.com](mailto:jxpro@qq.com) 来联系我
