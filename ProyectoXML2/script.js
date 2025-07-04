let timer = 0;
let intervalId;
let score = 0;
let total = 0;

function loadQuiz() {
  score = 0;
  total = 0;
  timer = 0;
  clearInterval(intervalId);
  document.getElementById('score').innerText = '';
  document.getElementById('quiz').innerHTML = '';
  document.getElementById('timer').innerText = 'Tiempo: 0s';

  const lang = document.getElementById('language').value;
  const file = lang === 'es' ? 'preguntas_es.xml' : 'preguntas_en.xml';

  fetch(file)
    .then(res => res.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const preguntas = data.getElementsByTagName('pregunta');
      total = preguntas.length;

      for (let i = 0; i < preguntas.length; i++) {
        const div = document.createElement('div');
        div.className = 'pregunta';
        const texto = preguntas[i].getElementsByTagName('texto')[0].textContent;
        div.innerHTML = `<p><strong>${i + 1}.</strong> ${texto}</p>`;

        const respuestas = preguntas[i].getElementsByTagName('respuesta');
        for (let j = 0; j < respuestas.length; j++) {
          const resp = respuestas[j].textContent;
          const correcta = respuestas[j].getAttribute('correcta') === 'si';

          const label = document.createElement('label');
          label.innerHTML = `
            <input type="radio" name="pregunta${i}" value="${correcta}">
            ${resp}<br>
          `;
          div.appendChild(label);
        }

        document.getElementById('quiz').appendChild(div);
      }

      const submitBtn = document.createElement('button');
      submitBtn.textContent = lang === 'es' ? 'Finalizar' : 'Submit';
      submitBtn.onclick = showScore;
      document.getElementById('quiz').appendChild(submitBtn);

      intervalId = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = `Tiempo: ${timer}s`;
      }, 1000);
    });
}

function showScore() {
  clearInterval(intervalId);
  const radios = document.querySelectorAll('input[type="radio"]:checked');

  radios.forEach(r => {
    if (r.value === "true") score++;
  });

  document.getElementById('score').innerText = `Puntuación: ${score}/${total}`;
}
