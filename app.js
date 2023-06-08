/// <reference path="lib/Photon-Javascript_SDK.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// For Photon Cloud Application access create cloud-app-info.js file in the root directory (next to default.html) and place next lines in it:
//var AppInfo = {
//    MasterAddress: "master server address:port",
//    AppId: "your app id",
//    AppVersion: "your app version",
//}
// fetching app info global variable while in global context
var DemoWss = this["AppInfo"] && this["AppInfo"]["Wss"];
var DemoAppId = this["AppInfo"] && this["AppInfo"]["AppId"] ? this["AppInfo"]["AppId"] : "<no-app-id>";
var DemoAppVersion = this["AppInfo"] && this["AppInfo"]["AppVersion"] ? this["AppInfo"]["AppVersion"] : "1.0";
var DemoMasterServer = this["AppInfo"] && this["AppInfo"]["MasterServer"];
var DemoNameServer = this["AppInfo"] && this["AppInfo"]["NameServer"];
var DemoRegion = this["AppInfo"] && this["AppInfo"]["Region"];
var DemoFbAppId = this["AppInfo"] && this["AppInfo"]["FbAppId"];
var ConnectOnStart = false;
var DemoLoadBalancing = /** @class */ (function (_super) {
    __extends(DemoLoadBalancing, _super);
    function DemoLoadBalancing() {
        var _this = _super.call(this, DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, DemoAppId, DemoAppVersion) || this;
        _this.logger = new Exitgames.Common.Logger("Demo:");
        _this.USERCOLORS = ["#FF0000", "#00AA00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
        _this.logger.info("Photon Version: " + Photon.Version + (Photon.IsEmscriptenBuild ? "-em" : ""));
        // uncomment to use Custom Authentication
        // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        _this.output(_this.logger.format("Init", _this.getNameServerAddress(), DemoAppId, DemoAppVersion));
        _this.logger.info("Init", _this.getNameServerAddress(), DemoAppId, DemoAppVersion);
        _this.setLogLevel(Exitgames.Common.Logger.Level.INFO);
        _this.myActor().setCustomProperty("color", _this.USERCOLORS[0]);
        return _this;
    }
    DemoLoadBalancing.prototype.start = function () {
        this.setupUI();
        // connect if no fb auth required
        if (ConnectOnStart) {
            if (DemoMasterServer) {
                this.setMasterServerAddress(DemoMasterServer);
                this.connect();
            }
            if (DemoNameServer) {
                this.setNameServerAddress(DemoNameServer);
                this.connectToRegionMaster(DemoRegion || "EU");
            }
            else {
                this.connectToRegionMaster(DemoRegion || "EU");
                //this.connectToNameServer({ region: "EU", lobbyType: Photon.LoadBalancing.Constants.LobbyType.Default });
            }
        }
    };
    DemoLoadBalancing.prototype.onError = function (errorCode, errorMsg) {
        this.output("Error " + errorCode + ": " + errorMsg);
    };
    DemoLoadBalancing.prototype.onEvent = function (code, content, actorNr) {
        switch (code) {
            case 1:
                var mess = content.message + " " + this.getRtt() + " " + Math.floor(this.getServerTimeMs() / 1000);
                var sender = content.senderName;
                if (actorNr){
                    var showList = "<ul class='conChatContent'>"
                    var initValue = $(".conChatContent").html() === undefined ? "":$(".conChatContent").html();
                    if(content.senderType == "note"){
                        showList += `${initValue}<li>${sender} 分享了他的筆記：${content.message}</li>`
                    }else{
                        showList += `${initValue}<li>${sender}：${content.message}</li>`
                    }
                    showList += "</ul>"
                    $(".chatMessenge").html(showList);
                    $(".chatMessenge").animate({ scrollTop: $(".chatMessenge").height() }, 1000);
                }
                break;
            case 2:
                $(".waitForConnect").removeClass("active");
                setTimeout(() => {
                    $(".waitForConnect").css("display", "none");
                }, 500);
                var showList = "";
                var initValue = $(".conChatContent").html() === undefined ? "":$(".conChatContent").html();
                showList += `<ul class='conChatContent'>${initValue}<li><span style='color:lightcoral; font-weight:bold'>實驗開始！</span></li></ul>`
                $(".chatMessenge").html(showList);
                $(".chatMessenge").animate({ scrollTop: $(".chatMessenge").height() }, 1000);
                this.startExperiment();
                break;
            case 3:
                const diveLinker = this.loadDive();
                console.log(content.diffId, content.diffValue)
                diveLinker.setInput(content.diffId[0], 0);
                diveLinker.setInput(content.diffId[1], 1);
                diveLinker.setInput(content.diffId[2], content.diffValue[2]);
                diveLinker.setInput(content.diffId[3], content.diffValue[3]);
                diveLinker.setInput(content.diffId[4], content.diffValue[4]);
                break;
            default:
        }
        this.logger.debug("onEvent", code, "content:", content, "actor:", actorNr);
    };
    DemoLoadBalancing.prototype.onStateChange = function (state) {
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;
        // var stateText = document.getElementById("statetxt");
        // stateText.textContent = LBC.StateToName(state);
        // this.updateRoomButtons();
        // this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.objToStr = function (x) {
        var res = "";
        for (var i in x) {
            res += (res == "" ? "" : " ,") + i + "=" + x[i];
        }
        return res;
    };
    DemoLoadBalancing.prototype.loadDive = function () {
        const diveLinker = new DiveLinker("dive");
        diveLinker.enableBlock(false);
        diveLinker.start();

        return diveLinker;
    };
    DemoLoadBalancing.prototype.updateRoomInfo = function () {
        var r = this.myRoom();
        // stateText.innerHTML = "room: " + r.name + " [" + r.isOpen + " " + r.isVisible + " " + r.masterClientId + " " + r.maxPlayers + " " + r.emptyRoomLiveTime + " " + r.suspendedPlayerLiveTime
        //     + "] [" + this.objToStr(r.getCustomProperties())
        //     + "] [" + r.getPropsListedInLobby()
        //     + "] [" + r.expectedUsers
        //     + "]";
        $("#player_1").css("display", "none");
        $("#player_2").css("display", "none");
        $("#player_3").css("display", "none");
        var index = 1;
        for (var nr in this.myRoomActors()) {
            // var a = this.myRoomActors()[nr];
            // stateText.innerHTML += " " + nr + " " + a.name + " [" + this.objToStr(a.getCustomProperties()) + "]";
            // stateText.innerHTML = stateText.innerHTML + "<br>";
            if (this.myRoomActors().hasOwnProperty(nr)){
                $("#player_"+index).css("display", "flex");
                index++;
            };
        }
        // this.updateRoomButtons();
    };
    DemoLoadBalancing.prototype.updateChatInfo = function (message, actor) {
        var showList = "<ul class='conChatContent'>"
        var initValue = $(".conChatContent").html() === undefined ? "":$(".conChatContent").html();
        switch(message){
            case "meJoin":
                showList += `${initValue}<li><span style='color:gray; font-weight:bold'>您已經進入房間：${this.myRoom().name}</span></li>`
                break;
            case "actorJoin":
                showList += `${initValue}<li><span style='color:gray; font-weight:bold'>玩家 ${actor} 進入了房間。</span></li>`
                break;
            case "Leave":
                showList += `${initValue}<li><span style='color:gray; font-weight:bold'>玩家 ${actor} 離開了房間。</span></li>`
                break;
        }
        showList += "</ul>"
        $(".chatMessenge").html(showList);
        $(".chatMessenge").animate({ scrollTop: $(".chatMessenge").height() }, 1000);
    };
    DemoLoadBalancing.prototype.onActorPropertiesChange = function (actor) {
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.onMyRoomPropertiesChange = function () {
        this.updateRoomInfo();
    };
    DemoLoadBalancing.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
        this.logger.info("Demo: onRoomListUpdate", rooms, roomsUpdated, roomsAdded, roomsRemoved);
        this.output("Demo: Rooms update: " + roomsUpdated.length + " updated, " + roomsAdded.length + " added, " + roomsRemoved.length + " removed");
        this.onRoomList(rooms);
        // this.updateRoomButtons(); // join btn state can be changed
    };
    DemoLoadBalancing.prototype.startExperiment = function () {
        clearInterval(startDetect);
        diveLinker = this.loadDive();
        var outputValue = [];
        var lastOutput = [];
        var startDetect = setInterval(() => {
            outputValue = [];
            for (const [key, value] of Object.entries(diveLinker.getOutputList())) {
                outputValue.push(value["value"]);
            }
            if(!(JSON.stringify(outputValue) === JSON.stringify(lastOutput))){
                var index = 0;
                outputValue.forEach(element => {
                    if(element == 1){
                        diffLoc = index;
                        console.log("抓到你動了" + index)
                        this.raiseEvent(3, { diffId: [Object.keys(diveLinker.getOutputList())[diffLoc],
                            Object.keys(diveLinker.getOutputList())[diffLoc+1],
                            Object.keys(diveLinker.getOutputList())[diffLoc+2],
                            Object.keys(diveLinker.getOutputList())[diffLoc+3],
                            Object.keys(diveLinker.getOutputList())[diffLoc+4]]
                        , diffValue: [Object.values(diveLinker.getOutputList())[diffLoc]["value"],
                            Object.values(diveLinker.getOutputList())[diffLoc+1]["value"],
                            Object.values(diveLinker.getOutputList())[diffLoc+2]["value"],
                            Object.values(diveLinker.getOutputList())[diffLoc+3]["value"],
                            Object.values(diveLinker.getOutputList())[diffLoc+4]["value"]]
                        });
                        diveLinker.setInput(Object.keys(diveLinker.getOutputList())[diffLoc], 0);
                    }
                    index += 1;
                });
            }
            lastOutput = [];
            for (const [key, value] of Object.entries(diveLinker.getOutputList())) {
                lastOutput.push(value["value"]);
            }
        }, 1);
    };
    // DemoLoadBalancing.prototype.onRoomList = function (rooms) {
    //     var menu = document.getElementById("gamelist");
    //     while (menu.firstChild) {
    //         menu.removeChild(menu.firstChild);
    //     }
    //     var selectedIndex = 0;
    //     for (var i = 0; i < rooms.length; ++i) {
    //         var r = rooms[i];
    //         var item = document.createElement("option");
    //         item.attributes["value"] = r.name;
    //         item.textContent = r.name;
    //         menu.appendChild(item);
    //         if (this.myRoom().name == r.name) {
    //             selectedIndex = i;
    //         }
    //     }
    //     menu.selectedIndex = selectedIndex;
    //     this.output("Demo: Rooms total: " + rooms.length);
    //     this.updateRoomButtons();
    // };
    DemoLoadBalancing.prototype.onJoinRoom = function () {
        this.output("Game " + this.myRoom().name + " joined");
        this.updateRoomInfo();
        this.updateChatInfo("meJoin");
    };
    DemoLoadBalancing.prototype.onActorJoin = function (actor) {
        this.output("actor " + actor.name + " joined");
        this.updateRoomInfo();
        this.updateChatInfo("actorJoin", actor.name);
    };
    DemoLoadBalancing.prototype.onActorLeave = function (actor) {
        this.output("actor " + actor.name + " left");
        this.updateRoomInfo();
        this.updateChatInfo("Leave", actor.name);
    };
    DemoLoadBalancing.prototype.sendMessage = function (type, message) {
        try {
            this.raiseEvent(1, { message: message, senderName: this.myActor().name, senderType: type });
            // this.output('me[' + this.myActor().actorNr + ']: ' + message, this.myActor().getCustomProperty("color"));
            var showList = "<ul class='conChatContent'>"
            var initValue = $(".conChatContent").html() === undefined ? "":$(".conChatContent").html();
            if(type == "note"){
                showList += `${initValue}<li>我分享了筆記：${message}</li>`
            }else{
                showList += `${initValue}<li>我：${message}</li>`
            }
            showList += "</ul>"
            $(".chatMessenge").html(showList);
            $(".chatMessenge").animate({ scrollTop: $(".chatMessenge").height() }, 1000);
        }
        catch (err) {
            this.output("error: " + err.message);
        }
    };
    DemoLoadBalancing.prototype.getNoteContent = function () {
        var _this = this;
        setTimeout(() => {
            $(".noteLiShare").click(function (e) { 
                _this.sendMessage("note", $(`.con_${e.target.classList[1]}`).html());
            });
            $(".noteLiTrashCan").click(function (e) { 
                _this.getNoteContent();
            });
            $(".changeNote").click(function (e) { 
                _this.getNoteContent();
            });
        }, 1500);
    };
    DemoLoadBalancing.prototype.setupUI = function () {
        var _this = this;
        this.logger.info("Setting up UI.");
        // var btnJoin = document.getElementById("joingamebtn");
        // btnJoin.onclick = function (ev) {
        //     if (_this.isInLobby()) {
        //         var menu = document.getElementById("gamelist");
        //         var gameId = menu.children[menu.selectedIndex].textContent;
        //         var expectedUsers = document.getElementById("expectedusers");
        //         _this.output(gameId);
        //         _this.joinRoom(gameId, { expectedUsers: expectedUsers.value.length > 0 ? expectedUsers.value.split(",") : undefined });
        //     }
        //     else {
        //         _this.output("Reload page to connect to Master");
        //     }
        //     return false;
        // };
        $("#experiment1_do").click(function (e) { 
                if (_this.isInLobby()) {
                    var expectedUsers = " ";
                    var name = " ";
                    _this.myActor().setName($("#nav_userName").html());
                    _this.joinRandomOrCreateRoom({ expectedMaxPlayers: 3, expectedUsers: undefined }, undefined, { emptyRoomLiveTime: 20000, suspendedPlayerLiveTime: 20000, maxPlayers: 3});
                    //_this.joinRoom(gameId.length > 0 ? gameId : undefined, { createIfNotExists: true, expectedUsers: expectedUsers.length > 0 ? expectedUsers.value.split(",") : undefined }, { emptyRoomLiveTime: 20000, suspendedPlayerLiveTime: 20000, maxPlayers: 3 });
                    //this.joinRoom(gameId.value.length > 0 ? gameId.value : undefined, { createIfNotExists: true });
                }
                else {
                    _this.output("Reload page to connect to Master");
                }
                return false;
            });
        // 進入實驗按鈕
        $("#btnConnect").click(function (e) { 
            _this.raiseEvent(2, { message: "", senderName: _this.myActor().name });
            _this.startExperiment();
            _this.getNoteContent();

            var r = _this.myRoom();
            r.setIsOpen(false);
            $(".waitForConnect").removeClass("active");
            setTimeout(() => {
                $(".waitForConnect").css("display", "none");
            }, 500);
            var showList = "";
            showList += `<ul class='conChatContent'>${$(".conChatContent").html()}<li><span style='color:lightcoral; font-weight:bold'>實驗開始！</span></li></ul>`
            $(".chatMessenge").html(showList);
            $("#sendNote").click(function (e) { _this.getNoteContent();});
            e.preventDefault();
            });
        // var btnJoinRandom = document.getElementById("joinrandomgamebtn");
        // btnJoinRandom.onclick = function (ev) {
        //     if (_this.isInLobby()) {
        //         _this.output("Random Game or Create...");
        //         var name = document.getElementById("newgamename");
        //         var expectedUsers = document.getElementById("expectedusers");
        //         _this.joinRandomOrCreateRoom({ expectedMaxPlayers: 5, expectedUsers: expectedUsers.value.length > 0 ? expectedUsers.value.split(",") : undefined }, name.value.length > 0 ? name.value : undefined, { emptyRoomLiveTime: 20000, suspendedPlayerLiveTime: 20000, maxPlayers: 6 });
        //     }
        //     else {
        //         _this.output("Reload page to connect to Master");
        //     }
        //     return false;
        // };
        // var btnNew = document.getElementById("newgamebtn");
        // btnNew.onclick = function (ev) {
        //     if (_this.isInLobby()) {
        //         var name = document.getElementById("newgamename");
        //         _this.output("New Game");
        //         var expectedUsers = document.getElementById("expectedusers");
        //         //this.createRoom(name.value.length > 0 ? name.value : undefined, { isOpen: true, isVisible: true, emptyRoomLiveTime: 20000, suspendedPlayerLiveTime: 20000, expectedUsers: expectedUsers.value.length > 0 ? expectedUsers.value.split(",") : undefined, maxPlayers: 6, propsListedInLobby: ["p1", "p2"], customGameProperties: { "_n": 1, "_n2": "n2 val", "_n3": true } });
        //         _this.createRoom(name.value.length > 0 ? name.value : undefined);
        //     }
        //     else {
        //         _this.output("Reload page to connect to Master");
        //     }
        //     return false;
        // };
        // var btnSetExpectedUsers = document.getElementById("setexpectedusers");
        // btnSetExpectedUsers.onclick = function (ev) {
        //     _this.myRoom().setExpectedUsers(document.getElementById("expectedusers").value.split(","));
        // };
        // var btnClearExpectedUsers = document.getElementById("clearexpectedusers");
        // btnClearExpectedUsers.onclick = function (ev) {
        //     _this.myRoom().clearExpectedUsers();
        // };
        $("#sendMessenge").click(function (e) { 
            if (_this.isJoinedToRoom()) {
                var input = document.getElementById("inputChat");
                if(input.value != 0){
                    _this.sendMessage("normal", input.value);
                    input.value = '';
                    input.focus();
                }
            }
            else {
                if (_this.isInLobby()) {
                    _this.output("Press Join or New Game to connect to Game");
                }
                else {
                    _this.output("Reload page to connect to Master");
                }
            }
            return false;
            
        });
        $("#nav_courseList").click(function (e) { 
            _this.leaveRoom();
            return false;
        });
        $("#nav_courseResult").click(function (e) { 
            _this.leaveRoom();
            return false;
        });
        // document.getElementById("disconnectbtn").onclick = function (ev) { return _this.disconnect(); };
        // document.getElementById("remasterbtn").onclick = function (ev) { return _this.reconnectToMaster(); };
        // document.getElementById("regamebtn").onclick = function (ev) { return _this.reconnectAndRejoin(); };
        // btn = document.getElementById("colorbtn");
        // btn.onclick = function (ev) {
        //     var ind = Math.floor(Math.random() * _this.USERCOLORS.length);
        //     var color = _this.USERCOLORS[ind];
        //     _this.myActor().setCustomProperty("color", color);
        //     _this.sendMessage("... changed his / her color!");
        // };
        // btn = document.getElementById("testbtn");
        // btn.onclick = function (ev) {
        //     _this.myRoom().setMaxPlayers((_this.myRoom().maxPlayers || _this.myRoomActorsArray().length) + 1);
        //     _this.myRoom().setIsVisible(!_this.myRoom().isVisible);
        //     _this.myRoom().setIsOpen(!_this.myRoom().isOpen);
        //     _this.myRoom().setEmptyRoomLiveTime(_this.myRoom().emptyRoomLiveTime + 1000);
        //     _this.myRoom().setSuspendedPlayerLiveTime(_this.myRoom().suspendedPlayerLiveTime + 2000);
        //     _this.myRoom().setExpectedUsers((_this.myRoom().expectedUsers || []).concat("u" + (_this.myRoom().expectedUsers || []).length));
        //     _this.myRoom().setPropsListedInLobby((_this.myRoom().getPropsListedInLobby() || []).concat("l"));
        //     _this.myRoom().setMasterClient(_this.myRoomActorsArray()[Math.floor(Math.random() * _this.myRoomActorsArray().length)].actorNr);
        //     _this.myActor().setName(_this.myActor().name + " ! ");
        //     var n, p, n1, n2, p1, p2, prop, expected;
        //     var setPropTest = function (actorOrRoom) {
        //         n = "n";
        //         n1 = "n1";
        //         n2 = "n2";
        //         p = actorOrRoom.getCustomProperty(n);
        //         p1 = actorOrRoom.getCustomProperty(n1);
        //         p2 = actorOrRoom.getCustomProperty(n2);
        //         prop = {};
        //         prop[n1] = (p1 || "p1") + (p1 || "").length;
        //         prop[n2] = (p2 || "p2") + (p2 || "").length;
        //         expected = {};
        //         expected[n1] = p1 === void 0 ? null : p1;
        //         expected[n2] = p2 === void 0 ? null : p2;
        //     };
        //     setPropTest(_this.myActor());
        //     _this.myActor().setCustomProperty(n, (p || "p") + (p || "").length, true, p);
        //     _this.myActor().setCustomProperties(prop, true, expected);
        //     setPropTest(_this.myRoom());
        //     _this.myRoom().setCustomProperty(n, (p || "p") + (p || "").length, true, p);
        //     _this.myRoom().setCustomProperties(prop, true, expected);
        //     _this.sendMessage("... test: " + _this.myRoom().maxPlayers);
        // };
        // this.updateRoomButtons();
    };
    DemoLoadBalancing.prototype.output = function (str, color) {
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").
            replace(/>/, "&gt;").replace(/"/, "&quot;");
            console.log(escaped);
    };
    // DemoLoadBalancing.prototype.updateRoomButtons = function () {
    //     var btn;
    //     btn = document.getElementById("newgamebtn");
    //     btn.disabled = !(this.isInLobby() && !this.isJoinedToRoom());
    //     var canJoin = this.isInLobby() && !this.isJoinedToRoom() && this.availableRooms().length > 0;
    //     btn = document.getElementById("joingamebtn");
    //     btn.disabled = !canJoin;
    //     var canJoinOrCreate = this.isInLobby() && !this.isJoinedToRoom();
    //     btn = document.getElementById("joinorcreategamebtn");
    //     btn.disabled = !canJoinOrCreate;
    //     btn = document.getElementById("joinrandomgamebtn");
    //     btn.disabled = !canJoinOrCreate;
    //     btn = document.getElementById("leavebtn");
    //     btn.disabled = !(this.isJoinedToRoom());
    // };
    return DemoLoadBalancing;
}(Photon.LoadBalancing.LoadBalancingClient));
var demo;
