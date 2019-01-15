window.onload = function () {
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
};

document.onload = function () {
	
	var title = document.getElementsByTagName("title"),
	    welcome = document.getElementsByTagName("h1"),
	    panelTitle = document.getElementsByClassName("panel-heading");
	
	var startReq = {"table" : "Users", "action" : "get"};
	var xmlhttp = new XMLHTTPRequest();
	xmlhttp.onreadystate = function () {
		if (this.readyState === 4 && this.status === 200){
			var resp = JSON.parse(this.responseText);
			if(resp.username !== ""){
				title[0].innerText = resp.username + "'s ListApp";
				welcome[0].innerText += " " + resp.username;
				panelTitle[0].innerText = resp.username + panelTitle.innerText;
				var rememberThis = panelTitle[0].innerText;
			}
			else {
				if(resp.fName != ""){
					title[0].innerText = resp.fName + "'s ListApp";
					welcome[0].innerText += " " + resp.fName;
					panelTitle[0].innerText = resp.fName + panelTitle.innerText
					var rememberThis = panelTitle[0].innerText;
				}
				else{
					title[0].innerText = "Your ListApp";
					welcome[0].innerText += " friend!";
					panelTitle[0].innerText = "Your" + panelTitle.innerText;
					var rememberThis = panelTitle[0].innerText;
					alert("If you give create a Username you'll have a more personalized experience");
				}
			}
		}
	}
	xmlhttp.open("GET", "home.php?q="+JSON.stringify(startReq), true);
	xmlhttp.send();
};

function completed(TID, status){
    var req = {"table" : "Tasks", "action" : "update", "TID" : TID, "target" : "Complete", "Complete" : status},
        btn = document.getElementById(TID + "btn");
    if (status === 1){
        btn.innerText = "incomplete";
        btn.classList.remove("is-success");
        btn.classList.add("is-danger");
    }
    else{
        btn.innerText = "complete";
        btn.classList.remove("is-danger");
        btn.classList.add("is-success");
    }
    var xhp = new XMLHttpRequest();
    xhp.onreadystatechange = function () {
      if (xhp.readyState == 4 && xhp.status == 200){
          if(xhp.responseText == "success"){
              alert("Successfully updated");
          }
          else{
              alert(xhp.responseText);
          }
      }  
    };
    xhp.open("GET", "PHP/home.php?q=" + JSON.stringify(req), true);
    xhp.send();
}

function openList(LID) {
	var request = {"table": "Lists", "action": "get", "LID": LID};
	var otherLists = document.getElementsByClassName("panel-block");
	var panelTitle = document.getElementsByClassName("panel-heading");
	panelTitle.innerText = document.getElementById(LID).innerText;
	for (var i = 0; i < otherLists.length; i++) {
		otherLists[i].classList.add("hide");
	}
	var reqString = JSON.stringify(request);
	var xhp = new XMLHTTPRequest();
	xhp.onreadystatechange = function () {
		if(xhp.readyState == 4 && xhp.status == 200){
			//add tasks to the list and change the heading to the list name
			var response = JSON.parse(this.responseText);
			for (var i = 0; i < response.length; i++){
                taskGen(response[i]["TID"], response[i]["TaskName"], response[i]["Details"], response[i]["Complete"]);
            }
            var backBtn = document.createElement("a"),
                bBIconSP = document.createElement("span"),
                bBIcon = document.createElement("i"),
                addBtn = document.getElementsByClassName("add-btn");
            bBIconSP.classList.add("icon");
            bBIcon.classList.add("fas", "fa-arrow-left");
            bBIconSP.appendChild(bBIcon);
            backBtn.onclick = closeList;
            backBtn.id = 'backBtn';
            backBtn.appendChild(bBIconSP);
            panelTitle[0].insertAdjacentElement("afterBegin", backBtn);
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
        panel = document.getElementsByClassName("panel");
    for (var i = 0; i < goAway.length; i++){
        panel[0].removeChild(goAway[i]);
    }
    var lists = document.getElementsByClassName("hide");
    for(i = 0; i < lists.length; i++){
        lists[i].classList.remove("hide");
    }
    panel[0].removeChild(document.getElementById("backBtn"));
}

function taskGen(TID, taskName, taskDetails, completed) {
    var nodeHolder,
        nodeText,
        columnDiv,
        details,
        columnLeft,
        columnRight,
        taskBtn;
    nodeHolder = document.createElement("div");
    nodeHolder.id = TID;            
    nodeHolder.classList.add("panel-block", "panel-color", "find-me");
    columnDiv = document.createElement("div");
    columnDiv.classList.add("column", "is-6");
    columnLeft = document.createElement("div");
    columnLeft.classList.add("is-pulled-left");
    columnRight = document.createElement("div");
    columnRight.classList.add("is-pulled-right");
    taskBtn = document.createElement("button");
    taskBtn.onclick = completed(TID + "btn");
    taskBtn.id = TID + "btn";
    if(completed == 0){
        taskBtn.classList.add("button", "is-success");
        taskBtn.appendChild(document.createTextNode("Completed"));
	}
    else{
        taskBtn.classList.add("button", "is-danger");
        taskBtn.appendChild(document.createTextNode("incomplete"));
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