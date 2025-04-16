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
let timerType = "Work";

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
    timerTypeEl.innerHTML = timerType
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
}

function pauseTimer(){
    clearInterval(interval);
}

function resetTimer(){
    clearInterval(interval);
    timeLeft = timerTypeOptions[timerType];
    updateTimer();
}

function calcNextTimerType(){
    if(timerType == "Work"){
        workCount += 1;
        snackbarNotif();
        if(breakCount != 0 && breakCount % 3 === 0){
            switchTimerType("LongBreak");
        } else if(breakCount != 0 && breakCount % 4 === 0){
            alert("Pomodoro Session Complete! Great Job!")
        } else {
            switchTimerType("ShortBreak");
        }
    } else {
        breakCount += 1;
        snackbarNotif();
        switchTimerType("Work");
    }
}

function switchTimerType(type){
    timerType = type;
    resetTimer();
}

function snackbarNotif(){
    snackbarSetting = document.getElementById("snackbar");
    snackbarSetting.className = "show";
    setTimeout(function(){ snackbarSetting.className = snackbarSetting.className.replace("show", ""); }, 3000);
}

// ~ CALLS ~ 
startEl.addEventListener("click", startTimer)
pauseEl.addEventListener("click", pauseTimer)
resetEl.addEventListener("click", resetTimer)
