const map = document.getElementById('map');
const butt = document.getElementById('mapButt');

butt.addEventListener('click', async (event) => {
  event.preventDefault();

  const response = await fetch('/maps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  const result = await response.json();

  const { location } = result;

  ymaps.ready(init);
  function init() {
    const { geolocation } = ymaps;
    const myMap = new ymaps.Map(
      'map',
      {
        center: [55.76, 37.64],
        zoom: 8,
      },
      {
        searchControlProvider: 'yandex#search',
      }
    );
    const objectManager = new ymaps.ObjectManager();
    objectManager.add(location);
    myMap.geoObjects.add(objectManager);

    geolocation
      .get({
        autoReverseGeocode: false,
        provider: 'browser',
        mapStateAutoApply: true,
      })
      .then((result) => {
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        myMap.geoObjects.add(result.geoObjects);
      });
  }

  map.style.display = 'block';
});
