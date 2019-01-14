window.onload = function () {
	var burger = document.getElementsByClassName("navbar-burger");
	var burgerMenu = document.getElementsByClassName("navbar-menu");
	burger[0].addEventListener("click", function(){
		if(burger[0].classList[2] == "is-active"){
			burger[0].classList.remove("is-active");
			burgerMenu[0].classList.remove("is-active");
		}
		else{
			burger[0].classList.add("is-active");
			burgerMenu[0].classList.add("is-active");
		}
	});
};

document.onload = function () {
	
	var title = document.getElementsByTagName("title");
	var welcome = document.getElementsByTagName("h1");
	var panelTitle = document.getElementsByClassName("panel-heading");
	
	var startReq = {"table":"Users", "action":"get"};
	var xmlhttp = new XMLHTTPRequest();
	xmlhttp.onreadystate = function () {
		if(this.readyState == 4 && this.status == 200){
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

function completed(var TID){

}

function openList(var LID) {
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
			
			var nodeHolder;
			var nodeText;
			var columnDiv;
			var details;
			var columnLeft;
			var columnRight;
			var taskBtn 
			for(var i in response){
				nodeHolder = document.createElement("div");
				nodeHolder.id = response[i]["TID"];
				nodeHolder.classList.add("panel-block", "panel-color");
				columnDiv = document.createElement("div")
				columnDiv.classList.add("column", "is-6");
				columnLeft = document.createElement("div");
				columnLeft.classList.add("is-pulled-left");
				columnRight = document.createElement("div");
				columnRight.classList.add("is-pulled-right");
				taskBtn = document.createElement("button");
				taskBtn.onclick = completed(response[i]["TID"] + "btn");
				taskBtn.id = response[i]["TID"] + "btn";
				if(response[i]["Complete"] == 0){
					taskBtn.classList.add("button", "is-success");
					taskBtn.appendChild(document.createTextNode("Completed"));
				}
				else{
					taskBtn.classList.add("button", "is-danger");
					taskBtn.appendChild(document.createTextNode("incomplete"));
				}
				nodeText = document.createTextNode(response[i]["TaskName"]);
				details = document.createElement("p");
				details.classList.add("content", "task-details");
				details.appendChild(document.createTextNode(response[i]["Details"]))
				columnLeft.appendChild(nodeText);
				columnLeft.appendChild(details);
				columnRight.appendChild(taskBtn);
				columnDiv.appendChild(columnLeft);
				columnDiv.appendChild(columnRight);
				nodeHolder.appendChild(columnDiv);				
			}
		}
	};
}