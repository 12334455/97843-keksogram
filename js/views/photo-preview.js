/* global Backbone: true*/
'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PhotoPreviewView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:liked', this._onClick);
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);
      this._onClick = this._onClick.bind(this);
      this.setElement = document.querySelector('.gallery-overlay-preview').cloneNode(true);
    },
    events: {
      'click': '_onClick'
    },

    render: function() {
      this.el.classList.remove('invisible');
      this.el.querySelector('.gallery-overlay-image').src = this.model.get('url');
      this.el.querySelector('.gallery-overlay-image').addEventListener('error', this._onPhotoLoadError);
      this.el.querySelector('.gallery-overlay-image').addEventListener('load', this._onPhotoLoad);
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');
      return this;
    },

    _onPhotoLoadError: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.el.querySelector('.gallery-overlay-image').classList.add('picture-big-load-failure');
      this._cleanupImageListeners(evt.target);
    },

    _onPhotoLoad: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._cleanupImageListeners(evt.target);
    },

    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onPhotoLoad);
      image.removeEventListener('error', this._onPhotoLoadError);
    },

    _onClick: function(evt) {

      evt.stopPropagation();
      if (evt.target.classList.contains('gallery-overlay-controls-like')) {
        console.log(evt.target);
        this.model.likeToggle();
        this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      }
    }
  });


  window.PhotoPreviewView = PhotoPreviewView;
})();
