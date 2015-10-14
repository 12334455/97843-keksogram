/* global Photo: true Gallery: true */
'use strict';
(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };


  var PAGE_SIZE = 12;
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var filters = document.querySelector('.filters');
  var pictureContainer = document.querySelector('.pictures');
  var allPictures;
  var currentPage = 0;
  var currentPictures;
  var renderedPictures = [];
  var gallery;

  filters.classList.add('hidden');

  function renderPictures(pictures, pageNumber, withoutReplace) {
    var replace = !withoutReplace;
    pageNumber = pageNumber || 0;

    if (replace) {
      var el;
      while ((el = renderedPictures.shift())) {
        el.unrender();
      }
      pictureContainer.classList.remove('pictures-failure');
    }

    var pictureFragment = document.createDocumentFragment();

    var picturesFrom = pageNumber * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    pictures = pictures.slice(picturesFrom, picturesTo);

    pictures.forEach(function(picture) {
      var newPictureElement = new Photo(picture);
      newPictureElement.render(pictureFragment);
      renderedPictures.push(newPictureElement);
    });
    pictureContainer.appendChild(pictureFragment);
  }


  function loadPictures(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          pictureContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response || '';
            return callback(null, JSON.parse(data));
          } else {
            return callback(new Error(loadedXhr.status), null);
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      return callback(new Error('timeout'), null);
    };
  }

  function filterPictures(pictures, filterID) {
    var filteredPictures = pictures.slice(0);
    switch (filterID) {
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.date - a.date;
        });
        break;

      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      default:
        filteredPictures = pictures.slice(0);
        break;
    }
    localStorage.setItem('filterID', filterID);
    return filteredPictures;
  }

  function setActiveFilter(filterID) {
    document.getElementById(filterID).checked = true;
    currentPictures = filterPictures(allPictures, filterID);
    currentPage = 0;
    gallery.setPhotos(currentPictures.map(function(picture) {
      return picture.url;
    }));
    renderPictures(currentPictures, currentPage, false);
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.filters');

    filtersContainer.addEventListener('click', function(evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT') {
        setActiveFilter(element.id);
      }
    });
  }

  function isNextPageAvailable() {
    return !!allPictures && currentPage < Math.ceil(allPictures.length / PAGE_SIZE);
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
      renderPictures(currentPictures, currentPage++, true);
    });
  }

  function initGallery() {
    if (!gallery) {
      gallery = new Gallery();

      window.addEventListener('galleryclick', function(evt) {
        gallery.setCurrentPhotoBySrc(evt.detail.getPhotoSrc());
        gallery.show();
      });
    }
  }

  initFilters();
  initScroll();
  initGallery();

  loadPictures(function(err, loadedPictures) {
    pictureContainer.classList.remove('pictures-loading');
    if (err) {
      pictureContainer.classList.add('picture-load-failure');
    } else {
      allPictures = loadedPictures;
      var filterID = localStorage.getItem('filterID');
      setActiveFilter(filterID || 'filter-popular');
      filters.classList.remove('hidden');
    }
  });
})();
