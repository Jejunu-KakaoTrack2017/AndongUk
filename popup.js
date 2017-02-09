var wordList = [{"word":"apple","mean":"사과"},{"word":"banana","mean":"바나나"},{"word":"kiwi","mean":"키위"}];

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
	var page = document.getElementById("list");
	page.innerHTML = request.source;
    }
});

function onWindowLoad() {
    chrome.tabs.executeScript(null, {
        file: "getSource.js"
        }, function() {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
            }
        });
	document.getElementById("btn_search").onclick=search;
}
window.onload = onWindowLoad;

function search(){
	var txt = document.getElementById("txt_search").value;
	var result = "";
	for(i = 0; i < wordList.length; i++){
		if(txt === wordList[i].word){
			result = wordList[i];
		} 
	}
	
	var content = document.getElementById("content");
	content.innerHTML = result.word + " : " + result.mean;
}
