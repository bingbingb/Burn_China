
jQuery(document).ready(function () {
    $(".anniu").click(function () {
        $(this).hide();
        $(".anniu2").css("display", "block");
        $(".anniu3").css("display", "block");
        $(".elf").css("marginLeft", "calc(70%)");
    });

});
//重构问卷信息div
var optionId = 0;

function rebuildQuestionTbl(allQuestions) {
    // var allQuestions = questionnaireJson[0].question;
    var questionBody = "<div class='dvQuestion'>";
    for (var index in allQuestions) {
        var qidx = parseInt(index) + 1;
        questionBody += "<div class='qkuai'>" + "<div class='qindex'>" + "第" + qidx + "/10题" + "</div>" +
            "<div class='tiMu'>" + "<p class='qclass'>" + qidx + "、" +
            allQuestions[index].enName + "</p>" + "</div>";
        questionBody += analyseOptionForm(allQuestions[index], index);
        questionBody += "</div>";
    }
    questionBody += "</div>";
    $("#dvQue").html(questionBody);

    var allQuestion = $(".qclass");
    var allElect = $(".Elect");
    for (let qIndex = 0; qIndex < allQuestion.length; qIndex++) {
        let Tname = allQuestion.eq(qIndex).text();
        if (Tname.length <= 85) {
            allQuestion.eq(qIndex).parent(".tiMu").eq(0).css({
                "width": "calc(40%)",
                "height": "60px",
                "marginLeft": "calc(30%)",
                "paddingTop": "calc(1%)"
            });
        } else if((Tname.length>85) && (Tname.length<=130)){
            allQuestion.eq(qIndex).parent(".tiMu").eq(0).css({
                "width": "calc(45%)",
                "paddingTop": "calc(2%)",
                "height": "80px",
                "marginLeft": "calc(27.5%)"
            });
        }
		else if((Tname.length>130) && (Tname.length<180)){
            allQuestion.eq(qIndex).parent(".tiMu").eq(0).css({
                "width": "calc(50%)",
                "paddingTop": "calc(2%)",
                "height": "100px",
                "marginLeft": "calc(25%)"
            });
        }else{
			 allQuestion.eq(qIndex).parent(".tiMu").eq(0).css({
                "width": "calc(50%)",
                "paddingTop": "calc(2%)",
                "height": "150px",
                "marginLeft": "calc(25%)"
            });
		}
    }
    for (let eIndex = 0; eIndex < allElect.length; eIndex++) {
        let Ename = allElect.eq(eIndex).text();
        if (Ename.length <= 25) {
            allElect.eq(eIndex).css({"width": "calc(40%)", "border-radius": "20px", "paddingLeft": "5px"});
        } else if ((Ename.length > 25) && (Ename.length <= 60)) {
            allElect.eq(eIndex).css({"width": "calc(60%)", "border-radius": "30px", "paddingLeft": "10px"});
        } else if ((Ename.length > 60) && (Ename.length <= 120)) {
            allElect.eq(eIndex).css({"width": "calc(80%)", "border-radius": "40px", "paddingLeft": "15px"});
        } else {
            allElect.eq(eIndex).css({"width": "calc(115%)", "border-radius": "50px", "paddingLeft": "20px"});
        }
    }

}

function showAnalysis() {

    let questionDom = $(".qkuai");
    let scoreSum = 10;
    for (let qIndex = 0; qIndex < questionDom.length; qIndex++) {
        let tempName = answer[qIndex].enType;
        let str = "<div class='analyzeDv'><div>" + "Analysis：" + tempName + "</div></div>";
        questionDom.eq(qIndex).append(str);
    }

}


//获取选项展示的html
function analyseOptionForm(question, qid) {
    var allOptions = question.options;
    var optionType = analyseOptionType(allOptions);
    var optionBody = "";
    for (var optionIndex in allOptions) {
        var optionName = "option" + optionIndex;
        optionBody += "<div class='elect'>" + "<label><input type=" + optionType + " name=" + qid + " optionName=" + optionName + "\
                                        ><p class='Elect'>" + allOptions[optionIndex].label + "、" + allOptions[optionIndex].enName + "</p></label></div>";
    }
    return optionBody;
}

function analyseOptionType(allOptions) {
    var sumScore = 0;
    for (var optionIndex in allOptions) {
        sumScore += allOptions[optionIndex].score;
    }
    if (sumScore === 1) {    //单选总分
        return "radio";
    } else {
        return "checkbox";
    }
}

