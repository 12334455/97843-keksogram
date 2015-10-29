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

  window.addEventListener('imagecreated', function() {
    imageConstraint = resizer.getConstraint();
    imageHeight = resizer.getImageSizeHeight();
    imageWidth = resizer.getImageSizeWidth();
    picSide.value = imageConstraint.side;

    document.querySelector('.resize-image-preview').classList.add('invisible');

    picX.max = Math.max(imageWidth - picSide.value, 0);
    picY.max = Math.max(imageHeight - picSide.value, 0);
    picSide.max = Math.min(imageWidth, imageHeight);

    picX.min = picX.value = 0;
    picY.min = picY.value = 0;
    picSide.min = 50;
  });

  window.addEventListener('resizerchange', function() {
    imageConstraint = resizer.getConstraint();

    picX.value = Math.floor(imageConstraint.x);
    picY.value = Math.floor(imageConstraint.y);

    if (imageConstraint.x > picX.max) {
      resizer.setConstraint(Number(picX.max), Number(picY.value), Number(picSide.value));
    }
    if (imageConstraint.x < picX.min) {
      resizer.setConstraint(Number(picX.min), Number(picY.value), Number(picSide.value));
    }
    if (imageConstraint.y > picY.max) {
      resizer.setConstraint(Number(picX.value), Number(picY.max), Number(picSide.value));
    }
    if (imageConstraint.y < picY.min) {
      resizer.setConstraint(Number(picX.value), Number(picY.min), Number(picSide.value));
    }
  });

  picSide.onchange = function() {
    if (Number(picSide.value) > Number(picSide.max)) {
      picSide.value = picSide.max;
    }
    if (Number(picSide.value) < Number(picSide.min)) {
      picSide.value = picSide.min;
    }
    imageConstraint = resizer.getConstraint();

    var sideDiff = (imageConstraint.side - Number(picSide.value)) / 2;
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
    if (Number(picX.value) > Number(picX.max)) {
      picX.value = picX.max;
    }
    if (Number(picX.value) < Number(picX.min)) {
      picX.value = picX.min;
    }
    resizer.setConstraint(Number(picX.value), Number(picY.value), Number(picSide.value));
  };

  picY.onchange = function() {
    if (Number(picY.value) > Number(picY.max)) {
      picY.value = picY.max;
    }
    if (Number(picY.value) < Number(picY.min)) {
      picY.value = picY.min;
    }
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
