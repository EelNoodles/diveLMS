// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, update, get, child, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3yiDXSFZFovIurCOpkpcBnWhjkatMGh0",
  authDomain: "nutnbingo.firebaseapp.com",
  databaseURL: "https://nutnbingo-default-rtdb.firebaseio.com",
  projectId: "nutnbingo",
  storageBucket: "nutnbingo.appspot.com",
  messagingSenderId: "172701986732",
  appId: "1:172701986732:web:86db8160540bfa6ebe9409",
  measurementId: "G-WXLJWTRH1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(getDatabase());
const auth = getAuth(app);

var coursesList = ["course_signIn", "course_knowLab", "course_safetyLab", "experiment1_intro", "experiment1_do", "experiment1_theory", "experiment1_test",
"experiment2_intro", "experiment2_do", "experiment2_theory", "experiment2_test"];

$("#btnUserSignIn").click(function (e) { 
    $("#inputState").html("");
    signInWithEmailAndPassword(auth, $("#inputUserAccount").val(), $("#inputUserPassword").val())
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      moveToCourseList();

    })
    .catch((error) => {
        $("#inputState").html("登入資料有誤！");
    });
});

window.onload = function (){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        $("#welcomeBackText").html(`${user.displayName}，歡迎回來！<br>(${uid}) `);
        $("#signInForm").css("display", "none");
        $("#hasSignIn").css("display", "block");
        demo = new DemoLoadBalancing();
        demo.start();
        $("#nav_userName").html(user.displayName);
    }
    });
}

// let stuList = ["S10967025_盧奕捷","S10955059_鍾易恆","S10955018_顏玉傑","S10955044_戴元揚","S10955009_彭丞玉","S10955020_林倚萱","S10955028_陳昱臻","S10955014_張浩恩","S10955042_林士善","S10855050_薛渝頻","S10955027_吳柄城","S10955038_莊承新","S10955036_傅梓崵","S10955052_張哲倫","S10955017_梁茗凱","S10955002_徐弘宇","S10955007_黃御宸","S10955057_林霆瑋","S10955043_彭筱茜","S10955016_潘昱宏","S10955060_黃國峻","S10955053_塗謹嘉","S10955008_徐碩亨","S10955029_黃韻綺","S10955046_葉志軒","S10955031_陳韋臻","S10955030_謝秉均","S10955021_黃莉宸","S10855020_蔡永濂","S10955011_陳品中","S10955041_王柏晨","S10955047_許維芳","S10955032_楊喻翔","S10955006_童逸","S10959047_潘慧婷"];
// function createAllStdentAccount() {
//     stuList.forEach(element => {
//         let temp = element.split("_")
//         createUserWithEmailAndPassword(auth, `${temp[0]}@gm2.nutn.edu.tw`, 123456).then((userCredential) => {
//             const user = userCredential.user;
//             updateProfile(user, {
//                 displayName: temp[1]
//               }).then(() => {
//                 let coursesList = ["course_signIn", "course_knowLab", "course_safetyLab"];
//                 set(ref(db, `Users/${user.uid}`), {
//                     coursesfinList: coursesList
//                   }).then(()=>{
//                     console.log(temp[0]+"註冊好了。");
//                   });
//               });
//           });
//     });
// }

function closeAllArea() {
    document.querySelectorAll(".contentArea").forEach((element) => {
        element.style.display =  "none";
        $(".resultActive").removeClass("active");
        $(".course").removeClass("active");
        $(".Content").removeClass("blur");
        $(".waitForConnect").removeClass("active");
        try{clearInterval(startDetect)}catch{};
        setTimeout(() => {
            $(".waitForConnect").css("display", "none");
        }, 500);
    });
}

$("#nav_courseList").click(function (e) { moveToCourseList();});
$("#nav_courseResult").click(function (e) { moveToCourseResult();});
$("#btnUserSignOut").click(function (e) { 
    auth.signOut();
    $("#signInForm").css("display", "flex");
    $("#hasSignIn").css("display", "none");
});

