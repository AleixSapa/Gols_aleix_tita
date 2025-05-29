document.addEventListener("DOMContentLoaded", function () {
  const scoreForm = document.getElementById("scoreForm");

  if (scoreForm) {
    scoreForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const matchData = {
        aleixGoals: parseInt(document.getElementById("aleixGoals").value),
        titaGoals: parseInt(document.getElementById("titaGoals").value),
        weekday: document.getElementById("weekday").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value,
        timestamp: new Date().toISOString(),
      };

      // Obtenir les dades existents o crear un array buit
      let matches = JSON.parse(localStorage.getItem("footballMatches")) || [];

      // Afegir les noves dades
      matches.push(matchData);

      // Guardar a localStorage
      localStorage.setItem("footballMatches", JSON.stringify(matches));

      // Netejar el formulari
      scoreForm.reset();

      alert("Dades guardades correctament!");
    });
  }
});

function formatDate(dateString) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ca-ES", options);
}

function formatWeekday(weekday) {
  // Formateja el dia de la setmana amb la primera lletra en majúscula
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatLocation(location) {
  return location === "pasadis" ? "En el passadís" : "On sempre";
}

function loadMatchesTable() {
  const tableBody = document.getElementById("matchesTableBody");
  const summaryDiv = document.getElementById("summary");

  if (!tableBody || !summaryDiv) return;

  // Obtenir les dades
  const matches = JSON.parse(localStorage.getItem("footballMatches")) || [];

  // Netejar la taula
  tableBody.innerHTML = "";

  // Variables pel resum
  let totalAleixGoals = 0;
  let totalTitaGoals = 0;
  let dimartsMatches = 0;
  let dijousMatches = 0;

  // Carregar les dades a la taula
  matches.forEach((match, index) => {
    const row = document.createElement("tr");

    totalAleixGoals += match.aleixGoals;
    totalTitaGoals += match.titaGoals;

    if (match.weekday === "dimarts") dimartsMatches++;
    if (match.weekday === "dijous") dijousMatches++;

    row.innerHTML = `
            <td>${formatDate(match.date)}</td>
            <td>${formatWeekday(match.weekday)}</td>
            <td>${match.aleixGoals}</td>
            <td>${match.titaGoals}</td>
            <td>${formatLocation(match.location)}</td>
            <td>
                <button onclick="deleteMatch(${index})" class="btn-delete">Eliminar</button>
            </td>
        `;

    tableBody.appendChild(row);
  });

  // Actualitzar el resum
  const totalMatches = matches.length;
  summaryDiv.innerHTML = `
        <div class="summary-item">Total de partits: ${totalMatches}</div>
        <div class="summary-item">Partits en ${formatWeekday(
          "dimarts"
        )}: ${dimartsMatches}</div>
        <div class="summary-item">Partits en ${formatWeekday(
          "dijous"
        )}: ${dijousMatches}</div>
        <div class="summary-item">Total gols Aleix: ${totalAleixGoals}</div>
        <div class="summary-item">Total gols Tita: ${totalTitaGoals}</div>
        <div class="summary-item">Mitjana gols Aleix: ${(
          totalAleixGoals / totalMatches || 0
        ).toFixed(2)}</div>
        <div class="summary-item">Mitjana gols Tita: ${(
          totalTitaGoals / totalMatches || 0
        ).toFixed(2)}</div>
    `;
}

function deleteMatch(index) {
  if (confirm("Estàs segur que vols eliminar aquest partit?")) {
    let matches = JSON.parse(localStorage.getItem("footballMatches")) || [];
    matches.splice(index, 1);
    localStorage.setItem("footballMatches", JSON.stringify(matches));
    loadMatchesTable();
  }
}

// Carregar la taula quan la pàgina es carregui
document.addEventListener("DOMContentLoaded", function () {
  loadMatchesTable();
});
