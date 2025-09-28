document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    const timerElement = document.getElementById('timer');
    const stageElement = document.getElementById('stage');
    const finalStageElement = document.getElementById('final-stage');
    const board = document.getElementById('board');

    let timer;
    let timeLeft;
    let currentStage;

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        currentStage = 1;
        timeLeft = 60;
        
        updateInfo();
        generateStage();
        
        timer = setInterval(() => {
            timeLeft--;
            updateInfo();
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStageElement.textContent = currentStage;
    }

    function nextStage() {
        currentStage++;
        generateStage();
        updateInfo();
    }

    function updateInfo() {
        timerElement.textContent = timeLeft;
        stageElement.textContent = currentStage;
    }

    function generateStage() {
        board.innerHTML = '';
        const gridSize = Math.min(10, currentStage + 1);
        const totalBoxes = gridSize * gridSize;

        // Generate color using HSL for better control
        const h = Math.random();
        const s = 0.5 + Math.random() * 0.4; // Saturation between 0.5 and 0.9
        const l_base = 0.4 + Math.random() * 0.2; // Base lightness between 0.4 and 0.6

        const baseColorRgb = hslToRgb(h, s, l_base);
        const baseColor = `rgb(${baseColorRgb[0]}, ${baseColorRgb[1]}, ${baseColorRgb[2]})`;

        // Adjust lightness for the different color. Smaller diff is harder.
        const lightnessDiff = 0.25 / (currentStage * 0.5 + 1); 
        
        let l_diff = l_base + lightnessDiff; // Always make it lighter for consistency
        if (l_diff > 0.9) { // Avoid it being too white
            l_diff = l_base - lightnessDiff;
        }

        const diffColorRgb = hslToRgb(h, s, l_diff);
        const diffColor = `rgb(${diffColorRgb[0]}, ${diffColorRgb[1]}, ${diffColorRgb[2]})`;

        const diffIndex = Math.floor(Math.random() * totalBoxes);

        board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        for (let i = 0; i < totalBoxes; i++) {
            const box = document.createElement('div');
            box.classList.add('color-box');
            box.style.backgroundColor = (i === diffIndex) ? diffColor : baseColor;
            box.addEventListener('click', () => {
                if (i === diffIndex) {
                    nextStage();
                } else {
                    // Penalty for wrong click
                    currentStage = Math.max(1, currentStage - 1);
                    updateInfo();
                    generateStage(); // Regenerate the board first

                    // Add shake effect to the new board
                    board.classList.add('shake');
                    setTimeout(() => {
                        board.classList.remove('shake');
                    }, 300); // Match animation duration
                }
            });
            board.appendChild(box);
        }
    }
    
    /**
     * Converts an HSL color value to RGB.
     * h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     */
    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
});