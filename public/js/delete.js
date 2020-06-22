const deletepod = document.getElementById('delete');
const check = document.getElementById('check');

//
//
// Событие на кнопку Отписаться
//
//
deletepod.addEventListener('click', async (event) => {
  event.preventDefault();

  const response = await fetch('/post-detals/poddel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  const result = await response.json();
  check.innerText = result.check;
});
