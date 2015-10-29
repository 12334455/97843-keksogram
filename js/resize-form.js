/* global resizer: true*/
'use strict';

define(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var picX = resizeForm['resize-x'];
  var picY = resizeForm['resize-y'];
  var picSide = resizeForm['resize-size'];
  var imageHeight;
  var imageWidth;
  var imageConstraint;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  window.addEventListener('imagecreated', function() {
    imageConstraint = resizer.getConstraint();
    imageHeight = resizer.getImageSizeHeight();
    imageWidth = resizer.getImageSizeWidth();
    picSide.value = imageConstraint.side;

    document.querySelector('.resize-image-preview').classList.add('invisible');

    picX.max = Math.max(imageWidth - picSide.value, 0);
    picY.max = Math.max(imageHeight - picSide.value, 0);
    picSide.max = Math.min(imageWidth, imageHeight);

    picX.min = 0;
    picY.min = 0;
    picX.value = Math.floor(imageConstraint.x);
    picY.value = Math.floor(imageConstraint.y);
    picSide.min = 50;
  });

  window.addEventListener('resizerchange', function() {
    imageConstraint = resizer.getConstraint();
    var x = clamp(Math.floor(imageConstraint.x), parseFloat(picX.min), parseFloat(picX.max));
    var y = clamp(Math.floor(imageConstraint.y), parseFloat(picY.min), parseFloat(picY.max));
    picX.value = x;
    picY.value = y;
    if (imageConstraint.x !== x || imageConstraint.y !== y) {
      resizer.setConstraint(x, y, Number(picSide.value));
    }
  });

  picSide.onchange = function() {
    picSide.value = clamp(Number(picSide.value), Number(picSide.min), Number(picSide.max));
    imageConstraint = resizer.getConstraint();
    var sideDiff = Math.floor((imageConstraint.side - Number(picSide.value)) / 2);
    resizer.setConstraint(imageConstraint.x + sideDiff, imageConstraint.y + sideDiff, Number(picSide.value));

    var picCanvas = document.querySelector('canvas');
    picX.max = Math.max(imageWidth - picSide.value, 0);
    picY.max = Math.max(imageHeight - picSide.value, 0);
    picSide.max = Math.min(picCanvas.width, picCanvas.height);

    picSide.value = Math.floor(imageConstraint.side);

    picX.value = Math.floor(imageConstraint.x);
    picY.value = Math.floor(imageConstraint.y);
  };

  picX.onchange = function() {
    picX.value = clamp(Number(picX.value), Number(picX.min), Number(picX.max));
    resizer.setConstraint(Number(picX.value), Number(picY.value), Number(picSide.value));
  };

  picY.onchange = function() {
    picY.value = clamp(Number(picY.value), Number(picY.min), Number(picY.max));
    resizer.setConstraint(Number(picX.value), Number(picY.value), Number(picSide.value));
  };

  prevButton.onclick = function(evt) {
    evt.preventDefault();
    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;
    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
});
