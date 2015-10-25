'use strict';

// Модель фотографии, которая является наследником Backbone.Model
(function() {
  /**
   * @constructor
   * @extends {Backbone.Model}
   **/
  var PhotoModel = Backbone.Model.extend({ // тип, наследник от бэкбон.модел. У на отличается тем, что имеет лайки
    initialize: function() {
      this.likeToggle = this.likeToggle.bind(this);
    },
    defaults: {
      liked: false
    },
    /**
     * Функция обработчик количества лайков при нажатии
     */
    likeToggle: function() {
      var likesCount = this.get('likes');
      if (!this.get('liked')) {
        likesCount++;
      } else {
        likesCount--;
      }
      this.set({
        likes: likesCount,
        liked: !this.get('liked')
      });
    }

  });
  window.PhotoModel = PhotoModel;
})();
