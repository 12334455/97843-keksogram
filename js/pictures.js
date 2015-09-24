(function () {
    var IMAGE_FAILURE_TIMEOUT = 10000;

    var filters = document.querySelector('.filters');
    var pictureTemplate = document.getElementById('picture-template');
    var pictureContainer = document.querySelector('.pictures');
    var pictureFragment = document.createDocumentFragment();

    filters.classList.add('hidden');

    pictures.forEach(function(picture, i) {
        var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
        newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
        newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

        pictureFragment.appendChild(newPictureElement);

        if(picture['url']) {
            var imageElement = new Image();
            imageElement.src = picture['url'];
        }

        var imageLoadTimeout = setTimeout(function() {
            newPictureElement.classList.add('picture-load-failure');
        }, IMAGE_FAILURE_TIMEOUT);

        imageElement.onload = function() {
            var oldImageElement = newPictureElement.querySelector('.picture img');
            newPictureElement.replaceChild(imageElement, oldImageElement);
            imageElement.style.width = '182px';
            imageElement.style.height = '182px';
            clearTimeout(imageLoadTimeout);
        };

        imageElement.onerror = function(evt) {
            newPictureElement.classList.add('picture-load-failure');
        }
    });

    pictureContainer.appendChild(pictureFragment);
    filters.classList.remove('hidden');
})();
