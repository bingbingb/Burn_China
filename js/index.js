/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//图片播放
var obj=document.all.elf1;
	var i=2;
	function jingli(){
		obj.src="img/小精灵"+i+".png";
		i++;
		if(i>15){
			i=1;
		}setTimeout("jingli()",200);
	}setTimeout("jingli()",200);
	var obj2=document.all.quan;
	var h=0;
	function quan(){
		obj2.src="img/圈"+h+".png";
		h++;
		if(h>9){
			h=0;
		}setTimeout("quan()",400);
	}setTimeout("quan()",400);
	
	//加载
	(function() {
				var loader = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 300, easingIn : mina.easeinout } );
				
				loader.show();
							
				setTimeout( function() {
					loader.hide();
				}, 1000 );

				var h=document.body.scrollHeight / document.body.clientHeight ;
				//windowScroll("body", Math.floor(h), "top")
			})();
	
	//播放音乐
 $(function(){
            //播放完毕
            $('#mp3Btn').on('ended', function() {
                console.log("音频已播放完成");
                $('.btn-audio').css({'background':'url(img/feng.png) no-repeat center bottom','background-size':'cover'});
            });
            //播放器控制
            var audio = document.getElementById('mp3Btn');
            audio.volume = .3;
            $('.btn-audio').click(function() {
                event.stopPropagation();//防止冒泡
                if(audio.paused){ //如果当前是暂停状态
                    $('.btn-audio').css({'background':'url(img/feng.png) no-repeat center bottom','background-size':'cover'});
                    audio.play(); //播放
                    return;
                }else{//当前是播放状态
                    $('.btn-audio').css({'background':'url(img/zanting.png) no-repeat center bottom','background-size':'cover'});
                    audio.pause(); //暂停
                }
            });
			 if(audio.paused){ //如果当前是暂停状态
                    $('.btn-audio').css({'background':'url(img/feng.png) no-repeat center bottom','background-size':'cover'});
                    audio.play(); //播放
                    return;
                }else{//当前是播放状态
                    $('.btn-audio').css({'background':'url(img/zanting.png) no-repeat center bottom','background-size':'cover'});
                    audio.pause(); //暂停
                }
        });
		
window.onload = function() {
				var story = document.getElementById('bt');
				var s = document.getElementById('jh');
				var i = 1;
				timer = setInterval(function() {
					s.innerHTML = story.innerHTML.substring(0, i);
					i++;
					if(s.innerHTML === story.innerHTML) {
						clearInterval(timer);
					}
				}, 200);
			};
			$(document).ready(function(){
				 $(".beita").click(function(){
				$(this).hide(1500);
			});
			setTimeout(function(){
				$(".beita").hide(1000);
			},11000);
			
	
		$("#jiLun").mouseover(function(){
				$(".heng").css("display","block");
			});
		$("#jiLun").mouseout(function(){
				$(".heng").css("display","none");
			});
		
			
	//翻页
	$('#index_main').fullpage({
	'navigation': true,
	slidesNavigation: true,
	controlArrows: false,
	continuousHorizontal:true,
	scrollingSpeed:900,
	showActiveTooltip :true, 
	anchors: ['hero', 'one', 'two', 'three','four','five'],
	loopHorizontal: true,
	onLeave: function(index, direction){
	}
});
	$(".tucj").each(function(){
		$(this).mouseover(function(){
				$(this).css({"height":"calc(70%)","width":"calc(70%)","marginTop":"5%"});
			});
		$(this).mouseout(function(){
				$(this).css({"height":"calc(50%)","width":"calc(50%)","marginTop":"20%"});
			});
		});
		
	$(".gbei").each(function(){
		$(this).click(function(){
			$(this).css({
                "transformStyle": "preserve-3d",
                "-webkitTransform": "rotateY(180deg)",
                "-webkitTransition": "all 0.6s"
            });
		});
	});
});