function moveToCourseList() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          //動畫轉換
          closeAllArea();
          $(".diveContent").removeClass("active");
          $(".contentCourse").css("display", "flex");
          setTimeout(() => {
              $(".course").addClass("active");
          }, 100);
          //課程資料存取
          get(child(dbRef, `Users/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
            let userfinList = snapshot.val()["coursesfinList"];
            userfinList.forEach(element => {
                $(`#${element}`).addClass("finish");
            switch (userfinList.length) {
                case 1:
                    $("#course1FinPer").html(`課程完成度：33%`);
                    break;
                case 2:
                    $("#course1FinPer").html(`課程完成度：66%`);
                    break;
                case 3:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    break;
                case 4:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：25%`);
                    break;
                case 5:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：50%`);
                    break;
                case 6:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：75%`);
                    break;
                case 7:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：100%`);
                    break;
                case 8:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：100%`);
                    $("#course3FinPer").html(`課程完成度：25%`);
                    break;
                case 9:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：100%`);
                    $("#course3FinPer").html(`課程完成度：50%`);
                    break;
                case 10:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：100%`);
                    $("#course3FinPer").html(`課程完成度：75%`);
                    break;
                case 11:
                    $("#course1FinPer").html(`課程完成度：100%`);
                    $("#course2FinPer").html(`課程完成度：100%`);
                    $("#course3FinPer").html(`課程完成度：100%`);
                    break;
                default:
                    break;
            }
            });
            } else {
                let coursesList = ["course_signIn"];
                set(ref(db, `Users/${uid}`), {
                    coursesfinList: coursesList
                  });
            }
          }).catch((error) => {
            console.error(error);
          });
          
        } else {
            alert("尚未登入！")
        }
      });
}

function moveToCourseResult() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          //動畫轉換
          closeAllArea();
          $(".diveContent").removeClass("active");
          $(".contentResult").css("display", "flex");
          setTimeout(() => {
              $(".resultActive").addClass("active");
          }, 100);
          
          get(child(dbRef, `Users/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
            let userfinList = snapshot.val()["coursesfinList"];
            userfinList.forEach(element => {
                $(`#${element}`).addClass("finish");
            let progressQuery = document.querySelectorAll(".td_progress");
            switch (userfinList.length) {
                case 1:
                    $(progressQuery[0]).html(`33%`);
                    break;
                case 2:
                    $(progressQuery[0]).html(`66%`);
                    break;
                case 3:
                    $(progressQuery[0]).html(`100%`);
                    break;
                case 4:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`25%`);
                    break;
                case 5:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`50%`);
                    break;
                case 6:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`75%`);
                    break;
                case 7:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`100%`);
                    break;
                case 8:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`100%`);
                    $(progressQuery[2]).html(`25%`);
                    break;
                case 9:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`100%`);
                    $(progressQuery[2]).html(`50%`);
                    break;
                case 10:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`100%`);
                    $(progressQuery[2]).html(`75%`);
                    break;
                case 11:
                    $(progressQuery[0]).html(`100%`);
                    $(progressQuery[1]).html(`100%`);
                    $(progressQuery[2]).html(`100%`);
                    break;
                default:
                    break;
            }
            });
            let testSnap = snapshot.val()["Test"]["experiment1_test"];
            if(testSnap != undefined){
                let gradeQuery = document.querySelectorAll(".td_testGrade");
                $(gradeQuery[1]).html(`${testSnap["correctCount"]}/5 分`);
                $(gradeQuery[1]).click(function () {  
                    closeAllArea();
                    $(".course").removeClass("active");
                    $(".chatArea").removeClass("hasEvent");
                    $(".chatNoOpen").removeClass("nonShow");
                    $(".waitForConnect").css("display", "none");
                    setTimeout(() => {
                        $(".contentCourse").css("display", "none");
                        $(".contentDive").css("display", "flex");
                        setTimeout(() => {
                            $(".diveContent").addClass("active");
                                $("#testArea").css("display", "block");
                                $("#diveIframe").css("display", "none");
                                $("#diveIframe_2").css("display", "none");
                                loadTest(testSnap["ansList"]);
                        }, 100);
                        $(".chatMessenge").html("");
                        $(".noteMessenge").html("");
                    }, 100);
                    updateNoteArea("experiment1_test");
                    currentCourse = "experiment1_test";
                });
            }
            } else {
                let coursesList = ["course_signIn"];
                set(ref(db, `Users/${uid}`), {
                    coursesfinList: coursesList
                  });
            }
          }).catch((error) => {
            console.error(error);
          });
          
        } else {
            alert("尚未登入！")
        }
      });
}

