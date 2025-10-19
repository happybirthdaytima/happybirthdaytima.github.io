class LinuxTerminal {
    constructor() {
        this.commandHistory = [];
        this.currentIndex = 0;
        this.isProcessing = false;
        this.passwordChars = ['', '', '', '', ''];
        this.completedQuests = 0;
        this.currentQuest = null;
        this.usedQuestIndexes = new Set();
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'ls': this.listFiles.bind(this),
            'cat': this.readFile.bind(this),
            'cd': this.changeDirectory.bind(this),
            'pwd': this.showCurrentDir.bind(this),
            'whoami': this.whoami.bind(this),
            'date': this.showDate.bind(this),
            'clear': this.clearScreen.bind(this),
            'sudo': this.sudo.bind(this),
            'rm': this.removeFile.bind(this),
            'mkdir': this.makeDir.bind(this),
            'echo': this.echo.bind(this),
            'quest': this.startRandomQuest.bind(this),
            'reboot': this.reboot.bind(this),
            'shutdown': this.shutdown.bind(this),
            'neofetch': this.neofetch.bind(this),
            'top': this.showTop.bind(this),
            'ps': this.showProcesses.bind(this),
            'ifconfig': this.showNetwork.bind(this),
            'df': this.showDiskSpace.bind(this),
            'uname': this.showKernelInfo.bind(this),
            'math': this.startMathGame.bind(this)
        };

        this.quests = [
            {
                name: "Загадка мудреца",
                question: "Я летаю без крыльев, плачу без глаз. Когда я прохожу, даже деревья гнутся. Что я?",
                answer: "ветер",
                type: "riddle"
            },
            {
                name: "Математическая головоломка", 
                question: "Если 2 + 3 = 10, 7 + 2 = 63, 6 + 5 = 66, то 8 + 6 = ?",
                answer: "112",
                type: "math"
            },
            {
                name: "Загадка на логику",
                question: "Что может бегать, но не ходить? Что имеет рот, но не говорит? Что имеет кровать, но не спит?",
                answer: "река",
                type: "riddle" 
            },
            {
                name: "Шифр Цезаря",
                question: "Расшифруй сообщение: Ынлспхнл -> (сдвиг 7)",
                answer: "поздравляю",
                type: "cipher"
            },
            {
                name: "Загадка про время",
                question: "Что идет, но никогда не приходит?",
                answer: "время",
                type: "riddle"
            },
            {
                name: "Логическая последовательность",
                question: "Продолжи последовательность: 1, 1, 2, 3, 5, 8, 13, ?",
                answer: "21",
                type: "sequence"
            },
            {
                name: "Загадка про брата",
                question: "У отца и матери есть один сын. Сколько всего детей в семье?",
                answer: "1",
                type: "riddle"
            },
            {
                name: "Геометрическая задача",
                question: "У квадрата 4 угла. Если один угол отрезать, сколько углов останется?",
                answer: "5",
                type: "math"
            }
        ];

        this.init();
    }

    init() {
        const commandInput = document.getElementById('commandInput');
        commandInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        commandInput.focus();

        setTimeout(() => {
            this.addOutput("Обнаружена системная задача: birthday_quest", "warning");
            this.addOutput("Для доступа к поздравлению требуется пароль sudo (5 символов)", "warning");
            this.addOutput("Выполняйте квесты командой 'quest' для получения символов пароля", "success");
        }, 2000);
    }

    handleKeyDown(e) {
        if (this.isProcessing) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter') {
            this.processCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.showPreviousCommand();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.showNextCommand();
        }
    }

    processCommand() {
        const commandInput = document.getElementById('commandInput');
        const command = commandInput.value.trim();
        
        if (!command) {
            commandInput.value = '';
            return;
        }

        this.commandHistory.push(command);
        this.currentIndex = this.commandHistory.length;
        
        this.addOutput(`brother@birthday:~$ ${command}`, 'command');
        commandInput.value = '';

        this.isProcessing = true;
        
        setTimeout(() => {
            this.executeCommand(command);
            this.isProcessing = false;
            
            setTimeout(() => this.addNewCommandLine(), 100);
            
            if (Math.random() < 0.15 && !this.currentQuest) {
                setTimeout(() => this.showSystemError(), 300);
            }
        }, 500);
    }

    executeCommand(command) {
        const [cmd, ...args] = command.split(' ');
        const commandHandler = this.commands[cmd];

        if (commandHandler) {
            commandHandler(args);
        } else {
            this.addOutput(`${cmd}: команда не найдена`, 'error');
            this.addOutput("Введите 'help' для списка команд", 'output');
        }
    }

    showSystemError() {
        this.addOutput("", "error");
        this.addOutput("kernel: [ 1234.567890] BUG: unable to handle kernel NULL pointer dereference", "error");
        this.addOutput("kernel: [ 1234.567891] PGD 0 P4D 0", "error");
        this.addOutput("kernel: [ 1234.567892] Oops: 0000 [#1] SMP NOPTI", "error");
        this.addOutput("kernel: [ 1234.567893] CPU: 0 PID: 1337 Comm: birthday_quest Tainted: G", "error");
        this.addOutput("", "error");
        this.addOutput("⚠️  СИСТЕМНАЯ ОШИБКА: Нажмите любую клавишу ИЛИ коснитесь экрана для продолжения...", "warning");
        
        const errorScreen = document.getElementById('systemError');
        errorScreen.style.display = 'flex';
        
        errorScreen.addEventListener('click', this.handleErrorClose.bind(this));
        document.addEventListener('keydown', this.handleErrorClose.bind(this));
    }

    handleErrorClose(e) {
        const errorScreen = document.getElementById('systemError');
        if (errorScreen.style.display === 'flex') {
            errorScreen.style.display = 'none';
            
            errorScreen.removeEventListener('click', this.handleErrorClose);
            document.removeEventListener('keydown', this.handleErrorClose);
            
            this.addOutput("Система восстановлена. Продолжаем работу...", "warning");
            setTimeout(() => this.addNewCommandLine(), 500);
            
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    startRandomQuest() {
        if (this.completedQuests >= 5) {
            this.addOutput("Все символы пароля получены! Используйте: sudo [пароль]", "success");
            return;
        }

        this.currentQuest = null;

        if (this.usedQuestIndexes.size >= this.quests.length) {
            this.usedQuestIndexes.clear();
        }

        let availableIndexes = [];
        for (let i = 0; i < this.quests.length; i++) {
            if (!this.usedQuestIndexes.has(i)) {
                availableIndexes.push(i);
            }
        }

        if (availableIndexes.length === 0) {
            this.addOutput("Нет доступных квестов", "error");
            return;
        }

        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        const randomQuest = this.quests[randomIndex];
        
        this.usedQuestIndexes.add(randomIndex);
        this.currentQuest = randomQuest;
        
        this.addOutput(`=== КВЕСТ ${this.completedQuests + 1}/5 ===`, "success");
        this.addOutput(randomQuest.name, "warning");
        this.addOutput(randomQuest.question, "output");
        
        switch(randomQuest.type) {
            case "riddle":
            case "cipher":
                this.addOutput("Введите ответ командой: echo [ответ]", "warning");
                break;
            case "math":
            case "sequence":
                this.addOutput("Введите ответ командой: math [ответ]", "warning");
                break;
        }
    }

    echo(args) {
        if (!this.currentQuest) {
            this.addOutput(args.join(' '), 'output');
            return;
        }

        const answer = args.join(' ').toLowerCase();
        if (answer === this.currentQuest.answer) {
            this.completeQuest();
        } else {
            this.addOutput("Неправильно! Попробуйте еще раз.", "error");
            this.addOutput(`Подсказка: ${this.getHint(this.currentQuest)}`, "warning");
        }
    }

    startMathGame(args) {
        if (!this.currentQuest) {
            this.addOutput("Запустите квест сначала: quest", "error");
            return;
        }

        if (this.currentQuest.type === "math" || this.currentQuest.type === "sequence") {
            const answer = args[0];
            if (answer === this.currentQuest.answer) {
                this.completeQuest();
            } else {
                this.addOutput("Неправильно! Попробуйте еще раз.", "error");
                this.addOutput(`Подсказка: ${this.getHint(this.currentQuest)}`, "warning");
            }
        } else {
            this.addOutput("Этот квест требует другую команду", "error");
        }
    }

    getHint(quest) {
        switch(quest.answer) {
            case "112": return "Формула: a * (a + b)";
            case "21": return "Это последовательность Фибоначчи";
            case "5": return "При отрезании угла появляется новый угол";
            case "1": return "В семье только один ребенок";
            case "ветер": return "Он невидимый, но ощутимый";
            case "река": return "Водный поток";
            case "поздравляю": return "Сдвиг алфавита на 7 позиций назад";
            case "время": return "Оно постоянно движется вперед";
            default: return "Подумай еще!";
        }
    }

    completeQuest() {
        const charIndex = this.completedQuests;
        const passwordChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        this.passwordChars[charIndex] = passwordChars[Math.floor(Math.random() * passwordChars.length)];
        
        this.addOutput("✓ Правильно! Получен символ пароля", "success");
        this.addOutput(`Текущий прогресс пароля: ${this.passwordChars.map(c => c || '_').join('')}`, "success");
        
        this.completedQuests++;
        this.currentQuest = null;

        if (this.completedQuests >= 5) {
            this.addOutput("🎉 Все 5 символов пароля собраны!", "success");
            this.addOutput("Используйте: sudo [пароль] для доступа к поздравлению", "warning");
        } else {
            this.addOutput("Введите 'quest' для следующего задания", "output");
        }

        setTimeout(() => this.addNewCommandLine(), 100);
    }

    sudo(args) {
        if (args.length === 0) {
            this.addOutput("sudo: требуется пароль для brother", "error");
            this.addOutput("Использование: sudo [5-символьный пароль]", "output");
            return;
        }

        const password = args[0].toUpperCase();
        if (password === this.passwordChars.join('')) {
            this.showCongratulations();
        } else {
            this.addOutput("sudo: неверный пароль", "error");
            this.addOutput(`Подсказка: пароль состоит из 5 символов: ${this.passwordChars.map(c => c || '?').join('')}`, "output");
        }
    }

    showCongratulations() {
        this.addOutput("", "output");
        this.addOutput("=== ДОСТУП РАЗРЕШЕН ===", "success");
        this.addOutput("Загрузка персонального поздравления...", "warning");
        
        setTimeout(() => {
            this.showCongratulationWindow();
        }, 2000);
    }

    showCongratulationWindow() {
        const congratWindow = document.getElementById('congratulationWindow');
        congratWindow.style.display = 'flex';
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#00ff00', '#ff0000', '#ffff00', '#00ffff', '#ff00ff'];
        const congratWindow = document.getElementById('congratulationWindow');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                z-index: 10001;
                border-radius: 2px;
            `;
            congratWindow.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    showHelp() {
        const helpText = `
Доступные команды:
  help      - показать справку
  ls        - список файлов
  cat       - показать файл
  quest     - начать случайный квест
  sudo      - доступ к поздравлению (требует пароль)
  echo      - вывести текст / ответить на загадку
  math      - решить математическую задачу
  clear     - очистить экран
  reboot    - перезагрузка
  shutdown  - выключение
  neofetch  - информация о системе
        `.trim();
        
        this.addOutput(helpText, 'output');
    }

    listFiles() {
        const files = [
            'quest_system/',
            'congratulation.locked',
            'password_fragments/',
            'system_logs/',
            'birthday_protocol/'
        ];
        
        this.addOutput(files.join('    '), 'output');
    }

    readFile(args) {
        if (!args.length) {
            this.addOutput("cat: укажите файл", 'error');
            return;
        }

        const filename = args[0];
        
        switch(filename) {
            case 'congratulation.locked':
                this.addOutput("Файл заблокирован. Требуется пароль sudo.", 'error');
                this.addOutput("Выполните 5 квестов для получения пароля.", 'warning');
                break;
            default:
                this.addOutput(`cat: ${filename}: Нет такого файла`, 'error');
        }
    }

    addOutput(text, type = 'output') {
        const history = document.getElementById('commandHistory');
        const line = document.createElement('div');
        line.className = `line ${type}`;
        line.innerHTML = text;
        history.appendChild(line);
        this.scrollToBottom();
    }

    addNewCommandLine() {
        const history = document.getElementById('commandHistory');
        
        const oldLine = document.getElementById('currentLine');
        if (oldLine) {
            oldLine.remove();
        }
        
        const newLine = document.createElement('div');
        newLine.className = 'line';
        newLine.id = 'currentLine';
        newLine.innerHTML = `
            <span class="user">brother</span><span class="prompt">@</span><span class="host">birthday</span><span class="prompt">:</span><span class="path">~</span><span class="prompt">$ </span>
            <input type="text" class="command" id="commandInput" autofocus>
        `;
        history.appendChild(newLine);
        
        const newInput = document.getElementById('commandInput');
        newInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        this.scrollToBottom();
    }

    scrollToBottom() {
        const terminal = document.getElementById('terminal');
        terminal.scrollTop = terminal.scrollHeight;
    }

    showPreviousCommand() {
        if (this.commandHistory.length > 0) {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
            document.getElementById('commandInput').value = this.commandHistory[this.currentIndex] || '';
        }
    }

    showNextCommand() {
        if (this.currentIndex < this.commandHistory.length - 1) {
            this.currentIndex++;
            document.getElementById('commandInput').value = this.commandHistory[this.currentIndex] || '';
        } else {
            this.currentIndex = this.commandHistory.length;
            document.getElementById('commandInput').value = '';
        }
    }

    showDate() { this.addOutput(new Date().toString(), 'output'); }
    whoami() { this.addOutput("brother", 'output'); }
    clearScreen() { 
        document.getElementById('commandHistory').innerHTML = ''; 
        this.addNewCommandLine();
    }
    
    reboot() {
        this.addOutput("Имитация перезагрузки...", 'warning');
        setTimeout(() => {
            this.clearScreen();
            this.addOutput("Система перезагружена", 'success');
        }, 2000);
    }

    shutdown() {
        this.addOutput("Имитация выключения...", 'warning');
        setTimeout(() => {
            this.addOutput("Система завершает работу...", 'warning');
            setTimeout(() => {
                this.clearScreen();
                this.addOutput("Обновите страницу для перезапуска", 'success');
            }, 2000);
        }, 1000);
    }

    neofetch() {
        const info = `
brother@birthday
-------------
OS: Birthday Quest Ubuntu 23.04
Host: Congratulation System
Kernel: 6.2.0-26-generic
Uptime: 1 hour
Tasks: ${this.completedQuests}/5 quests completed
Shell: bash 5.1.16
CPU: Quest Processor
Memory: 32GB Quest RAM
        `.trim();
        
        this.addOutput(info, 'output');
    }

    changeDirectory() { this.addOutput("bash: cd: Доступ ограничен системой квестов", 'error'); }
    showCurrentDir() { this.addOutput("/home/brother", 'output'); }
    removeFile() { this.addOutput("rm: Отказано в доступе", 'error'); }
    makeDir() { this.addOutput("mkdir: Отказано в доступе", 'error'); }
    showTop() { this.addOutput("Запуск top...", 'output'); this.addOutput("...имитация работы...", 'output'); }
    showProcesses() { this.addOutput("  PID TTY          TIME CMD", 'output'); this.addOutput(" 1337 pts/0    00:00:00 birthday_quest", 'output'); }
       showNetwork() { 
        this.addOutput("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500", 'output'); 
        this.addOutput("        inet 192.168.1.77  netmask 255.255.255.0  broadcast 192.168.1.255", 'output');
    }
    
    showDiskSpace() { 
        this.addOutput("Filesystem      Size  Used Avail Use% Mounted on", 'output');
        this.addOutput("/dev/sda1        29G  5.2G   23G   19% /", 'output');
    }
    
    showKernelInfo() { 
        this.addOutput("Linux birthday 6.2.0-26-generic #26-Ubuntu SMP PREEMPT_DYNAMIC Thu Jun 22 14:36:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux", 'output'); 
    }
}

function closeCongratulations() {
    const congratWindow = document.getElementById('congratulationWindow');
    congratWindow.style.display = 'none';
    terminal.addOutput("Поздравление закрыто. Спасибо что прошёл все квесты! 🎉", "success");
    terminal.addNewCommandLine();
}

const terminal = new LinuxTerminal();