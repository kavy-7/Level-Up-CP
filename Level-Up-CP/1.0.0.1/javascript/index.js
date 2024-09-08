var btnToday=document.querySelector(".btnToday");
var btnUpcoming=document.querySelector(".btnUpcoming");
var btnMain=document.querySelector(".btnMain");
var btnTarget=document.querySelector(".btnTarget");
var btnFil=document.querySelector(".btnFil");
var mainSection=document.querySelector(".mainSection");
var sectionDaily=document.querySelector(".sectionDaily");
var filSection=document.querySelector(".filSection");
var mainContent=document.querySelector(".mainContent");
var btnUserName=document.querySelector(".btnUserName");
var handleName=document.querySelector("#handleName");
var handleError=document.querySelector(".handleError")
var newUser=document.querySelector(".newUser");
var Target=document.querySelector(".Target");
var btnSetTarget=document.querySelector(".btnSetTarget");
var targetNum=document.querySelector("#targetNum");
var handleNumError=document.querySelector(".handleNumError");
var targetInput=document.querySelector(".targetInput");
var showTarget=document.querySelector(".showTarget");
var userTarget=document.querySelector(".userTarget");
var btnStop=document.querySelector(".btnStop");
var btnChangeUserName=document.querySelector(".btnChangeUserName");
var timer=document.querySelector(".timer");
var goBack=document.querySelector(".goBack");
var usernameChange=document.querySelector(".usernameChange");
var userName=document.querySelector(".userName");
// constant variables

var host_sites=['codeforces.com','codechef.com','atcoder.jp','leetcode.com','codingninjas.com/codestudio','hackerearth.com','geeksforgeeks.org','topcoder.com'];
var hosts = `codechef.com%2Ccodeforces.com%2Cgeeksforgeeks.org%2Chackerearth.com%2Cleetcode.com%2Ctopcoder.com%2Catcoder.jp%2Ccodingninjas.com/codestudio`;
var allcontest = false;
var contestsData;

// map for rendering logos

const logo = new Map();
logo.set('atcoder.jp', 'atcoder.png');
logo.set('leetcode.com', 'leetcode.png');
logo.set('topcoder.com', 'topcoder.png');
logo.set('codechef.com', 'codechef.png');
logo.set('codeforces.com', 'codeforces.png');
logo.set('hackerearth.com', 'HackerEarth.png');
logo.set('geeksforgeeks.org', 'GeeksforGeeks.png');
logo.set('codingninjas.com/codestudio', 'codingNinja.png'); 

// function to display timer

function updateTimer() {
    chrome.storage.local.get("stopTime", function (items) {
        // console.log(items.stopTime);
        if (items.stopTime) {
            // console.log("yes");
            let lastStopDate = new Date(items.stopTime);
            let stopDate=JSON.parse(localStorage.getItem("stopDate"));
            let currentTime = new Date();
            // console.log(typeof(stopDate));
            // console.log(currentTime.getDate());
            let diffTime = lastStopDate - currentTime;
            if (diffTime <=0 ) {
                timer.classList.add("hidden");
                chrome.storage.local.remove("stopTime");  
            } 
            else if(stopDate!==currentTime.getDate()){
                timer.classList.add("hidden");
                chrome.storage.local.remove("stopTime");  
            }
            else {
                let hours = Math.floor(diffTime / (60 * 60 * 1000));
                let minutes = Math.floor((diffTime % (60 * 60 * 1000)) / (60 * 1000));
                let seconds = Math.floor((diffTime % (60 * 1000)) / 1000);
                if (hours.toString().length === 1) {
                    hours = "0" + hours;
                }
                if (minutes.toString().length === 1) {
                    minutes = "0" + minutes;
                }
                if (seconds.toString().length === 1) {
                    seconds = "0" + seconds;
                }
                timer.innerHTML = ` <b> Redirecting to cf will again start in ${hours}:${minutes}:${seconds}</b>`;
                timer.classList.remove("hidden");
            }
        }
    });
}

setInterval(updateTimer, 1000); //to call the timer function every second on ui;

// to disable and enable the stop button

chrome.storage.local.get('stopDate', function (items) {
    const lastStopDate = items.stopDate;
    const todayDate = new Date().toDateString();
    // console.log(lastStopDate);
    // if the date when we used stop button is today then button should be disabled else not
    if (lastStopDate !== undefined && lastStopDate === todayDate) {
        btnStop.disabled = true;

    } else if (lastStopDate !== undefined && new Date(lastStopDate) < new Date(todayDate)) {  
        btnStop.disabled = false;
    }
});

