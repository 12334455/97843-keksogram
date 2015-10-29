/* global PhotoView: true Gallery: true PhotosCollection: true*/
'use strict';

  /*
   Загрузка и фильтрация фотографий производится через коллекцию, описанную в модуле js/models/photos.js,
   а отрисовка — через представление js/views/photo.js.
   */
(function() {
  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;

  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * Элемент переключателей фильтров
   * @type {Element}
   */
  var filters = document.querySelector('.filters');

  /**
   * Контейнер списка фотографий
   * @type {Element}
   */
  var pictureContainer = document.querySelector('.pictures');

  /**
   * @type {number}
   */
  var currentPage = 0;

  /**
   * @type {*|PhotosCollection}
   */
  var photosCollection = new PhotosCollection();

  /**
   * @type {*|Gallery}
   */
  var gallery = new Gallery(photosCollection);

  /**
   * @type {Array}
   */
  var renderedViews = [];

  filters.classList.add('hidden');

  /**
   * Выводит на страницу список отелей постранично (12)
   * @param {number} pageNumber
   */
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

    });

    pictureContainer.appendChild(pictureFragment);
  }

  /**
   * Фильтрация списка фотографий
   * в соответствии с установленным фильтром
   * @param {string} filterID
   */
  function filterPictures(filterID) {
    photosCollection.setFilter(filterID);
    photosCollection.sort();
  }

  /**
   * Вызывает функцию фильтрации на списке фотографий с переданным fitlerID
   * и подсвечивает кнопку активного фильтра.
   * @param {string} filterID
   */
  function setActiveFilter(filterID) {
    document.getElementById('filter-' + filterID).checked = true;
    filterPictures(filterID);
    currentPage = 0;
    renderPictures(currentPage);
  }

  /**
   * Инициализация подписки на клики по кнопкам фильтра.
   */
  function initFilters() {
    var filtersContainer = document.querySelector('.filters');

    filtersContainer.addEventListener('click', function(evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT') {
        location.hash = 'filters/' + evt.target.value;
        setActiveFilter(parseURL()); // При нажатии передаем  filter-new, filter-discussed, filter-popular
      }
    });
  }

  /**
   * Проверяет можно ли отрисовать следующую страницу списка фотографий.
   * @returns {boolean}
   */
  function isNextPageAvailable() {
    return !!photosCollection && currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
  }

  /**
   * Проверяет, находится ли скролл внизу страницы
   * @returns {boolean}
   */
  function isAtTheBottom() {
    var GAP = 100;
    return pictureContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  /**
   * Испускает на объекте window событие loadneeded если скролл находится внизу
   * страницы и существует возможность показать еще одну страницу.
   */
  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  /**
   * Создает два обработчика событий: на прокручивание окна, который в оптимизированном
   * режиме (раз в 100 миллисекунд скролла) проверяет можно ли отрисовать следующую страницу;
   * и обработчик события loadneeded, который вызывает функцию отрисовки следующей страницы.
   */
  function initScroll() {
    window.addEventListener('scroll', function() { //Немного оптимизации
      requestAnimationFrame(function() {
        checkNextPage();
      });
    });

    window.addEventListener('loadneeded', function() {
      currentPage = currentPage + 1;
      renderPictures(currentPage);
    });
  }

  /**
   * При неудачной загрузке картинки добавляет класс ошибки загрузки
   */
  function showLoadFailure() {
    pictureContainer.classList.add('picture-load-failure');
  }

  function parseURL() {
    var filterHash = location.hash.match(/^#filters\/(\S+)$/);
    if (!filterHash) {
      filterHash[0] = '#filters/popular';
      filterHash[1] = 'popular';
    }
    return filterHash[1];
  }

  /**
   * Слушаем изменение события hashchange
   */
  window.addEventListener('hashchange', function() {
    parseURL();
  });

  /**
   * Загрузка коллекции Backbone и инициализация фильтров и scroll.
   */
  photosCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function() {
    initFilters();
    filters.classList.remove('hidden');
    initScroll();

    setActiveFilter(parseURL());
  }).fail(function() {
    showLoadFailure();
  });
})();
