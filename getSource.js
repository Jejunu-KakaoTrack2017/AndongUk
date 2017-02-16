function get_source(document_body){
    return document_body.innerText;
}

function get_url(){
  return document.URL;
}

chrome.extension.sendMessage({
    action: "getSource",
    source: get_source(document.body),
    url: get_url()
});