// handling the click event of stop button

btnStop.addEventListener('click',()=>{
    btnStop.disabled = true;
    const currentDate = new Date();
    chrome.storage.local.set({stopDate: currentDate.toDateString()});
    localStorage.setItem("stopDate",JSON.stringify(currentDate.getDate()));
    chrome.storage.local.set({toComp:currentDate.getDate()});
    const updatedTime = new Date(currentDate.getTime() + (2* 60 * 1000));
    chrome.storage.local.set({stopTime: updatedTime.toString()});
})

// displaying the daily target

var alreadySetTarget=localStorage.getItem("dailyTarget");
if(alreadySetTarget!=="undefined" && alreadySetTarget!==null){
        alreadySetTarget=JSON.parse(localStorage.getItem("dailyTarget"));
        var alreadySetDate=new Date(JSON.parse(localStorage.getItem("targetDate")));
        var checkDate=new Date();
        // if already set date equals current date means the target set is for today 
        // hence rendering target
        // else we will render input field to enter target
        // console.log(alreadySetDate);
        // console.log(checkDate);
        if(alreadySetDate.getDate()===checkDate.getDate() && alreadySetDate.getMonth()===checkDate.getMonth() && alreadySetDate.getFullYear()===checkDate.getFullYear()){
            targetInput.classList.add("hidden");
                showTarget.classList.add("hidden");
                userTarget.innerHTML=`
           today's target is ${alreadySetTarget}  `
                userTarget.classList.remove("hidden");
                targetNum.setAttribute("disabled","true");
                targetNum.placeholder="Target already set";
        }
        else{
            targetInput.classList.remove("hidden");
            showTarget.classList.remove("hidden");
            userTarget.classList.add("hidden");
            targetNum.removeAttribute("disabled");
            targetNum.placeholder="Enter Target";
        }
}



// to get user to change username 
btnChangeUserName.addEventListener('click',()=>{
    user=JSON.parse(localStorage.getItem("handleName"));
    Target.classList.add("hidden");
    newUser.classList.add("hidden");
    usernameChange.innerHTML=`
        <div class="oldUser">Your old username is ${user}</div>
        <img src="/images/chatbox.png" alt="chatbox"> 
        <div class="toAdd">
            <label for="newUserName">Enter Your Correct Handle :</label>
            <input type="text" name="newhandleName" id="newhandleName" placeholder="Enter your new Username">
        </div>
    `
    userName.classList.remove("hidden");
    usernameChange.classList.remove("hidden");
    goBack.classList.remove("hidden");
})

// handling the case of changing username submissions
goBack.addEventListener('click',()=>{
    var newhandleName=document.querySelector("#newhandleName");
    var newhandleError=document.querySelector(".newhandleError");
    var handle=newhandleName.value;
    if(!handle.length){
        newhandleError.innerHTML=`
        <h1>Please enter something !!!</h1>
        `
    }
    else{
        chrome.storage.local.set({handleName:handle});
        localStorage.setItem("handleName",JSON.stringify(handle));
        Target.classList.remove("hidden");
        newUser.classList.add("hidden");
        userName.classList.add("hidden");
        usernameChange.classList.add("hidden");
        goBack.classList.add("hidden");
    }
})

// new user handle name 
btnUserName.addEventListener('click',()=>{
    var handle=handleName.value;
    if(!handle.length){
        handleError.innerHTML=`
        <h1>Please enter something !!!</h1>
        `
    }
    else{
        chrome.storage.local.set({handleName:handle});
        localStorage.setItem("handleName",JSON.stringify(handle));
        Target.classList.remove("hidden");
        newUser.classList.add("hidden");
    }
});

// setting thr target
btnSetTarget.addEventListener('click',()=>{
    var UserTarget=targetNum.value;
    var userDate=new Date();
    // console.log(userDate);
    if(UserTarget && UserTarget!==undefined && UserTarget>0){
        chrome.storage.local.set({dailyTarget:UserTarget});
        localStorage.setItem("dailyTarget",JSON.stringify(UserTarget));
        chrome.storage.local.set({targetDate:JSON.stringify(userDate)});
        localStorage.setItem("targetDate",JSON.stringify(userDate));
        targetInput.classList.add("hidden");
        showTarget.classList.add("hidden");
        userTarget.innerHTML=`
            today's target is ${UserTarget}  `
        userTarget.classList.remove("hidden");
        targetNum.setAttribute("disabled","true");
        targetNum.placeholder="Target already set"
        // FetchData();
    }
    else{
        handleNumError.innerHTML=`
        Please enter a valid target !!!!
        `
        targetNum.removeAttribute("disabled");
        targetNum.placeholder="Enter Target";
    }
})


