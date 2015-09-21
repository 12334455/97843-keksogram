(function() {
    var formElementResize = document.forms['upload-resize'];
    var formElementFilter = document.forms['upload-filter'];

    var sizeX = formElementResize['resize-x'];
    var sizeY = formElementResize['resize-y'];
    var resSize = formElementResize['resize-size'];

    var MINSIZE = 0;

    var img = document.getElementById('upload-select-image');
    var width = img.clientWidth;
    var height = img.clientHeight;

    sizeX.min = sizeY.min = 0;
    sizeX.max = width - 1;
    sizeY.max = height -1;
    sizeX.value = sizeY.value = 0;
    resSize.min = resSize.value = 1;
    resSize.max = Math.min(width - 1, height - 1);


    sizeX.onchange = function(evt) {
        if (sizeX.value < MINSIZE) {
            sizeX.value = 0;
        }
        if (sizeX > width) {
            sizeX.value = width;
        }
        resSize.max = Math.min(width - sizeX.value, height - sizeY.value);
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

    formElementFilter.onsubmit = function(evt) {
        evt.preventDefault();
        var value = formElementFilter.elements['upload-filter'].value;
        var date = new Date();
        var birthDate = new Date (1994, 11, 7);
        var seconds = Math.floor((date.getTime() - birthDate.getTime())/(1000));
        docCookies.setItem('filter-name', value, seconds, '/');
        formElementFilter.submit();
    };

})();