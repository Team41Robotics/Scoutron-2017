window.addEventListener("load", function(){
	var forms = document.getElementsByTagName("form");
	for (var i = 0; i < forms.length; i++){
		var form = forms[i];
		form.addEventListener("submit", formSubmit);
	}
});

function formSubmit(event, form, formData){
	var fileName = window.location.pathname.split("/").pop().split(".");
	fileName.pop();
	var filename = fileName.join(".");
	console.log(filename);
	event.preventDefault();
	//if(!localStorage.storedRequests) localStorage.storedRequests = "{}";
	//var storedRequests = JSON.parse(localStorage.storedRequests);
	var form = this || form;
	var formData = new FormData(form);
	var request = new XMLHttpRequest();
	request.onerror = function(){
		formCallback(storedRequests[filename][document.querySelector("input[name=Team_Number]").value]);
	};
	request.onreadystatechange = function(){
		if (this.readyState == 4){
			//storedRequests[filename][document.querySelector("input[name=Team_Number]").value] = request.responseText;
			//localStorage.storedRequests = JSON.stringify(storedRequests);
			formCallback(JSON.parse(request.responseText));
		}
	};
	request.open("POST", "./form/" + filename + ".php");
	request.send(formData);
}

function randomize(){
	var inputs = document.querySelectorAll("input");
	for (var i = 0; i < inputs.length; i++){
	  var input = inputs[i];
	  if (input.type == "number"){
	    input.value = Math.round(Math.random()*200);
	  } else if (input.type == "checkbox"){
	    input.checked = (Math.round(Math.random()) == 1) ? true : false;
	  } else if (input.type == "range"){
	    input.value = Math.round(Math.random() * input.max);
	  }
	}
	document.querySelector("select").selectedIndex = Math.round(Math.random()*4);
	document.querySelector("textarea").value = "Note #" + Math.round(Math.random()*100);
}