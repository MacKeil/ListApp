window.onload = function () {
    //DOM manipulation for existing elements
	var burger = document.getElementsByClassName("navbar-burger"),
        burgerMenu = document.getElementsByClassName("navbar-menu"),
        btns = document.getElementsByClassName("button");
	burger[0].addEventListener("click", function () {
		if (burger[0].classList[2] === "is-active") {
			burger[0].classList.remove("is-active");
			burgerMenu[0].classList.remove("is-active");
		}
		else {
			burger[0].classList.add("is-active");
			burgerMenu[0].classList.add("is-active");
		}
	});
    btns[0].onclick = createList;
    btns[2].onclick = createList;
    btns[1].onclick = accountInfo;
    btns[3].onclick = accountInfo;
    document.body.addEventListener("load", getUser());
};



function completed(TID, taskStatus){
    var req = {"table" : "Tasks", "action" : "update", "TID" : TID, "target" : "Complete", "Complete" : taskStatus},
        btn = document.getElementById(TID + "btn");
    if (taskStatus === 1){
        btn.innerText = "incomplete";
        btn.classList.remove("is-success");
        btn.classList.add("is-danger");
	btn.removeEventListener("click", function(){completed(TID, 1);});
	btn.addEventListener("click", function(){completed(TID, 0);});
    }
    else{
        btn.innerText = "complete";
        btn.classList.remove("is-danger");
        btn.classList.add("is-success");
	btn.removeEventListener("click", function(){completed(TID, 0);});
	btn.addEventListener("click", function(){completed(TID, 1);});
    }
    var xhp = new XMLHttpRequest();
    xhp.onreadystatechange = function () {
      if (xhp.readyState == 4 && xhp.status == 200){
              alert(xhp.response);
      }  
    };
    xhp.open("GET", "PHP/home.php?q=" + JSON.stringify(req), true);
    xhp.send();
}

function openPanel(){
    //gets all lists for the user and places them on the screen
    var req = {table : "Lists", action : "get"};
    var xhp = new XMLHttpRequest();
    xhp.onreadystatechange = function () {
    	if (xhp.readyState == 4 && xhp.status == 200) {
            var response = JSON.parse(xhp.response);
    		for (var i = 0; i < response.length; i++) {
    			listGen(response[i].LID, response[i].ListName, response[i].Details);
    		}
    		
    	}
    };
    xhp.open("GET", "PHP/home.php?q=" + JSON.stringify(req), true);
    xhp.send();
}

