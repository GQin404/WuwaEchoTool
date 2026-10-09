var flag = true;//控制导入频率
var currentRole = 0;//选择的角色ID
let curData;//当前在操作的数据JSON

$(function () {
    if(new URLSearchParams(location.search).get("guide")==="1")return;
    // 首次选择和 Dock 不初始化旧页面，避免只读导航写入空存档或弹出旧设置。
    if (window.UiView && window.UiView.state.effective !== 'classic') return;
    //开始从本地缓存查找是否存在保存的数据
    curData = getDataFromCache("mcData");
    if (curData == null || typeof (curData) === "undefined") {
        //无数据，开始初始化用户信息
        curData = {"pjLevel": 0, "tzmId": null, "role": [], "unusedEchoes": []};
        saveDataToCache(curData);
    } else {
        //初始化特征码
        let tzm = "";
        try {
            tzm = curData.tzmId;
        } catch (e) {
            tzm = null;
        }
        if (tzm != null && typeof (tzm) !== "undefined") {
            $("#idValue").val(tzm);
        }
        //根据数据初始化角色列表
        if (curData.role.length > 0) {
            cshRoleBox();
        }
        //根据当前用户评级初始化首页评价
    }
    //判断是否有保存的token
    let token = localStorage.getItem("kjq_token");
    if (token == null || typeof (token) === "undefined") {
        //还未设置token-询问是否要去绑定token
        if (typeof (curData.internaServer) !== "undefined") {
            if (curData.internaServer) {
                //已设置国际服
                $("#box001").removeClass("mc-hide");
                $("#box002").addClass("mc-hide");
            } else {
                //已设置默认非国际服要使用token绑定
                $("#box002").removeClass("mc-hide");
                $("#box001").addClass("mc-hide");
            }
        } else {
            //从未设置过，进行询问
            if (new URLSearchParams(location.search).get('action') !== 'create') $("#mc-import-setting").modal("show");
            $("#box001").removeClass("mc-hide");
            $("#box002").addClass("mc-hide");
        }
    }
    //模拟点击蒲牢评价
    pulaoPJ();
    //初始化深塔信息
    renderTowerInfo();

    $("#gb-btn-set").click(() => {
        //选择了自定义角色玩家
        $("#box002").removeClass("mc-hide");
        $("#box001").addClass("mc-hide");
        curData["internaServer"] = false;
        saveDataToCache(curData);
        $("#mc-import-setting").modal("hide");
    });
    $("#dr-btn-set").click(() => {
        //选择了导入角色玩家
        $("#box001").removeClass("mc-hide");
        $("#box002").addClass("mc-hide");
        curData["internaServer"] = true;
        saveDataToCache(curData);
        $("#mc-import-setting").modal("hide");
    });
    //更换绑定token
    $(".mc-pulao-img").click(() => {
        if ($("#box002").hasClass("mc-hide")) {
            $("#box002").removeClass("mc-hide");
            $("#box001").addClass("mc-hide");
        } else {
            $("#box001").removeClass("mc-hide");
            $("#box002").addClass("mc-hide");
        }
    });
    //点击绑定token
    $(".mc-btn-box-import2").click(async () => {
        const value=$("#tokenValue").val();if(!value){alert(EchoI18n.createBrowser(window).t('workspace.TOKEN_REQUIRED'));return;}
        const service=ImportService.create({ajax:$.ajax,host:hostName,methods:methodName,headers:completeHeaders,tokenHeaders:completeHeaders2,storage:localStorage});
        try{await service.bind(value);token=value;$("#box002").removeClass("mc-hide");$("#box001").addClass("mc-hide");alert(EchoI18n.createBrowser(window).t('workspace.bound'));}
        catch(_){alert(EchoI18n.createBrowser(window).t('workspace.IMPORT_FAILED'));}
    });
    $("#jfgz").click(function () {
        window.open("./rule.html?view=classic", "_self");
    });
    $('[data-toggle="tooltip"]').tooltip("show");
    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
    }, 5000);
    // 角色本身的属性用于筛选，不随输出模态改变。
    // 分类参考：https://wuthering.gg/zh-Hans/characters
    const roleElementGroups = {
        '冷凝': [11,13,19,23,26,29,52,56,60],
        '热熔': [2,4,12,16,33,39,43,48,49,53,62],
        '导电': [8,10,14,24,28,41,46,55,57,58,63,64],
        '气动': [3,9,15,18,35,36,37,38,42,44,51,61],
        '衍射': [1,6,7,21,25,31,32,47,50,54],
        '湮灭': [5,17,20,22,27,30,34,40,45,59]
    };
    let roleRes = '<div class="mc-filter">' +
        '<label for="mc-filter-select">星级<select id="mc-filter-select" class="form-control mc-select">' +
        '<option value="5" selected>五星角色</option><option value="4">四星角色</option><option value="all">全部星级</option></select></label>' +
        '<label for="mc-filter-element">属性<select id="mc-filter-element" class="form-control mc-select">' +
        '<option value="all">全部属性</option>' +
        Object.keys(roleElementGroups).map(element => '<option value="' + element + '">' + element + '</option>').join('') +
        '</select></label></div><div class="mc-filter-roles">';
    roleList.forEach(item => {
        const element = Object.keys(roleElementGroups).find(key => roleElementGroups[key].includes(item.id)) || '';
        const name = $('<span>').text(item.name).html().replace(/"/g, '&quot;');
        roleRes += '<div data-role-val="' + item.id + '" data-star="' + item.star + '" data-element="' + element +
            '" title="' + name + '" aria-label="' + name + '" class="mc-role ' + item.cls + '"></div>';
    });
    roleRes += '</div><p class="mc-filter-empty mc-hide" role="status">没有符合条件的角色</p>';
    const rolePicker = $('#mc-addrole .modal-body-a');
    rolePicker.html(roleRes);
    function filterRoleCards() {
        const star = $('#mc-filter-select').val();
        const element = $('#mc-filter-element').val();
        let visibleCount = 0;
        rolePicker.find('.mc-role').each(function () {
            const card = $(this);
            const visible = (star === 'all' || card.attr('data-star') === star) &&
                (element === 'all' || card.attr('data-element') === element);
            card.toggleClass('mc-hide', !visible);
            if (visible) visibleCount++;
            if (!visible && card.hasClass('mc-active')) {
                card.removeClass('mc-active');
                currentRole = 0;
            }
        });
        rolePicker.find('.mc-filter-empty').toggleClass('mc-hide', visibleCount > 0);
    }
    rolePicker.on('change', '#mc-filter-select, #mc-filter-element', filterRoleCards);
    filterRoleCards();
    //点击特征码ID，隐藏或显示ID
    $("#idTitle").click(() => {
        if ($("#idValue").attr("type") === "password") {
            $("#idValue").attr("type", "value");
        } else {
            $("#idValue").attr("type", "password");
        }
    });

    //开启或关闭角色卡居中显示
    $(".cr-eval-center").click(() => {
        if ($(".mc-save-box").attr("data-mode") === "left") {
            $(".mc-save-box").addClass("mc-save-box-center").attr("data-mode", "center");
            curData["boxMode"] = true;
            $(".cr-eval-center").html("关闭居中显示");
        } else {
            $(".mc-save-box").removeClass("mc-save-box-center").attr("data-mode", "left");
            curData["boxMode"] = false;
            $(".cr-eval-center").html("角色居中显示");
        }
        saveDataToCache(curData);
    });
    //点击导入角色
    $(".mc-btn-box-import").click(async function () {
        if (!flag) return;
        flag = false;
        const service = ImportService.create({ajax:$.ajax,host:hostName,methods:methodName,headers:completeHeaders,tokenHeaders:completeHeaders2,storage:localStorage});
        try {
            const idz = $("#idValue").val();
            const roles = await service.list(idz);
            curData.tzmId = idz;
            const container = $("#mc-import-role .modal-body-b").empty();
            roles.forEach(item=>container.append($('<img>').attr({'data-level':item.level,'data-role-id':mappingRoleId(item.roleId,item.roleName),'data-game-role-id':item.roleId,src:item.roleIconUrl,alt:item.roleName}).addClass('mc-role-impt-item')));
            $("#mc-import-role").modal("show");
        } catch (_) { alert(EchoI18n.createBrowser(window).t('workspace.IMPORT_FAILED')); }
        finally { setTimeout(()=>{flag=true;},15000); }
    });
    //导入勾选的角色
    $('#dr-btn').click(() => {
        //拿到所有勾选的角色ID和等级
        $("#mc-import-role .mc-active").each((index, item) => {
            const entry=roleList.find(r=>String(r.id)===$(item).attr('data-role-id'));
            if(!entry)return;
            const roleOne=CharacterCore.createRole(entry,Date.now()+index);
            Object.assign(roleOne,{isImport:true,level:$(item).attr('data-level'),gameRoleId:$(item).attr('data-game-role-id')});
            curData.role.push(roleOne);
        });
        saveDataToCache(curData);
        if (curData.role.length > 0) {
            cshRoleBox();
        }
        $("#mc-import-role").modal("hide");
        alert("导入成功！点开角色，点击右上角【导入数据】按钮，即可实时获取游戏内装备评分了。");
    });
    //点击添加角色
    $("#mc-addrole .mc-role").click(function () {
        $(".mc-role").removeClass("mc-active");
        $(this).addClass("mc-active");
        currentRole = $(this).attr("data-role-val");
    });
    $("#mc-import-role").on("click", ".mc-role-impt-item", function () {
        if ($(this).hasClass("mc-active")) {
            $(this).removeClass("mc-active");
        } else {
            $(this).addClass("mc-active");
        }
    });
    //保存角色
    $('#qd-btn').click(() => {
        if (currentRole < 1) {
            alert("请先选择一个角色。");
            return;
        }
        // 执行确定按钮的操作,从角色JSON查出对应编号插入列表
        roleList.forEach(item => {
            if (item.id == currentRole) {
                //生成一个角色对象
                let roleOne = CharacterCore.createRole(item, Date.now());
                curData.role.push(roleOne);
                saveDataToCache(curData);
                $(".mc-save-box").append(`<div class="mc-role ` + item.cls + `">
                   <p class="mc-role-score">0.00</p>
                   <button type="button" data-id="` + roleOne.roleId + `" class="mc-role-delete" aria-label="删除角色" title="删除角色">×</button>
               </div>`);
                $(".mc-role-cel").addClass("mc-hide");
            }
        });
        $('#mc-addrole').modal('hide');
    });
    //点击角色跳转
    $(".mc-save-box").on("click", ".mc-role", function (event) {
        if ($(event.target).closest(".mc-role-delete").length) return;
        //拿到点击的角色ID
        let roleid = $(this).find(".mc-role-delete").attr("data-id");
        //判断是否是导入的角色，如果是则跳转到只读页面
        if ($(this).attr("data-readonly") === "true") {
            window.open("./mccost-readonly.html?view=classic&roleid=" + roleid, "_self");
        } else {
            window.open("./mccost.html?view=classic&roleid=" + roleid, "_self");
        }
    }).on("click", ".mc-role-delete", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!confirm("确定要删除角色吗？(该角色下声骸数据会一并删除)")) {
            return false;
        }
        //点击删除一个角色
        let roleId = $(this).attr("data-id");
        //从数据移除该角色并保存数据
        CharacterCore.removeRole(curData,roleId);

        //如果角色没有了，就初始化BOX
        if (curData.role.length < 1) {
            $(".mc-save-box").html(`<div class="mc-role-cel mcr-defult"  data-toggle="modal" data-target="#mc-addrole">
                请先<br>添加角色
            </div>`);
        }
        saveDataToCache(curData);
        //将该HTML元素移除
        $(this).parent().remove();
        //阻止冒泡
        return false;
    });
    //点击蒲牢点评进行评价
    $(".cr-eval-btn").click(() => {
        pulaoPJ();
    });

    //导出本地JSON为mcdata.json
    $(".mc-data-export").click(() => {
        downloadFun(JSON.stringify(curData), "mcdata.json");
    });
    //将外部mcdata.json导入到本地读取后写入缓存。
    $(".mc-data-import").click(() => {
        $("#fileInput").trigger("click");
    });
    $("#fileInput").change(event => {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        if (file.name !== "mcdata.json") {
            alert("导入的文件名称无法识别，必须是从该页面导出的数据才能导入。");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                curData = CharacterCore.validate(JSON.parse(e.target.result));
                saveDataToCache(curData);
                location.reload();
            } catch (error) {
                alert("导入的文件不是正确的JSON数据格式。");
            }
        };
        reader.onerror = function (e) {
            alert("文件无法被读取" + e.target.error.code);
        };

        reader.readAsText(file); // 读取文本文件
    });
    //点击跳转到声骸概率预测页面
    $("#mc-gl-fctgl").click(() => {
        window.open("./probability.html?view=classic", "_self");
    });
    $("#mc-gl-shdb").click(() => {
        window.open("./compare.html?view=classic", "_self");
    });
    $("#mc-gl-mnkk").click(() => {
        window.open("./imitate.html?view=classic", "_self");
    });
    $("#mc-gl-unusedEchoes").click(() => {
        window.open("./unusedEchoes.html?view=classic", "_self");
    });
    $("#mc-gl-jsdp").click(() => {
        alert("数据统计分析中，暂未开放，尽请期待");
    });
    $("#mc-gl-sldt").click(() => {
        window.open("https://b23.tv/28aU2TY", "_blank");
    });


    //导入深塔数据
    $("#upd-tower").click(() => {
        //拿到特征码
        if (curData.tzmId != null) {
            //有特征码，开始查询
            if (curData.tzmId.length !== 9) {
                alert("特征码ID必须是9位数字。");
                return;
            } else {
                let params = {
                    "gameId": 3,
                    "roleId": curData.tzmId,
                    "serverId": "76402e5b20be2c39f095a152090afddc"
                }
                //发送刷新数据请求
                $.ajax({
                    url: hostName + methodName[3],
                    type: 'POST',
                    headers: completeHeaders(localStorage.getItem("kjq_bat"), false),
                    data: params,
                    dataType: 'json',
                    success: function (rest) {
                        $.ajax({
                            url: hostName + methodName[4],
                            type: 'POST',
                            headers: completeHeaders(null, false),
                            data: params,
                            dataType: 'json',
                            success: function (res) {
                                let towerInfo = {};
                                if (res.code === 200 || res.code === 10902) {
                                    let deData = JSON.parse(res.data);
                                    if (deData.difficultyList != null) {
                                        towerInfo["mainInfo"] = deData.difficultyList;
                                        //再发一次请求拿到左中右塔的总星数
                                        $.ajax({
                                            url: hostName + methodName[5],
                                            type: 'POST',
                                            headers: completeHeaders(null, false),
                                            data: params,
                                            dataType: 'json',
                                            success: function (rest) {
                                                let starInfo = {
                                                    "leftStar": 0,
                                                    "middleStar": 0,
                                                    "rightStar": 0,
                                                    "sumStar": 0
                                                };
                                                let deData2 = JSON.parse(rest.data);
                                                if (deData2 != null && deData2.difficultyList != null && deData2.difficultyList.length>3) {
                                                    deData2.difficultyList[3].towerAreaList.forEach(item => {
                                                        if (item.areaId === 1) {
                                                            starInfo.leftStar = item.star;
                                                        } else if (item.areaId === 2) {
                                                            starInfo.middleStar = item.star;
                                                        } else if (item.areaId === 3) {
                                                            starInfo.rightStar = item.star;
                                                        }
                                                        starInfo.sumStar = parseInt(starInfo.sumStar) + parseInt(item.star);
                                                    });
                                                } else {
                                                    alert("没有查到本期参与深境区的数据 或 查询的不是本人(只有查自己才能获取星数)。");
                                                }
                                                towerInfo["starInfo"] = starInfo;
                                                curData["towerInfo"] = towerInfo;
                                                saveDataToCache(curData);
                                                //开始渲染页面
                                                renderTowerInfo();
                                                alert("更新深塔数据成功。");
                                            },
                                            error: function (e) {
                                                alert("异常：获取深塔详情数据失败，请联系作者。");
                                            }
                                        });


                                    } else {
                                        alert("没有查询到本期参与深塔信息。");
                                    }
                                } else {
                                    alert("未知的返回值：code-" + res.code);
                                }
                            },
                            error: function (e) {
                                alert("异常：导入深塔数据失败，请联系作者。");
                            }
                        });
                    },
                    error: function (e) {
                        alert("刷新游戏数据到库街区失败，请稍后再试。");
                    }
                });
            }
        } else {
            alert("请先绑定token并输入特征码UID。");
        }
    });
});

