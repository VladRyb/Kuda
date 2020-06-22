const check = document.getElementById('check');
const button = document.getElementById('button');

//
// Событие на кнопку Подписаться
//
//

button.addEventListener('click', async (event) => {
  event.preventDefault();

  const response = await fetch('/post-detals/pod', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  const result = await response.json();
  check.innerText = result.check;
});