function openList(LID) {
    //takes selected list and gets tasks, then changes panel to fit task
	var request = {"table": "Tasks", "action": "get", "LID": LID},
	    otherLists = document.getElementsByClassName("panel-block"),
	    panelTitle = document.getElementsByClassName("panel-heading"),
       btns = document.getElementsByClassName("button"),
       backBtn = document.createElement("a"),
       bBIconSP = document.createElement("span"),
       bBIcon = document.createElement("i"),
       editBtn = document.createElement("a"),
       eBIconSP = document.createElement("span"),
       eBIcon = document.createElement("i"),
       addBtn = document.getElementsByClassName("add-btn");
   bBIconSP.classList.add("icon");
   eBIconSP.classList.add("icon");
   eBIcon.classList.add("fas", "fa-ellipsis-v");
   bBIcon.classList.add("fas", "fa-arrow-left");
   eBIconSP.appendChild(eBIcon);
   bBIconSP.appendChild(bBIcon);
   btns[0].onclick = function () {createTask(LID)};
   btns[2].onclick = function () {createTask(LID)};
   btns[0].innerText = "Add Task";
   btns[2].innerText = "Add Task";
	panelTitle[0].innerText = document.getElementById(LID).innerText;
	backBtn.onclick = closeList;
   backBtn.id = 'backBtn';
   backBtn.appendChild(bBIconSP);
   editBtn.onclick = function(LID){updateList(LID);};
   editBtn.id = 'editbtn' + LID;
   editBtn.appendChild(eBIconSP);
   panelTitle[0].insertAdjacentElement("afterBegin", backBtn);
   panelTitle[0].insertAdjacentElement("beforeend", editBtn);
	for (var i = 0; i < otherLists.length; i++) {
		otherLists[i].classList.add("hide");
	}
	var reqString = JSON.stringify(request);
	var xhp = new XMLHttpRequest();
	xhp.onreadystatechange = function () {
		if(xhp.readyState == 4 && xhp.status == 200){
			//add tasks to the list and change the heading to the list name
			var response = JSON.parse(this.responseText);
			if(response !== null){
				for (var i = 0; i < response.length; i++){
        	        taskGen(response[i]["TID"], response[i]["TaskName"], response[i]["Details"], response[i]["Complete"]);
            			}
			}
            var bBIconSP = document.createElement("span"),
                bBIcon = document.createElement("i"),
                addBtn = document.getElementsByClassName("add-btn");
            bBIconSP.classList.add("icon");
            bBIcon.classList.add("fas", "fa-arrow-left");
            bBIconSP.appendChild(bBIcon);
            
            for(i = 0; i < addBtn.length; i++){
                addBtn[i].innerText = "Add Task";
                addBtn[i].onclick = createTask;
            }
		}
	};
    xhp.open("GET", "PHP/home.php?q=" + reqString, true);
    xhp.send();
}
function closeList (){
    var goAway = document.getElementsByClassName("find-me"),
        panel = document.getElementsByClassName("panel"),
        btns = document.getElementsByClassName("button");
    for (var i = goAway.length; i > 0; i--){
        goAway[i-1].remove();
    }
    var lists = document.getElementsByClassName("hide");
    for(i = lists.length; i > 0; i--){
        lists[i-1].classList.remove("hide");
    }
    btns[0].onclick = createList;
    btns[2].onclick = createList;
    btns[0].innerText = "Add List";
    btns[2].innerText = "Add List";
    document.getElementById("backBtn").remove();
    getUser(true);
}

function taskGen(TID, taskName, taskDetails, isComplete) {
    var nodeHolder,
        nodeText,
        columnDiv,
        details,
        columnLeft,
        columnRight,
        editBtn,
        eBIconSP,
        eBIcon,
        taskBtn;
    nodeHolder = document.createElement("div");
    nodeHolder.id = "Task" + TID;            
    nodeHolder.classList.add("panel-block", "panel-color", "find-me");
    columnDiv = document.createElement("div");
    columnDiv.classList.add("column", "is-6");
    columnLeft = document.createElement("div");
    columnLeft.classList.add("is-pulled-left");
    columnRight = document.createElement("div");
    columnRight.classList.add("is-pulled-right");
    taskBtn = document.createElement("button");
    taskBtn.id = TID + "btn";
    editBtn = document.createElement("a");
    eBIconSP = document.createElement("span");
    eBIcon = document.createElement("i");
    eBIconSP.classList.add("icon");
    eBIcon.classList.add("fas", "fa-ellipsis-v");
    eBIconSP.appendChild(eBIcon);
    editBtn.onclick = function(LID){updateTask(TID);};
    editBtn.id = 'editbtn' + TID;
    editBtn.appendChild(eBIconSP);
    nodeHolder.appendChild(editBtn);
    if(isComplete == 0){
        taskBtn.classList.add("button", "is-success");
        taskBtn.appendChild(document.createTextNode("Completed"));
	taskBtn.addEventListener("click", function(){completed(TID, 1);});
	}
    else{
        taskBtn.classList.add("button", "is-danger");
        taskBtn.appendChild(document.createTextNode("incomplete"));
	taskBtn.addEventListener("click", function(){completed(TID, 0);});
	}
    nodeText = document.createTextNode(taskName);
    details = document.createElement("p");
    details.classList.add("content", "task-details");
    details.appendChild(document.createTextNode(taskDetails));
    columnLeft.appendChild(nodeText);
    columnLeft.appendChild(details);
    columnRight.appendChild(taskBtn);
    columnDiv.appendChild(columnLeft);
    columnDiv.appendChild(columnRight);
    nodeHolder.appendChild(columnDiv);
    document.getElementsByClassName("panel")[0].appendChild(nodeHolder);
}

