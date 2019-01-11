window.onload = function () {
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
			}
			else {
				if(resp.fName != ""){
					title[0].innerText = resp.fName + "'s ListApp";
					welcome[0].innerText += " " + resp.fName;
					panelTitle[0].innerText = resp.fName + panelTitle.innerText
				}
				else{
					title[0].innerText = "Your ListApp";
					welcome[0].innerText += " friend!";
					panelTitle[0].innerText = "Your" + panelTitle.innerText;
					alert("If you give create a Username you'll have a more personalized experience");
				}
			}
		}
	}
	xmlhttp.open("GET", "home.php?q="+JSON.stringify(startReq), true);
	xmlhttp.send();
};