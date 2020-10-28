function windowScroll(id, number, direction) {
    var oHtml = document.documentElement;
    //在IE8以下不支持使用class选取元素，这里采用id
    var oContent = $(id)[0];
    //获取文档的高度
    var cHeight;
    if(direction === "top" ) {
        cHeight = oHtml.clientHeight;
    }else if( direction === "left" ) {
        cHeight = oHtml.clientWidth;
    }

    //用于控制鼠标每个多长时间才能让页面滚动设置的变量
    var count = 1;
    //在窗口尺寸改变的时候实时给cHeight赋值
    window.onresize = function () {
        if(direction === "top" ) {
            cHeight = oHtml.clientHeight;
        }else if( direction === "left" ) {
            cHeight = oHtml.clientWidth;
        }
    };
    if(window.addEventListener) {
        //用于判断当前浏览器是否为FF
        if( navigator.userAgent.toLowerCase().indexOf("firefox") !== -1 ) {
            oHtml.addEventListener("DOMMouseScroll", function (e) {
                //FF浏览器的滚动条滚动上下判断是与其它浏览器相反的，负值是向上滚动
                if( count === 1 ) {
                    //滚轮向上滚动时
                    if( e.detail < 0 ) {
                        upRoll();
                    }
                    //e.detail是正值说明是想下滚动
                    else if( e.detail > 0 ) {
                        downRoll();
                    }
                }
                //阻止浏览器页面滚动的默认事件
                e.preventDefault();
            }, false);
        } else {
            oHtml.addEventListener('mousewheel',function (e) {
                var event = e || window.event;
                //当count = 1 时让页面可以滚动
                if( count === 1 ) {
                    //当鼠标向上滚动时
                    if( event.wheelDelta > 0 ) {
                        upRoll();
                    }
                    //当鼠标向下滚动时
                    if( event.wheelDelta < 0 ) {
                        downRoll();
                    }
                }
                //阻止浏览器滚动的默认事件，防止页面来回晃动
                event.preventDefault();
            }, {passive: false});
        }
    } else if(window.attachEvent) {
        oHtml.attachEvent("onmousewheel",function(){
            console.log(count);
            if( count === 1 ){
                //当鼠标向上滚动时
                if( event.wheelDelta > 0 ) {
                    upRoll();
                }
                //当鼠标向下滚动时
                if( event.wheelDelta < 0 ) {
                    downRoll();
                }
            }
            //阻止浏览器滚动的默认事件，防止页面来回晃动
            return false;
        });
    }

    //向上滚动时执行的函数
    function upRoll(){
        if( getElemProp(oContent, direction) >= 0 ) {
           // oContent.style[direction] ='0px';
            console.log("到顶了");
           
        }
        else {
            
            elemDisplace(oContent, direction, 30, cHeight);
            //如果鼠标不是在顶部往上滚动的话就将count++
            count++;
            setTimeout(function () {
                //当过了1000ms后把count置为1，让页面可以继续滚动
                count = 1;
            }, 200);
            
        }
    }

    //向下滚动时执行的函数
    function downRoll() {
        //判断是否滚动到底部
        if( getElemProp(oContent, direction) <= -number*cHeight ) {
            //oContent.style[direction] =document.body.scrollHeight +'px';

            console.log("到底了");
        }
        else {
            elemDisplace(oContent, direction, -30, cHeight);
            //如果鼠标不是在顶部往上滚动的话就将count++
            count++;
            setTimeout(function () {
                //当过了1000ms后把count置为1，让页面可以继续滚动
                count = 1;
            }, 200);
        }
    }
}

//让元素加速运动
function elemDisplace(elem, direction, speed, distance){
    $(elem).css("position","relative");
    var zh=document.body.scrollHeight;
    //记录元素当前的位置
    var origin = parseInt( getElemProp(elem, direction) );
    var pos;
    var Timer = setInterval(function(){
        pos = parseInt( getElemProp(elem, direction) );
        //判断元素是否位移到了指定的地方
        if( Math.abs(pos - origin ) >= distance ){
            if(speed > 0){
                if( (origin + distance)>0){
                    elem.style[direction] = '0px';
                }else{
                     elem.style[direction] = origin + distance + 'px';
                }
               
            }else {
                elem.style[direction] = origin - distance + 'px';
            }
            speed = 0;
            clearInterval(Timer);
        }else {
            //判断元素的位移方向
            if(speed > 0) {
                speed++;
            } else {
                speed--;
            }
            if(zh<(pos + speed)){
                elem.style[direction] ='0px';
                clearInterval(Timer);
            }
            elem.style[direction] = pos + speed + 'px';
            
        }
    },15);
}


//获取元素属性
function getElemProp(elem, prop){
    if(window.getComputedStyle){
        return parseInt(window.getComputedStyle(elem, null)[prop]);
    }else{
        return parseInt(elem.currentStyle[prop]);
    }
}