let courseLinkQuery = document.querySelectorAll(".courseLink");
var currentCourse = "";

courseLinkQuery.forEach((elemnet) => {
    $(`#${elemnet.id}`).click(function (e) { 
        get(child(dbRef, `Users/${auth.currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                let userfinList = snapshot.val()["coursesfinList"];
                if((coursesList.indexOf(userfinList[userfinList.length - 1]) + 1)  >=  coursesList.indexOf(elemnet.id)){
                    if(elemnet.id == "course_signIn"){
                        showDialog("該課程無內容！");
                    }else{
                        $(".course").removeClass("active");
                        $(".chatArea").removeClass("hasEvent");
                        $(".chatNoOpen").removeClass("nonShow");
                        $(".waitForConnect").css("display", "none");
                        setTimeout(() => {
                            $(".contentCourse").css("display", "none");
                            $(".contentDive").css("display", "flex");
                            setTimeout(() => {
                                $(".diveContent").addClass("active");
                                if(elemnet.id == "experiment1_do" || elemnet.id == "experiment2_do"){
                                    $(".waitForConnect").css("display", "flex");
                                    $("#testArea").css("display", "none");
                                    $("#diveIframe").css("display", "block");
                                    $("#diveIframe_2").css("display", "none");
                                    //$(".Content").addClass("blur");
                                    $(".chatArea").addClass("hasEvent");
                                    $(".chatNoOpen").addClass("nonShow");
                                    setTimeout(() => {
                                        $(".waitForConnect").addClass("active");
                                    }, 500);
                                }else if(elemnet.id == "experiment1_test"){
                                    $("#testArea").css("display", "block");
                                    $("#diveIframe").css("display", "none");
                                    $("#diveIframe_2").css("display", "none");
                                    loadTest();
                                }else{
                                    $("#testArea").css("display", "none");
                                    $("#diveIframe").css("display", "none");
                                    $("#diveIframe_2").css("display", "block");
                                    loadNormalDive(elemnet.id);
                                }
                            }, 100);
                            $(".chatMessenge").html("");
                            $(".noteMessenge").html("");
                            updateNoteArea(currentCourse);
                        }, 1000);
                        currentCourse = elemnet.id;
                    }
                }else{
                    showDialog(`不可跳過先修課程。`)
                }
            }
          }).catch((error) => {
            console.error(error);
          });
    });
});

function showDialog(content){
    $(".dialog_content").html(content);
    $(".dialog").css("display", "flex");
    setTimeout(() => {
        $(".dialog").addClass("active");
    }, 100);
    $(".Content").addClass("blur");

    $(".dialog_close").click(function (e) { 
        $(".Content").removeClass("blur");
        $(".dialog").removeClass("active");
        setTimeout(() => {
            $(".dialog").css("display", "none");
        }, 1000);
    });
}

function loadNormalDive(doCourse) {  
    const diveLinker = new DiveLinker("dive_2");
    switch (doCourse) {
        case "course_knowLab":
            diveLinker.setProject(27365);
            break;
        case "course_safetyLab":
            diveLinker.setProject(26739);
            break;
        case "experiment1_intro":
            diveLinker.setProject(27593);
            break;
        case "experiment1_theory":
            diveLinker.setProject(27648);
            break;
        default:
            break;
    }
    diveLinker.enableBlock(false);
    diveLinker.start();
    var detectFinish = setInterval(() => {
        if(diveLinker.checkComplete()){
            clearInterval(detectFinish);
            get(child(dbRef, `Users/${auth.currentUser.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                let userCoursesList = snapshot.val()["coursesfinList"];
                if(!(userCoursesList.includes(doCourse))){
                    userCoursesList.push(doCourse);
                    set(ref(db, `Users/${auth.currentUser.uid}`), {
                        coursesfinList: userCoursesList
                    });
                    showDialog("恭喜你完成本課程。")
                }else{
                    showDialog("已經修過該課程。")
                }
                moveToCourseList();
                }
              }).catch((error) => {
                console.error(error);
              });
        }
    }, 100);
}

