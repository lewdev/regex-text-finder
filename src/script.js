const APP_DATA_KEY = "regex-text-finder";

//inputs
const regexStrInput = document.getElementById("regexStr");
const textBodyInput = document.getElementById("text-body");
const formatTextBodyInput = document.getElementById("format-text");
const outputDiv = document.getElementById("output");
const regexStrHistSelect = document.getElementById("regexStrHist");

//buttons
const clearBtn = document.getElementById("clearBtn");
const findBtn = document.getElementById("findBtn");
const formatBtn = document.getElementById("formatBtn");
const removeDuplicatesBtn = document.getElementById("removeDuplicatesBtn");

const goSound = new Audio('../public/app_alert-complete.mp3')
const errSound = new Audio('../public/app_alert-error.mp3')
let data = {
  'regexStr': "",
  'regexStrHist': [],
  'textBody': "",
  'formatResults': "{result}\n",
  'results': [],
  'soundFxOn': true,
}
window.onload = function() {
  loadData();
  displayData();
  document.getElementById("regexStr").onkeypress = function() {
    let e = window.event;
    if ((e.charCode || e.keyCode) === 13) {
      find();
    }
  };
  regexStrHistSelect.onchange = function() {
    regexStrInput.value = regexStrHistSelect.value;
  };
  document.getElementById("clearBtn").onclick = function() { clearHistory(); };
  findBtn.onclick = function() { find(); };
  formatBtn.onclick = function() { formatResults(); };
  removeDuplicatesBtn.onclick = function() { removeDuplicates(); };
};
/**
 * @public
 */
function clearHistory() {
  if (data['regexStrHist']) {
    data['regexStrHist'] = [];
    regexStrHistSelect.innerHTML = "";
    saveData();
    displayData();
  }
}
/**
 * @public
 */
function formatResults() {
  const formatText = formatTextBodyInput.value;
  if (data['results'] && formatText) {
    const size = data['results'].length;
    let str = "";
    for (let i = 0; i < size; i++) {
      const result = data['results'][i];
      const resultLen = data['results'][i].length;
      let formattedStr = formatText + "";
      for (let j = 0; j < resultLen; j++) {
        const regex = new RegExp("\{result" + (j ? j : '') + "\}", 'g');
        formattedStr = formattedStr.replace(regex, data['results'][i][j]);
      }
      str += formattedStr;
    }
    outputDiv.innerHTML = '<strong>Formatted Results (' + size + '):</strong> <textarea rows="10" class="full-width">' + str + '</textarea>';
  }
  saveData();
}
/**
 * @public
 */
function removeDuplicates() {
  const uniqueSet = [];
  const newResults = [];
  if (data['results']) {
    const size = data['results'].length;
    for (let i = 0; i < size; i++) {
      const str = data['results'][i][0];
      if (!uniqueSet.includes(str)) {
        uniqueSet.push(str);
        newResults.push(data['results'][i]);
      }
    }
    data['results'] = newResults.sort();
    saveData();
    displayData();
  }
}
/**
 * @public
 */
function find() {
  if (outputDiv && regexStrInput && textBodyInput) {
    let regexStr = regexStrInput.value;
    let regex = null;
    try {
      regex = new RegExp(regexStr, 'i');
      //'g' gets all matches, but the full match
      //'i' gets one "group match" and "index" where the group match was found.
    }
    catch(err) {
      console.log(err);
      outputDiv.innerHTML = (err + err.stack).replace(/\n/g, '<br/>');
      playErrSoundFx();
      return;
    }

    //if the regexStr already exists in history, remove it
    if (data['regexStrHist'].includes(regexStr)) {
      for( var i = 0; i < data['regexStrHist'].length; i++){ 
         if ( data['regexStrHist'][i] === regexStr) {
           data['regexStrHist'].splice(i, 1); 
         }
      }
    }
    //unshift adds it to the top of the array.
    data['regexStrHist'].unshift(regexStr);

    data['textBody'] = textBodyInput.value;
    const textBodyLen = data['textBody'].length;
    let results = [];
    let result = null;
    let index = 0;
    let temp = "";
    let done = false;
    while (!done) {
      if (index >= textBodyLen) {
        done = true;
      }
      else {
        result = temp.match(regex);
        if (result) {
          results.push(result);
          index = result.index + index + result[0].length;
        }
        else {
          done = true;
        }
      }
    }
    if (results.length > 0) {
      data['regexStr'] = regexStr;
      data['results'] = results;
      playGoSoundFx();
      saveData();
      displayData();
    }
    else {
      playErrSoundFx();
      outputDiv.innerHTML = "Nothing found";
    }
  }
}
function loadData() {
  const localData = window.localStorage.getItem(APP_DATA_KEY);
  if (localData) {
    const parsedData = JSON.parse(localData);
    if (parsedData) {
      data = parsedData;
    }
  }
}
function displayData() {
  if (data) {
    const histLen = data['regexStrHist'] ? data['regexStrHist'].length : 0;
    if (histLen > 0) {
      const firstRegexStr = data['regexStrHist'][0];
      regexStrInput.value = firstRegexStr;
      regexStrHistSelect.value = firstRegexStr;
      regexStrHistSelect.innerHTML = "";
      for (let i = 0; i < histLen; i++) {
        const str = data['regexStrHist'][i];
        regexStrHistSelect.innerHTML += '<option value="' + str.replace(/"/g,"&quot;") + '">' + encodedStr(str) + '</option>';
      }
    }
    textBodyInput.value = data['textBody'];
    formatTextBodyInput.value = data['formatResults'];
    if (data['results']) {
      const count = data['results'].length;
      let outputStr = "";
      outputStr = "<strong>Results (" + count + "):</strong> <ul>"
      for (let i = 0; i < count; i++) {
        outputStr += "<li>" + encodedStr(data['results'][i][0]) + "</li>";
        outputStr += "<ul>";
        let subSize = data['results'][i].length;
        for (let j = 1; j < subSize; j++) {
          outputStr += "<li>" + encodedStr(data['results'][i][j]) + "</li>";
        }
        outputStr += "</ul>";
      }
      outputStr += "</ul>";
      outputDiv.innerHTML = outputStr;
    }
  }
}
function playSound(audio) {
  if (data['soundFxOn']) {
    // stop the sound of it previously playing the same sound.
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}
function playGoSoundFx() {
  playSound(goSound);
}
function playErrSoundFx() {
  playSound(errSound);
}
function saveData() {
  data['formatResults'] = formatTextBodyInput.value;
  window.localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}
function clearData() {
  window.localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}
function encodedStr(str) {
  return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });
}