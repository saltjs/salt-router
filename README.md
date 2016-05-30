# salt-router
## 简介
Salt_router.js 主要功能是跟 Native 深度结合的一些 API 的封装，在项目中主要解决一些路由上的一些问题以及增加转场等的一些动画，另外还涉及到了 view 之间共享数据，以及多 view 的preload 等功能,API统一支持Promise,方便使用者调用;

## 使用方式
目前没有发布npm源，所以使用暂时clone到本地使用,代码中支持两种方式引入

```js
<script type="text/javascript" src="/xx/xx/salt-router.js"></script>

<script type="text/javascript">
    window.salt.router.preload({}).then().catch();
</script>


```
支持Commonjs规范的`require`

```js

var Salt_router = require('salt-router');

// Salt_router.preload

```

## APIs

### preload
 * Demo
 
  ```js
 
    Salt_router.preload({
            pages:[{
                id:'id1', // frame id
                url:'xxx' // frame url
            }] 
    }).then((data)=>{
        // TODO 
    }).catch((e)=>{
        // 捕获异常,或者根据返回code执行降级代码
    })
 
  ```
 
 * 功能
        用于项目中预加载某些不需要特定数据交互的页面，一般是数据变化比较少的页面;
 * 参数
     * pages:`Object` 预加载的页面的数组对象，其中单个对象中包括
      * id: `String` 自定义的frame id,唯一
      * url: `String` 预加载的页面的url
 
 * 依赖API:dd.ui.nav.preload

 
### recycle
* Demo

```js


Salt_router.recycle({
        id:['a','b'] // frame id
}).then((data)=>{
        // TODO
}).catch((e)=>{
        // 捕获异常,或者根据返回code执行降级代码
})

``` 

* 功能
        用于释放(销毁)没有用的 webView
* 参数 
    * recycle:`String` API名称
    * id:`Array` 需要释放的frame id数组;
* 依赖API:dd.ui.nav.recycle


### push
* Demo

```js
Salt_router.push({
        id:'xxx', // frame id 
        url:'xxx', // 跳转的frame 所需要加载的url
        anim:1, // 转场动画,1:从左到右,2:bottom 从下往上;默认1;
        needPost:true // 是否需要发送数据到加载的frame;
        param:'xxx' // 当needPost 是true的时候发送的数据
}).then(()=>{}).catch((e)=>{
})

```
* 功能
        用于创建并且跳转一个新的webView
* 参数
    * id:`String` frame id
    * url:`String` 跳转的frame 所需要加载的url
    * anim:`number` 转场动画,1:从左到右,2:bottom 从下往上;默认1;
    * needPost:`bool` 是否需要发送数据到加载的frame;
    * param:`Object` 当needPost是true的时候发送的数据，直接json对象,以及字符串;数据存储的key就是frame id;
* 依赖API:dd.ui.nav.push
* 备注: 发送的数据默认获取从getMessage中获取;

    
### goBack
* Demo

```js

Salt_router.goBack();

```
* 功能
    返回历史记录的上一层
    
    
    
### pop
* Demo

```js

    Salt_router.pop({
        to:'xxx' // frame id 
    }).then(()=>{
    }).catch((e)=>{
    })

```
* 功能
    功能中有2部分，包括了view 之间的跳转;
* 参数
    * to:`String` 需要返回到指定的frame 的id;返回当前frame 之后堆栈上层的view 都会全部注销;
* 备注:当to 不存在的时候默认会直接返回上一个frame;

### postMessage
* Demo

```js
// @param opt 可以是Array,也可以是Object;
// @example
// [{key:'home',value:'123'},{key:'detail',value:'333'}] or {key:'app',value:'111'} 
Salt_router.postMessage(opt).then().catch();

```
* 功能
    当前api 主要是对已经存在的frame 发送数据;
* 参数
    * key:存储的key 值;
    * value:key 对应的value
* 依赖API:dd.runtime.message.post


### getMessage
* Demo

```js

    Salt_router.getMessage('key');

```
* 功能
    获取别的frame 中存入的key,value 数据;
* 参数
    * key:`String` 存储的数据的key 值;


## 依赖
* Promise 针对不支持promise的浏览器需要单独引入
* dingTalk 钉钉单独的sdk.js 








