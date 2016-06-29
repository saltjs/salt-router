/**
 * Salt_router Component for Native
 * @author ruiyang.dry
 * update by 2016年05月23日16:05:01 for add Promise
 * @example
     Salt_router.pagePreload({}).then((data)=>{
     }).catch((e)=>{
     })
 */

const Salt_router ={
    /**
     * 页面预加载API
     * @param  {Array}  opt.pages 预加载的frame id数组;example: opt.pages = [{id:'id1',url:'xxx'}]
     * @param {arguments} data preload 成功之后返回值,其中包含frame的状态等
     * @example
     * data:{
            id: 'id1', // 报告状态的frame id
            status: 0, // frame 状态，0:开始加载;1:加载完成;-1:加载失败;
            extras: {} // 错误状态的信息，在成功加载时可以忽略
         }
     */
    preload:function(opt){
        return new Promise(function(resolve,reject){
            if(register()){
                if(isStr(opt) || isNumber(opt)){
                    opt = {
                        pages:[]
                    }
                };
                dd.ui.nav.preload({
                    pages: opt.pages,
                    onSuccess: function(data) {
                        resolve(data);
                    },
                    onFail: function(err) {
                        reject(err);
                    }
                });
            }else{
                reject({
                    errorCode:1001,
                    errorMessage:'客户端版本太低'
                })
            }
        });
    },

    /**
     * 页面释放API
     * @param  {Array}   ids 需要释放的frame;
     */
    recycle:function(ids){

        return new Promise(function(resolve,reject){
            if(register()){
                if(type(ids) =='array'){
                    dd.ui.nav.recycle({
                        ids: ids,
                        onSuccess:function(){
                            resolve('success');
                        },
                        onFail:function(){
                           reject('fail');
                        }
                    })
                }
            }else{
                reject({
                    errorCode:1001,
                    errorMessage:'客户端版本太低'
                })
            }

        })
    },

    /**
     * 生成frame并且跳转
     * @param {String} id 需要跳转的frame 的id;
     * @param {String} url 需要跳转的frame 的url;
     * @param {Number} anim 转场动画:1:从右侧向左侧拉; 2:从底部向上,{anim: 3, transit: {from: {top: 123, height: 456}}}
     * @param {Object} transit 当anim:3的时候的参数
     * @param {Boolean} needPost 是否需要传输数据到新创建的或者跳转的frame;
     * @param {Object} param 当needPost 为true 时发送的json 数据;
     */
    push:function(opt){
        return new Promise(function(resolve,reject){
            if(register()){
                if(opt.needPost){
                    var _objStr;
                    try {
                        _objStr = isObj(opt.param)?JSON.stringify(opt.param):opt.param;
                    } catch (e) {
                        _objStr = '';
                    }
                    window.localStorage.setItem(opt.id, _objStr)
                };
                dd.ui.nav.push({
                    id:opt.id,
                    url:opt.url,
                    anim: opt.anim,
                    // 目前只有Android支持
                    transit: {
                        from: {
                            top: 123,
                            height: 456
                        }
                    },
                    onSuccess:function(data){
                        resolve(data);
                    },
                    onFail:function(err){
                        reject(err);
                    }
                })

            }else{
                reject({
                    errorCode:1001,
                    errorMessage:'客户端版本太低'
                })
            }
        })
    },

    /**
     * 关闭当前frame
     * @return
     */
    goBack:function(){
        dd.biz.navigation.goBack();
    },

    /**
     * frame之间跳转的路由API
     * @param  {String}   to 需要跳转的frame 的id;当to不存在的时候默认返回历史的上层frame;
     */
    pop:function(opt){
        // 如果当前frame 中有历史记录，则回退当前frame 历史记录，否则关闭当前frame

        return new Promise(function(resolve,reject){
            if(register()){
                if (opt.to || opt.to == '') {
                    dd.ui.nav.pop({
                        to: opt.to,
                        onSuccess: function(data) {
                            resolve(data);
                        },
                        onFail: function(err) {
                            reject(err);
                        }
                    })
                } else {
                    dd.ui.nav.pop({
                        onSuccess: function(data) {
                            resolve(data);
                        },
                        onFail: function(err) {
                            reject(err);
                        }
                    })
                }
            }else{
                reject({
                    errorCode:1001,
                    errorMessage:'客户端版本太低'
                })
            }
        });
    },

    /**
     * 发送消息给指定的frame
     * @param  {Array}   opt 传送的数据对象
     * @todo  update 这种数据传送模式
     */
    postMessage:function(opt){
        // opt.key,opt.value;支持数组
        var t = this;
        if(type(opt) === 'array'){
            opt.forEach(function(item, index){
                if(t.getMessage(item.key)){
                    window.localStorage.removeItem(item.key);
                }
                window.localStorage.setItem(item.key,item.value);
            })
        }else if(isObj(opt) && isStr(opt.value)){
            if(t.getMessage(opt.key)){
                window.localStorage.removeItem(opt.key);
            }
            window.localStorage.setItem(opt.key,opt.value);
        }else{
            throw {"errorCode":'1002',errorMessage:"参数错误"}
        }

    },

    /**
     * 获取从其他的frame 中发送过来的消息
     * @param  {String} key 缓存数据中的key 键
     */
    getMessage:function(key){
        if(isStr(key)){
            return window.localStorage.getItem(key)
        }else{
            throw {"errorCode":'1002',errorMessage:"参数错误"}
        }
    }
};


/*
* 工具函数
*/

function isFn(fn) {
    return 'function' === type(fn);
}

function isStr(str) {
    return 'string' === type(str);
}

function isObj(o) {
    return 'object' === type(o);
}

function isNumber(num) {
    return "number" === type(num);
}

function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object (\w+)\]/, '$1').toLowerCase();
}

function register(name){
    if(window.dd){
        if(dd.compareVersion('2.7.0', dd.version, true)){
            return true;
        }else{
            return false ;
        }
    }else{
        return false;
    }

}

(function(globalObj){
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = globalObj;
    }else{
        if(window.salt){
            window.salt['router'] = globalObj;
        }else{
            window.salt = {
                router:globalObj
            }
        }
    }

})(Salt_router)
