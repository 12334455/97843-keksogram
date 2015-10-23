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
    this._photoPreviewView = new Backbone.View();
    this._currentIndexPhoto = 0;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._element = document.querySelector('.gallery-overlay');
  };

  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    document.querySelector('.gallery-overlay-close').addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    document.querySelector('.gallery-overlay-close').removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.setCurrentPhoto = function(photoIndex) {
    this._currentIndexPhoto = clamp(photoIndex, 0, this.collection.length - 1);
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._photoPreviewView = new PhotoPreviewView({
      model: this.collection.at(this._currentIndexPhoto),
      el: document.querySelector('.gallery-overlay-preview')
    });
    console.log(this._photoPreviewView);
    this._photoPreviewView.render();
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        this._photoPreviewView.destroy();
        break;
      case Key.LEFT:
        this._photoPreviewView.destroy();
        this.setCurrentPhoto(this._currentIndexPhoto - 1);
        this._showCurrentPhoto();
        break;
      case Key.RIGHT:
        this._photoPreviewView.destroy();
        this.setCurrentPhoto(this._currentIndexPhoto + 1);
        this._showCurrentPhoto();
        break;
      default: break;
    }
  };

  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this._photoPreviewView.destroy();
    this.hide();
  };
  window.Gallery = Gallery;
})();
