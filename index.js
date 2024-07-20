var endTime;
var startTime;
var extraTimeEnabled = false;
var extraEndTime;
var endTimeFinFlag = false;
var extraEndTimeFinFlag = false;
var startTimeFlag = false;
var duration;
var timerRunning = false;

function getCurrentTime() {
    now = new Date();
    return now;
}

function whiteBackground() {
    const whitebgCSS = 'whitebg.css';
    const colors = document.getElementById('colors');
    colors.setAttribute('href', whitebgCSS);
}

function blackBackground() {
    const blackbgCSS = 'blackbg.css';
    colors.setAttribute('href', blackbgCSS);
}

function replaceWithNbsp(element) {
    element.innerHTML = "&nbsp;";
}

function clearTimesAndStatuses() {
    const elementIds = ["startTime", "endTime", "endTimeStatus", "extraEndTime", "extraEndTimeStatus"];
    for (elementId of elementIds) {
        replaceWithNbsp(document.getElementById(elementId));
    }
}

function resetGlobals() {
    endTime = undefined;
    extraEndTime = undefined;
    endTimeFinFlag = false;
    extraEndTimeFinFlag = false;
    startTimeFlag = false;
    startTime = undefined;
    timerRunning = false;
}

function resetClock(event) {
    event.preventDefault();
    whiteBackground();
    if (!checkExtraTime()) {
        hideExtraTimeInfo();
    }
    clearTimesAndStatuses();
    resetGlobals();
}



function addMinutes(date, minutes) {
    // Add given number of minutes to date, return new date
    const millisecondsPerMinute = 60000;
    var newTime = new Date(date.getTime() + minutes * millisecondsPerMinute);
    return newTime;
}

function padWithLeadingZero(i) {
    // Add a leading 0 to a number if it is less than 10, e.g. 9 becomes 09
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function hideExtraTimeInfo() {
    const extraTimeInfoVisibility = document.getElementById('extraTimeInfo');
    extraTimeInfoVisibility.style.display = 'none';
}

function showExtraTimeInfo() {
    const extraTimeInfoVisibility = document.getElementById('extraTimeInfo');
    extraTimeInfoVisibility.style.display = 'block';
}

function timeToStr(time) {
    // Convert time to string in format hh:mm:ss
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    hours = padWithLeadingZero(hours);
    minutes = padWithLeadingZero(minutes);
    seconds = padWithLeadingZero(seconds);

    var clockStr = hours + ":" + minutes + ":" + seconds;
    return clockStr;
}

function endTimeStatusSwitch() {
    whiteBackground();
    var endTimeStatus = document.getElementById("endTimeStatus");
    endTimeStatus.textContent = "Fin";
    endTimeFinFlag = true;
}

function extraEndTimeStatusSwitch() {
    blackBackground();
    var extraEndTimeStatus = document.getElementById("extraEndTimeStatus");
    extraEndTimeStatus.textContent = "Fin";
    extraEndTimeFinFlag = true;

}

function startTimeStatusSwitch() {
    blackBackground();
    startTimeFlag = true;
}

function updateTime() {
    var now = getCurrentTime();
    if (now >= startTime && startTimeFlag === false) {
        startTimeStatusSwitch();
    }
    if (now >= endTime && endTimeFinFlag === false) {
        endTimeStatusSwitch();
        if (!extraTimeEnabled) {
            timerRunning = false;
            showSettingsMenu();
        }
    } else if (extraTimeEnabled === true && now >= extraEndTime && extraEndTimeFinFlag === false) {
        extraEndTimeStatusSwitch();
        timerRunning = false;
        showSettingsMenu();
    }
    var clockStr = timeToStr(now);
    document.getElementById("clock").textContent = clockStr;
    setTimeout(updateTime, 10);
}

function validateSettings() {
    duration = document.forms["examSettings"].duration.value;
    if (duration == null || duration == "" || duration <= 0) {
        var errorMessage = "Invalid duration: " + duration + "\nDuration must be greater than 0";
        console.error(errorMessage);
        alert(errorMessage);
        return false;
    } else {
        return true;
    }
}

function preflightChecks(event) {
    event.preventDefault();
    resetClock(event)
    var validSettings = validateSettings();
    if (validSettings) {
        startTimer(event);
    }
}

function checkExtraTime() {
    const checkbox = document.getElementById("extraTimeToggle");
    return checkbox.checked;
}

function calculateNextNearestMinute(date) {
    // Round given date to next nearest minute
    const coefficient = 1000 * 60;
    const roundedTime = new Date(Math.ceil(date.getTime() / coefficient) * coefficient);
    return roundedTime;
}

function startTimer(event) {
    const extraTimeMultiplier = 1.25;
    extraTimeEnabled = checkExtraTime();
    var minutes = duration;
    startTime = getCurrentTime()
    if (!event.shiftKey) { // If shift is held down, start the timer immediately
        startTime = calculateNextNearestMinute(startTime);
    }
    var startTimeStr = timeToStr(startTime);

    endTime = addMinutes(startTime, minutes);
    var endTimeStr = timeToStr(endTime);

    var extraMinutes = minutes * extraTimeMultiplier;
    extraEndTime = addMinutes(startTime, extraMinutes);
    var extraEndTimeStr = timeToStr(extraEndTime);

    document.getElementById("startTime").textContent = startTimeStr;
    document.getElementById("endTime").textContent = endTimeStr;
    if (extraTimeEnabled) {
        showExtraTimeInfo();
        document.getElementById("extraEndTime").textContent = extraEndTimeStr;
    } else {
        hideExtraTimeInfo();
    }
    timerRunning = true;
}

function showSettingsMenu() {
    const settingsMenu = document.querySelector('.settings');
    settingsMenu.style.transform = 'translateY(0)';
    settingsMenu.style.opacity = '1';
}

// toggle visibility of settings bar
document.addEventListener('DOMContentLoaded', () => {
    const settingsMenu = document.querySelector('.settings');

    let isSettingsVisible = true;

    document.addEventListener('mousemove', (event) => {
        if (timerRunning) { // Only hide settings if the timer is running
            if (event.clientY <= 50) {
                if (!isSettingsVisible) {
                    settingsMenu.style.transform = 'translateY(0)';
                    settingsMenu.style.opacity = '1';
                    isSettingsVisible = true;
                }
            } else {
                if (isSettingsVisible) {
                    settingsMenu.style.transform = 'translateY(-100%)';
                    settingsMenu.style.opacity = '0';
                    isSettingsVisible = false;
                }
            }
        }
    });
});

