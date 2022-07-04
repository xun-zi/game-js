const container = document.querySelector('.container');
const squareType = [
    [
        [[0, 0], [1, 0], [0, 1], [1, 1],],
        [[0, 0], [1, 0], [0, 1], [1, 1],],
        [[0, 0], [1, 0], [0, 1], [1, 1],],
        [[0, 0], [1, 0], [0, 1], [1, 1],],
    ], [
        [[1, 0], [0, 0], [-1, 0], [-2, 0]],
        [[0, -1], [0, -2], [0, 0], [0, 1]],
        [[1, 0], [0, 0], [-1, 0], [-2, 0]],
        [[0, -1], [0, -2], [0, 0], [0, 1]],
    ], [
        [[0, -1], [0, 0], [0, 1], [1, 1]],
        [[1, 0], [-1, 0], [-1, 1], [0, 0]],
        [[0, -1], [-1, -1], [0, 0], [0, 1]],
        [[1, 0], [1, -1], [-1, 0], [0, 0]],
    ], [
        [[0, -1], [0, 0], [0, 1], [-1, 1]],
        [[0, 0], [-1, 0], [-1, -1], [1, 0]],
        [[0, 0], [0, -1], [1, -1], [0, 1]],
        [[0, 0], [1, 0], [1, 1], [-1, 0]]
    ], [
        [[0, 0], [0, -1], [1, 0], [1, 1]],
        [[0, 0], [0, -1], [1, -1], [-1, 0]],
        [[0, 0], [0, -1], [1, 0], [1, 1]],
        [[0, 0], [0, -1], [1, -1], [-1, 0]],
    ], [
        [[0, 0], [0, 1], [1, 0], [1, -1]],
        [[1, 0], [0, -1], [-1, -1], [0, 0]],
        [[0, 0], [0, 1], [1, 0], [1, -1]],
        [[1, 0], [0, -1], [-1, -1], [0, 0]],
    ]
];
//格子创建
let grids = [];
let st = [];
let cnt = new Array(24).fill(0);
let sqtypeX = 0, sqtypeY = 0;
let lumpX = 21, lumpY = 5, sqtype = squareType[0][0], time = 100;
for (let i = 0; i < 24; i++) {
    let gridRow = [];
    s = []
    for (let j = 0; j < 10; j++) {
        const grid = document.createElement('div');
        grid.classList.add('grid');
        gridRow.push(grid);
        grid.innerHTML = i + ',' + j;
        container.append(grid);
        s.push(false);
    }
    grids.push(gridRow);
    st.push(s);
}


//按键设置
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        deleteLump([lumpX, lumpY], sqtype)
        if (ifGoWalk([lumpX, lumpY - 1], sqtype)) lumpY--;
        addLump([lumpX, lumpY], sqtype)
    } else if (e.key == 'ArrowRight') {
        deleteLump([lumpX, lumpY], sqtype)
        if (ifGoWalk([lumpX, lumpY + 1], sqtype)) lumpY++;
        addLump([lumpX, lumpY], sqtype)
    } else if (e.key === 'ArrowDown') {
        time = 10;
    } else if (e.key === 'ArrowUp') {
        deleteLump([lumpX, lumpY], sqtype)
        sqtypeY = (sqtypeY + 1) % 4;
        sqtype = squareType[sqtypeX][sqtypeY];
        addLump([lumpX, lumpY], sqtype)
        console.log(1);
    }
})

//基本规则建立
function init() {
    fullRowDispose();
    sqtypeX = Math.floor(Math.random() * 100 % 6), sqtypeY = Math.floor(Math.random() * 100 % 4);
    lumpX = 22, lumpY = 5, time = 100, sqtype = squareType[sqtypeX][sqtypeY];
    lumpstart();
}
function lumpstart() {
    if (goWalk([lumpX, lumpY], sqtype)) setTimeout(() => lumpstart(), time);
    else init();
}

function ifGoWalk([x, y], squareTypeOne) {
    for (let i = 0; i < squareTypeOne.length; i++) {
        const [x1, y1] = squareTypeOne[i];
        const a = +x + x1, b = +y + y1;
        if (b < 0 || b >= 10 || a < 0 || st[a][b]) return false;
    }
    return true;
}

//满行清除
function fullRowDispose() {
    for (let i = 0, j = 0; i < grids.length; i++) {
        if (cnt[i] === 10) {
            for (let k = 0; k < grids.length; k++)deleteSquare(i, k);
        } else {
            for (let k = 0; k < grids.length; k++) {
                if (st[i][k]) {
                    deleteSquare(i, k);
                    addSquare(j, k);
                } else if (st[j][k]) {
                    deleteSquare(j, k);
                }
            }
            j++;
        }
    }
}
function goWalk([x, y], squareTypeOne) {
    deleteLump([x, y], squareTypeOne);
    if (!ifGoWalk([x - 1, y], squareTypeOne)) {
        addLump([x, y], squareTypeOne);
        return false;
    }
    addLump([x - 1, y], squareTypeOne);
    lumpX--;
    return true;
}
//增加和删除
function addLump([x, y], squareTypeOne) {
    squareTypeOne.forEach(([x1, y1]) => {
        let a = x + x1, b = y + y1;
        addSquare(a, b);
    })
}
function deleteLump([x, y], squareTypeOne) {
    squareTypeOne.forEach(([x1, y1]) => {
        let a = x1 + x, b = y + y1;
        deleteSquare(a, b);
    })
}
function addSquare(x, y) {
    if (st[x][y]) return;
    grids[x][y].classList.add('red');
    st[x][y] = true;
    cnt[x]++;
}
function deleteSquare(x, y) {
    if (!st[x][y]) return;
    st[x][y] = false;
    cnt[x]--;
    grids[x][y].classList.remove('red');
}
init()