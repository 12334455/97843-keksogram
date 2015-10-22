/* global PhotoPreviewView: true Backbone: true*/
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

  var Gallery = function(collection) {
    this.collection = collection;
    this.view = null;

    this._currentIndexPhoto = 0;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._element = document.querySelector('.gallery-overlay');
  };

  /*var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._element = document.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._photoElement = this._element.querySelector('.gallery-overlay-preview img');
    this._photos.reset();
    this._currentPhoto = 0;
    this._currentPicture = new Backbone.Model();
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };
*/
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._showCurrentPhoto();
    document.querySelector('.gallery-overlay-close').addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    if (this.view) {
      this.view.remove();
      this.view = null;
    }
  };


  Gallery.prototype.setCurrentPhoto = function(photoIndex) {
    this._currentIndexPhoto = clamp(photoIndex, 0, this.collection.length - 1);
    this._showCurrentPhoto();
  };


  Gallery.prototype._showCurrentPhoto = function() {
    var photoPreviewView = new PhotoPreviewView({
      model: this.collection.at(this._currentIndexPhoto),
      el: document.querySelector('.gallery-overlay-preview')
    });
    photoPreviewView.render();
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        this.setCurrentPhoto(this._currentIndexPhoto - 1);
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentIndexPhoto + 1);
        break;
      default: break;
    }
  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };
  window.Gallery = Gallery;
})();