$("#sendNote").click(function (e) { 
    get(child(dbRef, `Users/${auth.currentUser.uid}/Note/${currentCourse}`)).then((snapshot) => {
        if($("#inputNote").val() != ""){
            var noteList = [];
            if (snapshot.exists()) {
                noteList = snapshot.val()["noteList"];
            }
            noteList.push($("#inputNote").val());
            set(ref(db, `Users/${auth.currentUser.uid}/Note/${currentCourse}`), {
                noteList: noteList
              }).then(()=>{
                $("#inputNote").val("")
                updateNoteArea(currentCourse);
              });
        }else{
            showDialog("筆記欄位不可空白！")
        }
      }).catch((error) => {
        console.error(error);
      });
});

function updateNoteArea(loadCourse) { 
    loadNoteContent(loadCourse);
    let courseNoteList = [];
    courseNoteList.push(loadCourse);
    get(child(dbRef, `Users/${auth.currentUser.uid}/Note`)).then((snapshot) => {
        if (snapshot.exists()) {
            for (const [key, value] of Object.entries(snapshot.val())) {
                courseNoteList.push(key);
            }
        }
      }).then(()=>{
        let updateNoteList = "<ul>";
        courseNoteList.forEach(element => {
            let courseTitle = $(`#${element}`).html();
            updateNoteList += `<li class='changeNote changeTo@${element}'>${courseTitle}</li>`;
        });
        updateNoteList += "</ul>"
        $(".noteCurrentNote").html(updateNoteList);
        $(".changeNote").click(function (e) { 
            let changeNoteId = e.target.classList[1].split("@");
            updateNoteArea(changeNoteId[1]);
            $(".noteCurrentNote").animate({ scrollTop: 0 }, 1000);
            e.preventDefault();
        });
      });
}

