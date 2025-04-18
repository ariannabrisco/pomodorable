// ~ CONSTS ~
const timerEl = document.getElementById("timer")
const timerTypeEl = document.getElementById("timerType")
const startEl = document.getElementById("start")
const pauseEl = document.getElementById("pause")
const resetEl = document.getElementById("reset")
const restartSessionEl = document.getElementById("restartSession")

const length25El = document.getElementById("25")
const length50El = document.getElementById("50")


// ~ LETS ~
let interval;
let sessionStarted = false;
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
    timerEl.innerHTML = formattedTime;

    if(timerType == "Work"){
        timerTypeEl.innerHTML = `${timerType} ${workCount+1}`;
    } else if(timerType == "ShortBreak"){
        timerTypeEl.innerHTML = `${timerType} ${shortBreakCount+1}`;
    } else if(timerType == "LongBreak"){
        timerTypeEl.innerHTML = `${timerType} ${longBreakCount+1}`;
    }
}

function startTimer(){
    sessionStarted = true;
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

function restartSession(){
    let confirmRestart = "Press confirm you want to restart the entire pomodoro session! This cannot be undone.";
    if(confirm(confirmRestart) == true){
        clearInterval(interval);
        workCount = 0;
        shortBreakCount = 0;
        longBreakCount = 0;
        totalBreakCount = 0;
        sessionStarted = false;
        if(sessionCount != 0){
            sessionCount--;
        }
        switchTimerType("Work");
        updateControlButtons(false);
    }
}

// switching functions
function calcNextTimerType(){
    if(timerType == "Work"){
        workCount ++;
        snackbarNotif(timerType, workCount);
        if(shortBreakCount != 0 && shortBreakCount % 3 === 0){
            switchTimerType("LongBreak");
        } else {
            switchTimerType("ShortBreak");
        }
    } else if(timerType == "ShortBreak"){
        shortBreakCount ++;
        totalBreakCount ++;
        snackbarNotif(timerType, shortBreakCount);
        switchTimerType("Work");
    } else if(timerType == "LongBreak"){
        alert("Pomodoro Session Complete! Great Job!")
        sessionCount ++;
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
    var lengthButtons = document.querySelectorAll(".lengthControl");

    if(isrunning){
        startButton.disabled = true;
        pauseButton.disabled = false;
        lengthButtons.disabled = true;
    } else{
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
    if(workCount != 0 && timerType != "Work"){
        lengthButtons.disabled = true;
    } else if(workCount % 4 == 0 && timerType == "Work"){
        lengthButtons.disabled = false;
    }
}

// choice functions
function length50(){
    lengthChoice = 50;
    timeLeft = lengthChoice * 60;
    timerTypeOptions.Work = lengthChoice * 60;
    timerTypeOptions.ShortBreak = lengthChoice * (1/5) * 60;
    timerTypeOptions.LongBreak = lengthChoice * (3/5) * 60;
    updateTimer();
}

function length25(){
    lengthChoice = 25;
    timeLeft = lengthChoice * 60;
    timerTypeOptions.Work = lengthChoice * 60;
    timerTypeOptions.ShortBreak = lengthChoice * (1/5) * 60;
    timerTypeOptions.LongBreak = lengthChoice * (3/5) * 60;
    updateTimer();
}


// sidebar functions
var dropdown = document.getElementsByClassName("dropdownButton");
var i;

for (i = 0; i < dropdown.length; i++){
    dropdown[i].addEventListener("click", function(){
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if(dropdownContent.style.display === "block"){
            dropdownContent.style.display = "none";
        } else{
            dropdownContent.style.display = "block";
        }
    });
}
// ~ CALLS ~ 
// event listeners
startEl.addEventListener("click", startTimer)
pauseEl.addEventListener("click", pauseTimer)
resetEl.addEventListener("click", resetTimer)
restartSessionEl.addEventListener("click", restartSession)

length25El.addEventListener("click", length25)
length50El.addEventListener("click", length50)

