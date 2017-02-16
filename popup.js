var MainWordList;
var MainUrl;

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
	     var page = document.getElementById("list");
	     var wordcount = extractWordCount(request.source);
       MainUrl = request.url;

       requestWordMean(MainUrl, wordcount, function (obj){
         MainWordList = obj.wordMeanModels;
         console.log(MainWordList);
         refresh_word_list(obj.wordMeanModels)
       });
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

  requestTranslate(MainUrl,txt, function(translate){
    var content = document.getElementById("content");
    content.innerHTML = translate;
  });


  var txt_word = extractWordCount(txt);

  var search_list =[];
  for(i in txt_word){
    search_list.push(i);
  }

	var result = [];
  for(i = 0; i < search_list.length; i++){
    for(j = 0; j < MainWordList.length; j++){
  		if(search_list[i] === MainWordList[j].word){
  			result.push(MainWordList[j]);
  		}
  	}
  }

  result = result.concat(MainWordList);
  refresh_word_list(result);
}

function extractWordCount(str)
{
	var formatedStr = str.replace(/(\W|\d)+/g, ' ').trim();
	var wordList = formatedStr.split(' ');
	var count = {};
	for(i in wordList)
	{
		var word = wordList[i].toLowerCase();
		if(count[word] === undefined)
			count[word] = 1;

		count[word]++;
	}
	return count;
}

//Transmission
/*
 * parameter
 * -url : url string
 * -search : {
 *	word:count,...
 * }
 * -callback : callback function.
 *  function (wordlist=[{word:word, mean:mean},...]);
 * return
 * -array:[{word:word, mean:mean},...]
 *
 */
function requestWordMean(url, words, callback)
{
	var xhr = new XMLHttpRequest();
	var response;
  xhr.open("POST", "http://113.198.161.224:8080/getmean", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(this.readyState == 4){
			response = JSON.parse(this.responseText);
			callback(response);
		}
	}
	var send = {
		"action":"word_mean",
		"url":url,
		"wordList":makeWordList(words)
	};
  var sendStr = "search="+JSON.stringify(send);
  console.log(sendStr);
	xhr.send(sendStr);
}

function makeWordList(words){
	var wordlist=[];
	for(word in words){
		var i = {
			"word":word,
			"count":words[word]
		};
		wordlist.push(i);
	}
	return wordlist;
}

/*
 * parameter
 * -url : url string.
 * -search : search string.
 * -callback : callback function.
 *  function (string);
 * return
 * -string : translated string.
 */
function requestTranslate(url, search, callback)
{
	var xhr = new XMLHttpRequest();
	var response;

	xhr.open("POST", "http://113.198.161.224:8080/getTranslate", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(this.readyState == 4){
			response = JSON.parse(this.responseText);
			callback(response.translate);
		}
	}

	var send = {
		"action":"translate",
		"search":search
	}
  var sendStr = "search="+JSON.stringify(send);
  console.log(sendStr);
	xhr.send(sendStr);
}

//TESTCODE
function requestMean(words){
  var result = [];
  for(i in words){
    var element = {
      "word": i,
      "mean": words[i]
    }
    result.push(element);
  }
  return result;
}
