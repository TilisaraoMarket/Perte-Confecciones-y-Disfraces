// Sistema de puntos
class PointSystem {
    constructor() {
        this.points = parseInt(localStorage.getItem('costumePoints')) || 0;
        this.username = localStorage.getItem('username') || '';
    }

    addPoints(amount) {
        this.points += amount;
        localStorage.setItem('costumePoints', this.points);
        this.updatePointsDisplay();
    }

    usePoints(amount) {
        if (this.points >= amount) {
            this.points -= amount;
            localStorage.setItem('costumePoints', this.points);
            this.updatePointsDisplay();
            return true;
        }
        return false;
    }

    updatePointsDisplay() {
        const pointsDisplay = document.getElementById('pointsDisplay');
        if (pointsDisplay) {
            pointsDisplay.textContent = `Puntos: ${this.points}`;
        }
    }

    setUsername(name) {
        this.username = name;
        localStorage.setItem('username', name);
    }
}

// Juego de memoria
class CostumeMemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isLocked = false;
        this.pointSystem = new PointSystem();
    }

    initialize() {
        const costumes = [
            { id: 1, name: 'Princesa' },
            { id: 2, name: 'Superhéroe' },
            { id: 3, name: 'Pirata' },
            { id: 4, name: 'Hada' },
            { id: 5, name: 'Vampiro' },
            { id: 6, name: 'Bruja' }
        ];

        // Duplicar las cartas para crear pares
        this.cards = [...costumes, ...costumes]
            .sort(() => Math.random() - 0.5)
            .map((costume, index) => ({
                ...costume,
                index,
                isFlipped: false,
                isMatched: false
            }));

        this.renderGame();
    }

    renderGame() {
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = '';

        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
            cardElement.dataset.index = card.index;

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card.name}</div>
                </div>
            `;

            cardElement.addEventListener('click', () => this.flipCard(card.index));
            gameContainer.appendChild(cardElement);
        });
    }

    flipCard(index) {
        if (this.isLocked) return;
        if (this.flippedCards.length === 2) return;
        if (this.cards[index].isMatched) return;
        if (this.flippedCards.includes(index)) return;

        this.cards[index].isFlipped = true;
        this.flippedCards.push(index);
        this.renderGame();

        if (this.flippedCards.length === 2) {
            this.isLocked = true;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        const match = this.cards[first].name === this.cards[second].name;

        if (match) {
            this.cards[first].isMatched = true;
            this.cards[second].isMatched = true;
            this.matchedPairs++;
            this.pointSystem.addPoints(100);

            if (this.matchedPairs === this.cards.length / 2) {
                setTimeout(() => {
                    alert('¡Felicitaciones! Has completado el juego y ganado 500 puntos extra!');
                    this.pointSystem.addPoints(500);
                    this.resetGame();
                }, 500);
            }
        }

        setTimeout(() => {
            if (!match) {
                this.cards[first].isFlipped = false;
                this.cards[second].isFlipped = false;
            }
            this.flippedCards = [];
            this.isLocked = false;
            this.renderGame();
        }, 1000);
    }

    resetGame() {
        this.cards.forEach(card => {
            card.isFlipped = false;
            card.isMatched = false;
        });
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.isLocked = false;
        this.cards.sort(() => Math.random() - 0.5);
        this.renderGame();
    }
}