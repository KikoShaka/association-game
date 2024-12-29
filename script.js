document.addEventListener("DOMContentLoaded", () => {
    const setTeamsButton = document.getElementById("set-teams");
    const teamCountInput = document.getElementById("team-count");
    const teamFormsDiv = document.getElementById("team-forms");
    const wordInputSection = document.getElementById("word-input-section");
    const continueSection = document.getElementById("continue-section");
    const currentPlayerDiv = document.getElementById("current-player");
    const wordInputForm = document.getElementById("word-input-form");

    let participants = [];
    let teams = [];
    let words = [];
    let currentPlayerIndex = 0;

    setTeamsButton.addEventListener("click", () => {
        const teamCount = parseInt(teamCountInput.value);
        teamFormsDiv.innerHTML = ""; // Изчистване на предишните полета
        participants = [];
    
        // Генериране на форми за отборите
        for (let i = 0; i < teamCount; i++) {
            const teamDiv = document.createElement("div");
            teamDiv.classList.add("team");
            teamDiv.innerHTML = `
                <h3>Team ${i + 1}</h3>
                <label>Player ${i * 2 + 1} : <input type="text" class="participant-name" placeholder="Enter name"></label><br>
                <label>Player ${i * 2 + 2} : <input type="text" class="participant-name" placeholder="Enter name"></label><br>
            `;
            teamFormsDiv.appendChild(teamDiv);
        }
    
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.addEventListener("click", setupWordInput);
        teamFormsDiv.appendChild(continueButton);
    });
    

    function setupWordInput() {
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

        wordInputSection.classList.remove("hidden");
        continueSection.classList.add("hidden");
        currentPlayerIndex = 0;
        showNextPlayerInput();
    }

    function showNextPlayerInput() {
        if (currentPlayerIndex >= participants.length) {
            // Всички играчи са въвели думите си
            wordInputSection.innerHTML = `
                <button id="start-game">Start Game</button>
            `;
            document.getElementById("start-game").addEventListener("click", startGame);
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

    function startGame() {
        // Записване на данните в localStorage
        localStorage.setItem("teams", JSON.stringify(teams));
        localStorage.setItem("words", JSON.stringify(words));

        // Пренасочване към game.html
        window.location.href = "game.html";
    }
});
