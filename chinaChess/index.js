const container = document.querySelector('.container');
const chessboardEl = document.createElement('div');
const gridsEl = document.createElement('div');
chessboardEl.classList.add('chessboard');
gridsEl.classList.add('girds-container');
container.append(gridsEl);
container.append(chessboardEl);
const player = ['redChess', 'blackChess']
const hash = new Map();
let cnt = 0;
let state = 0;
const n = 10, m = 9;
let selectX, selectY, selectChess, selectPos = [], selectPosCircle = [];
const initchessPos = [[0, 0, '车'], [0, 1, '马'], [0, 2, '象'], [0, 3, '士'], [0, 4, '帅'], [0, 5, '士'], [0, 6, '象'], [0, 7, '马'],
[0, 8, '车'], [2, 1, '炮'], [2, 7, '炮'], [3, 0, '兵'], [3, 2, '兵'], [3, 4, '兵'], [3, 6, '兵'], [3, 8, '兵']];
// console.log(Math.sqrt(2));
//棋盘创建
for (let i = 0; i < 9; i++)
    for (let j = 0; j < 8; j++) {
        const chessGrid = document.createElement('div');
        chessGrid.classList.add('chessGrid');
        if (i == 4 && j != 0 && j != 7) chessGrid.style.borderWidth = "2px 0px";
        else if (i == 4 && j == 0) chessGrid.style.borderRight = "0px";
        else if (i == 4 && j == 7) chessGrid.style.borderLeft = "0px";
        // chessGrid.innerHTML = `${i},${j}`;
        chessboardEl.append(chessGrid);
        [[7, 3], [8, 4], [0, 3], [1, 4]].forEach(([x, y]) => {
            if (x == i && y == j) chessGrid.classList.add('backslash');
        });
        [[1, 3], [0, 4], [8, 3], [7, 4]].forEach(([x, y]) => {
            if (x == i && y == j) chessGrid.classList.add('slash');
        });
    }

