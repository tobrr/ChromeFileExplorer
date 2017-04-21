// content.js

// Global variables
var currentFiles = [];

// Listener for messages from background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var link = (isDirectory(currentFiles[1].fileName)) ? currentFiles[1].link : window.location.href;
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": link});
    }
  }
);

class DirectoryFile {
  constructor(fileName, link, size, sizeRaw, dateModified, dateModifiedRaw) {
    this.fileName = fileName;
    this.link = link;
    this.size = size;
    this.sizeRaw = sizeRaw;
    this.dateModified = dateModified;
    this.dateModifiedRaw = dateModifiedRaw;
  }

  setLink(link) {
    this.link = link;
  }
}

// Reads the files from the current directory and stores them in currentFiles
function readFiles() {
  var table = document.getElementById("tbody");
  for (var i = 0, row; row = table.rows[i]; i++) {
    console.log(row);
    var fileName = row.cells[0].dataset.value;
    var link = null;
    var size = row.cells[1].innerHTML;
    var sizeRaw = row.cells[1].dataset.value;
    var dateModified = row.cells[2].innerHTML;
    var dateModifiedRaw = row.cells[2].dataset.value;

    var dirFile = new DirectoryFile(fileName, link, size, sizeRaw, dateModified, dateModifiedRaw);

    if (isDirectory(fileName) || isParentDirectoryLink(fileName)) {
      var formattedLink = formatLink(row.cells[0].getElementsByTagName('a')[0].getAttribute("href"))
      dirFile.setLink(formattedLink);
    }

    currentFiles.push(dirFile);
  }
}

// Formats the link
function formatLink(link) {
  return link.substring(1, link.length);
}

// Checks if current row contains a directory
function isDirectory(fileName) {
  if (fileName[fileName.length - 1] === "/") {
    return true;
  }
  return false;
}

// Checks if current row contains the parent folder link
function isParentDirectoryLink(fileName) {
  if (fileName === "..") {
    return true;
  }
  return false;
}

function addNewDivs(divs){
    var toAdd = document.createDocumentFragment();

    numberOfFiles=divs.length;   //Set i's max value to the number of files

    for(var i=0; i < numberOfFiles; i++){  

        newDiv = createDiv("div"+i);

        //Add file icon to div
        var newFile = document.createElement('img');
        newFile.src = "pic.png";   // Replace this with the path to a folder icon
        
        //Set event handlers
        newFile.draggable = true;
        newFile.ondragstart = function(event) {drag(event)};

        //Image details, change as needed
        newFile.id = "img"+i;
        newFile.width = "88";
        newFile.height = "31";

        newDiv.innerHTML = newFile.outerHTML;
        toAdd.appendChild(newDiv);
    }

    // Create blank div at the end so the user can drag to the end
    newDiv = createDiv("div"+i);
    toAdd.appendChild(newDiv);

    var wrapper = document.getElementById("wrapper");
    wrapper.appendChild(toAdd);
}

function createDiv(id){
    // Make a drag-and-drop directory div with the parameter as it's id.
    var newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.className = 'slot';
    newDiv.addEventListener('drop', function(ev) {drop(ev)}, false);
    newDiv.addEventListener('dragover', function(ev) {allowDrop(ev)}, false);
    newDiv.addEventListener('dragstart', function(ev) {drag(ev)}, false);
    return newDiv
}

readFiles();
console.log("length=" + currentFiles.length);
console.log(currentFiles);
