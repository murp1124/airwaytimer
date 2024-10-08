let startTime;
let timerInterval;


function startTimer() {

    startTime = Date.now();
    updateStartTime();
    updateElapsedTime();
    timerInterval = setInterval(updateElapsedTime, 100);

    document.getElementById('firstRSIPush').textContent = 'Reset Timer';

    document.getElementById('firstRSIPush').addEventListener('mouseover', () => {
        document.getElementById('firstRSIPush').style.backgroundColor = 'rgb(233, 102, 102)';
    });

    document.getElementById('firstRSIPush').addEventListener('mouseout', () => {
        document.getElementById('firstRSIPush').style.backgroundColor = 'rgb(233, 102, 102)';
    });


    switchButton1.disabled = false;
}


function updateStartTime() {
    const cstTime = getCurrTime();
    document.getElementById('startTimeValue').textContent = cstTime;
}


function getCurrTime(date = new Date(), options = {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false}) {

    return date.toLocaleString('en-US', options);
}


function updateElapsedTime() {

    const {hours, minutes, seconds } = getTimeComponents();

    document.getElementById('elapsedTimeValue').textContent =
        `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}


function padZero(num) {

    return num.toString().padStart(2, '0');
}


function getTimeComponents() {
;
    const milliseconds = Date.now() - startTime;
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds %60000) / 1000);
    return { hours, minutes, seconds };
}


function resetTimer() {


    startTime = null;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    };

    document.getElementById('firstRSIPush').style.color = '';;
    document.getElementById('switchButton1').style.color = '';
    document.getElementById('switchButton2').style.color = '';
    document.getElementById('switchButton3').style.color = '';

    clearInterval(timerInterval);
    document.getElementById('elapsedTimeValue').textContent = "00:00:00";
    document.getElementById('startTimeValue').textContent = "N/A";
    document.getElementById('firstRSIPush').textContent = "RSI Meds Pushed";
    
    document.getElementById('firstRSIPush').addEventListener('mouseover', () => {
        document.getElementById('firstRSIPush').style.backgroundColor = '';
    });

    document.getElementById('firstRSIPush').addEventListener('mouseout', () => {
        document.getElementById('firstRSIPush').style.backgroundColor = '';
    });

    switchButton1.disabled = true;
    document.getElementById('bladeInsertedValue').textContent = "";

    switchButton2.disabled = true;
    document.getElementById('bladeRemovedValue').textContent = "";

    switchButton2.disabled = true;
    document.getElementById('breathDeliveredValue').textContent = "";
};

document.getElementById('firstRSIPush').addEventListener('click', function() {
    if (this.textContent === 'RSI Meds Pushed') {
        startTimer();
    } else {
        resetTimer();
    }
});


function recordTime() {

    const options = {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    };

    const currTimeStr = getCurrTime(new Date(), options);

    const {hours, minutes, seconds} = getTimeComponents();
    const elapsedTimeStr = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}` 
    
    return { elapsedTimeStr, currTimeStr };
}


const switchButton1 = document.getElementById('switchButton1');
switchButton1.disabled = true;

const switchButton2 = document.getElementById('switchButton2');
switchButton2.disabled = true;

const switchButton3 = document.getElementById('switchButton3');
switchButton3.disabled = true;

switchButton1.addEventListener('click', function() {
    const {elapsedTimeStr, currTimeStr} = recordTime();
    document.getElementById('bladeInsertedValue').textContent = " ~T+" + elapsedTimeStr + " at " + currTimeStr + " CST";
    document.getElementById('switchButton1').style.color = 'black';
    switchButton1.disabled = true;
    switchButton2.disabled = false;
});

switchButton2.addEventListener('click', function() {
    const {elapsedTimeStr, currTimeStr} = recordTime();
    document.getElementById('bladeRemovedValue').textContent = " ~T+" + elapsedTimeStr + " at " + currTimeStr + " CST";
    document.getElementById('switchButton2').style.color = 'black';
    switchButton2.disabled = true;
    switchButton3.disabled = false;

});

switchButton3.addEventListener('click', function() {
    const {elapsedTimeStr, currTimeStr} = recordTime();
    document.getElementById('breathDeliveredValue').textContent = " ~T+" + elapsedTimeStr + " at " + currTimeStr + " CST";
    document.getElementById('switchButton3').style.color = 'black';
    switchButton3.disabled = true;
});
