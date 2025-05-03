// ~ CONSTS ~
const timerEl = document.getElementById("timer")
const timerTypeEl = document.getElementById("timerType")
const startEl = document.getElementById("start")
const pauseEl = document.getElementById("pause")
const resetEl = document.getElementById("reset")
const restartSessionEl = document.getElementById("restartSession")

const mainContainerEl = document.getElementById("mainContainer")
const sidebarEl = document.getElementById("sidebar")
const openSidebarEl = document.getElementById("openSidebarButton") 
const closeSidebarEl = document.getElementById("closeSidebarButton") 

const length25El = document.getElementById("length25")
const length50El = document.getElementById("length50")

const magicAlertEl = document.getElementById("magic")
const bonusAlertEl = document.getElementById("bonus")

const tadaAlertEl = document.getElementById("tada")
const birthdayAlertEl = document.getElementById("birthday")

const previewSoundEl = document.getElementById("preview")

const fiveSunnyWorkEl = document.getElementById("fiveSunny")
const jazzCoffeeWorkEl = document.getElementById("jazzCoffee")

const fireplaceBreakEl = document.getElementById("fireplace")
const forestBirdsBreakEl = document.getElementById("forestBirds")

const backgroundTypes = [
    'blanchedAlmond',
    'varietyPhoto'
]

const blanchedAlmondEl = document.getElementById("blanchedAlmond")
const varietyPhotoEl = document.getElementById("varietyPhoto")

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
let sectionAlert = "magicAlert";
let sectionPath = `assets/sounds/alerts/section/${sectionAlert}.mp3`;
let sessionAlert = "tadaAlert";
let sessionPath = `assets/sounds/alerts/session/${sessionAlert}.mp3`;

let workPath = `assets/sounds/work/fiveSunny.mp3`;
let workSound = new Audio(workPath);
workSound.loop = true;

let breakPath = `assets/sounds/break/fireplace.mp3`;
let breakSound = new Audio(breakPath);
breakSound.loop = true;


// ~ VARS ~
var timerTypeOptions = {
    Work: lengthChoice * 60,
    ShortBreak: lengthChoice * (1/5) * 60,
    LongBreak: lengthChoice * (3/5) * 60
}

var dropdown = document.getElementsByClassName("dropdownButton");
var i;


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

    if (timerType == "Work"){
        playWorkSound(workPath);
        sound = workSound;
    }

    else if (timerType == "ShortBreak" || timerType == "LongBreak"){
        playBreakSound(breakPath);
        sound = breakSound;
    }
    interval = setInterval(()=>{
        timeLeft--;
        updateTimer();
        if(timeLeft === 0){
            clearInterval(interval);
            stopPlaying(sound);
            calcNextTimerType();
            updateTimer();
        }
    }, 10)      // 1000 for actual, 10 for testing
    updateControlButtons(true);
}

function pauseTimer(){
    clearInterval(interval);
    stopPlaying(sound);
    updateControlButtons(false);
}

function resetTimer(){
    clearInterval(interval);
    stopPlaying(sound);
    timeLeft = timerTypeOptions[timerType];
    updateTimer();
    updateControlButtons(false);
}

function restartSession(){
    let confirmRestart = "Press confirm you want to restart the entire pomodoro session! This cannot be undone.";
    if(confirm(confirmRestart) == true){
        clearInterval(interval);
        stopPlaying(sound);
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
        console.log(sessionStarted);
    }
}

