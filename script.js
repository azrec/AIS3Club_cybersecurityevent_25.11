const CORRECT_KEY = 'sapporo2004';

const LOG_CONTENT = `
SYS: Booting system core... OK
SYS: Initializing display driver... OK
SYS: Verifying security protocols... L3 Active
CHAT: [NTCUST] 測試，台中端畫面正常。
DATA: Received packet from 164.70.19.63 (Sapporo).
SYS: connection ping 200ms...
CHAT: [SAPPORO] 收到。關於〈境界之鏡〉，我們有點擔心...
DATA: ...packet 3F... received...
SYS: System heartbeat normal.
CHAT: [NTCUST] 擔心什麼？
SYS: ...connection unstable... voltage drop...
CHAT: [SAPPORO] ...以防萬一，如果鏡子碎裂... 記住，這是唯一的辦法...
ERROR: packet 4A corrupted (checksum mismatch)
SYS: Attempting recovery...
CHAT: [SAPPORO] ...儀式失效...要在高台上重組它...
WARN: Protocol mismatch detected.
SYS: ...connection lost... Dumping last known coordinate cache...
CACHE: NTCUST-ZJ-ROOFTOP
LOG END: Session terminated by remote host.
`;

const loginScreen = document.getElementById('login-screen');
const logScreen = document.getElementById('log-screen');
const accessKeyInput = document.getElementById('access-key');
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

            const delay = 900 + Math.random() * 200; 
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
    accessKeyInput.style.borderRightWidth = '0'; 

    errorMessage.textContent = '';
    const inputKey = accessKeyInput.value.trim();

    if (inputKey === CORRECT_KEY) {
        startLogDisplay();
    } else {
        errorMessage.textContent = '[ERROR]：存取金鑰錯誤，嘗試數位鑑識失敗。';
        accessKeyInput.value = '';
    }
});

accessKeyInput.addEventListener('keypress', (e) => {
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