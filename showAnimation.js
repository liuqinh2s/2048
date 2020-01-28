function showNumberWithAnimation(i, j, randNumber) {
    var numberCell = $(`#number-cell-${i}-${j}`);
    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);
    numberCell.css({
        width: '100px',
        height: '100px',
        top: getPosition(i),
        left: getPosition(j),
        opacity: '0',
        // display: 'none',
    });
    numberCell.animate({ opacity: '1' }, 100);
}

function showMoveAnimation(fromX, fromY, toX, toY) {
    var numberCellFrom = $(`#number-cell-${fromX}-${fromY}`);
    var numberCellTo = $(`#number-cell-${toX}-${toY}`);
    numberCellTo.attr('style', numberCellFrom.attr('style'));
    numberCellTo.text(board[toX][toY]);
    numberCellTo.css('background-color', getNumberBackgroundColor(board[toX][toY]));
    numberCellFrom.removeAttr('style');
    numberCellFrom.text('');
    numberCellTo.animate(
        {
            top: getPosition(toX),
            left: getPosition(toY),
        },
        50
    );
}

function updateScore(score) {
    $('#score').text(score);
}
