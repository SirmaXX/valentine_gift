import { Haptics, ImpactStyle } from '@capacitor/haptics';

class PuzzleGame {
    constructor() {
        this.gridSize = 3;
        this.tiles = [];
        this.emptyIndex = 0;
        this.moves = 0;
        this.seconds = 0;
        this.timer = null;
        this.imageUrl = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800';
        this.isAutoSolving = false;
        this.autoSolved = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Zorluk seçimi
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.gridSize = parseInt(e.target.dataset.level);
                this.startNewGame();
                this.hapticFeedback('light');
            });
        });

        // Resim seçimi
        document.querySelectorAll('.image-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.image-option').forEach(opt =>
                    opt.classList.remove('active')
                );
                option.classList.add('active');
                this.imageUrl = option.dataset.image;
                this.hapticFeedback('light');
            });
        });

        // Custom resim yükleme
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imageUrl = event.target.result;
                    const preview = document.getElementById('customImagePreview');
                    preview.innerHTML = `<img src="${this.imageUrl}" alt="Custom">`;
                    preview.classList.add('show');

                    // Diğer seçimleri kaldır
                    document.querySelectorAll('.image-option').forEach(opt =>
                        opt.classList.remove('active')
                    );
                    this.hapticFeedback('medium');
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewGame();
            this.hapticFeedback('light');
        });

        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
            this.hapticFeedback('medium');
        });

        document.getElementById('autoSolveBtn').addEventListener('click', () => {
            this.autoSolve();
            this.hapticFeedback('medium');
        });

        document.getElementById('changeImageBtn').addEventListener('click', () => {
            document.getElementById('difficultySelector').style.display = 'block';
            document.getElementById('gameContainer').style.display = 'none';
            this.stopTimer();
            this.hapticFeedback('light');
        });

        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideCelebration();
            document.getElementById('difficultySelector').style.display = 'block';
            document.getElementById('gameContainer').style.display = 'none';
            this.hapticFeedback('light');
        });
    }

    async hapticFeedback(type = 'light') {
        try {
            const style = {
                light: ImpactStyle.Light,
                medium: ImpactStyle.Medium,
                heavy: ImpactStyle.Heavy
            }[type];
            await Haptics.impact({ style });
        } catch (e) {
            // Haptic desteklenmiyor (browser)
        }
    }

    startNewGame() {
        document.getElementById('difficultySelector').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';

        this.moves = 0;
        this.seconds = 0;
        this.autoSolved = false;
        this.updateStats();

        // Seçili resmi göster
        const preview = document.getElementById('currentImagePreview');
        preview.innerHTML = `<img src="${this.imageUrl}" alt="Puzzle Image">`;

        this.initializeTiles();
        this.shuffleTiles();
        this.renderBoard();
        this.startTimer();
    }

    initializeTiles() {
        const totalTiles = this.gridSize * this.gridSize;
        this.tiles = Array.from({ length: totalTiles }, (_, i) => i);
        this.emptyIndex = totalTiles - 1;
    }

    shuffleTiles() {
        // Çözülebilir bir karışım oluştur
        for (let i = 0; i < 1000; i++) {
            const movableTiles = this.getMovableTiles();
            const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
            this.swapTiles(randomTile, this.emptyIndex);
        }
    }

    getMovableTiles() {
        const movable = [];
        const row = Math.floor(this.emptyIndex / this.gridSize);
        const col = this.emptyIndex % this.gridSize;

        // Üst
        if (row > 0) movable.push(this.emptyIndex - this.gridSize);
        // Alt
        if (row < this.gridSize - 1) movable.push(this.emptyIndex + this.gridSize);
        // Sol
        if (col > 0) movable.push(this.emptyIndex - 1);
        // Sağ
        if (col < this.gridSize - 1) movable.push(this.emptyIndex + 1);

        return movable;
    }

    swapTiles(index1, index2) {
        [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
        this.emptyIndex = index1;
    }

    renderBoard() {
        const board = document.getElementById('puzzleBoard');
        board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        board.innerHTML = '';

        this.tiles.forEach((tile, index) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';

            if (tile === this.gridSize * this.gridSize - 1) {
                piece.classList.add('empty');
            } else {
                const row = Math.floor(tile / this.gridSize);
                const col = tile % this.gridSize;
                const bgSize = this.gridSize * 100;
                const bgX = (col * 100) / (this.gridSize - 1);
                const bgY = (row * 100) / (this.gridSize - 1);

                piece.style.backgroundImage = `url(${this.imageUrl})`;
                piece.style.backgroundSize = `${bgSize}%`;
                piece.style.backgroundPosition = `${bgX}% ${bgY}%`;

                if (!this.isAutoSolving) {
                    piece.addEventListener('click', () => this.handleTileClick(index));
                }
            }

            board.appendChild(piece);
        });
    }

    handleTileClick(index) {
        const movableTiles = this.getMovableTiles();

        if (movableTiles.includes(index)) {
            this.swapTiles(index, this.emptyIndex);
            this.moves++;
            this.updateStats();
            this.renderBoard();
            this.hapticFeedback('light');

            if (this.checkWin()) {
                this.win();
            }
        }
    }

    checkWin() {
        return this.tiles.every((tile, index) => tile === index);
    }

    showHint() {
        const correctTiles = this.tiles.filter((tile, index) => tile === index);
        const wrongTiles = this.tiles
            .map((tile, index) => ({ tile, index }))
            .filter(({ tile, index }) => tile !== index && tile !== this.gridSize * this.gridSize - 1);

        if (wrongTiles.length > 0) {
            const randomWrong = wrongTiles[Math.floor(Math.random() * wrongTiles.length)];
            const pieces = document.querySelectorAll('.puzzle-piece');
            pieces[randomWrong.index].classList.add('hint');
            setTimeout(() => {
                pieces[randomWrong.index].classList.remove('hint');
            }, 500);
        }
    }

    // A* Algoritması ile Otomatik Çözme
    async autoSolve() {
        if (this.isAutoSolving) return;

        this.isAutoSolving = true;
        this.autoSolved = true;
        document.getElementById('solvingStatus').style.display = 'block';
        document.getElementById('autoSolveBtn').disabled = true;

        // Çözümü hesapla
        const solution = await this.findSolution();

        document.getElementById('solvingStatus').style.display = 'none';

        if (solution) {
            // Çözümü adım adım göster
            for (let i = 0; i < solution.length; i++) {
                await this.sleep(300); // Her hamle arası 300ms bekle

                const move = solution[i];
                this.swapTiles(move, this.emptyIndex);
                this.moves++;
                this.updateStats();
                this.renderBoard();
                await this.hapticFeedback('light');
            }

            this.isAutoSolving = false;
            document.getElementById('autoSolveBtn').disabled = false;
            this.win();
        } else {
            alert('Çözüm bulunamadı!');
            this.isAutoSolving = false;
            document.getElementById('autoSolveBtn').disabled = false;
        }
    }

    async findSolution() {
        // UI'ın güncellenmesi için kısa bir bekleme
        await this.sleep(100);
        return await this.aStarSolve();
    }

    async aStarSolve() {
        const start = {
            tiles: [...this.tiles],
            emptyIndex: this.emptyIndex,
            g: 0,
            h: this.calculateHeuristic(this.tiles),
            path: []
        };

        const openSet = [start];
        const closedSet = new Set();
        const maxIterations = 30000; // Maksimum iterasyon sayısı artırıldı
        let iterations = 0;

        while (openSet.length > 0 && iterations < maxIterations) {
            iterations++;

            // Her 100 iterasyonda bir ana döngüye nefes aldır (UI donmasın)
            if (iterations % 100 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            // En düşük f değerine sahip düğümü al
            openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
            const current = openSet.shift();

            // Çözüm bulundu mu?
            if (this.isSolved(current.tiles)) {
                return current.path;
            }

            const stateKey = current.tiles.join(',');
            if (closedSet.has(stateKey)) continue;
            closedSet.add(stateKey);

            // Komşuları oluştur
            const neighbors = this.getNeighbors(current);

            for (const neighbor of neighbors) {
                const neighborKey = neighbor.tiles.join(',');
                if (!closedSet.has(neighborKey)) {
                    openSet.push(neighbor);
                }
            }
        }

        return null; // Çözüm bulunamadı
    }

    getNeighbors(state) {
        const neighbors = [];
        const row = Math.floor(state.emptyIndex / this.gridSize);
        const col = state.emptyIndex % this.gridSize;

        const moves = [
            { dr: -1, dc: 0 }, // Üst
            { dr: 1, dc: 0 },  // Alt
            { dr: 0, dc: -1 }, // Sol
            { dr: 0, dc: 1 }   // Sağ
        ];

        for (const move of moves) {
            const newRow = row + move.dr;
            const newCol = col + move.dc;

            if (newRow >= 0 && newRow < this.gridSize && newCol >= 0 && newCol < this.gridSize) {
                const newIndex = newRow * this.gridSize + newCol;
                const newTiles = [...state.tiles];
                [newTiles[state.emptyIndex], newTiles[newIndex]] = [newTiles[newIndex], newTiles[state.emptyIndex]];

                neighbors.push({
                    tiles: newTiles,
                    emptyIndex: newIndex,
                    g: state.g + 1,
                    h: this.calculateHeuristic(newTiles),
                    path: [...state.path, newIndex]
                });
            }
        }

        return neighbors;
    }

    calculateHeuristic(tiles) {
        let distance = 0;
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] !== this.gridSize * this.gridSize - 1) {
                const currentRow = Math.floor(i / this.gridSize);
                const currentCol = i % this.gridSize;
                const targetRow = Math.floor(tiles[i] / this.gridSize);
                const targetCol = tiles[i] % this.gridSize;
                distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
            }
        }
        return distance;
    }

    isSolved(tiles) {
        return tiles.every((tile, index) => tile === index);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateStats();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateStats() {
        document.querySelector('.moves strong').textContent = this.moves;
        const minutes = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const secs = (this.seconds % 60).toString().padStart(2, '0');
        document.querySelector('.time strong').textContent = `${minutes}:${secs}`;
    }

    async win() {
        this.stopTimer();
        await this.hapticFeedback('heavy');

        setTimeout(() => {
            this.showCelebration();
        }, 300);
    }

    showCelebration() {
        const overlay = document.getElementById('celebrationOverlay');
        overlay.classList.add('show');

        document.getElementById('finalMoves').textContent = this.moves;
        const minutes = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const secs = (this.seconds % 60).toString().padStart(2, '0');
        document.getElementById('finalTime').textContent = `${minutes}:${secs}`;

        // Otomatik çözüm bilgisi
        const autoInfo = document.getElementById('autoSolveInfo');
        if (this.autoSolved) {
            autoInfo.style.display = 'block';
        } else {
            autoInfo.style.display = 'none';
        }

        this.createHearts();
        this.createRoses();
    }

    hideCelebration() {
        document.getElementById('celebrationOverlay').classList.remove('show');
        document.getElementById('heartsContainer').innerHTML = '';
        document.getElementById('confettiContainer').innerHTML = '';
    }

    createHearts() {
        const container = document.getElementById('heartsContainer');
        const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝'];

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(heart);

                setTimeout(() => heart.remove(), 3000);
            }, i * 100);
        }
    }

    createRoses() {
        const container = document.getElementById('confettiContainer');
        const flowers = ['🌹', '🥀', '🌺', '🌷', '🌸', '💐'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const rose = document.createElement('div');
                rose.className = 'rose';
                rose.textContent = flowers[Math.floor(Math.random() * flowers.length)];
                rose.style.left = Math.random() * 100 + '%';
                rose.style.animationDelay = Math.random() * 0.5 + 's';
                rose.style.animationDuration = (Math.random() * 2 + 2) + 's';
                container.appendChild(rose);

                setTimeout(() => rose.remove(), 4000);
            }, i * 50);
        }
    }
}

// Oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});