function getDaysDiff(date1, date2) {
    let difference = Math.abs(date2.getTime() - date1.getTime());
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const days = Math.floor(difference / millisecondsInDay);
    return days;
}

//初始化角色
function cshRoleBox() {
    let res = "";
    curData.role.sort((a, b) => parseFloat(b.totalScore) - parseFloat(a.totalScore));
    curData.role.forEach((item, index) => {
        const portraitClass = roleList.find(r => String(r.id) === String(item.roleListId))?.cls || item.cls;
        if (typeof (item.isImport) != "undefined" && item.isImport) {
            res += `<div data-readonly="true" class="mc-role ` + portraitClass + `">
                       <p class="mc-role-score">` + item.totalScore + `</p>
                       <button type="button" data-id="` + item.roleId + `" class="mc-role-delete" aria-label="删除角色" title="删除角色">×</button>
                       <p class="mc-role-level">Lv-` + item.level + `</p>`;
            if (index === 0) {
                res += `<span class="mc-role-rank rankbg01">1</span>`;
            } else if (index === 1) {
                res += `<span class="mc-role-rank rankbg02">2</span>`;
            } else if (index === 2) {
                res += `<span class="mc-role-rank rankbg03">3</span>`;
            }
            res += `<span class="mc-role-ming">` + (typeof (item.ming) !== "undefined" ? item.ming : 0) + `</span></div>`;
        } else {
            res += `<div data-readonly="false" class="mc-role ` + portraitClass + `">
                       <p class="mc-role-score">` + item.totalScore + `</p>
                       <button type="button" data-id="` + item.roleId + `" class="mc-role-delete" aria-label="删除角色" title="删除角色">×</button>`;
            if (index === 0) {
                res += `<span class="mc-role-rank rankbg01">1</span>`;
            } else if (index === 1) {
                res += `<span class="mc-role-rank rankbg02">2</span>`;
            } else if (index === 2) {
                res += `<span class="mc-role-rank rankbg03">3</span>`;
            }
            res += `<span class="mc-role-ming">` + (typeof (item.ming) !== "undefined" ? item.ming : 0) + `</span></div>`;
            res += `</div>`;
        }
    });
    if (typeof (curData.boxMode) !== "undefined" && curData.boxMode) {
        $(".mc-save-box").addClass("mc-save-box-center").attr("data-mode", "center");
        $(".cr-eval-center").html("关闭居中显示");
    }
    $(".mc-save-box").html(res);
}

