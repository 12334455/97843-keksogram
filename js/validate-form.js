(function() {
    var formElement = document.forms['upload-resize'];

    var sizeX = formElement['resize-x'];
    var sizeY = formElement['resize-y'];
    var resSize = formElement['resize-size'];

    var MINSIZE = 0;

    var img = document.getElementById('upload-select-image');
    var width = img.clientWidth;
    var height = img.clientHeight;

    sizeX.min = sizeY.min = 0;
    sizeX.max = width - 1;
    sizeY.max = height -1;
    sizeX.value = sizeY.value = 0;
    resSize.min = 1;
    resSize.max = Math.min(width - 1, height - 1);

    sizeX.onchange = function(evt) {
        if (sizeX.value < MINSIZE) {
            sizeX.value = 0;
        }
        if (sizeX > width) {
            sizeX.value = width;
        }
        resSize.max = min(width - sizeX.value, height - sizeY.value);

    };


    sizeY.onchange = function(evt) {
        if (sizeY.value < MINSIZE) {
            sizeY.value = 0;
        }
        if (sizeY > height) {
            sizeY.value = height;
        }
        resSize.max = Math.min(width - sizeX.value, height - sizeY.value);

    };



})();