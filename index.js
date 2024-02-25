var endTime;
var startTime;
var extraTimeEnabled = false;
var extraEndTime;
var endTimeFinFlag = false;
var extraEndTimeFinFlag = false;
var startTimeFlag = false;
var duration;

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
    //console.log("Clearing times and statuses")
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
}

function resetClock(event) {
    event.preventDefault();
    whiteBackground();
    if (!checkExtraTime()) {
        hideExtraTimeInfo();
    }
    clearTimesAndStatuses();
    resetGlobals();
    //console.log("Clock reset");
}

function getCurrentTime() {
    now = new Date();
    return now;
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
    } else if (extraTimeEnabled === true && now >= extraEndTime && extraEndTimeFinFlag === false) {
        extraEndTimeStatusSwitch();
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
        //console.log("Valid duration: " + duration);
        return true;
    }
}

function preflightChecks(event) {
    //console.log("Start button clicked");
    event.preventDefault();
    resetClock(event)
    var validSettings = validateSettings();
    if (validSettings) {
        //console.log("Starting exam");
        startExam();
    }
}

function checkExtraTime() {
    const checkbox = document.getElementById("extraTimeToggle");
    if (checkbox.checked == true) {
        extraTimeEnabled = true;
    } else {
        extraTimeEnabled = false;
    }
    return extraTimeEnabled;
    //console.log("Extra time enabled: " + extraTimeEnabled);
}

function calculateNextNearestMinute(date) {
    // Round given date to next nearest minute
    const coefficient = 1000 * 60;
    const roundedTime = new Date(Math.ceil(date.getTime() / coefficient) * coefficient);
    return roundedTime;
}

function startExam() {
    const extraTimeMultiplier = 1.25;
    checkExtraTime();
    var minutes = duration;
    startTime = getCurrentTime()
    startTime = calculateNextNearestMinute(startTime);
    var startTimeStr = timeToStr(startTime);
    //console.log("startTime: " + startTime);
    //console.log("startTimeStr: " + startTimeStr);

    endTime = addMinutes(startTime, minutes);
    var endTimeStr = timeToStr(endTime);
    //console.log("endTime: " + endTime);
    //console.log("endTimeStr: " + endTimeStr);

    var extraMinutes = minutes * extraTimeMultiplier;
    extraEndTime = addMinutes(startTime, extraMinutes);
    var extraEndTimeStr = timeToStr(extraEndTime);
    //console.log("extraEndTime: " + extraEndTime);
    //console.log("extraEndTimeStr: " + extraEndTimeStr);

    document.getElementById("startTime").textContent = startTimeStr;
    document.getElementById("endTime").textContent = endTimeStr;
    if (extraTimeEnabled) {
        showExtraTimeInfo();
        document.getElementById("extraEndTime").textContent = extraEndTimeStr;
    } else {
        hideExtraTimeInfo();
    }
}

