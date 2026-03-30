class EventRandomizer {
    constructor() {
        this.mode = 'names';
        this.selectedWinners = [];
        this.history = [];
        this.defaultNames = [
            "Алишер Каримов",
            "Динара Рахимова",
            "Бахтиёр Умаров",
            "Нигора Тошпулатова",
            "Рустам Хасанов",
            "Зарина Абдуллаева",
            "Шахзод Ахмедов",
            "Малика Юсупова",
            "Жасур Исламов",
            "Нодира Назарова",
            "Отабек Мирзаев",
            "Гулнора Саидова",
            "Азиз Мухаммедов",
            "Дилноза Алимова",
            "Санжар Турсунов",
            "Севара Файзуллаева",
            "Равшан Джалилов",
            "Нилуфар Кадырова",
            "Тимур Султанов",
            "Камила Шарипова",
            "Фаррух Азизов",
            "Дильбар Раимова",
            "Улугбек Насыров",
            "Мадина Холматова",
            "Шерзод Давлатов"
        ];
        this.initializeElements();
        this.loadFromStorage();
        this.loadDefaultNames();
        this.attachEventListeners();
        this.initializeDisplay();
    }

    initializeElements() {
        this.namesModeBtn = document.getElementById('namesMode');
        this.numbersModeBtn = document.getElementById('numbersMode');
        this.namesInput = document.getElementById('namesInput');
        this.numbersInput = document.getElementById('numbersInput');
        this.namesList = document.getElementById('namesList');
        this.minNumber = document.getElementById('minNumber');
        this.maxNumber = document.getElementById('maxNumber');
        this.winnersCount = document.getElementById('winnersCount');
        this.excludeWinners = document.getElementById('excludeWinners');
        this.selectBtn = document.getElementById('selectBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.winnersDisplay = document.getElementById('winnersDisplay');
        this.historyDisplay = document.getElementById('historyDisplay');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('overlay');
    }

    attachEventListeners() {
        this.namesModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchMode('names');
        });
        this.numbersModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchMode('numbers');
        });
        this.selectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[Event] Кнопка "Выбрать победителей" нажата');
            this.selectWinners();
        });
        this.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.resetHistory();
        });
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });
        this.overlay.addEventListener('click', () => this.closeSidebarPanel());
        
        this.namesList.addEventListener('input', () => {
            console.log('[Event] Изменение списка имён');
            this.saveToStorage();
        });
        this.winnersCount.addEventListener('input', () => {
            console.log('[Event] Изменение количества победителей');
            this.saveToStorage();
        });
        this.excludeWinners.addEventListener('change', () => {
            console.log('[Event] Изменение чекбокса исключения');
            this.saveToStorage();
        });
        this.minNumber.addEventListener('input', () => {
            console.log('[Event] Изменение минимального числа');
            this.saveToStorage();
        });
        this.maxNumber.addEventListener('input', () => {
            console.log('[Event] Изменение максимального числа');
            this.saveToStorage();
        });
    }

    loadFromStorage() {
        try {
            const savedHistory = localStorage.getItem('randomizer_history');
            const savedWinners = localStorage.getItem('randomizer_winners');
            const savedMode = localStorage.getItem('randomizer_mode');
            const savedNamesList = localStorage.getItem('randomizer_names_list');
            const savedWinnersCount = localStorage.getItem('randomizer_winners_count');
            const savedExcludeWinners = localStorage.getItem('randomizer_exclude_winners');
            const savedMinNumber = localStorage.getItem('randomizer_min_number');
            const savedMaxNumber = localStorage.getItem('randomizer_max_number');
            const savedCurrentWinners = localStorage.getItem('randomizer_current_winners');

            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }

            if (savedWinners) {
                this.selectedWinners = JSON.parse(savedWinners);
            }

            if (savedMode) {
                this.mode = savedMode;
                if (savedMode === 'names') {
                    this.namesModeBtn.classList.add('active');
                    this.numbersModeBtn.classList.remove('active');
                    this.namesInput.classList.remove('hidden');
                    this.numbersInput.classList.add('hidden');
                } else {
                    this.numbersModeBtn.classList.add('active');
                    this.namesModeBtn.classList.remove('active');
                    this.numbersInput.classList.remove('hidden');
                    this.namesInput.classList.add('hidden');
                }
            }

            if (savedNamesList) {
                this.namesList.value = savedNamesList;
            }

            if (savedWinnersCount) {
                this.winnersCount.value = savedWinnersCount;
            }

            if (savedExcludeWinners !== null) {
                this.excludeWinners.checked = savedExcludeWinners === 'true';
            }

            if (savedMinNumber) {
                this.minNumber.value = savedMinNumber;
            }

            if (savedMaxNumber) {
                this.maxNumber.value = savedMaxNumber;
            }

            if (savedCurrentWinners) {
                const currentWinners = JSON.parse(savedCurrentWinners);
                this.restoreCurrentWinners(currentWinners);
            }
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }

    loadDefaultNames() {
        if (this.namesList.value.trim() === '') {
            this.namesList.value = this.defaultNames.join('\n');
        }
    }

    saveToStorage() {
        console.log('[saveToStorage] Сохранение в localStorage');
        try {
            localStorage.setItem('randomizer_history', JSON.stringify(this.history));
            localStorage.setItem('randomizer_winners', JSON.stringify(this.selectedWinners));
            localStorage.setItem('randomizer_mode', this.mode);
            localStorage.setItem('randomizer_names_list', this.namesList.value);
            localStorage.setItem('randomizer_winners_count', this.winnersCount.value);
            localStorage.setItem('randomizer_exclude_winners', this.excludeWinners.checked);
            localStorage.setItem('randomizer_min_number', this.minNumber.value);
            localStorage.setItem('randomizer_max_number', this.maxNumber.value);
        } catch (e) {
            console.error('Ошибка сохранения данных:', e);
        }
    }

    clearStorage() {
        localStorage.removeItem('randomizer_history');
        localStorage.removeItem('randomizer_winners');
        localStorage.removeItem('randomizer_names_list');
        localStorage.removeItem('randomizer_winners_count');
        localStorage.removeItem('randomizer_exclude_winners');
        localStorage.removeItem('randomizer_min_number');
        localStorage.removeItem('randomizer_max_number');
        localStorage.removeItem('randomizer_current_winners');
    }

    switchMode(mode) {
        console.log('[switchMode] Переключение режима на:', mode);
        this.mode = mode;
        
        if (mode === 'names') {
            this.namesModeBtn.classList.add('active');
            this.numbersModeBtn.classList.remove('active');
            this.namesInput.classList.remove('hidden');
            this.numbersInput.classList.add('hidden');
        } else {
            this.numbersModeBtn.classList.add('active');
            this.namesModeBtn.classList.remove('active');
            this.numbersInput.classList.remove('hidden');
            this.namesInput.classList.add('hidden');
        }

        this.saveToStorage();
    }

    getAvailableNames() {
        const text = this.namesList.value.trim();
        if (!text) return [];
        
        let names = text.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (this.excludeWinners.checked) {
            names = names.filter(name => !this.selectedWinners.includes(name));
        }

        return names;
    }

    getAvailableNumbers() {
        const min = parseInt(this.minNumber.value);
        const max = parseInt(this.maxNumber.value);
        
        if (isNaN(min) || isNaN(max) || min > max) {
            return [];
        }

        let numbers = [];
        for (let i = min; i <= max; i++) {
            if (!this.excludeWinners.checked || !this.selectedWinners.includes(i)) {
                numbers.push(i);
            }
        }

        return numbers;
    }

    selectRandom(array, count) {
        if (array.length === 0) return [];
        
        const actualCount = Math.min(count, array.length);
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, actualCount);
    }

    selectWinners() {
        const count = parseInt(this.winnersCount.value) || 1;
        let available, winners;

        this.clearError();

        if (this.mode === 'names') {
            available = this.getAvailableNames();
            
            if (available.length === 0) {
                this.showError('Список участников пуст или все участники уже выбраны!');
                return;
            }

            if (count > available.length) {
                this.showError(`Недостаточно участников! Доступно только ${available.length}.`);
                return;
            }

            winners = this.selectRandom(available, count);
        } else {
            available = this.getAvailableNumbers();
            
            if (available.length === 0) {
                this.showError('Некорректный диапазон чисел или все числа уже выбраны!');
                return;
            }

            if (count > available.length) {
                this.showError(`Недостаточно чисел в диапазоне! Доступно только ${available.length}.`);
                return;
            }

            winners = this.selectRandom(available, count);
        }

        if (this.excludeWinners.checked) {
            this.selectedWinners.push(...winners);
        }

        this.displayWinners(winners);
    }

    displayWinners(winners) {
        console.log('[displayWinners] Начало. Очистка контейнера победителей');
        this.winnersDisplay.innerHTML = '';
        
        winners.forEach((winner, index) => {
            setTimeout(() => {
                console.log(`[displayWinners] Показываем победителя ${index + 1}:`, winner);
                const winnerDiv = document.createElement('div');
                winnerDiv.className = 'winner-item';
                
                this.animateWinner(winnerDiv, winner, () => {
                    console.log('[displayWinners] Анимация завершена для:', winner);
                    this.addToHistory([winner]);
                    this.saveCurrentWinners();
                    this.saveToStorage();
                });
                this.winnersDisplay.appendChild(winnerDiv);
            }, index * 3000);
        });
    }

    saveCurrentWinners() {
        const currentWinners = [];
        const winnerElements = this.winnersDisplay.querySelectorAll('.winner-item');
        winnerElements.forEach(el => {
            if (!el.classList.contains('rolling')) {
                currentWinners.push(el.textContent);
            }
        });
        console.log('[saveCurrentWinners] Сохранение текущих победителей:', currentWinners);
        localStorage.setItem('randomizer_current_winners', JSON.stringify(currentWinners));
    }

    restoreCurrentWinners(winners) {
        console.log('[restoreCurrentWinners] Восстановление победителей:', winners);
        this.winnersDisplay.innerHTML = '';
        winners.forEach(winner => {
            const winnerDiv = document.createElement('div');
            winnerDiv.className = 'winner-item';
            winnerDiv.textContent = winner;
            this.winnersDisplay.appendChild(winnerDiv);
        });
    }

    animateWinner(element, finalWinner, onComplete) {
        const duration = 2500;
        const interval = 80;
        let elapsed = 0;

        let pool;
        if (this.mode === 'names') {
            pool = this.getAvailableNames();
            if (pool.length === 0) {
                const text = this.namesList.value.trim();
                pool = text.split('\n').map(name => name.trim()).filter(name => name.length > 0);
            }
        } else {
            pool = this.getAvailableNumbers();
            if (pool.length === 0) {
                const min = parseInt(this.minNumber.value);
                const max = parseInt(this.maxNumber.value);
                pool = Array.from({length: max - min + 1}, (_, i) => min + i);
            }
        }

        if (pool.length === 0) {
            element.textContent = finalWinner;
            if (onComplete) onComplete();
            return;
        }

        element.classList.add('rolling');

        const rollInterval = setInterval(() => {
            const randomItem = pool[Math.floor(Math.random() * pool.length)];
            element.textContent = randomItem;
            elapsed += interval;

            if (elapsed >= duration) {
                clearInterval(rollInterval);
                element.textContent = finalWinner;
                element.classList.remove('rolling');
                element.classList.add('winner-revealed');
                
                setTimeout(() => {
                    element.classList.remove('winner-revealed');
                    if (onComplete) onComplete();
                }, 1000);
            }
        }, interval);
    }

    addToHistory(winners) {
        const timestamp = new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const historyEntry = {
            timestamp,
            winners,
            mode: this.mode
        };

        this.history.unshift(historyEntry);
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyDisplay.innerHTML = '<div class="empty-state">История выборов пуста</div>';
            return;
        }

        this.historyDisplay.innerHTML = '';
        
        this.history.forEach(entry => {
            const historyDiv = document.createElement('div');
            historyDiv.className = 'history-item';
            
            const timestamp = document.createElement('div');
            timestamp.className = 'timestamp';
            timestamp.textContent = entry.timestamp;
            
            const winnersList = document.createElement('div');
            winnersList.className = 'winners';
            
            entry.winners.forEach(winner => {
                const winnerLine = document.createElement('div');
                winnerLine.className = 'winner-line';
                winnerLine.textContent = winner;
                winnersList.appendChild(winnerLine);
            });
            
            historyDiv.appendChild(timestamp);
            historyDiv.appendChild(winnersList);
            this.historyDisplay.appendChild(historyDiv);
        });
    }

    resetHistory() {
        if (this.history.length === 0 && this.selectedWinners.length === 0) {
            return;
        }

        if (confirm('Вы уверены, что хотите сбросить историю и список победителей?')) {
            this.selectedWinners = [];
            this.history = [];
            this.clearStorage();
            this.winnersDisplay.innerHTML = '<div class="empty-state">Выберите победителей</div>';
            this.updateHistoryDisplay();
        }
    }

    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const mainAction = document.querySelector('.main-action');
        mainAction.parentNode.insertBefore(errorDiv, mainAction);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    clearError() {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    updateDisplay() {
        console.log('[updateDisplay] Вызван. Количество детей в winnersDisplay:', this.winnersDisplay.children.length);
        const hasWinners = this.winnersDisplay.children.length > 0 && 
                           !this.winnersDisplay.querySelector('.empty-state');
        
        console.log('[updateDisplay] hasWinners:', hasWinners);
        
        if (!hasWinners) {
            console.log('[updateDisplay] Устанавливаем empty-state');
            this.winnersDisplay.innerHTML = '<div class="empty-state">Выберите победителей</div>';
        }
        
        this.updateHistoryDisplay();
    }

    initializeDisplay() {
        console.log('[initializeDisplay] Инициализация дисплея');
        if (this.winnersDisplay.children.length === 0) {
            this.winnersDisplay.innerHTML = '<div class="empty-state">Выберите победителей</div>';
        }
        this.updateHistoryDisplay();
    }

    openSidebar() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('active');
        this.menuToggle.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeSidebarPanel() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
        this.menuToggle.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggleSidebar() {
        if (this.sidebar.classList.contains('open')) {
            this.closeSidebarPanel();
        } else {
            this.openSidebar();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const randomizer = new EventRandomizer();
});