function loadNoteContent(courseId) {
    get(child(dbRef, `Users/${auth.currentUser.uid}/Note/${courseId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            var showList = "<ul>"
            for (const [key, value] of Object.entries(snapshot.val()["noteList"])) {
                if(currentCourse == "experiment1_do"){
                    showList += `<li class='con_${key}'>${value} <img src='res/share.png' class='noteLiShare ${key}'><img src='res/trashcan.png' class='noteLiTrashCan ${key}'></li>`
                }else{
                    showList += `<li class='con_${key}'>${value} <img src='res/trashcan.png' class='noteLiTrashCan ${key}'></li>`
                }
            }
            showList += "</ul>"
            $(".noteMessenge").html(showList);
            $(".noteMessenge").animate({ scrollTop: $(".noteMessenge").height() }, 1000);

            let trashCanQuery = document.querySelectorAll(".noteLiTrashCan");
            trashCanQuery.forEach((element) => {
                $(element).click(function (e) { 
                    remove(ref(db, `Users/${auth.currentUser.uid}/Note/${courseId}/noteList/${e.target.classList[1]}`)).then(()=>{
                        updateNoteArea(courseId);
                      });
                });
            });
        }else{
            $(".noteMessenge").html();
        }
      }).catch((error) => {
        console.error(error);
      });
}

var question = ["下列哪一項物品名稱為「燒杯」?",
                "下列哪種器具可以用來裝取「液體」?",
                "請問圖中紅白色管的正確用途?<img src = 'res/lab_ques.png'>",
                "本次實驗的原理為？",
                "我想不到題目了！"]
var questionContent = {0: ["（Ａ）<img src='res/beaker_par.png'>", "（Ｂ）<img src='res/graduated_cylinder.png'>", "（Ｃ）<img src='res/erlenmeyer_flask.png'>"],
                        1: ["（Ａ）<img src='res/beaker_par.png'>", "（Ｂ）<img src='res/graduated_cylinder.png'>", "（Ｃ）<img src='res/erlenmeyer_flask.png'>"],
                        2: ["（Ａ）若化學反應將產生有害氣體時，可用來罩住容器吸走氣體，以免危害身體。", "（Ｂ）若有粉末或顆粒散倒或殘留至實驗桌上，可用來吸起粉末回收，避免藥品浪費。", "（Ｃ）可以用來燙頭髮。"],
                        3: ["（Ａ）氧化反應", "（Ｂ）聚合反應", "（Ｃ）鏈接反應"],
                        4: ["（Ａ）Good", "（Ｂ）Fancy", "（Ｃ）OMG"]};
var questionAns = ["0", "2", "0", "1", "2"]
var userAns = ["", "", "", "", ""];
function loadTest(grade) {  
    let testContent = ""
    for (let index = 0; index < question.length; index++) {
        testContent += `<div class='questionDiv'>${index+1}、${question[index]}</div><div class='questionContentDiv'>`
        for (let i = 0; i < questionContent[index].length; i++) {
            testContent += `<div class='answerDiv ${index}_${i}'>${questionContent[index][i]}</div>` 
        }
        testContent += "</div>"
    }
    get(child(dbRef, `Users/${auth.currentUser.uid}/Test/experiment1_test`)).then((snapshot) => {
        if (snapshot.exists()) {
            grade = snapshot.val()["ansList"];
        } 
      }).then(()=>{
        if(grade == undefined){
            testContent += "<div class='submitTest'><h2>送出</h2></div>";
        }
        $("#testArea").html(testContent);
        $(".answerDiv").click(function (e) { 
            let classList = e.target.classList[1].split("_");
            $(`.${classList[0]}_0`).removeClass("choice");
            $(`.${classList[0]}_1`).removeClass("choice");
            $(`.${classList[0]}_2`).removeClass("choice");
            $(`.${e.target.classList[1]}`).addClass("choice");
            userAns[classList[0]] = classList[1];
            e.preventDefault();
        });
        $(".submitTest").click(function (e) { 
            let correct = 0;
            for (let index = 0; index < userAns.length; index++) {
                if(userAns[index] == questionAns[index]){
                    correct += 1;
                }
                $(`.${[index]}_${questionAns[index]}`).addClass("ans");
            }
            get(child(dbRef, `Users/${auth.currentUser.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                let userCoursesList = snapshot.val()["coursesfinList"];
                    userCoursesList.push(currentCourse);
                    set(ref(db, `Users/${auth.currentUser.uid}`), {
                        coursesfinList: userCoursesList
                    }).then(()=>{
                        set(ref(db, `Users/${auth.currentUser.uid}/Test/${currentCourse}`), {
                            correctCount: correct,
                            ansList: userAns
                          }).then(()=>{
                            showDialog(`恭喜你結束了考試。<br>本次成績為：${correct}`)
                            loadTest();
                          });
                    });
                }
              }).catch((error) => {
                console.error(error);
              });
        });
        if(grade != undefined){
            for (let index = 0; index < userAns.length; index++) {
                $(`.${[index]}_${questionAns[index]}`).addClass("ans");
            }
            for (let index = 0; index < grade.length; index++) {
                $(`.${[index]}_${grade[index]}`).addClass("choice");
            }
        }
      });
}