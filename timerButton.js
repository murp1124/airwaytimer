let startTime;
let timerInterval;


function initFromURL() {

    const currState = new URLSearchParams(window.location.search);
    const savedStartTime = currState.get('startTime');
    
    if (savedStartTime) {
        startTime = parseInt(savedStartTime);
        timerInterval = setInterval(updateElapsedTime, 100);
        document.getElementById('firstRSIPush').textContent = 'Reset Timer';
        document.getElementById('firstRSIPush').style.backgroundColor = 'rgb(233, 102, 102)';
       
        const options = {

            timeZone: "America/Chicago",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        };

        const startTimeStr = new Date(startTime);
        const test = startTimeStr.toLocaleString('en-US', options);
        document.getElementById('startTimeValue').textContent = test;

        updateElapsedTime();

        switchButton1.disabled = false;
    }

    const bladeInserted = currState.get('bladeInserted');

    if (bladeInserted === "true") {
        const bladeInsertTime = currState.get('bladeInsertTime');
        const bladeElapsedTime = currState.get('bladeElapsedTime');

        document.getElementById('bladeInsertedValue').textContent = 
            `~T+${bladeElapsedTime} at ${bladeInsertTime} CST`;
        document.getElementById('switchButton1').style.color = 'black';
        switchButton1.disabled = true;
        switchButton2.disabled = false;

    }

    const bladeRemoved = currState.get('bladeRemoved');

    if (bladeRemoved === "true") {
        const bladeRemovalTime = currState.get('bladeRemovalTime');
        const bladeRemElapsedTime = currState.get('bladeRemElapsedTime');

        document.getElementById('bladeRemovedValue').textContent = 
            `~T+${bladeRemElapsedTime} at ${bladeRemovalTime} CST`;
        document.getElementById('switchButton2').style.color = 'black';
        switchButton2.disabled = true;
        switchButton3.disabled = false;

    }

    const breathDelivered = currState.get('breathDelivered');

    if (breathDelivered === "true") {
        const breathDeliveredTime = currState.get('breathDeliveredTime');
        const breathElapsedTime = currState.get('breathElapsedTime');
        const progressBoxes = currState.get('progressBoxes');

        document.getElementById('breathDeliveredValue').textContent = 
            `~T+${breathElapsedTime} at ${breathDeliveredTime} CST`;
        document.getElementById('switchButton3').style.color = 'black';
        switchButton3.disabled = true;

        for (let box = 1; box <= 5; box ++) {
            document.getElementById(`box${box}`).style.backgroundColor = "#cccccc";
            document.getElementById('dataProgressBar').animate([
                {
                    opacity: 0
                },
                {
                    opacity: 0.3
                },
                {
                    opacity: 1
                }], {duration: 1000});
        }

        const boxesStr = progressBoxes || -1;
        const boxes = parseInt(boxesStr)

        const five_minutes = 5 * 60 * 1000;
        const ping = new Audio('https://github.com/murp1124/airwaytimer/raw/refs/heads/main/Sounds/beep_short_on.wav')
        const glowEffect = document.querySelector('.borderGlow');
    
        const breathTime = new Date(startTime + parseTimeString(breathElapsedTime) * 1000);
        const lastBreathTime = Date.now() - breathTime.getTime();
        const alignment = lastBreathTime % five_minutes;
        const nextBoxTime = five_minutes - alignment;

        
        if (boxes >= 0) {
            for (let i = 0; i <= boxes; i++) {
                document.getElementById(`box${i + 1}`).style.backgroundColor = "#50C878";
            }
        }

        // Refactor this beast some other day *phewwww*

        if (boxes === -1) {

            for (let i = 0; i < 5; i++) {

                currBox = boxes + 1
                const delayVal = i === currBox ?
                    nextBoxTime : nextBoxTime + (i - currBox) * five_minutes;

                setTimeout(() => {
                    for (let pings = 0; pings < 3; pings++) {
                        setTimeout(() => {
                            if (document.getElementById('soundToggle').checked) {
                                ping.play();
                            }
                            glowEffect.classList.add('glow-active');                    
                            setTimeout(() => {
                                glowEffect.classList.remove('glow-active');
                            }, 1000);
                        }, 1500 * pings);
                    }

                   document.getElementById(`box${i+1}`).style.backgroundColor = "#50C878";

                }, delayVal);
            }

        } else {
    
            currBox = boxes + 1
            for (let i = currBox; i < 5; i++) {
    
                const delayVal = i === currBox ?
                    nextBoxTime : nextBoxTime + (i - currBox) * five_minutes;
    
                setTimeout(() => {
                    for (let pings = 0; pings < 3; pings++) {
                        setTimeout(() => {
                            if (document.getElementById('soundToggle').checked) {
                                ping.play();
                            }
                            glowEffect.classList.add('glow-active');                    
                            setTimeout(() => {
                                glowEffect.classList.remove('glow-active');
                            }, 1000);
                        }, 1500 * pings);
                    }
        
                    document.getElementById(`box${i+1}`).style.backgroundColor = "#50C878";
    
                }, delayVal);
            }
        }
    }

    function parseTimeString(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

}


function startTimer() {

    startTime = Date.now();
    updateStartTime();
    updateElapsedTime();
    timerInterval = setInterval(updateElapsedTime, 100);

    document.getElementById('firstRSIPush').textContent = 'Reset Timer';
    document.getElementById('firstRSIPush').style.backgroundColor = 'rgb(233, 102, 102)';

    switchButton1.disabled = false;

    const url = new URL(window.location);
    url.searchParams.set('startTime', startTime.toString());
    window.history.pushState({}, '', url);
}


function updateStartTime() {

    const options = {

        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    const cstTime = getCurrTime(undefined, options);
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

    // Ensures T+ output is accurate relative to 
    // recorded Start Time and Elapsed Time.
    const roundedSecs = Math.floor(milliseconds / 1000);

    const hours = Math.floor(roundedSecs / 3600);
    const minutes = Math.floor((roundedSecs % 3600) / 60);
    const seconds = roundedSecs % 60;

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
        initFromURL(true);
        this.style.backgroundColor = '';
        const baseURL = window.location.href.split('?')[0];
        window.parent.location = baseURL;
    }
});


