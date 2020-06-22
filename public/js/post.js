const like = document.getElementById('like');
const comment = document.getElementById('comment');
const comments = document.getElementById('comments');

const Templates = {};

async function render(templateName, data) {
  if (!Templates[templateName]) {
    const str = await (await fetch(`/hbs/${templateName}.hbs`)).text();
    Templates[templateName] = Handlebars.compile(str);
  }

  return Templates[templateName](data);
}

//
//
// Like
//
//

like.addEventListener('click', async (event) => {
  event.preventDefault();

  const response = await fetch('/post-detals/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  const result = await response.json();
  like.innerText = `♡ ${result.like}`;
});

//
//
// Добавление коментариев
//
//

comment.addEventListener('submit', async (event) => {
  event.preventDefault();

  const textComment = document.getElementsByName('comment')[0].value;

  const response = await fetch('/post-detals/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ textComment }),
  });

  const result = await response.json();

  const commentDiv = document.getElementById('comments');

  const newComment = result.comment;

  const newDiv = document.createElement('div');
  newDiv.innerHTML = await render('comment', newComment);
  commentDiv.prepend(newDiv);
  document.getElementsByName('comment')[0].value = '';
});

//
//
// Удаление комментариев
//
//

comments.addEventListener('click', async (event) => {
  event.preventDefault();
  if (event.target.className === 'badge badge-danger') {
    const response = await fetch('/post-detals/comment/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ id: event.target.id }),
    });

    const result = await response.json();
    const { id } = result;
    const noneDiv = document.getElementsByName(`${id}`);
    noneDiv[0].style.display = 'none';
  }
});

//
//
// Загруска карты
//
//

document.addEventListener('DOMContentLoaded', async (event) => {
  event.preventDefault();

  const response = await fetch('/post-detals', {
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
        center: location.features[0].geometry.coordinates,
        zoom: 8,
        controls: ['routeButtonControl'],
      },
      {
        searchControlProvider: 'yandex#search',
      }
    );
    const objectManager = new ymaps.ObjectManager();
    objectManager.add(location);
    myMap.geoObjects.add(objectManager);

    const control = myMap.controls.get('routePanelControl');
    control.routePanel.options.set({
      reverseGeocoding: true,
      types: { masstransit: true, pedestrian: true, taxi: true },
    });
  }
});
