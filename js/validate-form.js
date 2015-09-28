'use strict';
(function() {
  var formElementResize = document.forms['upload-resize'];
  var formElementFilter = document.forms['upload-filter'];

  var sizeX = formElementResize['resize-x'];
  var sizeY = formElementResize['resize-y'];
  var resSize = formElementResize['resize-size'];

  var MIN_IMAGE_SIZE = 0;

  var img = document.getElementById('upload-select-image');
  var width = img.clientWidth;
  var height = img.clientHeight;

  sizeX.min = sizeY.min = MIN_IMAGE_SIZE;
  sizeX.max = width;
  sizeY.max = height;
  sizeX.value = sizeY.value = MIN_IMAGE_SIZE;
  resSize.min = resSize.value = MIN_IMAGE_SIZE;
  resSize.max = Math.min(width, height);


  sizeX.onchange = function() {
    if (sizeX.value < MIN_IMAGE_SIZE) {
      sizeX.value = 0;
    }
    if (sizeX > width) {
      sizeX.value = width - 1;
    }
    resSize.max = Math.min(width - sizeX.value, height - sizeY.value);
  };


  sizeY.onchange = function() {
    if (sizeY.value < MIN_IMAGE_SIZE) {
      sizeY.value = 0;
    }
    if (sizeY > height) {
      sizeY.value = height - 1;
    }
    resSize.max = Math.min(width - sizeX.value, height - sizeY.value);
  };

  formElementFilter.onsubmit = function(evt) {
    evt.preventDefault();
    var value = formElementFilter.elements['upload-filter'].value;
    var date = new Date();
    var birthDate = new Date(1994, 11, 7);
    var seconds = Math.floor((date.getTime() - birthDate.getTime()) / 1000);
    docCookies.setItem('filter-name', value, seconds, '/');
    formElementFilter.submit();
  };

})();
