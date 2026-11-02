let players = JSON.parse(localStorage.getItem("sportsxPlayers")) || [];

let dailyMatches = JSON.parse(localStorage.getItem("sportsxDailyMatches")) || {};

const $ = (id) => document.getElementById(id);

// Save records
function saveData() {
    localStorage.setItem("sportsxPlayers", JSON.stringify(players));
    localStorage.setItem("sportsxDailyMatches", JSON.stringify(dailyMatches));
}

// Update dashboard
function updateDashboard() {

    $("playerCount").textContent = players.length;

    let totalMatches = players.reduce(
        (sum, player) => sum + player.matches, 0
    );

    let totalWins = players.reduce(
        (sum, player) => sum + player.wins, 0
    );

    $("matchCount").textContent = totalMatches;
    $("winCount").textContent = totalWins;
}

// Register player
$("playerForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = $("playerName").value.trim();
    let sport = $("sportName").value.trim();

    let matches = Number($("matches").value);
    let wins = Number($("wins").value);
    let basePoints = Number($("basePoints").value);
    let bonusPoints = Number($("bonusPoints").value);

    if (!name || !sport) {
        alert("Enter player name and sport name!");
        return;
    }

    if (
        !Number.isInteger(matches) ||
        !Number.isInteger(wins) ||
        !Number.isInteger(basePoints) ||
        !Number.isInteger(bonusPoints) ||
        matches < 0 || wins < 0 ||
        basePoints < 0 || bonusPoints < 0
    ) {
        alert("Enter valid positive numbers!");
        return;
    }

    if (wins > matches) {
        alert("Wins cannot be greater than matches!");
        return;
    }

    let player = {
        name,
        sport,
        matches,
        wins,
        basePoints,
        bonusPoints
    };

    players.push(player);

    saveData();
    updateDashboard();

    $("playerForm").reset();

    alert("Player registered successfully!");

    showAllPlayers();
});

// Calculate performance
function calculatePerformance(player) {

    let totalScore = player.basePoints + player.bonusPoints;

    let averageScore = player.matches === 0
        ? 0
        : totalScore / player.matches;

    let winRate = player.matches === 0
        ? 0
        : (player.wins / player.matches) * 100;

    let eligibility =
        player.matches >= 5 && winRate >= 50
        ? "ELIGIBLE"
        : "NOT ELIGIBLE";

    return {
        totalScore,
        averageScore,
        winRate,
        eligibility
    };
}

// Display player
function displayPlayer(player) {

    let result = calculatePerformance(player);

    let safeName = player.name.replace(/[&<>"']/g, c =>
        ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]
    );

    let safeSport = player.sport.replace(/[&<>"']/g, c =>
        ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]
    );

    let eligibilityClass = result.eligibility === "ELIGIBLE"
        ? "eligible"
        : "not-eligible";

    return `
        <div class="player-card">

            <h3>${safeName}</h3>

            <p><b>Sport:</b> ${safeSport}</p>

            <p><b>Matches Played:</b> ${player.matches}</p>

            <p><b>Bonus Points:</b> ${player.bonusPoints}</p>

            <p><b>Base Points:</b> ${player.basePoints}</p>

            <p><b>Total Score:</b> ${result.totalScore}</p>

            <p><b>Average Score:</b>
                ${result.averageScore.toFixed(2)}
            </p>

            <p><b>Win Rate:</b>
                ${result.winRate.toFixed(2)}%
            </p>

            <p class="${eligibilityClass}">
                Eligibility: ${result.eligibility}
            </p>

        </div>
    `;
}

// Search player
function searchPlayer() {

    let searchName = $("searchName").value.trim().toLowerCase();

    if (!searchName) {
        alert("Enter a player name!");
        return;
    }

    let found = players.filter(player =>
        player.name.toLowerCase().includes(searchName)
    );

    if (found.length === 0) {

        $("playerResults").innerHTML =
            "<p>Player not found!</p>";

        return;
    }

    $("playerResults").innerHTML =
        found.map(displayPlayer).join("");
}

// Display all players
function showAllPlayers() {

    if (players.length === 0) {

        $("playerResults").innerHTML =
            "<p>No players registered yet.</p>";

        return;
    }

    $("playerResults").innerHTML =
        players.map(displayPlayer).join("");
}

// Save daily matches
$("dailyForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let date = $("matchDate").value;

    let matches = Number($("dailyMatchCount").value);

    if (!date || !Number.isInteger(matches) || matches < 0) {
        alert("Enter valid date and match details!");
        return;
    }

    dailyMatches[date] = matches;

    saveData();

    $("dailyForm").reset();

    alert("Daily match details saved!");

    displayDailyMatches();
});

// Display daily matches
function displayDailyMatches() {

    let dates = Object.keys(dailyMatches).sort().reverse();

    if (dates.length === 0) {

        $("dailyResults").innerHTML =
            "<p>No daily match records available.</p>";

        return;
    }

    $("dailyResults").innerHTML = dates.map(date => `
        <div class="daily-record">
            <b>Date:</b> ${date}
            |
            <b>Matches Held:</b> ${dailyMatches[date]}
        </div>
    `).join("");
}

// Load saved data
updateDashboard();
showAllPlayers();
displayDailyMatches();