//棋盘操控点创建
let grids = [];
let gridsDate = [];
for (let i = 0; i < n; i++) {
    let gridRow = [];
    const gridsDaterow = [];
    for (let j = 0; j < m; j++) {
        const grid = document.createElement('div');
        grid.classList.add('grid');
        grid.innerHTML = `${i},${j}`;
        gridRow.push(grid);
        gridsEl.append(grid);
        gridsDaterow.push(false);
        grid.addEventListener('click', (e) => {
            let flag = false;
            selectPos.forEach(([a, b]) => {
                if (a === i && b === j) flag = true;
            });
            if (!flag) return;
            if (state !== 1) return;
            // console.log(`this=${this},e.target=${e.target}`)
            state = 0;
            chessMove(selectX, selectY, i, j, selectChess);
        })
    }
    grids.push(gridRow);
    gridsDate.push(gridsDaterow);
}
//黑色放置棋子
initchessPos.forEach(([x, y, name]) => {
    CreateChress(x, y, name, 'blackChess');
})
//红色棋子放置
initchessPos.forEach(([x, y, name]) => {
    CreateChress(n - x - 1, m - y - 1, name, 'redChess');
})
//棋子创建
function CreateChress(x, y, name, color) {
    const chess = document.createElement('div');
    chess.classList.add('chess');
    chess.classList.add(color);
    hash.set(chess, [x, y]);
    chess.addEventListener('click', (e) => {
        if (state === 1 && gridsDate[selectX][selectY][1] !== color) {
            console.log('eatChess');
            return;
        }
        const [x, y] = hash.get(chess);
        e.stopPropagation();
        if (player[cnt % 2] !== gridsDate[x][y][1]) return false;
        removeDot();
        selectX = x, selectY = y, selectChess = chess;
        selectPos = getChessSide(x, y);
        createDot();
        state = 1;
    });
    chess.innerHTML = name;
    gridsDate[x][y] = [name, color, chess];
    grids[x][y].append(chess);
}
//棋子移除(吃)
function removeChess(x, y) {
    if (!gridsDate[x][y]) throw new Error('没有这个棋子');
    gridsDate[x][y][2].remove();
    gridsDate[x][y] = null;
}
//棋子移动
function chessMove(preX, preY, toX, toY, selectChess) {
    grids[toX][toY].append(selectChess);
    removeDot();
    if (gridsDate[toX][toY] && gridsDate[preX][preY][1] !== gridsDate[toX][toY][1]) removeChess(toX, toY);
    let tmp = gridsDate[toX][toY];
    gridsDate[toX][toY] = gridsDate[preX][preY];
    gridsDate[preX][preY] = tmp;
    hash.set(selectChess, [toX, toY]);
    cnt++;
}
//棋子可走点
function getChessSide(x, y) {
    switch (gridsDate[x][y][0]) {
        case '车':
            return vehicle(x, y);
        case '炮':
            return gun(x, y);
        case '兵':
            return arm(x, y);
        case '象':
            return elephant(x, y);
        case '士':
            return guard(x, y);
        case '帅':
            return leader(x, y);
        case '马':
            return horse(x, y);
        default:
            return [[x, y]];
    }
}
//车移动方式
function vehicle(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    for (let i = x - 1; i >= 0; i--)if (!check(i, y)) break;
    for (let i = x + 1; i < n; i++)if (!check(i, y)) break;
    for (let i = y - 1; i >= 0; i--)if (!check(x, i)) break;
    for (let i = y + 1; i < m; i++)if (!check(x, i)) break;
    return pos;
    function check(x, y) {
        if (!gridsDate[x][y]) {
            pos.push([x, y]);
        } else {
            if (gridsDate[x][y][1] !== color) pos.push([x, y]);
            return false;
        }
        return true;
    }
}
//炮移动方式
function gun(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    let state = 0;
    for (let i = x - 1; i >= 0; i--)if (!check(i, y)) break;
    state = 0;
    for (let i = x + 1; i < n; i++)if (!check(i, y)) break;
    state = 0;
    for (let i = y - 1; i >= 0; i--)if (!check(x, i)) break;
    state = 0;
    for (let i = y + 1; i < m; i++)if (!check(x, i)) break;
    return pos;
    function check(x, y) {
        if (state === 0) {
            if (!gridsDate[x][y]) pos.push([x, y]);
            else state = 1;
            return true;
        } else if (state === 1) {
            if (!gridsDate[x][y]) return true;
            else {
                if (gridsDate[x][y][1] !== color) pos.push([x, y]);
                return false;
            }
        }
    }
}
//士兵移动方式
function arm(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([x1, y1]) => {
        let a = x1 + x, b = y1 + y;
        console.log(`a=${a} b=${b}`)
        if (IfCrossBorder(a, b)) return;
        if (gridsDate[a][b] && gridsDate[a][b][1] === color) return;
        if (color === 'blackChess' && x <= 4 && (b != y || a < x)) return;
        else if (color === 'blackChess' && x >= 4 && a < x) return;
        if (color === 'redChess' && x > 4 && (b != y || a > x)) return;
        else if (color === 'redChess' && x <= 4 && a > x) return;
        pos.push([a, b]);
    })
    return pos;
}
//象移动方式
function elephant(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    [[-1, 1], [1, -1], [1, 1], [-1, -1]].forEach(([x1, y1]) => {
        let a = x1 + x, b = y + y1;
        // console.log(`a=${a} b=${b}`);
        if (IfCrossBorder(a, b)) return;
        if (gridsDate[a][b]) return;
        a += x1, b += y1;
        if (gridsDate[a][b] && gridsDate[a][b][1] === color) return;
        if(color === 'redChess' && a <= 4)return;
        if(color === 'blackChess' && a >= 5)return;
        pos.push([a, b]);
    });
    return pos;
}
//士的移动方式
function guard(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    [[-1, 1], [1, -1], [1, 1], [-1, -1]].forEach(([x1, y1]) => {
        const a = x1 + x, b = y1 + y;
        console.log(`a=${a} b=${b}`)
        if (IfCrossBorder(a, b)) return;
        if (gridsDate[a][b] && gridsDate[a][b][1] === color) return;
        if (!Ifmatts(a, b)) return;
        pos.push([a, b]);
    })
    return pos;
}
//帅的移动方式
function leader(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([x1, y1]) => {
        let a = x1 + x, b = y1 + y;
        if (IfCrossBorder(a, b)) return;
        if (gridsDate[a][b] && gridsDate[a][b][1] === color) return;
        if (!Ifmatts(a, b)) return;
        pos.push([a, b]);
    })
    return pos;
}
//马的移动方式
function horse(x, y) {
    const pos = [];
    const color = gridsDate[x][y][1];
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([x1, y1]) => {
        let a = x1 + x, b = y1 + y;
        if (IfCrossBorder(a, b)) return;
        if (gridsDate[a][b] && gridsDate[a][b][1] === color) return;

        [[-1, 1], [1, -1], [1, 1], [-1, -1]].forEach(([x2, y2]) => {
            let x3 = a + x2, y3 = b + y2;
            if (IfCrossBorder(a, b)) return;
            if (x3 === x || y3 === y) return;
            if (gridsDate[x3][y3] && gridsDate[x3][y3][1] === color) return;
            pos.push([x3, y3]);
        })
    })
    return pos;
}
//绿点创建
function createDot() {
    console.log(selectPos)
    selectPos.forEach(([x, y]) => {
        const dot = document.createElement('div')
        dot.classList.add('dot');
        selectPosCircle.push(dot);
        grids[x][y].append(dot);
    });
}
//绿点移除
function removeDot() {
    selectPosCircle.forEach((El) => {
        El.remove();
    })
    selectPosCircle = [];
}
//x,y是否越界
function IfCrossBorder(x, y) {
    if (x >= 0 && x < n && y >= 0 && y < m) return false;
    else return true;
}
//是否越出米字格
function Ifmatts(x, y) {
    if (y < 3 || y > 5) return false;
    if (x > 2 && x < 7) return false;
    console.log(true);
    return true;
}