// switching functions
function calcNextTimerType(){
    if(timerType == "Work"){
        workCount ++;
        playAlertSound(sectionPath);
        snackbarNotif(timerType, workCount);
        if(shortBreakCount != 0 && shortBreakCount % 3 === 0){
            switchTimerType("LongBreak");
        } else {
            switchTimerType("ShortBreak");
        }
    } else if(timerType == "ShortBreak"){
        shortBreakCount ++;
        totalBreakCount ++;
        playAlertSound(sectionPath);
        snackbarNotif(timerType, shortBreakCount);
        switchTimerType("Work");
    } else if(timerType == "LongBreak"){
        playAlertSound(sessionPath);
        sessionCount ++;
        alert(`Pomodoro Session ${sessionCount} Complete! Great Job!`)
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
    var length25Button = document.querySelector(".lengthControl.ver25");
    var length50Button = document.querySelector(".lengthControl.ver50");

    if(isrunning){
        startButton.disabled = true;
        pauseButton.disabled = false;
        length25Button.disabled = true;
        length50Button.disabled = true;
    } else if(!isrunning){
        startButton.disabled = false;
        pauseButton.disabled = true;
        if(sessionStarted){
            length25Button.disabled = true;
            length50Button.disabled = true;
        } else if(!sessionStarted){
            length25Button.disabled = false;
            length50Button.disabled = false;
        }

        }
    }

// sidebar control functions
function openSidebar(){
    sidebarEl.style.width = "250px";
}

function closeSidebar(){
    sidebarEl.style.width = "0px";
}

// sidebar dropdown organization
for (i = 0; i < dropdown.length; i++){

    dropdown[i].addEventListener("click", function(){
        var dropdownContent = this.nextElementSibling;
        if(dropdownContent.style.display === "block"){
            dropdownContent.style.display = "none";
        } else{
            dropdownContent.style.display = "block";
        }
    });
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
    updateControlButtons(false);
}

// alerts
function playAlertSound(path){
    const alertSound = new Audio(path);
    alertSound.play().catch(error => {
        console.error("Trouble playing alert:", error);
    });
}

function setSectionAlertSound(sectionAlert){
    sectionPath = `assets/sounds/alerts/section/${sectionAlert}.mp3`;
    playAlertSound(sectionPath);
}

function setSessionAlertSound(sessionAlert){
    sessionPath = `assets/sounds/alerts/session/${sessionAlert}.mp3`;
    playAlertSound(sessionPath);
}

// work sounds
function playWorkSound(path){
    if (workSound.src !== path){
        workSound.pause();
        workSound = new Audio(path);
        workSound.loop = true;
    }
    workSound.play().catch(error => {
        console.error("Touble playing work sound:", error);
    });
}

function setWorkSound(workSound){
    workPath = `assets/sounds/work/${workSound}.mp3`;
    workSound = new Audio(workPath);
    workSound.loop = true;
    playPreview(workPath);
}


// break sounds

function playBreakSound(path){
    if (breakSound.src !== path){
        breakSound.pause();
        breakSound = new Audio(path);
        breakSound.loop = true;
    }
    breakSound.play().catch(error => {
        console.error("Trouble playing break sound:", error);
    });
}

function setBreakSound(breakSound){
    breakPath = `assets/sounds/break/${breakSound}.mp3`;
    breakSound = new Audio(breakPath);
    breakSound.loop = true;
    playPreview(breakPath);
}
// general sound functions
function playPreview(path){
    const previewSound = new Audio(path);
    previewSound.play().catch(error => {
        console.error("Trouble playing preview:", error)
    });

    setTimeout(() => {
        previewSound.pause();
        previewSound.currentTime = 0;
    }, 5000); // five seconds
}

function stopPlaying(sound){
    sound.pause();
    sound.currentTime = 0;
}

// background functions
function setBackground(background){
    document.body.classList.remove(...backgroundTypes);
    document.body.classList.add(`${background}`);
}

// ~ CALLS ~ 
// event listeners
startEl.addEventListener("click", startTimer)
pauseEl.addEventListener("click", pauseTimer)
resetEl.addEventListener("click", resetTimer)
restartSessionEl.addEventListener("click", restartSession)

openSidebarEl.addEventListener("click", openSidebar)
closeSidebarEl.addEventListener("click", closeSidebar)

length25El.addEventListener("click", length25)
length50El.addEventListener("click", length50)

magicAlertEl.addEventListener("click", function() {
    setSectionAlertSound("magicAlert");
});

bonusAlertEl.addEventListener("click", function() {
    setSectionAlertSound("bonusAlert");
});

tadaAlertEl.addEventListener("click", function() {
    setSessionAlertSound("tadaAlert");
});

birthdayAlertEl.addEventListener("click", function() {
    setSessionAlertSound("birthdayAlert");
});

fiveSunnyWorkEl.addEventListener("click", function(){
    setWorkSound("fiveSunny");
});

jazzCoffeeWorkEl.addEventListener("click", function(){
    setWorkSound("jazzCoffee");
});

fireplaceBreakEl.addEventListener("click", function(){
    setBreakSound("fireplace");
});

forestBirdsBreakEl.addEventListener("click", function(){
    setBreakSound("forestBirds");
});

blanchedAlmondEl.addEventListener("click", function(){
    setBackground("blanchedAlmond");
});

varietyPhotoEl.addEventListener("click", function(){
    setBackground("varietyPhoto");
});