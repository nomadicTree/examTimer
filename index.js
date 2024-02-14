var endTime;
var extraTimeEnabled = false;
var extraEndTime;
var endTimeFinFlag = false;
var extraEndTimeFinFlag = false;
var duration;

function blackBackground() {
    var element = document.getElementsByTagName("body")[0];
    element.style.backgroundColor = "black";
    element.style.color = "white";
    console.log("Background set to black")
}

function whiteBackground() {
    var element = document.getElementsByTagName("body")[0];
    element.style.backgroundColor = "white";
    element.style.color = "black";
    console.log("Background set to white")
}

function resetClock(event) {
    console.log("Reset button clicked")
    event.preventDefault();

    blackBackground();
    document.getElementById("startTime").innerText = "";
    document.getElementById("endTime").innerText = "";
    document.getElementById("extraEndTime").innerText = "";
    endTime = undefined;
    endTimeFinFlag = false;
    extraEndTimeFinFlag = false;
    console.log("Clock reset");
}

function getCurrentTime() {
    now = new Date();
    return now;
}

function addMinutes(date, minutes) {
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

function updateTime() {
    var now = getCurrentTime();
    var clockStr = timeToStr(now);
    if (now >= endTime && endTimeFinFlag === false) {
        console.log("Time elapsed")
        whiteBackground();
        document.getElementById("endTime").insertAdjacentHTML("beforeend", "<div>Fin</div>");
        endTimeFinFlag = true;
    } else if (extraTimeEnabled === true && now >= extraEndTime && extraEndTimeFinFlag === false) {
        console.log("Extra time elapsed")
        blackBackground();
        document.getElementById("extraEndTime").insertAdjacentHTML("beforeend", "<div>Fin</div>");
        extraEndTimeFinFlag = true;
    }

    document.getElementById("clock").innerText = clockStr;
    setTimeout(updateTime, 10);
}

function validateSettings() {
    duration = document.forms["examSettings"].duration.value;
    if (duration == null || duration == "" || duration < 0) {
        console.error("Invalid duration: " + duration + "\nDuration must be greater than 0");
        return false;
    } else {
        console.log("Valid duration: " + duration);
        return true;
    }
}

function preflightChecks(event) {
    console.log("Start button clicked");
    event.preventDefault();
    resetClock(event)
    var validSettings = validateSettings();
    if (validSettings) {
        console.log("Starting exam");
        startExam();
    }
}

function checkExtraTime() {
    var checkbox = document.getElementById("extraTimeToggle");
    if (checkbox.checked == true) {
        extraTimeEnabled = true;
    } else {
        extraTimeEnabled = false;
    }
    console.log("Extra time enabled: " + extraTimeEnabled);
}

function startExam() {
    const extraTimeMultiplier = 1.25;
    checkExtraTime();
    var minutes = duration;
    var startTime = getCurrentTime()
    var startTimeStr = timeToStr(startTime);
    console.log("startTime: " + startTime);
    console.log("startTimeStr: " + startTimeStr);

    endTime = addMinutes(startTime, minutes);
    var endTimeStr = timeToStr(endTime);
    console.log("endTime: " + endTime);
    console.log("endTimeStr: " + endTimeStr);

    var extraMinutes = minutes * extraTimeMultiplier;
    extraEndTime = addMinutes(startTime, extraMinutes);
    var extraEndTimeStr = timeToStr(extraEndTime);
    console.log("extraEndTime: " + extraEndTime);
    console.log("extraEndTimeStr: " + extraEndTimeStr);

    document.getElementById("startTime").innerText = startTimeStr;
    document.getElementById("endTime").innerText = endTimeStr;
    if (extraTimeEnabled) {
        document.getElementById("extraEndTime").innerText = extraEndTimeStr;
    }
}

