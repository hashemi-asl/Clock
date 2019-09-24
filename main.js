function btnClick1() {
    states[currentState].btnClick1();
}
function btnClick2() {
    states[currentState].btnClick2();
}
function btnClick3() {
    states[currentState].btnClick3();
}

let mode = false;
let currentState = 'clock';
let interval = null;

let states = {
    clock: {
        render: renderClock,
        clock: '<span>00</span>:<span>00</span>:<span>00</span><span></span>',
        controller: '<button onClick="btnClick1()">12/24</button><button onClick="btnClick2()">Stopwatch</button><button onClick="btnClick3()">Timer</button>',
        btnClick1: function(){
            mode = !mode;
            this.render();
        },
        btnClick2: function() {
            document.getElementById("clock").innerHTML = states.stopwatch.clock;
            document.getElementById("controller").innerHTML = states.stopwatch.controller;
            currentState='stopwatch';
            clearInterval(interval);
        },
        btnClick3: function() {
            currentState='timer';
            document.getElementById("clock").innerHTML = states.timer.clock;
            document.getElementById("controller").innerHTML = states.timer.controller;
            clearInterval(interval);
        }
    },
    stopwatch: {
        render: renderStopwatch,
        clock: '<span>00</span>:<span>00</span>:<span>00</span><span></span>',
        controller: '<button onClick="btnClick1()">Back</button><button onClick="btnClick2()">Start</button>',
        btnClick1: function() {
            document.getElementById("clock").innerHTML = states.clock.clock;
            document.getElementById("controller").innerHTML = states.clock.controller;
            currentState='clock';
            clearInterval(interval);
            liveClock();
        },
        btnClick2: function() {
            document.getElementById("controller").innerHTML = states.stopwatchRun.controller;
            currentState='stopwatchRun';
            states.stopwatch.startTime = new Date();
            liveStopwatch();
        }
    },
    stopwatchRun: {
        controller: '<button onClick="btnClick1()">Stop</button><button onClick="btnClick2()">Lap</button>',
        btnClick1: function(){
            document.getElementById("controller").innerHTML = states.stopwatchStop.controller;
            currentState='stopwatchStop';
            clearInterval(interval);
        },
        btnClick2: function() {
            const lap = Math.floor((new Date() - states.stopwatch.startTime)/10);
            const [hour,min,sec,cSec] = convertToClockStyle(lap);
            const newNode = document.getElementById('laps') || document.createElement('div');
            newNode.id = 'laps';
            newNode.innerHTML += `<div><span>${hour.toLocaleString('en',{minimumIntegerDigits:2})}:${min.toLocaleString('en',{minimumIntegerDigits:2})}:${sec.toLocaleString('en',{minimumIntegerDigits:2})}</span><span>.${cSec.toLocaleString('en',{minimumIntegerDigits:2})}</span></div>`;
            document.body.insertBefore(newNode, document.getElementById("container").nextSibling);
        }
    },
    stopwatchStop: {
        controller: '<button onClick="btnClick1()">Resume</button><button onClick="btnClick2()">Restart</button>',
        btnClick1: function(){
            if (document.querySelector('#controller button:first-of-type').innerHTML === 'Resume'){
                document.querySelector('#controller button:first-of-type').innerHTML = 'Stop';
                liveStopwatch();

            } else {
                document.querySelector('#controller button:first-of-type').innerHTML = 'Resume';
                clearInterval(interval);
            }
        },
        btnClick2: function(){
            document.getElementById("clock").innerHTML = states.stopwatch.clock;
            document.getElementById("controller").innerHTML = states.stopwatch.controller;
            document.getElementById('laps').remove();
            currentState='stopwatch';
            clearInterval(interval);
        }
    },
    timer: {
        clock: '<span>00</span>:<span>00</span>:<span>59</span>',
        controller: '<button onClick="btnClick1()">Reset</button><button onClick="btnClick2()">Start</button>',
        btnClick1: function(){
            clearInterval(interval);
            document.getElementById("clock").innerHTML = states.timer.clock;
        },
        btnClick2: function(){
            const timeSplit = document.querySelectorAll("#clock > span");
            let count = ((timeSplit[0].innerText) * 3600) + ((timeSplit[1].innerText ) * 60) + +timeSplit[2].innerText;
            interval = setInterval(()=>{
                const hour = Math.floor(count / 3600);
                const min = Math.floor((count % 3600) / 60);
                const sec = count % 60;
                document.querySelector('#clock > span:nth-of-type(1)').innerText = `${hour.toLocaleString('en',{minimumIntegerDigits:2})}`;
                document.querySelector('#clock > span:nth-of-type(2)').innerText = `${min.toLocaleString('en',{minimumIntegerDigits:2})}`;
                document.querySelector('#clock > span:nth-of-type(3)').innerText = `${sec.toLocaleString('en',{minimumIntegerDigits:2})}`;
                if (!count--){
                    clearInterval(interval);
                }
            },1000);
        }
    }
}
function convertToTimerStyle(counter) {
    const hour =  Math.floor(counter / 3600);
    const min =   Math.floor((counter % 3600) / 60);
    const sec =   counter % 60;
    return [hour,min,sec];
}

function liveClock() {
    states.clock.render();
    interval = setInterval(()=>{
        states.clock.render();
    },1000);
}


function liveStopwatch() {
    interval = setInterval(()=>{
        states.stopwatch.render();
    },10);
}

function renderClock() {
    const now = new Date();
    const hour = now.getHours();
    [mode ? (hour > 12 ? hour - 12 : hour) : hour ,now.getMinutes(),now.getSeconds()].forEach((item,index)=>{
        if (item.toLocaleString('en',{minimumIntegerDigits:2}) !== document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText){
            document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText = item.toLocaleString('en',{minimumIntegerDigits:2});
        }
    })
    document.querySelector('#clock>span:last-of-type').innerText = mode ? (hour >= 12 ? 'pm' : 'am') : '';
}

function renderStopwatch() {
    const counter = Math.floor((new Date() - states.stopwatch.startTime) / 10);
    convertToClockStyle(counter).forEach((item,index)=>{
        if (item.toLocaleString('en',{minimumIntegerDigits:2}) !== document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText){
            document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText = item.toLocaleString('en',{minimumIntegerDigits:2});
        }
    })
}

// function renderTimer(){

// }
function convertToClockStyle(counter) {
    const cSec = counter % 100;
    const counterSec = (counter - cSec) / 100; //Math.floor(states.stopwatch.counter / 1000)
    const hour =  Math.floor(counterSec / 3600);
    const min =   Math.floor((counterSec % 3600) / 60);
    const sec =   counterSec % 60;
    return [hour,min,sec,cSec];
}


document.body.onload = liveClock;