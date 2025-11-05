const IMPOSSIBLE_CMD = 'uuid:9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

const LOG_CONTENT = `
SYS: Booting from recovery partition... OK
SYS: Initializing kernel v3.4.1... OK
SYS: Mounting file systems... OK
SYS: Starting core services...
SYS: - Service 'network'....... OK
SYS: - Service 'scheduler'..... OK
SYS: - Service 'security_auth'... FAILED
SYS: Security authenticator failed to load.
SYS: System integrity compromised.
SYS: Attempting to lock down console...
ERROR: Control loop timer mismatch. (ERR_CODE: 7F4A)
SYS: Process hung. Awaiting manual interrupt.
WARN: UI layer is now detached from kernel.
SYS: ...
SYS: ...
SYS: ...
SYS: System halt. Dumping last known data cache.
SYS: --- BEGIN CACHE DUMP ---
SYS:
SYS: 流程已毀損...
SYS:
SYS: --- END CACHE DUMP ---
LOG END: Session terminated by kernel panic.
`;

const loginScreen = document.getElementById('login-screen');
const logScreen = document.getElementById('log-screen');
const cmdInput = document.getElementById('override-cmd'); 
const submitKeyButton = document.getElementById('submit-key');
const errorMessage = document.getElementById('error-message');
const logOutput = document.getElementById('log-output');
const finalClue = document.getElementById('final-clue');

let logIndex = 0;
let typingInterval;
let isPaused = false;

function startLogDisplay() {
    loginScreen.style.display = 'none';
    logScreen.style.display = 'block';

    const cleanLog = LOG_CONTENT.trim().split('\n');

    function typeLine() {
        if (logIndex < cleanLog.length && !isPaused) {
            logOutput.innerHTML += cleanLog[logIndex].trim() + '<br>';
            logOutput.scrollTop = logOutput.scrollHeight;
            logIndex++;

            const delay = 700 + Math.random() * 100;
            typingInterval = setTimeout(typeLine, delay);
        } else if (logIndex === cleanLog.length) {
            clearInterval(typingInterval);
            finalClue.style.display = 'block';
        } else if (isPaused) {
        }
    }

    typeLine();
}

submitKeyButton.addEventListener('click', () => {
    cmdInput.style.borderRightWidth = '0'; 

    errorMessage.textContent = '';
    const inputKey = cmdInput.value.trim();

    if (inputKey === IMPOSSIBLE_CMD) {
        startLogDisplay();
    } else {
        errorMessage.textContent = '[ERROR]：Command Error...';
        cmdInput.value = '';
    }
});

cmdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitKeyButton.click();
    }
});

document.addEventListener('keydown', (e) => {
    if (logScreen.style.display === 'block' && e.code === 'Space') {
        e.preventDefault();
        
        isPaused = !isPaused;
        
        if (!isPaused) {
            startLogDisplay(); 
            logOutput.style.border = '1px solid #00ff00';
        } else {
            clearTimeout(typingInterval);
            logOutput.style.border = '1px solid #ff0000';
        }
    }
});