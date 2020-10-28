$(document).ready(chalkboard);

function chalkboard() {
    var canvas = document.getElementById("chalkboard");
    var ctx = canvas.getContext("2d");
    var boardDv = document.getElementById("boardDv");
    var box = $("#box");

    box.css("height", window.innerHeight)
    $("#background").css({
        "top": 100,
        "height": function(){
            if((window.innerHeight) < 960){
                return 860;
            }else{
                return window.innerHeight - 100;
            }
        }
    })

    $("#boardDv").css({
        "margin-left": (window.innerWidth - 1024) / 2 + "px"
    });
    $("#canvasBorder").css({
        "margin-left": function(){
            var rs =  $("#boardDv").offset().left - 40 + "px";
            return rs;
        }
    });
    $("#zhou").css({
        "margin-left": function(){
            var rs =  $("#canvasBorder").offset().left - 40 + "px";
            return rs;
        }
    })

    var width = canvas.width;	//画布的宽
    var height = canvas.height;//画布的高
    var mouseX = boardDv.offsetLeft;
    var mouseY = boardDv.offsetTop;
    var mouseD = false;
    var eraser = false;
    var textSelect = false;
    var hasPosition = false;
    var xLast = boardDv.offsetLeft;
    var yLast = boardDv.offsetTop;
    var brushDiameter = 0;	//虚化
    var eraserWidth = 50;
    var eraserHeight = 100;

    $("#dragTextDv").Tdrag({
        // scope:"#chalkboard",
        handle: ".title"
    });


    window.bgId = 1;//当前需要显示的画板背景

    $('#chalkboard').css('cursor', 'none');


    document.onselectstart = function () {
        return false;
    };
    document.oncontextmenu = function () {
        return false;
    };

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    $("#colorInput").bind("change", function () {
        console.log($("#colorInput").val());
    });

    $(".lineStyle").bind("change", function () {
        ctx.lineWidth = parseInt($("#lineSize").val());
        brushDiameter = parseInt($("#idDiameter").val());
    })
    $("#nextGb").click(showNextBgPng);
    $("#previousGb").click(showPreviousBgPng);
    $("#textSelectBtn").click(selectTextWrite);
    $("#dragTextarea").blur(blurTextArea);
    function ajGetBgPng() {
        var j = {"id": bgId};
        $.ajax({
            type: "post",
            async: false,
            url: "http://120.77.39.52:8080/danmu/hhzg/danmu/findPng",
            dataType: "json",
            data: JSON.stringify(j),
            contentType: "application/json",
            success: function (json) {
                changeImg(json.imgBase64);
            },
            error: function () {
                alert('连接服务器失败！！！');
            }
        })
    }

    function changeImg(imgBase64) {
        var image = $("#pattern");
        imageSrc = "data:image/png;base64," + imgBase64;
        image.attr("src", imageSrc);
    }

    function showPreviousBgPng() {
        bgId--;
        if (bgId < 1) {
            alert("这已经是第一张啦~~")
            bgId = 1;
            return;
        }
        ctx.clearRect(0, 0, 1024, 720);
        ajGetBgPng();
    }

    function showNextBgPng() {
        bgId++;
        ctx.clearRect(0, 0, 1024, 720);
        ajGetBgPng();
    }

    //btn：选择为A
    function selectTextWrite() {
        $("#textSelectBtn").css("background", "yellow");//按钮改色提示
        $(".chalk").css({//去掉粉笔
            "display": "none",
        });
        $("#chalkboard").css("cursor", "text");//显示制作
        $("#dragTextarea").val("");
        textSelect = true;
        hasPosition = false;
    }
    //文本框失去焦点事件
    function blurTextArea() {
        $(".chalk").css("display", "block");
        $("#chalkboard").css("cursor", "none");//显示制作
        textSelect = false;
        hasPosition = false;
        var dx = $('#dragTextDv').offset().left - boardDv.offsetLeft;
        var dy = $('#dragTextDv').offset().top - boardDv.offsetTop;
        drowText("dragTextarea", dx ,dy);
        $("#dragTextDv").css( "display", "none");
    }
    function draw(x, y) {
        if (textSelect) {
            return;
        }
        ctx.strokeStyle = $("#colorInput").val();
        ctx.beginPath();
        ctx.moveTo(xLast, yLast);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Chalk Effect
        var length = Math.round(Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) / (5 / brushDiameter));
        var xUnit = (x - xLast) / length;
        var yUnit = (y - yLast) / length;
        for (var i = 0; i < length; i++) {
            var xCurrent = xLast + (i * xUnit);
            var yCurrent = yLast + (i * yUnit);
            var xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
            var yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
            ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
        }

        xLast = x;
        yLast = y;
    }

    function erase(x, y) {
        ctx.clearRect(x - 0.5 * eraserWidth, y - 0.5 * eraserHeight, eraserWidth, eraserHeight);
    }

    CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight, letterSpacing) {
        if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
            return;
        }

        var context = this;
        var canvas = context.canvas;
        var result = [];

        if (typeof maxWidth == 'undefined') {
            maxWidth = (canvas && canvas.width) || 300;
        }
        if (typeof lineHeight == 'undefined') {
            lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
        }

        // 字符分隔为数组
        var arrText = text.split('');
        var line = '';

        for (var n = 0; n < arrText.length; n++) {
            var testLine = line + arrText[n];
            var metrics = context.measureText(testLine);//测距
            var draw = {"x":0, "y":0, "text":""};
            //字体大小加间距
            var testWidth = metrics.width + testLine.length*letterSpacing;
            // var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                // context.fillText(line, x, y);
                // CanvasRenderingContext2D.prototype.letterSpacingText(line, x, y, 3);
                draw.x = x;
                draw.y = y;
                draw.text = line;
                result.push(draw);
                line = arrText[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        var draw = {"x":0, "y":0, "text":""};
        draw.x = x;
        draw.y = y;
        draw.text = line;
        result.push(draw);
        // context.fillText(line, x, y);
        return result;
    };

    CanvasRenderingContext2D.prototype.letterSpacingText = function (text, x, y, letterSpacing) {
        var context = this;
        var canvas = context.canvas;

        // if (!letterSpacing && canvas) {
        // 	letterSpacing = parseFloat(window.getComputedStyle(canvas).letterSpacing);
        // }
        // if (!letterSpacing) {
        // 	return this.fillText(text, x, y);
        // }

        var arrText = text.split('');
        var align = context.textAlign || 'left';

        // 这里仅考虑水平排列
        var originWidth = context.measureText(text).width;
        // 应用letterSpacing占据宽度
        var actualWidth = originWidth + letterSpacing * (arrText.length - 1);
        // 根据水平对齐方式确定第一个字符的坐标
        if (align == 'center') {
            x = x - actualWidth / 2;
        } else if (align == 'right') {
            x = x - actualWidth;
        }

        // 临时修改为文本左对齐
        context.textAlign = 'left';
        // 开始逐字绘制
        arrText.forEach(function (letter) {
            var letterWidth = context.measureText(letter).width;
            context.fillText(letter, x, y);
            // 确定下一个字符的横坐标
            x = x + letterWidth + letterSpacing;
        });
        // 对齐方式还原
        context.textAlign = align;
    };

    function drowText(textareaId, dx, dy) {
        var canvas = document.querySelector('#chalkboard');
        var ctx = canvas.getContext('2d');
        var textarea = $("#" + textareaId);

        var context = textarea.val();
        var textAreaWidth = textarea.width();
        var numOfRow = parseInt(textAreaWidth / 6);

        ctx.textBaseline = 'top';
        ctx.font = '15px "黑体"';
        ctx.fillStyle = $("#colorInput").val();
        // canvas.style.letterSpacing = 1 + "px"

        var loopTime = context.length*6/(textAreaWidth)

        var content = textarea.val();
        var drawLines = ctx.wrapText(content, dx, dy, textAreaWidth, 17.2, 1.7);
        for(let i = 0; i < drawLines.length; i++) {
            var drawline = drawLines[i];
            ctx.letterSpacingText(drawline.text, drawline.x, drawline.y, 1.7)
        }
    }



    $('.link').click(function () {
        processPngBase64();
    });

    // 上传图片
    function uploadBgPng(imgStr) {
        var j = {"pngName": bgId, "img": imgStr}
        $.ajax({
            type: "post",
            async: false,
            url: "http://120.77.39.52:8080/danmu/hhzg/danmu/upPng",
            dataType: "json",
            data: JSON.stringify(j),
            contentType: "application/json",
            success: function (json) {
                console.log(json);
                alert("上传成功");
            },
            error: function () {
                alert('连接服务器失败！！！');
            }
        })
    }

    function processPngBase64() {
        canvas = document.getElementById("chalkboard");//所画的画板
        var imgCanvas = document.createElement("canvas");//所需保存的新画板
        var patImg = document.getElementById("pattern");//新画板的背景图

        var canvasCtx = canvas.getContext('2d');
        var imgCtx = imgCanvas.getContext('2d');//新画板的绘图工具
        var pattern = imgCtx.createPattern(patImg, 'repeat');

        imgCanvas.width = 1024;
        imgCanvas.height = 720;

        //将所画的图像转为Image,并且画入新的画板
        var layimage = new Image;
        layimage.src = canvas.toDataURL("image/png");

        //将背景图画入新的画板
        imgCtx.fillStyle = pattern;
        imgCtx.rect(0, 0, 1024, 720);
        imgCtx.fill();

        setTimeout(function () {
            imgCtx.drawImage(layimage, 0, 0);	//所画图

            var compimage = imgCanvas.toDataURL("image/png");//.replace('image/png','image/octet-stream');

            var imgStr = compimage.substring(22, compimage.length + 1);
            uploadBgPng(imgStr);

        }, 500);
    }

    document.addEventListener('touchmove', function (evt) {
        var touch = evt.touches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        if (mouseY < (height + boardDv.offsetTop + 50) && mouseX < (width + boardDv.offsetLeft + 50)) {
            evt.preventDefault();
            $('.chalk').css('left', mouseX + 'px');
            $('.chalk').css('top', mouseY + 'px');
            //$('.chalk').css('display', 'none');
            if (mouseD) {
                draw(mouseX, mouseY);
            }
        }
    }, false);

    document.addEventListener('touchstart', function (evt) {
        //evt.preventDefault();
        var touch = evt.touches[0];
        mouseD = true;
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        xLast = mouseX - boardDv.offsetLeft;
        yLast = mouseY - boardDv.offsetTop;
        draw(mouseX + 1, mouseY + 1);
    }, false);

    document.addEventListener('touchend', function (evt) {
        mouseD = false;
    }, false);

    $(document).mousemove(function (evt) {
        mouseX = evt.pageX;
        mouseY = evt.pageY;

        if (mouseY < (height + boardDv.offsetTop + 50) && mouseX < (width + boardDv.offsetLeft + 50)) {
            $('.chalk').css('left', (mouseX - 0.5 * brushDiameter) + 'px');
            $('.chalk').css('top', (mouseY) + 'px');
            if (mouseD) {
                if (eraser) {
                    erase(mouseX - boardDv.offsetLeft, mouseY - boardDv.offsetTop);
                } else {
                    draw(mouseX - boardDv.offsetLeft, mouseY - boardDv.offsetTop);
                }
            }
        } else {
            $('.chalk').css('top', height - 10);
        }
    });

    $(document).mousedown(function (evt) {
        mouseD = true;
        xLast = mouseX - boardDv.offsetLeft;
        yLast = mouseY - boardDv.offsetTop;
        if (evt.button == 2) {
            erase(mouseX, mouseY);
            eraser = true;
            $('.chalk').addClass('eraser');
        } else if (textSelect && hasPosition == false) {
            $("#dragTextDv").css("display", "block")
            $("#textSelectBtn").css("background", "#ccc");
            if (!hasPosition) {
                $("#dragTextDv").css({//文本位置
                    "left": evt.pageX,
                    "top": evt.pageY
                })
                hasPosition=true;
            }
        } else if (!textSelect && !$('.panel').is(':hover')) {
            draw(mouseX - boardDv.offsetLeft + 1, mouseY - boardDv.offsetTop + 1);
        }
    });

    $(document).mouseup(function (evt) {
        mouseD = false;
        if (evt.button == 2) {
            eraser = false;
            $('.chalk').removeClass('eraser');
        }
    });

    $(document).keyup(function (evt) {
        if (evt.keyCode == 46) {//delete键
            $(".chalk").css("display", "block");
            $("#chalkboard").css("cursor", "none");//显示制作
            textSelect = false;
            hasPosition = false;
            $("#dragTextDv").css( "display", "none");
        }
    });

    ajGetBgPng();
} 