// Toggle
var user=localStorage.getItem("handleName");
if(user!==null && user!=="undefined"){
    Target.classList.remove("hidden");
    newUser.classList.add("hidden");
}


btnMain.addEventListener('click',()=>{
    btnMain.classList.add("okactive");
    btnFil.classList.remove("okactive");
    btnTarget.classList.remove("okactive");
    mainSection.classList.remove("hidden");
    filSection.classList.add("hidden");
    sectionDaily.classList.add("hidden");
})

btnFil.addEventListener('click',()=>{
    btnMain.classList.remove("okactive");
    btnFil.classList.add("okactive");
    btnTarget.classList.remove("okactive");
    mainSection.classList.add("hidden");
    filSection.classList.remove("hidden");
    sectionDaily.classList.add("hidden");
})

btnTarget.addEventListener('click',()=>{
    btnMain.classList.remove("okactive");
    btnFil.classList.remove("okactive");
    btnTarget.classList.add("okactive");
    mainSection.classList.add("hidden");
    filSection.classList.add("hidden");
    sectionDaily.classList.remove("hidden");
})

btnToday.addEventListener('click',()=>{
    allcontest=false;
    btnToday.classList.add("okactive");
    btnUpcoming.classList.remove("okactive");
    display();
})

btnUpcoming.addEventListener('click',()=>{
    allcontest=true;
    btnToday.classList.remove("okactive");
    btnUpcoming.classList.add("okactive");
    display();
})


// Filtering on the basis of platform

var host;
if (localStorage.getItem('host-sites') === null) { host = host_sites; localStorage.setItem('host-sites', JSON.stringify(host_sites));} 
else { host = JSON.parse(localStorage.getItem('host-sites'));}
    host.forEach(function(host_site) {
		document.getElementsByName(`${host_site}`)[0].checked = true;
})

// Calculation of Time

// curr time
var curr_time = new Date();
// console.log(curr_time);
var today = new Date();
today.setHours(0, 0, 0);
const curr_time_req_api = curr_time.toISOString().substring(0, 11) + curr_time.toISOString().substring(11, 19); //curr time format required in api
// time of tommorrow of filtering contest on the basis of upcomnig contest
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);
tomorrow.setHours(0, 0, 0);
// console.log(tomorrow);

var time_15_back = new Date();// fifteen days back time to check any contest which started 15 day ago but running now also
time_15_back.setDate(time_15_back.getDate() - 15);    
time_15_back.setHours(0, 0, 0);
var time_15_back_req_api = time_15_back.toISOString().substring(0, 11) + time_15_back.toISOString().substring(11, 19); //15 days back time requried for api



// function to fectch api data

const apiUrl=`https://cp-calendar-server.vercel.app/upcomingContests/?`; //api url 

async function FetchAPI() {
    mainContent.innerHTML=`
    <div class="spinner"> 
        <div class="loading-container">
            <div class="loading-text">
                <span>L</span>
                <span>O</span>
                <span>A</span>
                <span>D</span>
                <span>I</span>
                <span>N</span>
                <span>G</span>
            </div>
        </div>
    </div>
    `
    //  console.log("yes");
        try {
            const response = await fetch(`${(apiUrl + `&resource=${hosts}&end__gt=${curr_time_req_api}&start__gt=${time_15_back_req_api}`)}`);
            //start gt means contest with start time greater than time of 15 day back and end gt means contest having end time greater than current time
            if (response.ok){
                const data = (await response.json());
                // console.log(data);
                return data;
            }
        } catch (err)
        { 
            console.error(`Error: ${err}. Retrying...`);
            mainContent.innerHTML=`
            <div class="error">
                <h1>500</h1>
                <div>Sorry!!! Network Issue</div>
            </div>
             `
        }
}

// adding event listeners to  filSection

for(var i=1;i<=8;i++){
    // console.log(i);
    document.getElementById(`host${i}`).addEventListener('click',(evt)=>{
        if(evt.target.checked){
            if(!host.includes(evt.target.name)){
                host.push(evt.target.name);
            }
        }
        else{
            var idx=host.indexOf(evt.target.name);
            if(idx>-1){
                host.splice(idx,1);
            }
        }
        display();
        localStorage.setItem('host-sites', JSON.stringify(host));
    });
}

// calling fetch api on evry day and settings up contests data

