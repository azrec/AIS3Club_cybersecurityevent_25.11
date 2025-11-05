(function() { 
const user_token = 'uuid:9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

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
SYS: 流程審查中...
SYS:
SYS: --- END CACHE DUMP ---
LOG END: Audit terminated by system halt.
`;

const FINAL_CLUE_TEMPLATE = `
    <p class="prompt success-text">=== [AUDIT_COMPLETE]：資料流重組成功！ ===</p>
    <p class="prompt">最終報告： 目標已由執行時環境 (Runtime) 從字串中提取。</p>
    <p class="prompt">目標文字：[COORDINATE_HERE]</p>
`;

const enonekot = 'NDE1M18xNV81MF';
const owtnekot = '9tdWNoX2Z1bg==';


const loginScreen = document.getElementById('login-screen');
const logScreen = document.getElementById('log-screen');
const cmdInput = document.getElementById('override-cmd'); 
const submitKeyButton = document.getElementById('submit-key');
const errorMessage = document.getElementById('error-message');
const logOutput = document.getElementById('log-output');
const finalClueContainer = document.getElementById('final-clue-container');

let logIndex = 0;
let typingInterval;
let isPaused = false;


function decode(a, b) {
    const name = ('b' + 'o' + 't' + 'a').split('').reverse().join(''); 
    const func = window[name]; 
    
    if (typeof func === 'function') {
        return func(a + b);
    }
    return 'DECODING_ERROR';
}

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
            
            const finalCoordinate = decode(enonekot, owtnekot);
            const finalHTML = FINAL_CLUE_TEMPLATE.replace('[COORDINATE_HERE]', finalCoordinate);
            
            finalClueContainer.innerHTML = finalHTML; 
        } else if (isPaused) {
        }
    }

    typeLine();
}

submitKeyButton.addEventListener('click', () => {
    cmdInput.style.borderRightWidth = '0'; 

    errorMessage.textContent = '';
    const inputKey = cmdInput.value.trim();

    const MAX_ALLOWED_LENGTH = 20;

    if (inputKey.length > MAX_ALLOWED_LENGTH) {
        errorMessage.textContent = '[FATAL_AUDIT]：指令長度異常。';
        cmdInput.value = '';
        return;
    }

    if (inputKey === user_token) {
        startLogDisplay();
    } else {
        errorMessage.textContent = '[ERROR_403]：Token 無效。請檢查程式碼內「函式呼叫的順序與邊界」(Function Scope & Flow)。';
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

})();