//展示弹出
function showtt(text) {
    var pzi;
    if (text < 60) {
        var img = '<img class="bimg" src="img2/0~60分.png" alt=""/>';
        pzi = '<p class="alertWen">' + "Achievements：" + '<span class="fenWen">'
            + text + "分" + '</span>' + "<br/>" + img + '</p><p class="tanWen">' + "Don't lose heart, <br/> Keep working hard！" + '</p>';
    } else if (60 < text <= 95) {
        var img = '<img class="bimg" src="img2/80分.png" alt=""/>';
        pzi = '<p class="alertWen">' + "Achievements：" + '<span class="fenWen">'
            + text + "分" + '</span>' + "<br/>" + img + '</p><p class="tanWen">' + "Keep working hard, <br/> The next bully is you.！" + '</p>';
    } else if (text === 100) {
        var img = '<img class="bimg" src="img2/100分.png" alt=""/>';
        pzi = '<p class="alertWen">' + "Achievements：" + '<span class="fenWen">'
            + text + "分" + '</span>' + "<br/>" + img + '</p><p class="tanWen">' + "Congratulations on the birth of Xueba！" + '</p>';
    }
    var alertdiv = '<div class="alterdiv" style="">\n\
				<div id="alertp">\n\
		<input class="guna" type="image" name="button" src="img2/关闭按钮.png" onclick="$(this).parentsUntil(body).remove(); " />'
        + pzi + '</div>';
    $(document.body).append(alertdiv);
    $(".alterdiv").css("top", "0px");
    // 设置偏移数值，实现垂直和水平居中


    // 显示
    $(".alertdiv").show();
};

var anArray = new Array();
var aArray = new Array();

//分析答案
function showAnswer() {
    //获取页面所有问题dom
    //查询每一个问题中的选项
    let questionDom = $(".qkuai");
    let scoreSum = 10;
    for (let qIndex = 0; qIndex < questionDom.length; qIndex++) {
        //循环查找每个问题下的选项
        let optionOfQus = questionDom.eq(qIndex).find("input");
        let isCorrect = true;
        for (let oIndex = 0; oIndex < optionOfQus.length; oIndex++) {
            let oResult = optionOfQus[oIndex].checked ? 1 : 0;//比较选项的checked
            let optionDiv = questionDom.eq(qIndex).find(".elect").eq(oIndex);
            if (oResult !== answer[qIndex].options[oIndex].score && isCorrect) {
                // optionDiv.append("✘");
                scoreSum--;
                isCorrect = false;
            }
            if (answer[qIndex].options[oIndex].score === 1) {
                optionDiv.append('<div class="resultCaret">✔</div>');
            }
            // console.log(optionDiv.position().left)
            // console.log(optionDiv.position().top)
            // $(".resultCaret").eq(qIndex).css({
			// 	"top" : optionDiv.position().left + "px",
			// 	"left" : optionDiv.position().top + "px"
			// })
        }
    }
    // $(".resultCaret").css({
    //     "position": "absolute",
    //     "top": "40px",
    //     "left": "60px",
    //     "font-size": "60px",
    //     "color": "red"
    // })
    goal = scoreSum * 10;
    showtt(goal);
    showAnalysis();
}

//获取问题
function showQuestion() {
    var questionnairId = Math.floor(Math.random() * 10 + 1);//随机问卷
    $.ajax({
        type: "get",
        async: true,
        url: "http://120.77.39.52:8089/questionnair/findById?id=" + questionnairId + "",
        dataType: "json",
        contentType: "application/json",
        success: function (json) {
            answer = json.result;
            rebuildQuestionTbl(json.result);
        },
        error: function (json) {
            return json;
        }
    });
}

function insertQuestion() {
    var j = {question: {}, options: []};
    j.question.name = $("#qName").val();
    j.question.type = $("#qType").val();

    var options = $(".option");
    var label = ['A', 'B', 'C', 'D'];
    var score = $(".score");
    for (let i = 0; i < options.length; i++) {
        if (options[i].value.length !== 0) {
            let joOption = {};
            joOption.name = options[i].value;
            joOption.label = label[i];
            joOption.score = score[i].checked ? 1 : 0;
            j.options.push(joOption);
        }
    }
    $.ajax({
        type: "post",
        async: true,
        url: "http://120.77.39.52:8089/question/insert",
        dataType: "json",
        data: JSON.stringify(j),
        contentType: "application/json",
        success: function (json) {
            alert("添加成功");
        },
        error: function (json) {
            return json;
        }
    });
}