function recordTime() {

    // Ensures T+ output is accurate relative to 
    // recorded Start Time and Elapsed Time.
    const milliseconds = Date.now() - startTime;
    const roundedMilli = Math.floor(milliseconds / 1000) * 1000;
    const currDate = new Date(Date.now() + roundedMilli - milliseconds); // Sheesh...

    const options = {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    const currTimeStr = getCurrTime(currDate, options);

    const {hours, minutes, seconds} = getTimeComponents();
    const elapsedTimeStr = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    
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

    const url = new URL(window.location);
    url.searchParams.set('bladeInserted', 'true');
    url.searchParams.set('bladeInsertTime', currTimeStr);
    url.searchParams.set('bladeElapsedTime', elapsedTimeStr);
    window.history.pushState({}, '', url);

});

switchButton2.addEventListener('click', function() {
   
    const {elapsedTimeStr, currTimeStr} = recordTime();
    document.getElementById('bladeRemovedValue').textContent = " ~T+" + elapsedTimeStr + " at " + currTimeStr + " CST";
    document.getElementById('switchButton2').style.color = 'black';
    switchButton2.disabled = true;
    switchButton3.disabled = false;

    const url = new URL(window.location);
    url.searchParams.set('bladeRemoved', true);
    url.searchParams.set('bladeRemovalTime', currTimeStr);
    url.searchParams.set('bladeRemElapsedTime', elapsedTimeStr);
    window.history.pushState({}, '', url);

});

switchButton3.addEventListener('click', function() {

    for (let box = 1; box <= 5; box ++) {
        document.getElementById(`box${box}`).style.backgroundColor = "#cccccc";
        document.getElementById('dataProgressBar').animate([
            {
                opacity: 0
            },
            {
                opacity: 0.3
            },
            {
                opacity: 1
            }], {duration: 1000});
    }
   
    const {elapsedTimeStr, currTimeStr} = recordTime();
    document.getElementById('breathDeliveredValue').textContent = " ~T+" + elapsedTimeStr + " at " + currTimeStr + " CST";
    document.getElementById('switchButton3').style.color = 'black';
    switchButton3.disabled = true;

    const url = new URL(window.location);
    url.searchParams.set('breathDelivered', 'true');
    url.searchParams.set('breathDeliveredTime', currTimeStr);
    url.searchParams.set('breathElapsedTime', elapsedTimeStr);
    window.history.pushState({}, '', url)

    const five_minutes = 5 * 60 * 1000;
    const ping = new Audio('https://github.com/murp1124/airwaytimer/raw/refs/heads/main/Sounds/beep_short_on.wav')
    const glowEffect = document.querySelector('.borderGlow');

    for (let i = 0; i < 5; i++) {

        setTimeout(() => {

            document.getElementById(`box${i+1}`).style.backgroundColor = "#50C878";
            url.searchParams.set('progressBoxes', i.toString());
            window.history.pushState({}, '', url);

            for (let pings = 0; pings < 3; pings++) {
                setTimeout(() => {
                    if (document.getElementById('soundToggle').checked) {
                        ping.play();
                    }
                    glowEffect.classList.add('glow-active');                    
                    setTimeout(() => {
                        glowEffect.classList.remove('glow-active');
                    }, 1000);
                }, 1500 * pings);
            }

        }, five_minutes * (i + 1));
    }
});


document.addEventListener('DOMContentLoaded', initFromURL);