/**
 * 下载字符串到文件
 * @param {string} content 文件内容
 * @param {string} filename 文件名
 */
function downloadFun(content, filename) {
    // 创建隐藏的可下载链接 A 标签
    const dom = document.createElement('a')
    dom.download = filename || '未命名文件'
    // 隐藏
    dom.style.display = 'none'
    // 将字符内容转换为成 blob 二进制
    const blob = new Blob([content])
    // 创建对象 URL
    dom.href = URL.createObjectURL(blob)
    // 添加 A 标签到 DOM
    document.body.appendChild(dom)
    // 模拟触发点击
    dom.click()
    // 或
    // dom.dispatchEvent(new MouseEvent('click'))
    // 移除 A 标签
    document.body.removeChild(dom)
}

//返回深塔完成星数信息-towerId-塔ID,starInfo-深塔星数信息
function callbackTowerInfo(starInfo, towerId) {
    if (towerId == 1) {
        return "左塔达成度:<br>" + starInfo.leftStar + "/12";
    } else if (towerId == 2) {
        return "中塔达成度:<br>" + starInfo.middleStar + "/6";
    } else if (towerId == 3) {
        return "右塔达成度:<br>" + starInfo.rightStar + "/12";
    } else {
        return "异常：未知的塔ID。"
    }
}

