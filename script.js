// DOM Elements
const timeDisplay = document.getElementById('time');
const ampmDisplay = document.getElementById('ampm');
const dateDisplay = document.getElementById('date-text');
const themeToggle = document.getElementById('theme-toggle');
const alarmInput = document.getElementById('alarm-time');
const setAlarmBtn = document.getElementById('set-alarm-btn');
const stopAlarmBtn = document.getElementById('stop-alarm-btn');
const snoozeBtn = document.getElementById('snooze-btn');
const alarmStatus = document.getElementById('alarm-status');
const alarmSound = document.getElementById('alarm-sound');

let alarmTime = null;
let isAlarmPlaying = false;

// 1. UPDATE CLOCK FUNCTION
function updateClock() {
    const now = new Date();
    
    // Time Formatting
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12 || 12;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    timeDisplay.textContent = `${h}:${m}:${s}`;
    ampmDisplay.textContent = ampm;

    // Date Formatting
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString(undefined, dateOptions);

    // Check Alarm
    checkAlarm(h, m, ampm);
}

// 2. ALARM LOGIC
function checkAlarm(h, m, ap) {
    if (alarmTime && !isAlarmPlaying) {
        const [aH24, aM] = alarmTime.split(':');
        let aH = parseInt(aH24);
        let aAP = aH >= 12 ? 'PM' : 'AM';
        aH = aH % 12 || 12;
        aH = aH < 10 ? '0' + aH : aH;

        if (`${aH}:${aM}` === `${h}:${m}` && ap === aAP) {
            triggerAlarm();
        }
    }
}

function triggerAlarm() {
    isAlarmPlaying = true;
    alarmSound.play();
    stopAlarmBtn.classList.remove('hidden');
    snoozeBtn.classList.remove('hidden');
    alarmStatus.textContent = "⏰ Wake up! Alarm ringing...";
    document.body.style.backgroundColor = "rgba(255, 118, 117, 0.3)";
}

// Set Alarm
setAlarmBtn.addEventListener('click', () => {
    if (alarmInput.value) {
        alarmTime = alarmInput.value;
        alarmStatus.textContent = `Alarm set for ${alarmTime}`;
        stopAlarmBtn.classList.add('hidden');
        snoozeBtn.classList.add('hidden');
    }
});

// Stop Alarm
stopAlarmBtn.addEventListener('click', () => {
    stopAlarmInstance();
    alarmTime = null;
    alarmStatus.textContent = "No alarm set";
});

// Snooze Alarm (10 Minutes)
snoozeBtn.addEventListener('click', () => {
    stopAlarmInstance();
    
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    
    const sH = String(now.getHours()).padStart(2, '0');
    const sM = String(now.getMinutes()).padStart(2, '0');
    
    alarmTime = `${sH}:${sM}`;
    alarmStatus.textContent = `Snoozed! Next alarm at ${alarmTime}`;
});

function stopAlarmInstance() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    isAlarmPlaying = false;
    stopAlarmBtn.classList.add('hidden');
    snoozeBtn.classList.add('hidden');
    document.body.style.backgroundColor = "";
}

// 3. THEME PERSISTENCE
themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clock-theme', theme);
});

// Init Theme & Clock
const savedTheme = localStorage.getItem('clock-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

setInterval(updateClock, 1000);
updateClock();