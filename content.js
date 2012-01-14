chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
   
   function GetSelectedUrls() {
     
     var search = /https?:\/\/\S+|ftp:\/\/\S+/ig;
     var div1;
     
     function getUrlsInTextNodes(node, urls) {
	if (node.nodeType == 3) {
	  var match = node.nodeValue.match(search);
	  if (match != null) {
	    for (var x = 0; x < match.length; x++) {
	      if (urls.indexOf(match[x]) == -1) {
		urls.push(match[x]);
	      }
	    }
	  }
	} else {
	  for (var i = 0, len = node.childNodes.length; i < len; ++i) {
	    getUrlsInTextNodes(node.childNodes[i], urls);
	  }
	}
      }
     
     var urls=[];
     sel = window.getSelection();
     for(var i = 0; i < sel.rangeCount; i++) {
       asel = sel.getRangeAt(i).cloneContents();
       var links = asel.querySelectorAll("a");
       for (var x = 0; x < links.length; x++) {
         if (links[x].href.substr(0,7)== "http://" || links[x].href.substr(0,6)== "ftp://") {
	   if (urls.indexOf(links[x].href) == -1) {
	     urls.push(links[x].href);
	   }
	   links[x].innerHTML="";
	 }
        }
      
        getUrlsInTextNodes(asel,urls);
        
      }
      return urls;
    }   
    
    function resetHandler() {
      document.body.removeChild(div1);
    }
    
    function submitHandler() {
      if (document.getElementById("pyloadExtensionBoxadd_links").value.trim() == "" || 
	  document.getElementById("pyloadExtensionBoxadd_name").value.trim() == "") {
	return
      }
      chrome.extension.sendRequest({"add_links":document.getElementById("pyloadExtensionBoxadd_links").value,
	                         "add_name":document.getElementById("pyloadExtensionBoxadd_name").value,
				 "add_password":document.getElementById("pyloadExtensionBoxadd_password").value,
				 "add_dest":document.getElementById("pyloadExtensionBoxadd_dest").value
                                });
      document.body.removeChild(div1);
    }
    
    var urls=GetSelectedUrls();

    
    if (urls.length > 0) {
      if (request.type == "new") {
	div1 = document.createElement("div");
	div1.innerHTML=request.addBox;
	document.body.insertBefore(div1,document.body.firstChild);
	document.getElementById("pyloadExtensionBox").style.top=window.pageYOffset +50 +"px";
	
	document.getElementById("pyloadExtensionBoxadd_links").value = urls.join("\r\n");
	document.getElementById("pyloadExtensionBoxLogo").src = chrome.extension.getURL("images/logo-small.png");
	var form=document.getElementById("pyloadExtensionBoxadd_form");
	form.addEventListener("reset",resetHandler);
	form.addEventListener("submit",submitHandler);
      } else {
        chrome.extension.sendRequest({"add_links":urls.join("\r\n"),
         	                      "add_name":request.name,
		    	              "add_password":"",
				      "add_dest":1
                                    });
      }
    }
    sendResponse({}); 
    
}
);