//执行渲染蒲牢评价
function pulaoPJ() {
    let bys = {"b01": 0, "b02": 0, "b03": 0, "b04": 0};
    let sumScore = 0;
    let avgScore = 0;
    let fbrs = 0;
    curData.role.forEach(item => {
        if (typeof (item.isImport) !== "undefined" && item.isImport) {
            fbrs++;
            if (item.totalScore > 90) {
                bys.b01 = bys.b01 + 1;
            } else if (item.totalScore > 80) {
                bys.b02 = bys.b02 + 1;
            } else if (item.totalScore > 70) {
                bys.b03 = bys.b03 + 1;
            } else if (item.totalScore > 60) {
                bys.b04 = bys.b04 + 1;
            }
            sumScore = parseFloat(sumScore) + parseFloat(item.totalScore);
        }
    });
    if (fbrs !== 0) {
        avgScore = parseFloat(sumScore) / fbrs;
    } else {
        curData.role.forEach(item => {
            if (typeof (item.isImport) === "undefined" || !item.isImport) {
                fbrs++;
                if (item.totalScore > 90) {
                    bys.b01 = bys.b01 + 1;
                } else if (item.totalScore > 80) {
                    bys.b02 = bys.b02 + 1;
                } else if (item.totalScore > 70) {
                    bys.b03 = bys.b03 + 1;
                } else if (item.totalScore > 60) {
                    bys.b04 = bys.b04 + 1;
                }
                sumScore = parseFloat(sumScore) + parseFloat(item.totalScore);
            }
        });
        if (fbrs !== 0) {
            avgScore = parseFloat(sumScore) / fbrs;
        }
    }
    sumScore = sumScore.toFixed(2);
    avgScore = avgScore.toFixed(2);
    let ts = getDaysDiff(new Date("2024/5/23"), new Date());
    //开始根据练度筛选评价，总分500+均分75+，总分460+均分70+，总分430均分65，总分400均分60，总分360，总分320，总分280，总分240，总分180，总分120
    let pj;
    if (sumScore > 1200 && avgScore > 75) {
        pj = pulaoSay[0];
    } else if (sumScore > 1100 && avgScore > 70) {
        pj = pulaoSay[1];
    } else if (sumScore > 1000 && avgScore > 65) {
        pj = pulaoSay[2];
    } else if (sumScore > 900 && avgScore > 62) {
        pj = pulaoSay[3];
    } else if (sumScore > 800 && avgScore > 60) {
        pj = pulaoSay[4];
    } else if (sumScore > 700 && avgScore > 55) {
        pj = pulaoSay[5];
    } else if (sumScore > 600) {
        pj = pulaoSay[6];
    } else if (sumScore > 500) {
        pj = pulaoSay[7];
    } else if (sumScore > 400) {
        pj = pulaoSay[8];
    } else if (sumScore > 350) {
        pj = pulaoSay[9];
    } else if (sumScore > 300) {
        pj = pulaoSay[10];
    } else if (sumScore > 250) {
        pj = pulaoSay[11];
    } else if (sumScore > 200) {
        pj = pulaoSay[12];
    } else if (sumScore > 150) {
        pj = pulaoSay[13];
    } else if (sumScore > 100) {
        pj = pulaoSay[14];
    } else {
        pj = pulaoSay[15];
    }
    let percent = sumScore * 100 / 1200;
    percent = percent.toFixed(2);
    if (percent > 100) {
        percent = 100;
    }
    //开始回填数据
    $(".mc-box-evaluate-left").attr("title", pj.title).attr("data-original-title", pj.title);
    $('[data-toggle="tooltip"]').tooltip('show');
    $(".mc-box-evaluate-img").attr("src", "image/bqb/" + pj.img + ".png");
    $("#userPJ").html(pj.dj);
    $("#by01").html(bys.b01 + "个");
    $("#by02").html(bys.b02 + "个");
    $("#by03").html(bys.b03 + "个");
    $("#by04").html(bys.b04 + "个");
    $("#pj-words").html(pj.say + `开服至今 <span class="font-color font-color-01">` + ts + `</span>天，你一共毕业了<span class="font-color font-color-02"> ` + (bys.b01 + bys.b02 + bys.b03 + bys.b04) + ` </span>套声骸，合计评分<span class="font-color font-color-03">` + sumScore + `</span>
                分，平均每个角色练度为<span class="font-color font-color-04">` + avgScore + `</span>分，已经超越了<span class="font-color font-color-05"> ` + percent + `% </span>的玩家，评估你的练度为<span class="font-color font-color-07">【` + pj.dj + `】</span>，现在蒲牢我任命你为<span class="font-color font-color-06"> 【` + pj.ps + `】 </span>`);

}

