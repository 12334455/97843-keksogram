'use strict';

define([
  'views/photo'
], function(PhotoView) {
  var VideoPreviewView = PhotoView.extend({
    initialize: function() {
      this._onClickVideo = this._onClickVideo.bind(this);
      this._onClickLike = this._onClickVideo.bind(this);
      this.listenTo(this.model, 'change:likes', this._renderLikes);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click .video': '_onClickVideo',
      'click .gallery-overlay-controls-like': '_onClickLike'
    },

    /**
     * Отрисовывает лайки после лайка
     * @private
     */
    _renderLikes: function() {
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
    },

    /**
     * Уничтожение вьюхи мухахаха
     */
    destroy: function() {
      this.el.replaceChild(this.img, this.video);
      this.stopListening();
      this.undelegateEvents();
    },

    /**
     * Отрисовка вьюхи в галерее
     * @returns {PhotoPreviewView}
     */
    render: function() {
      this.setCommentsAndLikes('.comments-count', '.likes-count');
      this.img = this.el.querySelector('.gallery-overlay-image');

      this.video = document.createElement('video');
      this.video.classList.add('video');
      this.video.src = this.model.get('url');
      this.video.poster = this.model.get('preview');
      this.video.controls = false;
      this.video.loop = true;

      this.el.replaceChild(this.video, this.img);
    },
    /**
     * Событие при нажатии на видео. Обработка паузы/плея
     * @param {Event} evt
     * @private
     */
    _onClickVideo: function(evt) {
      evt.stopPropagation();
      if (this.video.paused) {
        this.video.play();
      } else {
        this.video.pause();
      }
    }
  });

  return VideoPreviewView;
});
