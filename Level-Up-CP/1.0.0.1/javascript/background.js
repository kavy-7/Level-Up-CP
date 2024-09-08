// constant variables
var problemArray;
var userForApi;
var target;
var targetDate;
var dailyTarget
var currentDate=new Date();


// fetching data to get number of problems user solved
const baseUrl=`https://codeforces.com/api/user.status?`; 
const domainWhiteList = new Set(["leetcode.com", "accounts.google.com", "extensions", "github.com", "drive.google.com","www.codechef.com","codeforces.com","atcoder.jp","www.codingninjas.com","www.hackerearth.com","www.geeksforgeeks.org","www.topcoder.com","www.linkedin.com","unstop.com","www.hackerrank.com"]); // this set is to whitelist the redirection for chrome://extensions and accounts.google.com
async function FetchData() {
    var retries=5;
    while(retries>0){
        try {
            // console.log(userForApi);
            const response = await fetch(`${(baseUrl + `handle=${userForApi}`)}`);
             if (response.ok){
                const data = (await response.json());
                // console.log(data);
                return data.result;
            }
            else throw new Error('Network response was not ok.')
        } catch (err)
        { 
            console.error(`Error: ${err}. Retrying...`);
            retries--;
        }
    }
}

// funtion to get date from unix timestamp

function getDateFromUnixTimestamp(unixTimestamp){
    var dateObj = new Date(unixTimestamp * 1000);
    return dateObj
}
// function to calculate the solved problems for today
function countSolvedProblems(){
    var count=0;
    var problemNames=[];
    // console.log(currentDate);
    for(var i=0;i<problemArray.length;i++){
        var unixTimestamp=problemArray[i].creationTimeSeconds;
        // console.log(unixTimestamp);
        var dateOfProblem=getDateFromUnixTimestamp(unixTimestamp);
        // console.log(dateOfProblem);
        if(problemArray[i].verdict==="OK" && !problemNames.includes(problemArray[i].problem.name) && currentDate.getDate()===dateOfProblem.getDate() && currentDate.getMonth()===dateOfProblem.getMonth() && currentDate.getFullYear()===dateOfProblem.getFullYear()){
            problemNames.push(problemArray[i].problem.name);
            count++;
        }
    }
    return count;
}

// function to redirect to codeforces
function render() {
    chrome.tabs.query(
        {currentWindow: true, active: true},
        (tabs) => {
            try {
            // console.log("tabs is",tabs);
            const currURL = new URL(tabs[0].url);
            const domain = currURL.hostname;
            // console.log("this is url",currURL);
            // console.log("this is domain",domain);
            if (!domainWhiteList.has(domain)) {
                chrome.tabs.update({url: `https://codeforces.com/problemset`});
            }
        } catch(error) {
            return;
        }
    }
    );
}


// function to check if the target is already achieved or not;
async function isAlreadySolved(){
    userForApi=await chrome.storage.local.get("handleName");
    userForApi=userForApi.handleName;
    dailyTarget=await chrome.storage.local.get("dailyTarget");
    dailyTarget=dailyTarget.dailyTarget;
    // console.log(dailyTarget);
    targetDate=await chrome.storage.local.get("targetDate");
    targetDate=targetDate.targetDate;
    if(targetDate!==undefined) targetDate=new Date(JSON.parse(targetDate));
    // console.log(currentDate);
    if(userForApi!==undefined || userForApi===null){
        if(dailyTarget===undefined || currentDate.getDate()!==targetDate.getDate() || currentDate.getMonth()!==targetDate.getMonth() || currentDate.getFullYear()!==targetDate.getFullYear() || dailyTarget===null){
            target=1;
        }
        else target=dailyTarget;
        var solvedCount;
        await FetchData().then((data)=>{
            problemArray=data;
            solvedCount=countSolvedProblems();
        });
        console.log(solvedCount);
        console.log(target);
        if(solvedCount>=target) return true;
        else return false;
    }
    else return true;
}



// funtion to check we have to render of not
async function check() {
    if (await isAlreadySolved()) {
        return;
    }
    // console.log("yes");
    const items = await chrome.storage.local.get('stopTime');
    var toComp=await chrome.storage.local.get('toComp');
    if (items.stopTime && items.stopTime!==undefined) {
        // emergency button is clicked make sure that if current time is 3 hours more than
        // last stored time (time when someone clicked the button)
        // then leetcode forcing will start; else do nothing
        toComp=toComp.toComp;
        const lastStopDate = new Date(items.stopTime);
        const currentTime = new Date();
        const diffTime = lastStopDate - currentTime;
        // console.log(toComp);
        // console.log(typeof(toComp));
        if (diffTime <= 0 || toComp!==currentTime.getDate()) {
            chrome.storage.local.remove("storedTime"); // removing the stored time as now it's work is done, so if someone again open or update the tab storedTime will become undefined and this function will go to leetcodeForcer()
            render();
        }
    } else {
        // emergency button is not clicked yet
        render();
    }
}

// event that will be fired when a tab will be updated
chrome.tabs.onUpdated.addListener( function (tabId, tabInfo, tab) {
    // to call only once. 
    // console.log(tab.url);
    // console.log(tabInfo);
    if (tab.url !== undefined && tabInfo.status === "complete") { 
        // console.log("y2");
       check();
    }
});

// event that will be fired when a new tab will be open
chrome.tabs.onActivated.addListener(function () {
    // console.log("y1");
    check();
});

// event that will be fired when we submit tha target and change it from default set and if username changes

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key] of Object.entries(changes)) {
       if(key==="targetDate" || key==="handleName"){
        // console.log("y3");
        check();
       }
    }
});