function listGen(LID, ListName, Details){
    //creates a list for the DOM
    var detailsHolder = document.createElement("p"),
        columnDiv = document.createElement("div"),
        pullLeft = document.createElement("div"),
        panel = document.getElementsByClassName("panel"),
        listHolder = document.createElement("a");
    listHolder.id = LID;
    listHolder.classList.add("panel-block", "panel-color");
    listHolder.onclick = function () {openList(LID)};
    columnDiv.classList.add("column", "is-6");
    pullLeft.classList.add("is-pulled-left");
    detailsHolder.classList.add("content");
    detailsHolder.innerText = Details;
    pullLeft.innerText = ListName;
    pullLeft.appendChild(detailsHolder);
    columnDiv.appendChild(pullLeft);
    listHolder.appendChild(columnDiv);
    panel[0].appendChild(listHolder);
}
function createList(){
    //opens list modal
    var submit = document.getElementById("submit-list"),
    	  modalBackground = document.getElementsByClassName("modal-background"),
    	  deleteBtn = document.getElementsByClassName("delete"),
    	  modal = document.getElementsByClassName("modal");
    modalBackground[0].addEventListener("click", function () {
    	modal[0].classList.remove("is-active");
    });
    deleteBtn[0].addEventListener("click", function () {
    	modal[0].classList.remove("is-active");
    });
    modal[0].classList.add("is-active");
    submit.onclick = sendList;
}

function createTask(LID){
    //opens task modal
    var submit = document.getElementById("submit-task"),
    	  modalBackground = document.getElementsByClassName("modal-background"),
    	  deleteBtn = document.getElementsByClassName("delete"),
    	  modal = document.getElementsByClassName("modal");
    modalBackground[1].addEventListener("click", function () {
    	modal[1].classList.remove("is-active");
    });
    deleteBtn[1].addEventListener("click", function () {
	 	modal[1].classList.remove("is-active");   
    });
    modal[1].classList.add("is-active");
    submit.onclick = function () {sendTask(LID)};
}

function sendTask(LIDN){
    //sends the new task to the back end and calls openList again
    var taskFrom = document.getElementsByName("Task"),
        formData = new FormData(taskFrom[0]),
        jsonSend = {table : "Tasks", action : "create", LID : LIDN};
    for (var iter of formData.entries()){
        jsonSend[iter[0]] = iter[1];
    }
    if(!jsonSend.Complete){
        jsonSend.Complete = 0;
    }
    else{
        jsonSend.Complete = 1;
    }
    var reqStr = JSON.stringify(jsonSend);
    var xhp = new XMLHttpRequest();
    xhp.onreadystatechange = function () {
        if(xhp.readyState == 4 && xhp.status == 200){
            alert(this.responseText);
        }
    };
    xhp.open("GET", "PHP/home.php?q=" + reqStr, true);
    xhp.send();
    
    taskFrom[0].reset();
    openList(LIDN);
}

function sendList(){
    //sends the new list info to the backend and calls openPanel again
    var listForm = document.getElementsByName("List"),
    	  formData = new FormData(listForm[0]),
    	  jsonSend = {"table" : "Lists", "action" : "create"};
    for (var iter of formData.entries()) {
    	jsonSend[iter[0]] = iter[1];
    }
    var reqStr = JSON.stringify(jsonSend);
    var xhp = new XMLHttpRequest();
    xhp.onreadystatechange = function () {
    	if (xhp.readyState == 4 && xhp.status == 200) {
    		alert(this.responseText);
    	}
    };
    xhp.open("GET", "PHP/home.php?q=" + reqStr, true);
    xhp.send();
    openPanel();
}

