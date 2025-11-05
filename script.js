(function() { 

// 陷阱指令 (Impassable Decoy)
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

// Part 1: 最終線索的 HTML 樣板，[COORDINATE_HERE] 將被替換
const FINAL_CLUE_TEMPLATE = `
    <p class="prompt success-text">=== 系統快取讀取完畢 ===</p>
    <p class="prompt">**關鍵訊息：** 流程已毀損，但資料並未遺失。</p>
    <p class="prompt">**最終座標：** [COORDINATE_HERE]</p>
    <p class="prompt">碎片之四已收集，請前往下一個地點。</p>
`;

// Part 2: 最終座標 'NTCUST-DEV-CONSOLE' 的 Base64 編碼
const ENCODED_COORD = 'TlRDVVNULURFVi1DT05TT0xF'; 


const loginScreen = document.getElementById('login-screen');
const logScreen = document.getElementById('log-screen');
const cmdInput = document.getElementById('override-cmd'); 
const submitKeyButton = document.getElementById('submit-key');
const errorMessage = document.getElementById('error-message');
const logOutput = document.getElementById('log-output');
const finalClueContainer = document.getElementById('final-clue-container'); // 獲取容器元素

let logIndex = 0;
let typingInterval;
let isPaused = false;


// 函式：Base64 解碼 (使用瀏覽器內建的 atob 函式)
function decodeBase64(encoded) {
    if (typeof atob === 'function') {
        return atob(encoded);
    }
    return 'DECODING_ERROR'; 
}


// 玩家必須利用 Debugger 執行此函式
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
            
            // 關鍵：即時解碼並組裝線索
            const finalCoordinate = decodeBase64(ENCODED_COORD);
            const finalHTML = FINAL_CLUE_TEMPLATE.replace('[COORDINATE_HERE]', finalCoordinate);
            
            // 寫入 DOM
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

    // 驗證邏輯：永遠為 false
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

})(); // 關鍵：IIFE 結束