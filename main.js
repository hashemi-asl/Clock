function ChangeType(){
console.log(1);
}

let mode = false;

function liveClock() {
    setInterval(()=>{
        const now= new Date();
        [now.getHours(),now.getMinutes(),now.getSeconds()].forEach((item , index)=>{
            document.querySelector(`#clock>span:nth-of-type(${index+1})`).innerText = item.toLocaleString('en', {minimumIntegerDigit:2})
        })
    },1000)
}

document.body.onload= liveClock;

 