function getUser(reset) {
	//ajax call and DOM manipulation for new elements
	var title = document.getElementsByTagName("title"),
	    welcome = document.getElementsByTagName("h1"),
	    panelTitle = document.getElementsByClassName("panel-heading");
	if(reset === undefined){
		reset = false;
	}
	if(reset){
		title[0].innerText ="";
		welcome[0].innerText = "Welcome";
		panelTitle[0].innerText = "'s Lists";
	}
	var startReq = {"table" : "Users", "action" : "get"};
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200){
			var resp = JSON.parse(this.response);
           
			if(resp.username !== ""){
				title[0].innerText = resp.username + "'s ListApp";
				welcome[0].innerText += " " + resp.username;
				panelTitle[0].innerText = resp.username + panelTitle[0].innerText;
				var rememberThis = panelTitle[0].innerText;
			}
			else {
				if(resp.fName != ""){
					title[0].innerText = resp.fName + "'s ListApp";
					welcome[0].innerText += " " + resp.fName;
					panelTitle[0].innerText = resp.fName + panelTitle[0].innerText
					var rememberThis = panelTitle[0].innerText;
				}
				else{
					title[0].innerText = "Your ListApp";
					welcome[0].innerText += " friend!";
					panelTitle[0].innerText = "Your" + panelTitle[0].innerText;
					var rememberThis = panelTitle[0].innerText;
					alert("If you give create a Username you'll have a more personalized experience");
				}
			}
		}
	}
	xmlhttp.open("GET", "PHP/home.php?q=" + JSON.stringify(startReq), true);
	xmlhttp.send();
	if(!reset){
		openPanel();
	}
}

function accountInfo(){
    //open the account info menu
    var modal = document.getElementsByClassName('modal')[2],
        deleteBtn = document.getElementsByClassName('delete')[2],
        modalBkgrnd = document.getElementsByClassName("modal-background")[2],
        submit = document.getElementById("submit-UsrChg"),
        deleteModal = document.getElementById('dltAcnt'),
        chgPwd = document.getElementById("chg-pwd"),
        lgOut = document.getElementById("lgout");
    deleteBtn.addEventListener("click", function(){
        modal.classList.remove('is-active');
    });
    modalBkgrnd.addEventListener("click", function(){
        modal.classList.remove('is-active');
    });
    modal.classList.add("is-active");
    submit.addEventListener("click", sendAcct);
    deleteModal.addEventListener('click', deleteAcctModal);
    chgPwd.addEventListener('click', pwdModal);
    lgOut.addEventListener('click', lgOutModal);
}

function sendAcct(){
    //sends the data for update
    var acctForm = document.getElementsByName("Account")[0],
        fformData = new FormData(acctForm),
        xhp = new XMLHttpRequest(),
        arry = [],
        i = 0,
        jsonData = {table: "Users", action: "update"};
    for (var iter of fformData.entries()){
        if(iter[1] !== ""){
            arry[i] = {target: iter[0]};
            arry[i][iter[0]] = iter[1];
            arry[i] = concatJSON(jsonData, arry[i]);
            i++;
        }
    }
    console.log(arry);
    ajaxOne(arry, xhp, ajaxTwo);
}

function sendPwd(){
    //sends the data for password change
    var pwdForm = document.getElementsByName("Password")[0],
        formData = new FormData(pwdForm),
        xhp = new XMLHttpRequest();
        xhp.onreadystatechange = function(){
            if(xhp.readyState == 4 && xhp.status == 200){
                console.log(xhp.response);
            }
        };
        xhp.open("POST", "PHP/home.php");
        xhp.send(formData);
}

function sendDltAcct(){
    //sends the request to delte the account
}

function pwdModal(){
    //opens the password modal
    var acctModal = document.getElementsByClassName('modal')[2],
        modal = document.getElementsByClassName('modal')[3],
        deleteBtn = document.getElementsByClassName('delete')[3],
        bkg = document.getElementsByClassName('modal-background')[3],
        submit = document.getElementById('submit-PwdChg');
    modal.classList.add('is-active');
    acctModal.classList.remove('is-active');
    deleteBtn.addEventListener("click", function(){
        modal.classList.remove('is-active');
    });
    bkg.addEventListener('click', function(){
        modal.classList.remove('is-active');
    });
    submit.addEventListener("click", sendPwd);
}

