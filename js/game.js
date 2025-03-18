// Configuración del juego
const gameConfig = {
    duration: 30, // duración en segundos
    spawnInterval: 1000, // tiempo entre aparición de disfraces
    costumes: ['👗', '🎭', '👑', '🦸‍♂️', '🧙‍♀️', '🦹‍♀️', '🤴', '👸', '🧚‍♀️'],
    points: {
        normal: 10,
        special: 25
    }
};

let gameState = {
    score: 0,
    timeLeft: gameConfig.duration,
    isPlaying: false,
    gameInterval: null,
    spawnInterval: null
};

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-game');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again');
    const shareScoreButton = document.getElementById('share-score');

    // Inicializar eventos
    startButton.addEventListener('click', startGame);
    playAgainButton?.addEventListener('click', startGame);
    shareScoreButton?.addEventListener('click', shareScore);

    function startGame() {
        // Reiniciar estado
        gameState.score = 0;
        gameState.timeLeft = gameConfig.duration;
        gameState.isPlaying = true;
        
        // Limpiar área de juego
        gameArea.innerHTML = '';
        gameContainer.style.display = 'block';
        gameOverScreen.style.display = 'none';
        startButton.style.display = 'none';
        
        // Actualizar displays
        updateScore();
        updateTime();
        
        // Iniciar intervalos
        gameState.gameInterval = setInterval(updateGame, 1000);
        gameState.spawnInterval = setInterval(spawnCostume, gameConfig.spawnInterval);
    }

    function updateGame() {
        gameState.timeLeft--;
        updateTime();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }

    function spawnCostume() {
        if (!gameState.isPlaying) return;
        
        const costume = document.createElement('div');
        costume.className = 'costume-item';
        
        // Elegir un disfraz aleatorio
        const isSpecial = Math.random() < 0.2; // 20% de probabilidad de disfraz especial
        costume.textContent = gameConfig.costumes[Math.floor(Math.random() * gameConfig.costumes.length)];
        
        // Posición aleatoria
        const maxX = gameArea.clientWidth - 50;
        const maxY = gameArea.clientHeight - 50;
        costume.style.left = Math.random() * maxX + 'px';
        costume.style.top = Math.random() * maxY + 'px';
        
        if (isSpecial) {
            costume.style.filter = 'drop-shadow(0 0 5px gold)';
            costume.dataset.special = 'true';
        }
        
        // Evento de click
        costume.addEventListener('click', () => catchCostume(costume));
        
        gameArea.appendChild(costume);
        
        // Eliminar después de un tiempo
        setTimeout(() => {
            if (costume.parentNode === gameArea) {
                costume.remove();
            }
        }, 2000);
    }

    function catchCostume(costume) {
        if (!gameState.isPlaying) return;
        
        const points = costume.dataset.special ? gameConfig.points.special : gameConfig.points.normal;
        gameState.score += points;
        
        // Animación de puntos
        showPointsAnimation(costume, points);
        
        // Animación de captura
        costume.classList.add('caught');
        setTimeout(() => costume.remove(), 300);
        
        updateScore();
    }

    function showPointsAnimation(costume, points) {
        const animation = document.createElement('div');
        animation.className = 'points-animation';
        animation.textContent = `+${points}`;
        animation.style.left = costume.style.left;
        animation.style.top = costume.style.top;
        
        gameArea.appendChild(animation);
        setTimeout(() => animation.remove(), 1000);
    }

    function updateScore() {
        scoreDisplay.textContent = gameState.score;
    }

    function updateTime() {
        timeDisplay.textContent = gameState.timeLeft;
    }

    function endGame() {
        gameState.isPlaying = false;
        clearInterval(gameState.gameInterval);
        clearInterval(gameState.spawnInterval);
        
        finalScoreDisplay.textContent = gameState.score;
        gameOverScreen.style.display = 'block';
    }

    function shareScore() {
        // Crear canvas para la imagen
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 300;
        
        // Dibujar fondo
        ctx.fillStyle = '#ff69b4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar texto
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Jugué en Perte Disfraces!', canvas.width/2, 100);
        ctx.fillText(`¡Hice ${gameState.score} puntos!`, canvas.width/2, 150);
        ctx.font = '24px Arial';
        ctx.fillText('¡Juega tú también y gana descuentos!', canvas.width/2, 200);
        
        // Convertir a imagen
        const image = canvas.toDataURL('image/png');
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.download = 'perte-game-score.png';
        link.href = image;
        link.click();
        
        // Mostrar mensaje
        alert('¡Imagen guardada! Compártela en tu historia de Instagram y etiquétanos para recibir tus puntos 🎉');
    }
});
