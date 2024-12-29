document.addEventListener("DOMContentLoaded", () => {
    const teams = JSON.parse(localStorage.getItem("teams")) || [];
    const words = JSON.parse(localStorage.getItem("words")) || [];
    let usedWords = [];
    let currentTeamIndex = 0;
    let currentWordIndex = 0;
    let round = 1;
    let timeLeft = 60;
    let timer = null;

    const currentRoundSpan = document.getElementById("current-round");
    const turnInfo = document.getElementById("turn-info");
    const timerSpan = document.getElementById("timer");
    const currentWordDiv = document.getElementById("current-word");
    const correctButton = document.getElementById("correct");
    const skipButton = document.getElementById("skip");
    const startNextTeamButton = document.getElementById("start-next-team");
    const resultsSection = document.getElementById("results");
    const scoresDiv = document.getElementById("scores");
    const roundSection = document.getElementById("round-section");
    const restartButton = document.getElementById("restart");

    function startGame() {
        currentRoundSpan.textContent = round;
        shuffle(words);
        playTurn();
    }

    function startTimer(callback) {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                callback();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        timerSpan.textContent = timeLeft;
    }

    function playTurn() {
        if (words.length === 0) {
            endRound();
            return;
        }

        const currentTeam = teams[currentTeamIndex];
        const word = words[currentWordIndex];
        turnInfo.textContent = `${currentTeam.name}'s turn!`;
        currentWordDiv.textContent = word;

        startTimer(() => {
            showStartNextTeamButton();
        });
    }

    function showStartNextTeamButton() {
        clearInterval(timer);
        timeLeft = 60;
        startNextTeamButton.classList.remove("hidden");
        startNextTeamButton.addEventListener("click", () => {
            startNextTeamButton.classList.add("hidden");
            currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            playTurn();
        });
    }

    correctButton.addEventListener("click", () => {
        const currentTeam = teams[currentTeamIndex];
        currentTeam.score++;
        usedWords.push(words[currentWordIndex]);
        words.splice(currentWordIndex, 1);

        if (words.length === 0) {
            clearInterval(timer);
            endRound();
        } else {
            currentWordIndex = Math.floor(Math.random() * words.length);
            playTurn();
        }
    });

    skipButton.addEventListener("click", () => {
        const skippedWord = words[currentWordIndex];
        words.splice(currentWordIndex, 1);
        words.push(skippedWord);
        showStartNextTeamButton();
    });

    function endRound() {
        round++;
        if (round > 3) {
            endGame();
        } else {
            words.push(...usedWords);
            usedWords = [];
            currentTeamIndex = 0;
            currentRoundSpan.textContent = round;
            startGame();
        }
    }

    function endGame() {
        clearInterval(timer);
        roundSection.classList.add("hidden");
        resultsSection.classList.remove("hidden");
        scoresDiv.innerHTML = teams
            .map(team => `<p>${team.name}: ${team.score} points</p>`)
            .join("");
    }

    restartButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    startGame();
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
