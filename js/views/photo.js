'use strict';

define(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var pictureTemplate = document.querySelector('#picture-template');

  var PhotoView = Backbone.View.extend({
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onClick = this._onClick.bind(this);
      this._onClickLike = this._onClickLike.bind(this);
      this.listenTo(this.model, 'change', this.render);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click .picture img': '_onClick',
      'click .picture-likes': '_onClickLike'
    },

    /**
     * При нажатие на клик вызывается обработка количетва "лайков"
     * @param {Event} evt
     * @private
     */
    _onClickLike: function(evt) {
      evt.preventDefault();
      this.model.likeToggle();
    },

    /**
     * Класс элемента.
     * @type {string}
     * @override
     */
    className: 'picture',

    /**
     * Достает и ставит комменты и лайки
     * @param {String} classC
     * @param {String} classL
     */
    setCommentsAndLikes: function(classC, classL) {
      this.el.querySelector(classC).textContent = this.model.get('comments');
      this.el.querySelector(classL).textContent = this.model.get('likes');
    },

    /**
     * Добавляет лисененги
     * @param imgEl
     */
    setListeners: function(imgEl) {
      imgEl.addEventListener('load', this._onImageLoad);
      imgEl.addEventListener('error', this._onImageFail);
      imgEl.addEventListener('abort', this._onImageFail);
    },

    /**
     * Отрисовка "карточки" фотографии
     */
    render: function() {
      this.el.appendChild(pictureTemplate.content.children[0].cloneNode(true));
      this.setCommentsAndLikes('.picture-comments', '.picture-likes');

      // Добавление фонового изображения.
      var src = this.model.get('preview') || this.model.get('url');
      if (src) {
        var imageElement = new Image();
        imageElement.src = src;
        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);
        this.setListeners(imageElement);
      }
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      if (this.el.classList.contains('picture') && !this.el.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    },

    /**
     * Очищает лисененги
     * @param {Event} evt
     */
    clearTimeAndListeners: function(evt) {
      clearTimeout(this._imageLoadTimeout);
      this.cleanupImageListeners(evt.target);
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onImageLoad: function(evt) {
      this.clearTimeAndListeners(evt);
      var oldElement = this.el.querySelector('.picture');
      var oldImageElement = this.el.querySelector('.picture img');
      oldElement.replaceChild(evt.target, oldImageElement);
    },

    /**
     * @private
     */
    _onImageFail: function(evt) {
      this.cleanupImageListeners(evt.target);
      this.el.classList.add('picture-load-failure');
    },

    /**
     * Удаление обработчиков событий на элементе.
     * @param {Image} image
     * @private
     */
    cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  return PhotoView;
});
