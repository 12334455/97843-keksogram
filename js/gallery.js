'use strict';

(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var Gallery = function() {
    this._element = document.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._photoElement = this._element.querySelector('.gallery-overlay-preview img');
    this._photos = [];
    this._currentPhoto = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
    this._currentPhoto = 0;
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype.setCurrentPhoto = function(photoIndex) {
    photoIndex = clamp(photoIndex, 0, this._photos.length - 1);

    if (this._currentPhoto === photoIndex) {
      return;
    }
    this._currentPhoto = photoIndex;
  };

  Gallery.prototype.setCurrentPhotoBySrc = function(src) {
    this.setCurrentPhoto(this._photos.indexOf(src));
    this._showCurrentPhoto();
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._photoElement.src = this._photos[this._currentPhoto];
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        this._showCurrentPhoto();
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        this._showCurrentPhoto();
        break;
      default: break;
    }
  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };


  window.Gallery = Gallery;
})();
