打卡

# AWS study chapters

# Chapter 1

# Chapter 2

# Chapter 3

# Chapter 4 - IAM

# Chapter 5 - EC2

# Chapter 9 - Router 53

# Chapter 11 - Amazon S3

# Chapter 12 - AWS CLI,IAM

# Chapter 15 - CloudFront

# Chapter 18 - CloudFormation

# Chapter 20 - CloudWatch

# Chapter 21 - Lambda

AWS — cloud practitioner

介绍注册和up主





01.

Aws history

2002内部运行 — 2003、2004推出 — 2006 SQS,S3,EC2

一直在leader的地位，占据市场主流，第二是Microsoft

功能多样 hosting, backup, big data, storage

Aws是global的，不同region



Regions all around the world, like us-east-1…

A region is a cluster of data center数据集合（region-scoped)

选择region的因素： compliance proximity available price (法规，地理位置，可用性，价格）、

一个region有不同的zones，分离的



216 points of presence



02.

介绍了region和global serverice种类和区别



03.

介绍了课程更新



01.

IAM： Identity and Access Management, a global service

Root account is created by default, do not share or use.

Users are people of the organisation, who can belong to any group (multiple or none)



Permissions: users or groups can be assigned by a JSON called policies给权限

least privilege principle: do not give more permissions than a user need最小权限原则



02.

create the IAM user — 为了不用root user,太危险了 有所有权限！ 创建用户用什么给什么权限

group创建， IAM用户登录



03.

IAM policies

继承—- 用于重复group

格式： JSON format

version,Id,statement(sid,effect,principal,action,resource,condition)



04.

IAM policies hands-on 练习

给group的或者自己写一个单独的inline

创建policy 有visiual editor


05.

IAM password policy — for security, 给一些密码的设置限制…（avoid brute force)

MFA！！多重验证=password+ security device

options:  Virtual MFA device(google,authy)

U2F(YoubiKey)—physical one

Hardware key Fob MFA, also for GovCloud



06.

MFA的设置 authy手机可用



07.

How can users access AWS?

3options: AWS Mangement console(MFA)

AWS CLI (access keys)

AWS SDK (for code, access keys)



08.

安装AWS CLI on windows



09.

安装AWS CLI on Mac



10.

安装AWS CLI on Linux



11.

AWS CLI demo

➜  ~ aws configure

AWS Access Key ID [None]: [REDACTED_AWS_KEY_ID]

AWS Secret Access Key [None]: AuODrGIOPK5fpKF8rSG7EBfvT3ywrF76yxq+HzmU

Default region name [None]: ap-southeast-2

Default output format [None]:

➜  ~

aws iam list-users

➜  ~



12.13.

AWS CloudShell. demo右上角的箭头按钮

和命令行使用差不多，终端



14.

IAM roles for services

服务需要对应的permission



15.

IAM roles hands-on

IAM Role 是一种 AWS 身份，它有权限策略，但不和具体用户或组绑定

### 🧱 Users,Groups,Roles三者核心区别总结



16.

IAM security tools

credentials report(account level)

IAM Access advisor(user-level)



17.

IAM security hands on

credentials report可以看见用户的一些信息 in csv.

last accessed



18.

IAM Best practices

不要用Root account

One physical user= one AWS user

最好用MFA更安全

password policy

use roles for giving permission to AWS services

user access keys for CLI/SDK

Assign user to group

never shared!



19.

summary for IAM总结

Users: mapped to a physical user, has a password for AWS console.

Groups: contains users only.

Policies:JSON document that outlines permissions for users or groups.

Roles: for EC2 instance or AWS services

Security:MFA+Password policy

Access Keys: using CLI or SDK

Aduit:report/last accessed



01.

billing 账单查询 Free Tier



02.

EC2  instance == Elastic Compute Cloud



# 01.what is DNS?

Domain Name System— www.google.com⇒ 172.217.18.36 主要做转换

the backbone of internet, hierarchical



术语：

Domain Registrar:Amazon,Route 53…

DNS Records: A,AAAA,

Zone file: contains DNS records

Name Server:

TLD:

SLD:

# How DNS works?

Web Brower — access — to local DNS server— > root DNS server

🌐 DNS 的运行流程（简化版）

当你在浏览器中输入 www.example.com 并回车，DNS 的工作过程大致如下：

🔍 第一步：本地缓存查询

- 浏览器或操作系统先查 本地 DNS 缓存 是否有 www.example.com 对应的 IP 地址。
- 如果有，直接返回，完成解析 ✅。
📡 第二步：递归 DNS 解析器（一般由 ISP 提供）

如果本地没有，就会请求“递归解析器”（Recursive Resolver），比如你的宽带或 Wi-Fi 网络默认设置的 DNS（例如 8.8.8.8 是 Google DNS）。

🧭 第三步：找根域名服务器（Root Name Server）

- 解析器问全球13组根服务器之一：“www.example.com 的 IP 地址是什么？”
- 根服务器回答：“我不知道完整地址，但你可以去找 .com 顶级域服务器。”
🌐 第四步：找顶级域名服务器（TLD Server）

- 递归解析器接着去找 .com 的服务器，问：“example.com 在哪？”
- .com 服务器说：“example.com 在某个权威服务器上（Authoritative Name Server）。”
🎯 第五步：找权威 DNS 服务

- 解析器找到 example.com 的权威服务器，它知道 www.example.com 对应的精确 IP。
- 它返回 IP，例如 93.184.216.34。
✅ 第六步：返回 IP 地址给浏览器

- 递归解析器把 IP 返回给你的电脑，电脑缓存这个结果一段时间。
- 浏览器用这个 IP 发起 HTTP 请求，加载网站内容。
🧠 总结：DNS 查询流程

```plain text

你 → 浏览器缓存 → 本地系统缓存 → 路由器 → 递归解析器 → 根服务器 → TLD 服务器 → 权威服务器 → 返回 IP → 加载网站
```



02. Amazon Route 53

authorize me to update the DNSrecords

可扩展的、高可用性的云域名系统（DNS） 服务,也是可以做域名注册

records contains: Domain name,record type.value,routing policy,TTL

A/AAAA/CNAME/NS…



# Record Types?

A —> maps a hostname to IPV4

AAAA → maps a hostname to IPV6

CNAME —> maps a hostname to another hostname

NS —> Name Servers for the Hosted Zone



# Hosted Zones托管区域

Public Hosted Zones —>共有

Private Hosted Zones —>私有



03.

Route 53 demo



04.

把阿里云域名转到AWS Route53



05

EC2 Instance setup



06.

Records TTL — > time to live

high TTL— > less traffic on Route 53, outdated records

lower TTL -< more traffic more miney

cached

经过半小时 测试 可以访问

- http://54.90.98.154/ 可以访问，说明服务器和服务正常
- https://test2.aarontao.com/ 访问不到，说明HTTPS访问有问题。
DNS发布时间要等，继续测试！

