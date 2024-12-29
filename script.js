document.addEventListener("DOMContentLoaded", () => {
    const setTeamsButton = document.getElementById("set-teams");
    const teamCountInput = document.getElementById("team-count");
    const teamFormsDiv = document.getElementById("team-forms");
    const teamNamesDiv = document.getElementById("team-names");
    const wordInputSection = document.getElementById("word-input-section");
    const wordInputForm = document.getElementById("word-input-form");
    const currentPlayerDiv = document.getElementById("current-player");
    const roundSection = document.getElementById("round-section");
    const turnInfo = document.getElementById("turn-info");
    const timerSpan = document.getElementById("timer");
    const currentWordDiv = document.getElementById("current-word");
    const currentRoundSpan = document.getElementById("current-round");
    const correctButton = document.getElementById("correct");
    const skipButton = document.getElementById("skip");
    const startNextTeamButton = document.createElement("button");
    const resultsSection = document.getElementById("results");
    const scoresDiv = document.getElementById("scores");
    const restartButton = document.getElementById("restart");

    let participants = [];
    let teams = [];
    let words = [];
    let usedWords = [];
    let currentPlayerIndex = 0;
    let currentTeamIndex = 0;
    let currentWordIndex = 0;
    let round = 1;
    let timer = null;
    let timeLeft = 60;

    setTeamsButton.addEventListener("click", () => {
        const teamCount = parseInt(teamCountInput.value);
        teamFormsDiv.innerHTML = "";
        participants = [];

        for (let i = 0; i < teamCount * 2; i++) {
            const form = document.createElement("div");
            form.classList.add("team-form");
            form.innerHTML = `
                <label>Participant ${i + 1} Name:</label>
                <input type="text" class="participant-name" placeholder="Enter name">
            `;
            teamFormsDiv.appendChild(form);
        }

        const startGameButton = document.createElement("button");
        startGameButton.textContent = "Start Game";
        startGameButton.addEventListener("click", startGame);
        teamFormsDiv.appendChild(startGameButton);

        teamNamesDiv.classList.remove("hidden");
    });

    function startGame() {
        const participantInputs = document.querySelectorAll(".participant-name");
        participants = Array.from(participantInputs)
            .map((input) => input.value.trim())
            .filter((name) => name);

        if (participants.length % 2 !== 0 || participants.length === 0) {
            alert("Please enter valid names for an even number of participants.");
            return;
        }

        teams = [];
        for (let i = 0; i < participants.length; i += 2) {
            teams.push({ name: `${participants[i]} & ${participants[i + 1]}`, score: 0 });
        }

        teamNamesDiv.classList.add("hidden");
        wordInputSection.classList.remove("hidden");
        setupWordInput();
    }

    function setupWordInput() {
        currentPlayerIndex = 0;
        words = [];
        usedWords = [];
        showNextPlayerInput();
    }

    function showNextPlayerInput() {
        if (currentPlayerIndex >= participants.length) {
            wordInputSection.classList.add("hidden");
            roundSection.classList.remove("hidden");
            shuffle(words);
            startRound();
            return;
        }

        const playerName = participants[currentPlayerIndex];
        currentPlayerDiv.textContent = `Player ${playerName}, enter your words:`;
        wordInputForm.reset();
    }

    wordInputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const animal = document.getElementById("animal").value.trim();
        const profession = document.getElementById("profession").value.trim();
        const famousPerson = document.getElementById("famousPerson").value.trim();
        const object = document.getElementById("object").value.trim();

        if (animal && profession && famousPerson && object) {
            words.push(animal, profession, famousPerson, object);
            currentPlayerIndex++;
            showNextPlayerInput();
        } else {
            alert("Please fill in all fields!");
        }
    });

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startRound() {
        currentWordIndex = 0;
        timeLeft = 60;
        currentRoundSpan.textContent = round;
        updateTimerDisplay();
        playTurn();
        startTimer();
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
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                showStartNextTeamButton();
            }
        }, 1000);
    }

    function showStartNextTeamButton() {
        clearInterval(timer);
        timeLeft = 60; // Рестартира таймера за следващия отбор
        startNextTeamButton.textContent = "Start Next Team";
        startNextTeamButton.classList.remove("hidden");
        startNextTeamButton.addEventListener("click", () => {
            startNextTeamButton.classList.add("hidden");
            currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            startTimer();
            playTurn();
        });
        roundSection.appendChild(startNextTeamButton);
    }

    function updateTimerDisplay() {
        timerSpan.textContent = timeLeft;
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
        showStartNextTeamButton(); // Показва бутона за следващия отбор
    });

    function endRound() {
        round++;
        if (round > 3) {
            endGame();
        } else {
            words = [...usedWords];
            usedWords = [];
            currentTeamIndex = 0;
            startRound();
        }
    }

    function endGame() {
        roundSection.classList.add("hidden");
        resultsSection.classList.remove("hidden");
        scoresDiv.innerHTML = teams
            .map((team) => `<p>${team.name}: ${team.score} points</p>`)
            .join("");
    }

    restartButton.addEventListener("click", () => {
        location.reload();
    });
});