//从缓存里初始化深塔信息
function cshTower() {
    //首先从curData里取深塔信息，如果没有则pass
    if (typeof (curData.towerInfo) != "undefined") {

    }
}

//渲染深塔数据信息页面
function renderTowerInfo() {
    if (typeof (curData.towerInfo) !== "undefined") {
        let reht = "";
        curData.towerInfo.mainInfo[0].towerAreaList.forEach(ele => {
            if (ele.floorList != null && ele.floorList.length > 0) {
                reht += `<div class="mc-tower-row" style="background-image: url('` + ele.floorList[0].picUrl + `');background-size: 100% auto">
                                                            <span class="mc-tower-row-left">` + callbackTowerInfo(curData.towerInfo.starInfo, ele.areaId) + `</span>`;
                if (ele.floorList[0].roleList != null && ele.floorList[0].roleList.length > 0) {
                    for (let i = 0; i < 3; i++) {
                        try {
                            reht += `<img class="mc-tower-row-role" src="` + ele.floorList[0].roleList[i].iconUrl + `" alt="角色头像">`;
                        } catch (e) {
                            reht += `<span class="mc-tower-row-role-null">空</span>`;
                        }
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        reht += `<span class="mc-tower-row-role-null">空</span>`;
                    }
                }
                reht += `</div>`;
            } else {
                reht += `<div class="mc-tower-row" style="background-image: url('https://web-static.kurobbs.com/adminConfig/67/tower_difficulty_floor_pic/1723104079431.jpg');background-size: 100% auto">
                                                            <span class="mc-tower-row-left">` + callbackTowerInfo(curData.towerInfo.starInfo, ele.areaId) + `</span>
                                                            <span class="mc-tower-row-role-null">空</span>
                                                            <span class="mc-tower-row-role-null">空</span>
                                                            <span class="mc-tower-row-role-null">空</span>
                                                        </div>`;
            }
        });
        $(".mc-tower-content").html(reht);
        $("#sumStar").html(curData.towerInfo.starInfo.sumStar);
    }
}
