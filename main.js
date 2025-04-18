// ~ CONSTS ~
const startEl = document.getElementById("start")
const pauseEl = document.getElementById("pause")
const resetEl = document.getElementById("reset")
const timerEl = document.getElementById("timer")
const timerTypeEl = document.getElementById("timerType")

const lengthEl = document.getElementById("length")


// ~ LETS ~
let interval;
let lengthChoice = 25;
let timeLeft = lengthChoice * 60; // seconds
let workCount = 0;
let totalBreakCount = 0;
let shortBreakCount = 0;
let longBreakCount = 0;
let sessionCount = 0;
let timerType = "Work";
let snackbarMessage;

var timerTypeOptions = {
    Work: lengthChoice * 60,
    ShortBreak: lengthChoice * (1/5) * 60,
    LongBreak: lengthChoice * (3/5) * 60
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

// switching functions
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
        totalBreakCount += 1;
        snackbarNotif(timerType, shortBreakCount);
        switchTimerType("Work");
    } else if(timerType == "LongBreak"){
        alert("Pomodoro Session Complete! Great Job!")
        sessionCount += 1;
        workCount = 0;
        shortBreakCount = 0;
        longBreakCount = 0;
        totalBreakCount = 0;
        switchTimerType("Work");
    }
}

function switchTimerType(type){
    timerType = type;
    resetTimer();
}

// display & interactability functions
function snackbarNotif(name, count){
    snackbarSetting = document.getElementById("snackbar");
    snackbarMessage = `${name} Session ${(count)} Complete!`
    document.getElementById("snackbar").textContent = snackbarMessage
    snackbarSetting.className = "show";
    setTimeout(function(){ snackbarSetting.className = snackbarSetting.className.replace("show", ""); }, 3000);
}

// enable/disable buttons function
function updateControlButtons(isrunning){
    var startButton = document.querySelector(".timer-control.start");
    var pauseButton = document.querySelector(".timer-control.pause");
    var lengthButton = document.querySelector(".lengthControl");

    if(isrunning){
        startButton.disabled = true;
        pauseButton.disabled = false;
        lengthButton.disabled = true;
    } else{
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
    if(workCount != 0 && timerType != "Work"){
        lengthButton.disabled = true;
    } else if(workCount % 4 == 0 && timerType == "Work"){
        lengthButton.disabled = false;
    }
}

// choice functions
function chooseLength(){
    if(lengthChoice === 25){
        lengthChoice = 50;
    } else if(lengthChoice === 50){
        lengthChoice = 25;
    }
    timeLeft = lengthChoice * 60;
    timerTypeOptions.Work = lengthChoice * 60;
    timerTypeOptions.ShortBreak = lengthChoice * (1/5) * 60;
    timerTypeOptions.LongBreak = lengthChoice * (3/5) * 60;
    updateTimer();
    
}


// ~ CALLS ~ 
// event listeners
startEl.addEventListener("click", startTimer)
pauseEl.addEventListener("click", pauseTimer)
resetEl.addEventListener("click", resetTimer)


lengthEl.addEventListener("click", chooseLength)