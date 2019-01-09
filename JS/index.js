
var modal = document.getElementsByClassName("modal");

function makeSignUpActive() {
	modal[0].classList.add("is-active");
}

function makeLogInActive(){
	modal[1].classList.add("is-active");
}

function hideSignUp() {
	modal[0].classList.remove("is-active");
}

function hideLogIn() {
	modal[1].classList.remove("is-active");
}

function logIn() {
	document.login.submit();
}

function signUp() {
	document.signup.submit();
}

window.onload = function(){
	var btns = document.getElementsByClassName("button");
	var modal = document.getElementsByClassName("modal");
	
	if(btns[0]){
		btns[0].addEventListener("click", makeSignUpActive);
	}
	if(btns[2]){
		btns[2].addEventListener("click", makeSignUpActive);
	}
	btns[1].addEventListener("click", makeLogInActive);
	btns[3].addEventListener("click", makeLogInActive);
	btns[5].addEventListener("click", hideSignUp);
	btns[7].addEventListener("click", hideLogIn);
	btns[4].addEventListener("click", signUp);
	btns[6].addEventListener("click", logIn);
}

