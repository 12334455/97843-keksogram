'use strict';

define([
  'views/photo'
], function(PhotoView) {
  var REQUEST_FAILURE_TIMEOUT = 10000;

  var PhotoPreviewView = PhotoView.extend({
    initialize: function() {
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      this._onPhotoLoad = this.clearTimeAndListeners.bind(this);
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
      var imageElement = this.el.querySelector('.gallery-overlay-image');
      imageElement.src = this.model.get('url');
      this.setListeners(imageElement);
      this.setCommentsAndLikes('.comments-count', '.likes-count');
      return this;
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onPhotoLoadError: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.el.classList.add('picture-big-load-failure');
      this.cleanupImageListeners(evt.target);
    }

  });

  return PhotoPreviewView;
});
