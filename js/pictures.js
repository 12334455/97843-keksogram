/* global PhotoView: true Gallery: true PhotosCollection: true*/
'use strict';
/*
 Загрузка и фильтрация фотографий производится через коллекцию, описанную в модуле js/models/photos.js,
 а отрисовка — через представление js/views/photo.js.
 */
(function() {
  var PAGE_SIZE = 12;
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var filters = document.querySelector('.filters');
  var pictureContainer = document.querySelector('.pictures');
  var currentPage = 0;


  filters.classList.add('hidden');

  var photosCollection = new PhotosCollection(); //инстанс, сущность типа PhotosCollection
  var gallery = new Gallery(photosCollection);
  var renderedViews = [];

  function renderPictures(pageNumber) {
    pageNumber = pageNumber || 0;

    var pictureFragment = document.createDocumentFragment();
    var picturesFrom = pageNumber * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;

    if (pageNumber === 0) {
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift(); //берет первый эелемент массива, возвращает его и удаляет
        viewToRemove.remove();
        viewToRemove.off('galleryclick');
      }
    }

    photosCollection.slice(picturesFrom, picturesTo).forEach(function(model) {
      var view = new PhotoView({ model: model });
      view.render();
      pictureFragment.appendChild(view.el);
      renderedViews.push(view); //добавляем чтобы удалить при перетирании контента


      view.on('galleryclick', function() {
        gallery.setCurrentPhoto(photosCollection.indexOf(model));
        gallery.show();
      });

/*      view.on('likeclick', function() {
        gallery.setCurrentPhoto(photosCollection.indexOf(model));
        gallery.show();
      });*/
    });

    pictureContainer.appendChild(pictureFragment);
  }


  function filterPictures(filterID) { // Переписали с помощью записи в коллекцию
    photosCollection.setFilter(filterID);
    photosCollection.sort();
    localStorage.setItem('filterID', filterID);
  }

  function setActiveFilter(filterID) {
    document.getElementById(filterID).checked = true;
    filterPictures(filterID); //передаем текущие фотки и текущий нажатый фильтр
    currentPage = 0;
    renderPictures(currentPage);
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.filters');

    filtersContainer.addEventListener('click', function(evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT' && localStorage.getItem('filterID') !== element.id) {
        setActiveFilter(element.id); // При нажатии передаем  filter-new, filter-discussed, filter-popular
      }
    });
  }

  function isNextPageAvailable() {
    return !!photosCollection && currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    var GAP = 100;
    return pictureContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  function initScroll() {
    var someTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });

    window.addEventListener('loadneeded', function() {
      currentPage = currentPage + 1;
      renderPictures(currentPage);
    });
  }

  function showLoadFailure() {
    pictureContainer.classList.add('picture-load-failure');
  }

  //вместо функции loadpictures. fetch делает запрос на сервер.
  photosCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state) { //success и failure это callback
    initFilters();
    filters.classList.remove('hidden');
    initScroll();

    setActiveFilter(localStorage.getItem('filterID') || 'filter-popular');
  }).fail(function() {
    showLoadFailure();
  });

})();
