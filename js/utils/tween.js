var tween = {
    //当前时间*变化量/持续时间+初始值
    zfLinear: function(t,b,c,d){ return c*t/d + b; },
    Quad: {//二次方的缓动（t^2）；
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },
    Cubic: {//三次方的缓动（t^3）
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    },
    Quart: {//四次方的缓动（t^4）；
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    },
    Quint: {//5次方的缓动（t^5）；
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        }
    },
    Sine: {//正弦曲线的缓动（sin(t)）
        easeIn: function(t,b,c,d){
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t,b,c,d){
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }
    },
    Expo: {//指数曲线的缓动（2^t）；
        easeIn: function(t,b,c,d){
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t,b,c,d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {//圆形曲线的缓动（sqrt(1-t^2)）；
        easeIn: function(t,b,c,d){
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        }
    },
    Elastic: {//指数衰减的正弦曲线缓动；
        easeIn: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
        },
        easeInOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        }
    },
    Back: {//超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
        easeIn: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    },
    zfBounce: {//指数衰减的反弹缓动。
        easeIn: function(t,b,c,d){
            return c - tween.zfBounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t,b,c,d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOut: function(t,b,c,d){
            if (t < d/2) return tween.zfBounce.easeIn(t*2, 0, c, d) * .5 + b;
            else return tween.zfBounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    }
};
/**
 * 动画方法示例
 * @param ele 要运动的元素
 * @param oTarget  要变化的属性目标值集合
 * @param duration  要用的总时间
 * @param effect  动画效果
 * @param callback  回调函数
 */
function animate(ele,oTarget,duration,effect,callback){
	var fnEffect=tween.Expo.easeOut;//让这个效果做为默认效果
	if(typeof effect == "number"){
		switch(effect){
			case 0:
				break;
			case 1:
				fnEffect=tween.Circ.easeOut;
				break;
			case 2:
				fnEffect=tween.Elastic.easeOut;
				break;
			case 3:
				fnEffect=tween.Back.easeOut;
				break;
			case 4:
				fnEffect=tween.zfBounce.easeOut;
		}
	}else if(effect instanceof Array){
		if(effect.length==1){
			fnEffect=tween.zfLinear;
		}else if(effect.length==2){
			fnEffect=tween[effect[0]][effect[1]]
		}
	}else if(typeof effect=="function"){
		callback=effect;
	}
	var oBegin={};//用来各方向开始值
	var oChange={};//用来保存各方向的距离值
	var counter=0;
	for(var attr in oTarget){
		var target=oTarget[attr];
		begin=getCss(ele,attr);
		change=target-begin;
		if(change){
			oBegin[attr]=begin;
			oChange[attr]=change;
			counter++;//如果有有效值，则让记数器累加一次
		}
	}
	if(counter===0)return;//如果没有有效运动距离，则退出此方法。（不必再浪费性能了）
	var times=0;
	var interval=15;
	window.clearInterval(ele.timer);//清除动画积累的
	function step(){
		times+=interval;
		if(times<duration){
			for(var attr in oChange){//把各方向都移动一次
				var begin=oBegin[attr];
				var change=oChange[attr];
				var value=fnEffect(times,begin,change,duration);
				setCss(ele,attr,value);			
			}
		}else{
			for(var attr in oTarget){
				var target=oTarget[attr];
				setCss(ele,attr,target);
			}
			window.clearInterval(ele.timer);
			ele.timer=null;
			if(typeof callback=="function"){
				callback.call(ele);	
			}	
		}
	}
	ele.timer=window.setInterval(step,interval);
}
function getCss(ele,attr){
    if(window.getComputedStyle){
        return parseFloat(getComputedStyle(ele,null)[attr]);
    }else{//专门处理IE的方案
        if(attr=="opacity"){
            var reg=/alpha\(opacity=(\d+)\)/
            var str=ele.currentStyle.filter;
            if(reg.test(str)){
                return RegExp.$1/100;
            }else{
                return 1;
            }
        }
        return parseFloat(ele.currentStyle[attr]);
    }
}
function setCss(ele,attr,value){
    if(attr=="opacity"){
        ele.style.opacity=value;
        ele.style.filter="alpha(opacity="+value*100+")";
    }else{
        ele.style[attr]=value+"px";
    }
}