function deleteAcctModal(){
    //opens the delete account modal
    var modal = document.getElementsByClassName('modal')[5],
        deleteBtn = document.getElementsByClassName('delete')[5],
        deleteAcct = document.getElementById('delete-accnt'),
        bkg = document.getElementsByClassName('modal-background')[5];
    modal.classList.add('is-active');
    deleteBtn.addEventListener('click', function(){
        modal.classList.remove('is-active');
    });
    bkg.addEventListener("click", function(){
        modal.classList.remove('is-active');
    });
    deleteAcct.addEventListener("click", sendDltAcct);
}

function lgOutModal(){
    //opens log out modal
    var acctModal = document.getElementsByClassName('modal')[2],
        modal = document.getElementsByClassName('modal')[4],
        bkg = document.getElementsByClassName('modal-background')[4],
        deleteBtn = document.getElementsByClassName('delete')[4];
    acctModal.classList.remove('is-active');
    modal.classList.add('is-active');
    bkg.addEventListener('click', function(){
        modal.classList.remove('is-active');
    });
    deleteBtn.addEventListener("click", function(){
        modal.classList.remove('is-active');
    });
}

function updateList(LID) {
    //opens the list update modal
    var upListModal = document.getElementsByClassName('modal')[7],
        bkg = document.getElementsByClassName('modal-background')[7],
        dltBtn = document.getElementsByClassName('delete')[7];
    upListModal.classList.add('is-active');
    bkg.addEventListener('click', function(){
        upListModal.classList.remove('is-active');
    });
    dltBtn.addEventListener('click', function(){
        upListModal.classList.remove('is-active');
    });
    
}

function updateTask(TID) {
    //opens the task update modal
    var upTaskModal = document.getElementsByClassName('modal')[6],
        bkg = document.getElementsByClassName('modal-background')[6],
        dltBtn = document.getElementsByClassName('delete')[6];
    upTaskModal.classList.add('is-active');
}


function concatJSON(in1, in2){
    var out = {};
    for(var key in in1){
        out[key] = in1[key];
    }
    for(var key in in2){
        out[key] = in2[key];
    }
    return out;
}

function ajaxOne(data, xhp, callback){
    xhp.onreadystatechange = function(){
        if(xhp.readyState == 4 && xhp.status == 200){
            console.log(xhp.response);
            callback(data, xhp, ajaxThree);
        }
    }
    xhp.open("GET", "PHP/home.php?q=" + JSON.stringify(data[0]));
    xhp.send();
}

function ajaxTwo(data, xhp, anotherCallback){
    xhp.onreadystatechange = function(){
        if(xhp.readyState == 4 && xhp.status == 200){
            console.log(xhp.response);
            anotherCallback(data, xhp);
        }
    }
    xhp.open("GET", "PHP/home.php?q=" + JSON.stringify(data[1]));
    xhp.send();
}

function ajaxThree(data, xhp){
    xhp.onreadystatechange = function(){
        if(xhp.readyState == 4 && xhp.status == 200){
            console.log(xhp.response);
        }
    }
    xhp.open("GET", "PHP/home.php?q=" + JSON.stringify(data[2]));
    xhp.send();
}

function autoFill(dataToUse){
    dataToUse = dataToUse || {};
    if(dataToUse = {}){
        console.log("No data to prefill with");
        return;
    }
    var myData = Object.entries(dataToUse);
    for(var i = 0; i < myData.length; i++){
        document.getElementsByName(myData[i][0])[0].value = myData[i][1];
    }
}

function getPrefillList(ID){
    var nodes = document.getElementById(ID).children[0].children[0].childNodes;
    var output = {ListName : nodes[0].textContent, }
}