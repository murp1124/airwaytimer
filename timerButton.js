let startTime;
let timerInterval;

function startTimer() {

    startTime = Date.now();
    updateStartTime();
    updateElapsedTime();
    timerInterval = setInterval(updateElapsedTime, 100);

    document.getElementById('firstRSIPush').textContent = 'Reset Timer';
    document.getElementById('firstRSIPush').style.backgroundColor = 'rgb(233, 102, 102)';

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

    const milliseconds = Date.now() - startTime;
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds %60000) / 1000);
    return { hours, minutes, seconds };
}


let taps = 0;
document.getElementById('firstRSIPush').addEventListener('click', function() {
  
    taps++;

    if (this.textContent === 'RSI Meds Pushed') {
        startTimer();
        this.style.backgroundColor = 'rgb(255, 80, 80)';
        taps = 0;
    } else if (taps === 1) {
        this.textContent = 'Confirm Reset';
        this.style.backgroundColor = 'rgb(255, 110, 250)';
        setTimeout(() => {
            taps = 0;
            this.textContent = 'Reset Timer';
            this.style.backgroundColor = 'rgb(255, 80, 80)';
        }, 3000);
    } else if (taps === 2) {
        this.style.backgroundColor = '';
        window.parent.location = window.parent.location.href;
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

    const five_minutes = 15000;
    const ping = new Audio('https://github.com/murp1124/airwaytimer/raw/refs/heads/main/Sounds/beep_short_on.wav')
    const glowEffect = document.querySelector('.borderGlow');

    for (let i = 0; i < 6; i++) {
        setTimeout(() => {

            ping.play();
            
            glowEffect.classList.add('glow-active');
            setTimeout(() => {
                glowEffect.classList.remove('glow-active');
            }, 6000);

            for (let pings = 0; pings < 3; pings++) {

                setTimeout(() => {
                    ping.play();
                }, 1500 * (pings + 1));

                glowEffect.classList.add('glow-active');
                setTimeout(() => {
                    glowEffect.classList.remove('glow-active');
                }, 10000);
            }

        }, five_minutes * (i + 1));
    }
});
