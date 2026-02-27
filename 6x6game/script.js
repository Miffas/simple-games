const container = document.getElementById("game");
const buttons = document.getElementById("buttons");
const colorContainer = document.getElementById("needed");
const restarter = document.getElementById("restart");
const stepDisplay = document.getElementById("back");
const setColors = [
    "#e6194b", // 0 red
    "#3cb44b", // 1 green
    "#ffe119", // 2 yellow
    "#4363d8", // 3 blue
    "#f58231", // 4 orange
    "#911eb4", // 5 purple
    "#42d4f4", // 6 cyan
    "#f032e6", // 7 magenta
    "#bfef45", // 8 lime
    "#fabed4", // 9 pink
    "#469990", // 10 teal
    "#dcbeff", // 11 lavender
    "#9a6324", // 12 brown
    "#fffac8", // 13 beige
    "#800000", // 14 maroon
    "#aaffc3", // 15 mint
    "#808000", // 16 olive
    "#ffd8b1", // 17 apricot
    "#000075", // 18 navy
    "#a9a9a9", // 19 gray
    "#ffffff", // 20 white
    "#000000", // 21 black
];
let usedColors = [];
// 路径
const mainPath = "game-crossx-6-";
// 默认关卡
const levelCount = levels.length;
let level = parseInt(localStorage.getItem(`${mainPath}levelnow`))%levelCount||0;
// 初始化数组
let neededColors = levels[level].result;
usedColors.push(models[levels[level].model]);
let step = 0;
// 最好成绩
let bestStep = parseInt(localStorage.getItem(`${mainPath}${levels[level].path}`))||0;
// 更新按钮颜色及文字，数组整理后触发
function update() {
    if (compare(usedColors[step], neededColors)) {
        restarter.textContent = `第${level+1}关 完成`;
        stepDisplay.style.backgroundColor = "#3cb44b";
        restarter.style.backgroundColor = "#3cb44b";
        // 下列仅在通过时触发
        if (step < bestStep || bestStep === 0) {
            bestStep = step;
            localStorage.setItem(`${mainPath}${levels[level].path}`, String(bestStep));
        }
    } else {
        restarter.textContent = `第 ${level+1} 关`;
        stepDisplay.style.backgroundColor = "#e0e0e0";
        restarter.style.backgroundColor = "#e0e0e0";
    }
    stepDisplay.textContent = `${step} / ${bestStep} 步`;
}
// 切换关卡
function change() {
    // 按钮初始化
    neededColors = levels[level].result;
    bestStep = parseInt(localStorage.getItem(`${mainPath}${levels[level].path}`))||0;
    restart();
    renderModule();
    localStorage.setItem(`${mainPath}levelnow`, String(level));
}
// 上关
function last() {
    level = (level+levelCount-1)%levelCount;
    change();
    console.log("last");
}
// 下关
function next() {
    level = (level+1)%levelCount;
    change();
    console.log("next");
}
// 撤回
function back() {
    if (step == 0) return;
    step--;
    usedColors.pop();
    render();
    update();
    console.log(step);
}
// 按钮初始化
function render() {
    for (let i = 0; i < 36; i++) {
        document.getElementById(`${i}`).style.backgroundColor = setColors[usedColors[step][i]];
    }
}
// 提示色块初始化
function renderModule() {
    for (let i = 0; i < 36; i++) {
        document.getElementById(`color${i}`).style.backgroundColor = setColors[neededColors[i]];
    }
}
// 重新开始
function restart() {
    step = 0;
    usedColors = [models[levels[level].model]];
    // neededColors = levels[level].result;
    // 按钮初始化
    render();
    // 更新按钮状态
    update();
    console.log("restart");
}
// 返回符合要求的坐标
function search(p=0) {
    const x = p%6;
    const y = Math.floor(p/6);
    console.log(step, x+1, y+1);
    let allowed = [];
    const xIR = [x-2,x-1,x+1,x+2];
    const yIR = [y-2,y-1,y+1,y+2];
    for (let i = 0; i < 6; i++) {
        if (xIR.includes(i)) allowed.push(i+y*6);
        if (yIR.includes(i)) allowed.push(i*6+x);
    }
    return allowed;
}
// 比较两个数组
function compare(a=[0],b=[0]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
// 主循环
// 重置按钮文本
restarter.textContent = `第 ${level+1} 关`;
stepDisplay.textContent = `${step} / ${bestStep} 步`;
for (let i = 0; i < 36; i++) {
    // 依次对游戏面板按钮进行填色
    const numBtn = document.createElement("button");
    numBtn.id = `${i}`;
    numBtn.className = "block";
    numBtn.style.backgroundColor = setColors[usedColors[0][i]];
    
    // 按钮点击事件
    numBtn.addEventListener("click", function() {
        // 历史纪录更改
        usedColors.push([...usedColors[step]]);
        // 记录该色块的颜色
        const color = usedColors[step][Number(numBtn.id)];
        step++;
        const s = search(numBtn.id);
        for (let j = 0; j < s.length; j++) {
            const p = s[j];
            usedColors[step][p] = color;
            // 更改颜色
            document.getElementById(`${p}`).style.backgroundColor = numBtn.style.backgroundColor;
        }
        if (compare(usedColors[step], usedColors[step-1])) {
            usedColors.pop();
            step--;
        }
        update();
    });
    container.appendChild(numBtn);
    // 目标图形区
    const colorBtn = document.createElement("button");
    colorBtn.id = `color${i}`;
    colorBtn.className = "block";
    
    colorBtn.style.backgroundColor = setColors[neededColors[i]];
    colorContainer.appendChild(colorBtn);
}