更改WIFI DNS为8.8.8.8 +1.1.1.1 成功！



07.

CNAME Alias区别

## ✅ 核心区别总结：

alias records targets — elastic load balancers,CloudFront,Api Gateway…

不可以设置EC2 DNS name



08.

routing policy路由策略

怎么对DNS进行路由反应？很多种类

> ☝️ *第 6 类（Geoproximity）需要使用 Route 53 Traffic Flow（付费高级功能）



09.

weighted 不同比例的分发,有百分比那种



10.

Latency-based 按照速度延迟响应，自动选延迟最低的region



11.

health check检查服务器是不是可用的，only for public监控服务器状态



12.

healthth check hands on实践



13.

failover

## 什么是 Failover（故障转移）？

Failover 就是：当主服务器挂了，自动切换到备用服务器继续服务，用户不会发现问题。

(选主和副）

## Active-Passive（主动-被动）架构是啥？

在**高可用系统（High Availability, HA）中，Active-Passive 是一种常见的故障转移（Failover）**架



14.

Geolocation地理位置为主，根据分配的地址，不同地址的人访问那个地区的ip！



15.

Geoproximity routing policy地理临近路由策略） 是 AWS Route 53 提供的一种高级 DNS 路由策略，它允许你根据用户的地理位置和资源的地理位置，将流量路由到最近或最优的区域资源

根据地理位置流量倾斜

控制bias进行偏离



16.

Traffic flow

- Traffic Flow 是 AWS Route 53 的一个功能，帮助你用可视化界面和更高级的策略来管理 DNS 路由。
- 你不用手动写复杂的路由规则，直接用图形化的“策略编辑器”把多个规则组合起来。


17.

MultiValue

### Multi-Value Answer Routing？

- Route 53 会给 DNS 查询返回 多个有效的 IP 地址（多个“值”）。
- 这些 IP 地址是你为一个域名配置的多个健康的终端节点（比如多个服务器或实例）。
- Route 53 会随机返回一组 IP，客户端会从中选择一个连接。
- Route 53 会对每个终端节点进行 健康检查，只返回健康的节点地址。
- 如果某个节点不健康，Route 53 不会把它的 IP 返回给查询者。


18.

domain registar vs DNS service

Domain Registrar（域名注册商） 和 DNS Service（DNS 服务）

### 1. Domain Registrar（域名注册商）

- 做什么的？
- 举例
- 作用
### 2. DNS Service（DNS 服务）

- 做什么的？
- 举例
- 作用


GoDaddy and route53 两个都是！！



19.

section clean up总结





域名注册商是你买域名的地方，比如 aarontao.com。他们帮你把这个域名注册到互联网的域名系统里。

GoDaddy、Namecheap、Google Domains、AWS Route 53（也可以做注册商）

- 你在这里买、续费、管理你的域名
- 负责维护域名所有权的注册信息（WHOIS）
- 你可以在这里设置域名的 Nameservers（告诉互联网用哪个 DNS 服务器管理你的域名）
DNS 服务是负责把域名“翻译”成服务器 IP 地址的地方。简单说，就是帮浏览器找到你网站服务器的“地址”。

AWS Route 53（同时是注册商和DNS服务）、Cloudflare DNS、Google Cloud DNS、阿里云DNS

- 维护域名下的 DNS 记录（比如 A 记录、CNAME、MX 等）
- 处理用户访问时的解析请求，把域名解析成 IP
- 支持流量路由策略、负载均衡、健康检查等高级功能
1. Amazon S3
Amazon S3（Simple Storage Service）是亚马逊提供的一种云存储服务，它允许你在云端存储和管理大量数据。

building blocks of AWS, infinitely scalable

Websites use it as the backbone, as well as for integration



1. Buckets
Bucket 是 Amazon S3 中用来存储数据的容器。

每个 bucket 中可以保存无限多个对象（如文件、图片、视频等）。

它相当于云端的“文件夹”，并具有唯一的名称用于识别和访问。



Objects have the Key, key is the Full path!

prefix+ object name

contains “/”

max is 5TB

metadata, tags, and version ID.



03. hands-on



04.

S3 versioning

Amazon S3 的 Versioning（版本控制） 是一种功能，用于为存储在 同一个 bucket 中的同一个对象的不同版本提供保存、恢复和保护机制。

1. 开启 Versioning 后，S3 会为每次上传的对象生成唯一的版本 ID，即使文件名相同，也会保留每个版本。
1. 删除并不会真正移除对象，而是添加一个“删除标记”版本，可以恢复之前的版本。
1. 你可以查看、恢复或永久删除任何版本的对象，提高数据保护和误删恢复能力。
### ✅ 典型用途：

- 防止意外覆盖或删除文件
- 数据审计和历史恢复
- 与 S3 Lifecycle 配合，自动清理旧版本节省费用


05. hands-on



1. encryption
在 Amazon S3 中，**加密（Encryption）**用于保护你的数据在存储时的安全性（即“静态加密”）。

### 🔐 理解 S3 Encryption：

1. S3 支持自动对上传的对象进行加密，防止数据在存储中被未授权访问。
1. 你可以选择使用 AWS 托管密钥（SSE-S3）、KMS（SSE-KMS）或自行上传的密钥（SSE-C）。
1. 启用默认加密后，所有新上传的对象都会被自动加密，无需开发者额外处理。
### 🔒 S3 的 4 种加密方式（Encryption Types）

### ✅ 说明：（考试会考！）

- SSE-S3：开箱即用，适合大多数场景。 AES-256,server-side
- SSE-KMS：适合有严格安全和审计要求的企业。 user control+ aduit trail
- SSE-C：适合对密钥控制要求极高的用户（例如合规要求）。 HTTPS used for security
- Client-Side Encryption：适合极端敏感数据，由客户端自己加密后上传。 client fully management
entcryption in transit(TLS/SSL)（传输加密）最好用 https



07.hands on


08.security

User-based： IAM policy

Resource-based: Bucket policy，ACL Access Control List（访问控制列表）

block public access

networking -VPC endpoints

loggin and auditing

user security— Pre-signed URL (limite time access)



09.hands on 



10.

S3 Websites

S3 Websites 是 Amazon S3 提供的一项功能，允许你将一个 S3 存储桶用作静态网站托管服务器。你可以直接托管 HTML、CSS、JavaScript 文件，而不需要 EC2 或其他服务器。



11.

cors 跨域（考试必考！）

在 Amazon S3 上启用 跨域资源共享（CORS），你需要为你的 S3 Bucket 设置一段 CORS 配置规则（CORS configuration），这样前端网页才能从浏览器访问另一个域名上的资源（比如通过 fetch() 请求图片、JSON 文件等）。



12.hands on



13.

consistency model

一致性模型（Consistency Model） 指的是用户在上传、读取、覆盖或删除对象时，能否立即读取到最新数据。S3 提供：

### ✅ 强一致性（Strong Consistency）

自 2020 年底起，Amazon S3 对所有操作提供强一致性，无需额外设置，适用于所有区域、存储桶和对象。

### 📌 具体表现如下：

- 写后读一致性（Read after write）：
- 覆盖后读一致性（Read after overwrite）：
- 删除后一致性（Read after delete）：
### 🔍 为什么强一致性重要？

过去，S3 采用“最终一致性”（Eventually Consistent），可能导致：

- 写完对象后马上读可能拿不到；
- 删除了对象却仍能被列出。
现在有了强一致性，S3 可用于更关键、更实时的应用，如日志处理、大数据分析、Web 应用等。

对一个新对象执行 PUT 后，立刻就能读到这个对象的数据。

对已有对象执行 PUT（覆盖）后，立刻能读到新的数据。

删除对象后，立即无法再读取或列出该对象。

01.IAM Policy



02.IAM policy simulator 测试



03.AWS CLI Dry runs

AWS CLI 的 Dry Run 是指模拟执行某些操作而不真正改变资源的功能，主要用来验证权限或操作是否能成功。

(减少花费和消耗）

Last login: Sun Jun  8 16:45:05 on ttys003

➜  ~ aws ec2 run-instances --dry-run --image-id ami-07b7cae50f732535f --instance-type t2.micro

成功！！



04.CLI STS Decode

decode-authorization-message

### 解码结果用途

- 看你是被哪条 policy 阻止的
- 看是 explicit deny（显式拒绝） 还是 缺失权限
- 帮你 debug policy
STS Policy

—run—>JSON format



05.EC2 Instances metadata

在 AWS EC2 中，Instance Metadata 是运行中的 EC2 实例可以访问的一组信息，用于获取关于实例本身的各种数据，比如：

- 实例 ID、AMI ID
- 当前 region、availability zone
- 安全组、IAM Role
- 公网/私网 IP
- 临时凭证（如果附加了 IAM Role）
- 用户数据（user-data）
http://169.254.169.254/latest/meta-data （EC2 instance内部使用！）

IAM Policy拿不到！

MetaData = Info about the EC2 instance

UserData =launch script of EC2 instance



06.AWS CLI Profiles

在 AWS CLI 中使用 profiles（配置文件） 可以让你在同一台电脑上管理多个不同的 AWS 账户或身份（例如不同 IAM 用户、不同角色）。



07.AWS CLI MFA

(考试考！）

使用 AWS CLI + MFA（多重身份验证） 时，你需要用一次性的 MFA 代码生成 临时凭证，再用这些凭证调用 AWS 服务。这通常用于提高安全性，特别是访问敏感资源或切换 IAM 角色时。



sts -getsession token



08.AWS SDK  overview

AWS SDK（Software Development Kit） 是一组工具包，帮助开发者用自己熟悉的编程语言与 AWS 服务进行交互。它封装了底层 API 调用，简化了请求签名、错误处理、重试机制等复杂细节。

when using AWS Services such as DynamoDB

(考试考！）



09.AWS Limits(Quotas)

在 AWS 中，Limits（也称 Quotas） 是对资源使用量和 API 调用的默认约束，旨在确保服务稳定性与公平使用。

API Rate Limites:

Serverices Limites:

## 🧱 分类：主要的 AWS 限额类型

Exponential Backoff（指数退避） 是 AWS 推荐的错误重试策略，特别用于应对 API 请求因限流（如 ThrottlingException）或临时失败（如 RequestLimitExceeded）而失败的场景。

SDK included Retry, Server Error 5XX(必须重试）！

4xx不重试

指数级增长重试的时间！

## 🧠 什么是 Exponential Backoff？

它的核心思想是：在失败后不要立即重试，而是等待一段时间，并且每次失败后等待的时间呈指数级增加，防止过度请求加剧问题。

## 🔁 工作原理

例如，假设你设置最大重试次数为 5 次：

其中还会加一个 小的随机抖动（jitter） 来防止多个客户端同时重试。



10.AWS CLI Credentials Provider Chain

在 AWS CLI 和 AWS SDK 中，Credentials Provider Chain 是一组预定义的凭证查找顺序。也就是说，当你使用 AWS CLI 或 SDK 进行请求时，它会按照固定的顺序去寻找你的身份凭证（Access Key 和 Secret Access Key）。

有优先级！

command line options, environment variables. CLI credentials file, configuration files,Container credentials,Instance profile credentials



最好不用code存，要继承



11.Signing AWS Api requests

在访问 AWS API 时（比如使用自定义代码调用 AWS 的 REST API），你通常需要**对请求进行签名（签署）**以进行身份验证。这种签名机制叫做 Signature Version 4（SigV4）。

Access key and secret key

## ✍️ 什么是 AWS API 签名？

签名的目的是为了验证：

- 你是谁（Access Key ID / Secret）
- 请求是否被篡改（签名保护内容完整性）
## 🧱 签名的基本要素

一个被签名的请求包含：

- X-Amz-Date：时间戳
- Authorization：授权头，包含签名摘要
- 可选的 X-Amz-Security-Token（使用 STS 或 MFA 时）
- 所有请求都通过 HMAC-SHA256 算法签名


SDK auto signed





## 🛰️ 什么是 Amazon CloudFront？

Amazon CloudFront 是 AWS 提供的全球内容分发网络（CDN）服务。

它可以将你的网站、API、视频、图片等内容，缓存并分发到全球边缘节点（Edge Locations），让用户无论身在何处都能更快、更可靠地访问内容。



01.CDN

Content Delivery Network

216 points globally

DDos protection …

## 🔍 核心功能



Origins:

在 AWS CloudFront 里，origin（源）是 CloudFront 获取你内容的源服务器，也就是说：

> Origin 就是 CloudFront 向其请求内容的原始地址来源。

### ✅ 常见的 Origin 类型：



at high level:

Client —> Edge location —> origin



S3 as the origin：

用户 (浏览器/客户端)
│
▼
请求 https://xxxx.cloudfront.net/index.html
│
▼
CloudFront（CDN 加速边缘节点）
│
├─ 若缓存中有资源 → 直接返回缓存内容 ✅
│
└─ 若缓存中没有资源
│
▼
向 Origin（S3 Bucket）请求资源
│
▼
S3 返回 index.html 等静态文件
│
▼
CloudFront 将资源缓存并返回给用户



ALB(application load banlancer)/EC2（ must be public)



Restriction—> whitelist/blacklist



CloudFront 与 S3 跨区域复制（Cross-Region Replication，CRR）有什么区别？什么时候用哪个？

### 🔍 一句话概括：

- CloudFront 是全球内容分发网络（CDN），用于加速内容交付。
cached,but little bit outdated,static

- S3 CRR 是数据备份/复制机制，用于将数据从一个区域复制到另一个区域的 S3 存储桶中。
dynamic,low latency

### 📦 功能对比：



02.hands-on

用 CloudFront Origin Access Identity (OAI) 的好处主要是为了安全性和访问控制，具体来说：

### 1. 保护你的 S3 Bucket 不被公开访问

- 默认情况下，如果你把 S3 Bucket 设置为公开，任何人都可以直接通过 S3 URL 访问里面的文件。
- 用 OAI 可以让你的 S3 Bucket 保持私有，只有 CloudFront 通过 OAI 才能访问 S3 里的内容。
- 这样，用户只能通过 CloudFront 的分发域名访问资源，而不能直接访问 S3 Bucket URL，增强了安全性。
### 2. 防止绕过 CloudFront 直接访问 S3

- 如果不使用 OAI，用户可能绕过 CloudFront，直接访问 S3 的 URL，这样就绕过了 CloudFront 的缓存和安全设置。
- 使用 OAI 后，S3 只允许 OAI 访问，不允许其他访问，保证流量一定经过 CloudFront，方便做缓存和访问控制。
03.CloudFrontCaching

cached based on headers,session cookies,query string parameters.

based on TTL

缓存命中（Cache Hit）：请求的资源在边缘节点缓存中，直接返回，无需回源。

最大化 CloudFront 缓存命中率maximize the cache hit rate to minmize request to origin

by separating static and dynamtic distribution把 静态内容 和 动态内容 分开用不同的 CloudFront Distribution 或 Cache Behavior，是提高缓存效率和性能的经典做法。

比如 static in S3, dynmatic in EC2

### 什么是 CloudFront 缓存？

CloudFront 是 AWS 的内容分发网络（CDN），它在全球的边缘节点缓存内容。缓存的目的是：

- 减少源服务器负载（比如你的 S3 Bucket 或 Web 服务器）
- 加快内容加载速度，让用户从离他们最近的边缘节点获取内容
- 降低延迟和提升用户体验


04.hands-on



05.CloudFront Security

restrict who can access — >whitelist,blacklist

Geo-Ip database地理位置限制

Https —> viewer protocol policy, origin protocol policy

Viewer Protocol Policy 是在 AWS CloudFront 中设置客户端（浏览器/用户）访问 CloudFront 分发时使用的协议策略。它决定了用户访问你的内容时是否允许 HTTP、强制使用 HTTPS，或自动重定向到 HTTPS。

## 🔧 选项说明

### 1. HTTP and HTTPS

- ✅ 允许用户用 HTTP 或 HTTPS 访问
- 适合兼容性要求高的场景，但安全性较低。
### 2. Redirect HTTP to HTTPS（✅ 推荐）

- 📢 自动将 HTTP 请求重定向到 HTTPS
- 用户输入 http://example.com 时会被重定向到 https://example.com
- 提高安全性，防止中间人攻击。


06.CloudFront Signed URL/Signed Cookies

在 AWS CloudFront 中，Signed URLs 和 Signed Cookies 是两种用来限制内容访问权限的机制，通常用于保护私有内容，例如会员视频、付费下载、受保护的文档等。

## 🧩 什么是 Signed URL 和 Signed Cookies？

URL expiration,IP ranges,signers



CloudFront Signed URL vs S3 Pre-signed URL

## ✅ 总览对比表



07.CloudFront Signed URL Process

2 types of signers: trusted key group

AWS acc contains key pairs



08.Pricing

price classes

在 Amazon CloudFront 中，Price Classes（价格类别） 允许你通过控制使用的边缘位置（Edge Locations）来优化成本与性能的平衡。

### 🧾 什么是 Price Class？

CloudFront 全球有数百个边缘节点，遍布北美、欧洲、亚洲、中东、非洲、南美、大洋洲等地区。但不同区域的传输成本不同。Price Class 就是让你决定愿意为性能支付多少，以便 AWS 只使用你愿意支付的区域节点

class All —> all regions,



class 200 —> excluded most expensive

Class 100 → least expensive



origin groups

field level encryption

Field-Level Encryption（字段级加密） 是 Amazon CloudFront 提供的一种增强安全功能，用于在客户端和 CloudFront 之间加密敏感数据字段，例如信用卡号、社会安全号码（SSN）等。

### 🧩 什么是 Field-Level Encryption？

它允许你使用 CloudFront 的 公钥 对来自客户端（浏览器）的 HTTP 表单中的 指定字段 进行加密。加密的数据只有你的 应用程序后端（origin，例如 EC2 或 API）能解密。

⚠️ 和 HTTPS 不同，它只加密特定字段，而不是整个请求体。

最后内容到webserver解码

01.🏗️ AWS CloudFormation 简介

CloudFormation 是 AWS 提供的**基础设施即代码（IaC）==通过代码管理基础配置的**服务，它允许你通过定义模板（YAML 或 JSON）来自动化部署、更新和管理 AWS 资源。

✅ CloudFormation 能做什么？

CloudFormation 可以自动创建并管理这些资源：

- EC2 实例
- VPC、子网、路由表
- S3 桶
- IAM 角色、策略
- RDS 数据库
- Lambda 函数
- CloudFront 分发
- 以及几乎所有 AWS 支持的资源
### 📦 核心功能



02.

Infrastruecture as Code

一般都是 manual work,但是比较难reproduce in others(复现）



IaC == use code deployed and create CRUD

Delcarative way 声明式

benefit —> IaC, cost, Productivity,separation of concern

不用重新造轮子！



template uploaded in S3, can not be edit



componets:

resources,parameters,mapping,outputs,conditionals,metadata

考试不用写！



03.hands on



04.

介绍自动化流程

自己做了 可以



05.

Yaml crash course

（jSON在这里不好用！）

key-value键值对

nested objects

support arrays



06.

what are resources

resource是必须在CF里面的！有224个

AWS::aws-product-name::data-type-name

almost all services supported,but can not be dynamic!



07.

CF parameters

a way to provide inputs to your AWS CF

主要是如果以后reuse就加上去:types,description,constaraints….



!Ref 引用

pseduo parameters伪参数）



08.

mapping

Mappings（映射） 是 AWS CloudFormation 中的一个核心功能，它允许你定义键值对（Key-Value Pairs）的查找表，用于在模板中根据某些条件（如 AWS 区域、实例类型、环境等）动态选择值，而无需硬编码。

## ✅ 什么是 Mappings（映射）？

Mappings 类似于编程语言中的“字典”或“哈希表”，你可以在模板中定义一组预定义的键值对，然后在资源属性或其他地方通过 Fn::FindInMap 函数动态查找对应的值。

### 📌 核心特点：

- 静态数据：Mappings 的值在模板部署时就已经确定，无法在运行时动态修改。
- 多维度查找：支持通过多个键（如 Region + InstanceType）查找对应的值。
- 常用于：
Mappings:
<映射名称>:
<键1>:
<键2>: <值>
<键3>: <值>
<键4>:
<键2>: <值>

Fn::FindInMap 找值



09.

CF outputs

考试必考！

可以export去使用

Fn::ImportValue



10.

conditions are used to control the creation of resources or outputs based on a condition:

environment,region,parameters…

特定条件使用



11.

Intrisic Functions 考试必考！

## ✅ 什么是 Intrinsic Functions？

Intrinsic Functions 是 CloudFormation 内置的函数，用于在模板中执行以下操作：

- 动态引用资源属性（如获取 EC2 实例的 Public IP）
- 条件判断（如根据参数值选择不同配置）
- 字符串/数值操作（如拼接字符串、转换大小写）
- 映射查找（如通过 Fn::FindInMap 动态选择 AMI ID）
它们类似于编程语言中的“内置函数”，但只能在 CloudFormation 模板中使用。



Fn::Ref

Fn::GetAtt

Fn::FindInMap

……



12.

CF Rollbacks

失败的时候回滚（creation failed,update fails)

- 根据不同 AWS 区域选择不同的 AMI ID
- 根据环境（Dev/Test/Prod）选择不同的配置（如实例类型、VPC ID）
- 根据账户或条件选择特定的资源属性


13.

ChangeSets

要知道那些变化了when update

nested stacks are stacks as part of other stacks(load balancer ,security group…)

Cross vs Nested Stack

Cross Stack（跨堆栈）和 Nested Stack（嵌套堆栈）是两种不同的资源组织方式



stackSets堆栈组



14.

CF Drift

在 AWS CloudFormation 中，Drift（漂移） 是指 CloudFormation 堆栈管理的资源 与 实际 AWS 资源状态 发生不一致的情况。

因为manual手动改变了！

要手动detect








Amazon CloudWatch 是 AWS 提供的一项监控和可观测性服务，用于对你在 AWS 上运行的资源和应用程序进行数据收集、分析和告警。它可以帮助你了解系统运行状况、优化资源使用、发现异常并及时响应问题。

### 🧠 简单理解：

CloudWatch 就像是 AWS 的“监控仪表盘”，可以监控你的 EC2、Lambda、RDS、DynamoDB、S3 等服务的运行状态，也可以收集自定义日志和指标。

### 📦 核心功能：



01.

the communications and intergration

SQS.SNS

考试会考SQS！

Amazon SQS（Simple Queue Service）和 SNS（Simple Notification Service）都是 AWS 提供的消息传递服务，但用途不同：

## 📨 一句话对比：



02.

AWS Interation and messaging

synchronous communications && asynchronous同步通信 && 异步、

decoupling 解耦



03.SQS

whats is the Queue?

## 🟦 什么是 Amazon SQS？

Amazon SQS 是 AWS 提供的一个托管消息队列服务，用于在系统中的不同组件之间可靠地传递消息，实现解耦、异步处理和流量削峰。

它是一个完全托管、可扩展的消息队列系统，适合处理分布式系统中临时或批量传输任务的需求。

## 🔧 基本工作原理

```plain text

Producer（生产者）发送消息 → 消息进入队列 → Consumer（消费者）拉取消息并处理
```

- 消息存储在队列中
- 消费者主动从队列中拉取消息
- 一个消息通常只能被一个消费者处理一次
## 🧩 SQS 的两个类型



rpduced to SQS using SDK

persisted in SQS



multiple consumers

可以解耦 application tiers

## ✅ 所以 SQS 就是：

一个临时存放任务的中间人，让：

- 前端系统/服务（比如：用户上传、提交订单）
- 后台处理系统/服务（比如：压缩图片、发货、发邮件）
分离开来，不直接耦合，不互相等待。 异步



04.handson



05.SQS Queue Access Policy

cross account access



06.Message Visibility Timeout

一个consumer poll了，短时间别人看不见 default 30s

当 SQS 中有消息被一个消费者（比如你的后台服务）接收到并开始处理时，SQS 会把这条消息暂时隐藏，让其他消费者看不到这条消息，防止重复处理。

这个隐藏的时间就是 Message Visibility Timeout，也叫“消息可见性超时”。

可以call api加时间



07.

Dead Letter Queue —> debugging

## 什么是 Dead Letter Queue？

Dead Letter Queue（DLQ） 是一个特殊的 SQS 队列，专门用来存放“处理失败”的消息。

## 为什么要用 DLQ？

在消息处理过程中，有些消息可能因为各种原因一直处理失败：

- 消费者代码出错
- 数据格式异常
- 外部服务不可用导致处理超时或失败
如果这些“坏消息”一直留在主队列，会影响系统性能和稳定性。

## 为什么 DLQ 很重要？

- 保证主业务流畅，不被坏消息卡住
- 有利于业务异常排查和系统稳定性维护


Redrive to source” 的意思是“把死信队列（DLQ）里的消息重新送回原队列（source queue）”，也就是把之前因多次处理失败被放到 DLQ 的消息，再次推回主队列重新处理。

## 详细解释

- 死信队列里的消息通常是因为多次消费失败才被转过去的。
- 有时候，你修复了导致处理失败的问题，想要重新处理这些死信消息。
- 这时，可以把 DLQ 中的消息“重投（redrive）”回源队列（主队列）。
- AWS SQS 支持批量将死信消息重新发送回主队列，方便重新处理。


08.

Delay Queue

## 什么是 Delay Queue（延迟队列）？

Delay Queue 是 Amazon SQS 的一个功能，允许你让消息在发送到队列后延迟一段时间才变得可见，也就是：

- 消息不会立即被消费者看到和处理。
- 消息会在延迟时间到后才被消费。
## 为什么用 Delay Queue？

- 控制消息处理时间，延迟执行某些操作。
- 实现简单的定时任务或重试机制。
- 减少瞬时峰值，平滑处理压力。


09.

SQS —Long Polling

 Long Polling（长轮询） 在 Amazon SQS 里的含义和作用。

## 什么是 Long Polling（长轮询）？

- Long Polling 是一种从 SQS 队列获取消息的方式。
- 它会让消费者请求 等待一段时间（最长可到20秒），直到有消息可取或者超时返回空结果。
- 简单来说，就是“等消息”，而不是立即返回空。
## 为什么用 Long Polling？

- 减少空轮询：如果用短轮询（默认立即返回），没有消息时会频繁请求空返回，浪费资源和费用。
- 降低延迟：消费者不用不停地反复请求，可以更高效地获取消息。
- 节省成本：减少不必要的请求次数，降低 SQS 费用。
- 长轮询的等待是“有消息就立刻返回，无消息才等满时间”，
- 只要队列里出现新消息，等待就会结束，返回消息给你。
SQS Extended Client

Amazon 提供的 SQS Extended Client Library 是一个辅助库，主要用来扩展 SQS 的功能，让你可以发送和接收超过 256 KB 的大消息。



Must Know API:

CreateQueue,DeleteQueue,

PurgeQueue

SendMessage,ReceivedMessage,DeleteMessage

MaxNumberOfMessages…



10.

SQS FIFO Queue 按顺序来

## 什么是 FIFO Queue？

- FIFO 是 First-In-First-Out 的缩写，意思是“先进先出”。
- FIFO 队列保证消息的严格顺序，即消息会按发送顺序被接收和处理。
- 同时保证消息不重复处理。
## 普通标准队列 vs FIFO 队列区别



11.

Deduplication —> interval 5mins

## 什么是 Deduplication（消息去重）？

- 在 FIFO 队列里，Deduplication 是用来避免重复消息被重复处理的机制。
- 它确保即使发送了重复的消息，队列也只会保留并处理一条，避免业务逻辑重复执行。
content based

Provide ID



Message Grouping

消息分组 可以分开按顺序访问



12.

SNS

Amazon SNS（Simple Notification Service）。

## 总体类比

## ✅ 什么是 Amazon SNS？

> Amazon SNS 是一个“发布-订阅（Pub/Sub）”的消息服务，用于让系统中的多个组件之间实现解耦通信。

- 它可以让一个“发布者”将消息广播给一个或多个“订阅者”。
- 支持多种订阅类型，比如：
## ✅ 工作机制（Publish / Subscribe）

1. 你创建一个 SNS Topic（主题）
1. 多个订阅者订阅该 Topic
1. 发布者发布一条消息到该 Topic
1. SNS 将这条消息“广播”到所有的订阅者（1对多）


many AWS services can send data to SNS for notifications



Security



13.

SNS+SQS Fan Out

## 🔥 什么是 SNS + SQS Fan-Out 模式？

Fan-Out（扇出）模式：

是指你使用 一个 SNS Topic 将消息广播（Fan Out）给多个 SQS 队列，

每个队列可以由不同服务独立异步消费，实现 一对多、解耦处理。

## 📌 场景举例

下单事件广播系统：

1. 用户下单成功后，系统向 SNS Topic 发送消息
1. SNS 会广播这个“订单已创建”事件到多个 SQS 队列：
1. 每个服务通过订阅自己的 SQS 队列异步处理，无需相互感知


> SNS 是消息的广播者，SQS 是消息的订阅者（接收者）。



S3 events to mulitple queues



## 什么是 Amazon Kinesis Data Firehose？

> Kinesis Data Firehose 是 AWS 提供的实时数据流投递服务，它可以将实时数据自动传输到数据湖、数据仓库、分析工具等目标中，无需管理服务器或写数据处理代码。



message filtering

过滤之后从SNS给到不同的SQS



14.hands on



15.考试必考

kinesis —> collect process analyze

它是实时数据管道的基石，适用于 毫秒级数据处理 场景。

## 🔥 Kinesis 产品家族（4 个服务）



16.

Kinesis data streams — > multiple shards分片

retention保留1-365days

不可删除

capacity mode： provision mode,on-demand mode



17.

Kinesis Producers怎么message进去kinesis

into data streams(SKD,KPL,agent）

注意负载平衡



provision throughput exceeded

你请求的数据读取或写入速率超过了你为服务预设的吞吐量限制。

- SQS 队列
- Lambda 函数
- Email
- SMS
- HTTP/HTTPS 端点
- 📨 Email Service（通知用户）
- 🚚 Logistics Service（发货处理）
- 📦 Inventory Service（库存扣减）
—> distributed partition key / increase shards / retry



18.

Kinesis consumers

两个模式 classic 和 enhances

Fan-Out 是指：

> 一条数据流可以被多个消费者并行消费，不会互相影响。

Kinesis 支持两种 fan-out 模式：

## “Pull”（拉取） vs “Push”（推送）

### 1. Shared Fan-Out 是 Pull 模式

- 客户端自己主动去拉数据：消费者调用 Kinesis 的 GetRecords API，不断地请求“有没有新数据？”
- 就像你去超市排队买东西，你要自己走过去排队，然后买货。
- 缺点：如果请求频率太低或者网络延迟，数据可能来得慢；多消费者还会抢资源，互相影响。
### 2. Enhanced Fan-Out 是 Push 模式

- Kinesis 主动把数据“推送”给消费者：消费者调用 SubscribeToShard API 后，Kinesis 会实时推送新数据给消费者。
- 就像超市送货上门，你不必自己去排队，而是货直接送到你家门口。
- 优点：延迟更低，多个消费者之间互不影响，适合对实时性要求高的场景。
## 直观对比

## 总结一句话：

> Pull 是你主动去要数据，Push 是数据主动送给你。

这也是为什么 Enhanced Fan-Out 延迟更低、性能更稳定，但会额外收费，因为它需要额外的实时推送资源。



19.hands on

用cloudShell做测试拉取



20.

Client Library KCL

AWS Kinesis Client Library（简称 KCL）是一个官方提供的客户端库，目的是简化开发人员从 Kinesis Data Streams 消费数据 的过程。

## KCL 的作用

- 自动管理 Shard 分片的读取，帮你自动跟踪每个 shard 读取的位置（checkpoint），保证消费的可靠性
- 支持 负载均衡，多实例消费者之间自动分配 shard，实现水平扩展
- 自动处理 shard 重新分片（split/merge），无需手动管理
- 支持 故障恢复，确保消费者崩溃后能从断点继续读数据
- 提供简洁的接口让你专注于“业务处理”，不用操心底层细节


KCL（Kinesis Client Library）会自动将 Kinesis Stream 中的多个 shards 分配给多个 KCL 应用实例，以实现 并行消费 和 负载均衡。

## 🧠 简单理解：

你可以把一个 Kinesis Stream 看作一个“多车道高速公路”（shards），

而 KCL 就是一个“调度系统”，把这些车道自动分配给多个处理车的“交通员”（应用实例）





21.

Kinesis operation- shard splitting

divid the hot shard—→ splitting it

在 Amazon Kinesis Data Streams 中，每个 shard（分片） 提供固定的读写能力：

- 写入：最多每秒 1MB 或 1000 条记录
- 读取：最多每秒 2MB
如果你的流量超过一个 shard 能力，就需要 拆分 shard 来扩展吞吐量，这就叫 Shard Splitting。



shard merging合并

## 为什么要 merge？

- 你之前拆分过 shard（比如从 1 个拆成 4 个），但现在流量下降了
- 为了节省成本（Kinesis 按 shard 计费）
- 想减少 shard 数，降低 checkpoint/管理复杂度


22.

Kinesis Data Firehose

### 什么是 Amazon Kinesis Data Firehose？

Kinesis Data Firehose 是 AWS 提供的 实时数据传输服务，用于将流式数据自动 加载（deliver）到目标存储或分析服务，比如：

- Amazon S3
- Amazon Redshift
- Amazon Elasticsearch Service (现在是 Amazon OpenSearch)
- Splunk
- 以及自定义 HTTP 端点
### 它和 Kinesis Data Streams 的区别？

## 🔥 一句话区分：

1. hands on
1. Data analysis SQL application
这是指 通过 SQL 来分析数据的应用，也叫 SQL-based analytics application。这类工具或服务允许你用熟悉的 SQL 语句去分析海量数据，常用于：

- 查询日志、传感器数据、点击流等
- 做实时或批量数据分析
- 构建仪表盘（dashboard）和报表


25.SQS VS SNS VS Kinesis

## 🧠 一句话区分：

## 📊 对比表格：

1. Ordering data into Kinesis
在 Amazon Kinesis Data Streams 中，要将数据有序地放入流中，核心概念是：

👉 使用 Partition Key 保证在相同 Shard 中的数据是有顺序的。



for SQS, no ordering

FIFO ordering

AWS Lambda 是一种无服务器（serverless）计算服务，它让你可以运行代码而无需管理服务器。你只需上传代码，Lambda 会在需要时自动运行、扩展和计费，只按用量收费。

## 🧠 核心概念

## ✅ 支持触发源（常见）

- S3（对象创建触发）
- API Gateway（HTTP 请求触发）
- CloudWatch（定时任务）
- DynamoDB Streams（数据更改）
- SQS（消息触发）
- SNS（通知触发）
- Kinesis（流数据处理）
- EventBridge（事件总线）


01.Serverless—→ Lambda



02.introduction

what is Serverless?  ⇒ FaaS(function as Service)

is a new paradigm in which the developers do not have to manage servers anymore

Serverless（无服务器）是一种云计算架构模型，不是真的没有服务器，而是指你不需要管理服务器。云服务商（如 AWS、Azure、GCP）会在背后为你自动分配、运行和扩展服务器资源，你只需关注写业务逻辑代码。

## ✅ 通俗理解

> “Serverless 就是我写好代码，上传到云端，不用管部署、扩容、运维，云服务自动搞定，按调用次数计费。”

## ✅ 特点总结

Serveless in AWS:

Lambda, Dynamo DB,Cognito,API Gateway,S3…



03.

考试必考！

Why AWS Lambda?

no servers, run on-demand, short executions,scal;ing is aautomated!

easy price

integration

Thumbnail creation

在 AWS 中，**"Thumbnail creation"（缩略图生成）**是一个非常常见、典型的 Serverless 应用场景，可以完全由 AWS 的 Serverless 服务来实现，不需要你自己搭建服务器！

## 📸 场景描述

用户上传图片 → 自动生成缩略图 → 存储到另一个 S3 桶（或同一个桶的不同路径）



Serverless CRON job

在 AWS 中，Serverless CRON job 是指不依赖 EC2 或服务器的定时任务，可以用 Lambda + EventBridge（以前叫 CloudWatch Events） 实现。

## ✅ 核心概念



04.hands on 很重要



05.Synchronous invocation

在 AWS 中，Lambda 的 Synchronous Invocation（同步调用） 是指：

> 调用者会等待 Lambda 函数执行完成并拿到结果，然后再继续后续操作。

CLI,SKD,API Gateway,Load Balancer

直接返回result



06.hands-on(cloudshell)

~ $ aws lambda invoke   --function-name DemoLambda   --cli-binary-format raw-in-base64-out   --payload '{"key1":"value1","key2":"value2","key3":"value3"}'   --region us-east-1   response.json
{
"StatusCode": 200,
"ExecutedVersion": "$LATEST"
}
~ $



07.

Lambda integration with ALB Application Load Balancer (ALB)

## 什么是 Lambda 与 ALB 集成？

- Application Load Balancer (ALB) 是 AWS 提供的第七层负载均衡器，支持 HTTP/HTTPS 请求路由。
- ALB 可以直接调用 Lambda 函数 作为目标（Target），这意味着 ALB 收到 HTTP 请求后，可以把请求“转发”给 Lambda 执行。
- 这样，你就能用 Lambda 来处理来自 ALB 的 Web 请求，实现无服务器的 HTTP 服务。
## 为什么用 ALB + Lambda？

- ALB 支持 HTTP/HTTPS 协议，适合处理 REST API 或 Web 应用流量。
- Lambda 让你免维护服务器，自动弹性伸缩。
- 结合使用可以轻松实现无服务器的 Web 后端。
## ALB Lambda 集成工作流程

```plain text

客户端 HTTP 请求
      ↓
Application Load Balancer (ALB)
      ↓
调用 Lambda 函数
      ↓
Lambda 处理请求，返回响应
      ↓
ALB 将响应转发给客户端
```

ALB to Lambda : HTTP To JSON

Application Load Balancer (ALB) 把 HTTP 请求转成 JSON 格式的事件，传给 Lambda 函数。

## 具体来说：

- ALB 作为 HTTP/HTTPS 请求的入口
- 它会把每个 HTTP 请求转成一个 JSON 对象，作为 Lambda 的输入事件（event）
- Lambda 通过解析这个 JSON，就能拿到请求方法、路径、头信息、查询参数、请求体等数据


ALB Multi-Header Values (考试会考)

ALB（Application Load Balancer）支持Multi-Header Values，意思是一个 HTTP 响应头可以带多个同名的值。



08.hands on 走一个EC2 ALB-lambda流程



09.

Lambda@Edge 边缘节点 = 离用户近的数据中心，帮你加速内容分发和处理请求。

Lambda@Edge 是 AWS Lambda 的一个扩展服务，专门用于与 Amazon CloudFront（AWS 的全球内容分发网络，CDN）集成，允许你在 CloudFront 边缘节点上运行 Lambda 函数，从而实现低延迟、高效的请求处理和内容定制。

### Lambda@Edge 的核心特点

- 运行在边缘节点：你的代码部署在 CloudFront 全球各地的边缘位置，用户请求时离用户最近的节点执行代码，降低延迟。
- 响应更快：比起传统在中心区域（如 AWS 区域内）执行 Lambda，边缘执行减少了网络往返时间。
- 支持多种触发点：可以在以下四个事件触发 Lambda 函数：
你在悉尼，访问一个部署在美国的服务器：

- 普通访问：请求直接飞到美国，响应再回到悉尼，速度慢，延迟高。
- 使用 CloudFront 边缘节点：请求先到悉尼附近的边缘节点，边缘节点缓存了内容或运行 Lambda@Edge 处理请求，再返回给你，速度快很多。


10.Asychronous invocation

在 AWS Lambda 中，Asynchronous Invocation（异步调用） 是指你调用一个 Lambda 函数后，不等待函数执行完成就立即返回，由 AWS 自动在后台EventQueue执行函数逻辑。

- Viewer Request（用户请求到达 CloudFront 时）
- Viewer Response（CloudFront 返回响应给用户之前）
- Origin Request（CloudFront 向源站发起请求之前）
- Origin Response（源站响应返回给 CloudFront 之前）
### ✅ 简单理解：

你“扔”一个任务给 Lambda，AWS 说“你走吧，我帮你搞定，搞完了我再处理后续的事，比如重试或记录日志。”

### 📦 异步调用的场景

适合以下情况：

- 任务耗时较长，不希望调用方等待（如处理图片、视频转码等）
- 触发事件后不需要立即返回结果（如 S3 上传文件后触发 Lambda）
- 解耦业务逻辑（如用户注册后异步发送欢迎邮件）
Idemoptent

S3,SNS,CloudWatch,CodeCommit…



11.hands on

~ $ aws lambda invoke   --function-name DemoLambda   --cli-binary-format raw-in-base64-out   --payload '{"key1":"value1","key2":"value2","key3":"value3"}' --invocation-type Event   --region ap-southeast-2   response.json
{
"StatusCode": 202
}
以异步方式（--invocation-type Event）

只是不返回文件，内容从CloudWatch logs看



可以用SQS做DLQ，retry max到了之后到DLQ



12.

CloudWatch Events/EventBridge⇒可以做CRON

你提到 CloudWatch Events/EventBridge，这通常是指 使用 EventBridge 来触发 Lambda 函数。

## 🔄 什么是 CloudWatch Events / EventBridge？

AWS EventBridge（之前叫 CloudWatch Events）是一个 事件总线服务，可以基于各种事件（如计划任务、S3 文件上传、EC2 状态改变、Lambda 自定义事件等）自动触发目标服务，比如：

- Lambda 函数
- Step Functions
- SQS 队列
- SNS 通知
- ECS 任务等


13.hands on CRON bridge

AWS EventBridge =⇒ triger CRON on Lambda



14.

S3 Event Notifications



15.S3 hands on



16.

Event Source mapping

“Event Source Mapping” 是 AWS Lambda 用来连接某些事件源（Event Sources）和 Lambda 函数的配置，允许 Lambda 自动消费来自事件源的数据，比如：

- AWS Kinesis Streams
- Amazon DynamoDB Streams
- Amazon MQ
- Amazon Managed Streaming for Apache Kafka (MSK)
等流式数据源。

### Event Source Mapping 是什么？

它本质上是一种绑定关系，Lambda 会自动轮询事件源（比如 Kinesis 或 DynamoDB Streams），然后触发 Lambda 处理新到的数据记录。

- Event Source Mapping 是 Lambda 和数据流（比如 Kinesis 或 DynamoDB Streams）之间的“自动连接器”。
- 它帮你“持续监听”这些数据流，一有新数据就自动拉取并触发 Lambda 执行。
- 你不用自己写代码去轮询，Lambda 会自动帮你处理数据流里的“新消息”。


17.hands on SQS



18.

Lambda destionation

Lambda destinations 是 当 Lambda 执行完成后自动转发结果 的一种机制，可以用来追踪 异步调用的结果（成功或失败）。它常用于：

- 异步调用时收集处理结果
- 替代手动写日志或错误处理逻辑
- 连接后续流程（如 SNS、SQS、EventBridge、另一个 Lambda）
推荐用这个来代替DLQ！



19.hands on Lambda destionation



20.

Lambda Execution Role(IAM)

「Lambda 在 AWS 里的权限通行证」

—— 只有这个角色授权了，Lambda 才能访问其他 AWS 服务。

Lambda Execution Role (IAM) 是指 AWS Lambda 执行函数时使用的 IAM 角色，它控制该 Lambda 拥有哪些 AWS 服务的访问权限。

### 🧠 简单理解：

这是 Lambda 的“身份”，它决定 Lambda 可以：

- 访问哪些资源（比如读取 S3 文件、写入 DynamoDB、发送 SNS 邮件等）；
- 被哪些服务调用（如被 EventBridge、S3、API Gateway 等触发）；
最好是one role per function

base poliy ⇒这份策略就是最基本的 —— 只允许 Lambda 把日志写到 CloudWatch。



21.hands on different permission (考试必考！）



22.

Lambda Environment variables ⇒ key value pairs

在 AWS Lambda 中，Environment Variables（环境变量） 是用来在运行时为你的函数传递配置信息的一种方式。



1. hands on Lambda Environment variables


24.Lambda monitoring and logging

CloudWatch logs/metrics

X-ray

AWS X-Ray 是一个分布式追踪服务，用来分析和调试你的应用程序，特别适合微服务、Lambda、API Gateway 等。它能帮你看到请求在系统中的执行路径、延迟、错误等情况，方便定位性能瓶颈和故障。

### X-Ray 主要功能

- 分布式追踪（Tracing）：跟踪请求跨多个服务的流程。
- 性能分析：查看延迟来源，识别慢请求。
- 错误检测：定位异常和错误点。
- 服务地图（Service Map）：展示系统中各服务的调用关系。
考试会考



25.Lambda trace hands on

“Throttle”（节流）在 AWS 和编程中常见，意思是限制操作频率，防止资源过载。具体到 AWS Lambda 或 AWS 服务里，它指的是限制单位时间内请求或调用的次数，避免系统过载或滥用。



26.

Lambda in VPC

default in AWS owned VPC

## 什么是 Lambda in VPC？

AWS Lambda 默认运行在 AWS 管理的一个共享网络环境中（不是在你的私有网络里）。如果你需要让 Lambda 函数访问你自己 VPC（虚拟私有云）内的资源（比如 RDS 数据库、ElastiCache、私有子网内的服务），就必须把 Lambda 配置到你的 VPC 里。

## 为什么要把 Lambda 放进 VPC？

- 访问私有资源：只能在 VPC 内部访问的数据库、缓存、内部 API 等。
- 安全隔离：在 VPC 内能更好控制安全组、网络访问策略。
- 满足合规要求：部分业务需要运行在专有网络环境中。
## Lambda in VPC 的关键点

1. 子网（Subnet）
1. 安全组（Security Group）
1. NAT Gateway（NAT网关）或 NAT实例
1. 权限


你需要给 Lambda 选择一个或多个 VPC 子网（一般是私有子网）运行。

分配给 Lambda 的安全组控制它的入站和出站流量。

如果 Lambda 需要访问公网（比如访问外部 API），而你选择的是私有子网，必须配置 NAT Gateway，供 Lambda 访问互联网。

Lambda 角色的 IAM 权限需要包含ec2:CreateNetworkInterface、ec2:DescribeNetworkInterfaces、ec2:DeleteNetworkInterface，因为 Lambda 会在 VPC 内创建和管理弹性网卡（ENI）。



Deploying a Lambda function in public subnet does not give it internet access or a public IP！！

用NAT Gateway/instance

27.hands on Lambda in VPC



28.

