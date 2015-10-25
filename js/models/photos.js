/* global Backbone: true PhotoModel: true*/

'use strict';

  /* Коллекция для работы с фотографиями, которая является наследником Backbone.Collection.
   Переопределен у коллекции параметр url, указан адрес, с которого загружаются данные
   Переопределен параметр model - он ссылкой на модель фотографии.
   */

(function() {
  /**
   * Список названий для каждого фильтра
   * @enum {number}
   */
  var filterToField = {
    'filter-new': 'date',
    'filter-discussed': 'comments',
    'filter-popular': 'likes'
  };

  /**
   * Простая функция сортировки
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  var sortFunc = function(a, b) {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
    return 0;
  };

  /**
   * @constructor
   * @param {Object} attributess
   * @param {Object} options
   */
  var PhotosCollection = Backbone.Collection.extend({ // Создаем новый конструктор типа PhotosCollection, который берет методы бэкбона и записывает их в прототип
    model: PhotoModel, //ссылка на модель фотографии
    url: 'data/pictures.json', // откуда берет данные
    comparator: function(a, b) {
      var result = sortFunc(a.get(this.filterBy), b.get(this.filterBy));
      if (result === 0) {
        return sortFunc(a.get('url'), b.get('url'));
      }
      return result;
    },
    setFilter: function(filterID) {
      this.filterBy = filterToField[filterID] || 'likes';
    },
    filterBy: 'likes'
  });

  window.PhotosCollection = PhotosCollection;
})();
