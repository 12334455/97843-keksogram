/* global Backbone: true */
'use strict';

/*ПРЕДСТАВЛЕНИЕ ФОТОГРАФИИ В СПИСКЕ. ЕСТЬ ОБРАБОТЧИК ONCLICK*/

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var pictureTemplate = document.querySelector('#picture-template');

  var PhotoView = Backbone.View.extend({
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click .picture': '_onClick'
    },

    /**
     * Класс элемента.
     * @type {string}
     * @override
     */
    className: 'picture',

    /**
     * Отрисовка "карточки" фотографии
     */
    render: function() {
      this.el.appendChild(pictureTemplate.content.children[0].cloneNode(true)); //this.el ссылка на el который создает bb при вызове конструктора
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');
      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');

      // Добавление фонового изображения.
      if (this.model.get('url')) {
        var imageElement = new Image();
        imageElement.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        imageElement.addEventListener('load', this._onImageLoad);
        imageElement.addEventListener('error', this._onImageFail);
        imageElement.addEventListener('abort', this._onImageFail);
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
     * @param {Event} evt
     * @private
     */
    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);
      var oldElement = this.el.querySelector('.picture');
      var oldImageElement = this.el.querySelector('.picture img');

      this.el.style.width = '182px';
      this.el.style.height = '182px';
      oldElement.replaceChild(evt.target, oldImageElement);
      this._cleanupImageListeners(evt.target);
    },

    /**
     * @private
     */
    _onImageFail: function() {
      this.el.classList.add('picture-load-failure');
    },

    /**
     * Удаление обработчиков событий на элементе.
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  window.PhotoView = PhotoView;
})();
