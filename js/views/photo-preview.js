/* global Backbone: true*/
'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;

  var PhotoPreviewView = Backbone.View.extend({
    initialize: function() {
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);

      this.listenTo(this.model, 'change', this.render);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click .gallery-overlay-controls-like': '_onClickLike'
    },

    /**
     * При нажатие на клик вызывается обработка количетва "лайков"
     * @param {Event} evt
     * @private
     */
    _onClickLike: function(evt) {
      evt.stopPropagation();
      this.model.likeToggle();
    },

    /**
     * Уничтожение вьюхи мухахаха
     */
    destroy: function() {
      this.stopListening();
      this.undelegateEvents();
    },

    /**
     * Отрисовка вьюхи в галерее
     * @returns {PhotoPreviewView}
     */
    render: function() {
      this.el.querySelector('.gallery-overlay-image').src = this.model.get('url');
      this.el.querySelector('.gallery-overlay-image').addEventListener('error', this._onPhotoLoadError);
      this.el.querySelector('.gallery-overlay-image').addEventListener('load', this._onPhotoLoad);
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');
      return this;
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onPhotoLoadError: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.el.querySelector('.gallery-overlay-image').classList.add('picture-big-load-failure');
      this._cleanupImageListeners(evt.target);
    },

    /**
     * @param {Event} evt
     * @private
     * @private
     */
    _onPhotoLoad: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._cleanupImageListeners(evt.target);
    },

    /**
     * Удаление обработчиков событий на элементе.
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onPhotoLoad);
      image.removeEventListener('error', this._onPhotoLoadError);
    }
  });


  window.PhotoPreviewView = PhotoPreviewView;
})();
