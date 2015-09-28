'use strict';
(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var filters = document.querySelector('.filters');
  var pictureContainer = document.querySelector('.pictures');
  var allPictures;

  filters.classList.add('hidden');

  function renderPictures(pictures) {
    pictureContainer.classList.remove('pictures-load-failure');
    pictureContainer.innerHTML = '';
    var pictureTemplate = document.getElementById('picture-template');
    var pictureFragment = document.createDocumentFragment();

    pictures.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

      pictureFragment.appendChild(newPictureElement);

      if (picture['url']) {
        var imageElement = new Image();
        imageElement.src = picture['url'];
      }

      var imageLoadTimeout = setTimeout(function() {
        newPictureElement.classList.add('picture-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      imageElement.onload = function() {
        var oldImageElement = newPictureElement.querySelector('.picture img');
        newPictureElement.replaceChild(imageElement, oldImageElement);
        imageElement.style.width = '182px';
        imageElement.style.height = '182px';
        clearTimeout(imageLoadTimeout);
      };

      imageElement.onerror = function() {
        newPictureElement.classList.add('picture-load-failure');
      };
      pictureContainer.appendChild(pictureFragment);
    });
  }

  function showLoadFailure() {
    pictureContainer.classList.add('picture-load-failure');
  }

  filters.classList.remove('hidden');

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
          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response || '';
            pictureContainer.classList.remove('pictures-loading');
            return callback(JSON.parse(data));
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    };
  }

  function filterPictures(pictures, filterValue) {
    var filteredPictures = pictures.slice(0);
    switch (filterValue) {
      case 'new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.date - a.date;
        });
        break;

      case 'discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      default:
        filteredPictures = pictures.slice(0);
        break;
    }
    return filteredPictures;
  }

  function setActiveFilter(filterValue) {
    var filteredPictures = filterPictures(allPictures, filterValue);
    renderPictures(filteredPictures);
  }

  function initFilters() {
    var filterElements = filters['filter'];
    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.value);
      };
    }
  }

  initFilters();

  loadPictures(function(loadedPictures) {
    allPictures = loadedPictures;
    setActiveFilter('popular');
  });
})();
