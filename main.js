// ~ CONSTS ~
const startEl = document.getElementById("start")
const pauseEl = document.getElementById("pause")
const resetEl = document.getElementById("reset")
const timerEl = document.getElementById("timer")
const timerTypeEl = document.getElementById("timerType")


// ~ LETS ~
let interval;
let timeLeft = 1500; // seconds
let workCount = 0;
let breakCount = 0;
let shortBreakCount = 0;
let longBreakCount = 0;
let sessionCount = 0;
let timerType = "Work";
let snackbarMessage;

var timerTypeOptions = {
    Work: 1500,
    ShortBreak: 300,
    LongBreak: 900
}


// ~ FUNCTIONS ~
// timer functions
function updateTimer(){
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    timerEl.innerHTML = formattedTime
    if(timerType == "Work"){
        timerTypeEl.innerHTML = `${timerType} ${workCount+1}`;
    } else if(timerType == "ShortBreak"){
        timerTypeEl.innerHTML = `${timerType} ${shortBreakCount+1}`;
    } else if(timerType == "LongBreak"){
        timerTypeEl.innerHTML = `${timerType} ${longBreakCount+1}`;
    }

}

function startTimer(){
    interval = setInterval(()=>{
        timeLeft--;
        updateTimer();
        if(timeLeft === 0){
            clearInterval(interval);
            calcNextTimerType();
            updateTimer();
        }
    }, 10)      // 1000 for actual, 10 for testing
    updateControlButtons(true);
}

function pauseTimer(){
    clearInterval(interval);
    updateControlButtons(false);
}

function resetTimer(){
    clearInterval(interval);
    timeLeft = timerTypeOptions[timerType];
    updateTimer();
    updateControlButtons(false);
}

function updateControlButtons(isrunning){
    var startButton = document.querySelector(".timer-control.start");
    var pauseButton = document.querySelector(".timer-control.pause");

    if(isrunning){
        startButton.disabled = true;
        pauseButton.disabled = false;
    } else{
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
}

function calcNextTimerType(){
    if(timerType == "Work"){
        workCount += 1;
        snackbarNotif(timerType, workCount);
        if(shortBreakCount != 0 && shortBreakCount % 3 === 0){
            switchTimerType("LongBreak");
        } else {
            switchTimerType("ShortBreak");
        }
    } else if(timerType == "ShortBreak"){
        shortBreakCount += 1;
        snackbarNotif(timerType, breakCount);
        switchTimerType("Work");
    } else if(timerType == "LongBreak"){
        longBreakCount += 1;
        breakCount += 1;
        alert("Pomodoro Session Complete! Great Job!")
        sessionCount += 1;
        switchTimerType("Work");
    }
}

function switchTimerType(type){
    timerType = type;
    resetTimer();
}

function snackbarNotif(name, count){
    snackbarSetting = document.getElementById("snackbar");
    snackbarMessage = `${name} Session ${count} Complete!`
    document.getElementById("snackbar").textContent = snackbarMessage
    snackbarSetting.className = "show";
    setTimeout(function(){ snackbarSetting.className = snackbarSetting.className.replace("show", ""); }, 3000);
}

// ~ CALLS ~ 
startEl.addEventListener("click", startTimer)
pauseEl.addEventListener("click", pauseTimer)
resetEl.addEventListener("click", resetTimer)
