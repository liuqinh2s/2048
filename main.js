var board = new Array();
var hasConflicted = new Array();
var score = 0;
var emptyGridNum = 16;

$(document).ready(() => {
    newgame();
});

function newgame() {
    // 初始化棋盘格
    init();
    // 在两个随机的格子生成数字
    generateOneNumber();
    generateOneNumber();
}

/**
 * 1. 初始化棋盘格 gridCell
 * 2. 初始化二维数组 用于存储数据 board
 * 3. 初始化数据 清零 updateBoardView();
 */
function init() {
    for (let i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (let j = 0; j < 4; j++) {
            let gridCell = $(`#grid-cell-${i}-${j}`);
            gridCell.css('top', getPosition(i));
            gridCell.css('left', getPosition(j));
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;

    updateScore(score);
}

function updateBoardView() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let theNumberCell = $(`#number-cell-${i}-${j}`);

            theNumberCell.css('width', '0px');
            theNumberCell.css('height', '0px');
            theNumberCell.css('top', getPosition(i) + 50);
            theNumberCell.css('left', getPosition(j) + 50);
            theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
            theNumberCell.css('color', getNumberColor(board[i][j]));
            theNumberCell.text('');

            // if (board[i][j] == 0) {
            //     theNumberCell.css('width', '0px');
            //     theNumberCell.css('height', '0px');
            //     theNumberCell.css('top', getPosition(i) + 50);
            //     theNumberCell.css('left', getPosition(j) + 50);
            //     theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
            //     theNumberCell.css('color', getNumberColor(board[i][j]));
            //     theNumberCell.text(board[i][j]);
            // } else {
            //     theNumberCell.css('width', '100px');
            //     theNumberCell.css('height', '100px');
            //     theNumberCell.css('top', getPosition(i));
            //     theNumberCell.css('left', getPosition(j));
            //     theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
            //     theNumberCell.css('color', getNumberColor(board[i][j]));
            //     theNumberCell.text(board[i][j]);
            // }
            // hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber() {
    if (nospace(board)) {
        false;
    }

    var randx = 0;
    var randy = 0;

    var randPosition = parseInt(Math.floor(Math.random() * emptyGridNum));
    let index = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                if (index == randPosition) {
                    randx = i;
                    randy = j;
                }
                index++;
            }
        }
    }

    // 空格子少一
    emptyGridNum--;

    // 随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function(event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 37: // left 向左移动
            if (moveLeft()) {
                setTimeout(generateOneNumber, 210);
                setTimeout(isgameover, 300);
            }
            break;
        case 38: // up 向上移动
            if (moveUp()) {
                setTimeout(generateOneNumber, 210);
                setTimeout(isgameover, 300);
            }
            break;
        case 39: // right 向右移动
            if (moveRight()) {
                setTimeout(generateOneNumber, 210);
                setTimeout(isgameover, 300);
            }
            break;
        case 40: // down 向下移动
            if (moveDown()) {
                setTimeout(generateOneNumber, 210);
                setTimeout(isgameover, 300);
            }
            break;
        default:
            // default
            break;
    }
});

/**
 * 1. 当前数字是否为0，不为0则进行左移
 * 2. 如果左侧为空格子，则数字进行一个移位操作
 * 3. 如果左侧有数字且不相等
 */
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (let k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        board[i][k] = board[i][j];
                        showMoveAnimation(i, j, i, k);
                        board[i][j] = 0;
                        break;
                    } else if (
                        board[i][k] == board[i][j] &&
                        noBlockHorizontal(i, k, j, board) &&
                        !hasConflicted[i][k]
                    ) {
                        board[i][k] += board[i][j];
                        showMoveAnimation(i, j, i, k);
                        emptyGridNum++;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            hasConflicted[i][j] = false;
        }
    }

    // setTimeout(updateBoardView, 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) return false;

    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        board[k][j] = board[i][j];
                        showMoveAnimation(i, j, k, j);
                        board[i][j] = 0;
                        break;
                    } else if (
                        board[k][j] == board[i][j] &&
                        noBlockVertical(j, k, i, board) &&
                        !hasConflicted[k][j]
                    ) {
                        //move
                        board[k][j] += board[i][j];
                        showMoveAnimation(i, j, k, j);
                        //add
                        emptyGridNum++;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            hasConflicted[i][j] = false;
        }
    }
    // setTimeout(updateBoardView, 200);
    return true;
}

// --------------------------------------------------------------------------------------------------------------------
// 向右移动
function moveRight() {
    if (!canMoveRight(board)) return false;

    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        board[i][k] = board[i][j];
                        showMoveAnimation(i, j, i, k);
                        board[i][j] = 0;
                        break;
                    } else if (
                        board[i][k] == board[i][j] &&
                        noBlockHorizontal(i, j, k, board) &&
                        !hasConflicted[i][k]
                    ) {
                        board[i][k] += board[i][j];
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add

                        emptyGridNum++;
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            hasConflicted[i][j] = false;
        }
    }
    // setTimeout(updateBoardView, 200);
    return true;
}

// --------------------------------------------------------------------------------------------------------------------
// 向下移动
function moveDown() {
    if (!canMoveDown(board)) return false;

    //moveDown
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        board[k][j] = board[i][j];
                        showMoveAnimation(i, j, k, j);

                        board[i][j] = 0;
                        break;
                    } else if (
                        board[k][j] == board[i][j] &&
                        noBlockVertical(j, i, k, board) &&
                        !hasConflicted[k][j]
                    ) {
                        //move
                        board[k][j] += board[i][j];
                        showMoveAnimation(i, j, k, j);
                        //add

                        emptyGridNum++;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            hasConflicted[i][j] = false;
        }
    }
    // setTimeout(updateBoardView, 200);
    return true;
}

// 游戏结束
function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('游戏结束！您的得分为：' + score);
}