const lastFetchTime=new Date(localStorage.getItem("lastFetchTime"));
var allContests=localStorage.getItem("allContests");
// console.log(allContests);
// console.log(lastFetchTime);
// console.log(allContests==="undefined");
if(allContests===null || allContests==="undefined" || lastFetchTime<today){
    // console.log("Yes");
    FetchAPI().then(data=>{
        contestsData=data;
        localStorage.setItem("allContests",JSON.stringify(data));
        localStorage.setItem("lastFetchTime",new Date());
        display();
    })
}
else{
    contestsData=JSON.parse(allContests);
    display();
}

// function to render the contests on ui 
 
function display(){
    var contests=``;
    contestsData.objects.forEach((contest)=>{
        var time_s=new Date(contest.start+`.000Z`);
        var time_e=new Date(contest.end+`.000Z`);
        if(!allcontest){
            if(host.includes(contest.resource) && time_s<tomorrow && time_e>curr_time){
                const minutes = (parseInt(contest.duration) / 60) % 60;
                const hours = parseInt((parseInt(contest.duration) / 3600) % 24);
                const days = parseInt((parseInt(contest.duration) / 3600) / 24);
                var contestLength= ``;
                if (days > 0)
                    contestLength+= `${days} days `;
                if (hours > 0) 
                    contestLength+= `${hours} hours `;
                if (minutes > 0)
                    contestLength += `${minutes} minutes `;
                const time_s_in_local=new Date(contest.start+`.000Z`).toLocaleString('en-US');
                const time = time_s_in_local.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var contestDetails = ""+contest.event;
                if(contestDetails.length>30)
                    contestDetails = contestDetails.substring(0,30)+"....";
                if(curr_time>=time_s){
                    var item = `
                    <div class="contest">
                    <a href="${contest.href}" target="_blank">
                    <div class="details">
                    <div class="first">
                    <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
                    <span>${contestDetails}</span>
                    </div>
                    <div class="extra">
                    <span> Started At: <strong>${date} ${time[1]}</strong></span>
                    <span>Duration: ${contestLength} </span>
                    </div>
                    </div>
                    </a>
                    </div>
                    `;
                }
                else{
                    var item = `
                    <div class="contest">
                    <a href="${contest.href}" target="_blank">
                    <div class="details">
                    <div class="first">
                    <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
                    <span>${contestDetails}</span>
                    </div>
                    <div class="extra">
                    <span> Starts At: <strong>${date} ${time[1]}</strong></span>
                    <span>Duration: ${contestLength} </span>
                    </div>
                    </div>
                    </a>
                    </div>
                    `;
                }
                contests+=item;
            }
        }
        else{
            if(host.includes(contest.resource) && time_e>curr_time){
                const minutes = (parseInt(contest.duration) / 60) % 60;
                const hours = parseInt((parseInt(contest.duration) / 3600) % 24);
                const days = parseInt((parseInt(contest.duration) / 3600) / 24);
                var contestLength= ``;
                if (days > 0)
                    contestLength+= `${days} days `;
                if (hours > 0) 
                    contestLength+= `${hours} hours `;
                if (minutes > 0)
                    contestLength += `${minutes} minutes `;
                const time_s_in_local=new Date(contest.start+`.000Z`).toLocaleString('en-US');
                const time = time_s_in_local.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var contestDetails = ""+contest.event;
                if(contestDetails.length>30)
                    contestDetails = contestDetails.substring(0,30)+"....";
                if(curr_time>=time_s){
                    var item = `
                    <div class="contest">
                    <a href="${contest.href}" target="_blank">
                    <div class="details">
                    <div class="first">
                    <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
                    <span>${contestDetails}</span>
                    </div>
                    <div class="extra">
                    <span> Started At: <strong>${date} ${time[1]}</strong></span>
                    <span>Duration: ${contestLength} </span>
                    </div>
                    </div>
                    </a>
                    </div>
                    `;
                }
                else{
                    var item = `
                    <div class="contest">
                    <a href="${contest.href}" target="_blank">
                    <div class="details">
                    <div class="first">
                    <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
                    <span>${contestDetails}</span>
                    </div>
                    <div class="extra">
                    <span> Starts At: <strong>${date} ${time[1]}</strong></span>
                    <span>Duration: ${contestLength} </span>
                    </div>
                    </div>
                    </a>
                    </div>
                    `;
                }
                contests+=item;
            }
        }
    })
    mainContent.innerHTML=contests;
    if(contests===``){
        mainContent.innerHTML=`
            <div class="emptyPage">
                <img src="images/chatbox.png" alt="chatbox" >
                <p>There is no contest to display</p>
            </div>
        `
    }
}
