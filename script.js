const APP_DATA_KEY = "regex-text-finder";
const regexStrInput = document.getElementById("regexStr");
const textBodyInput = document.getElementById("text-body");
const formatTextBodyInput = document.getElementById("format-text");
const outputDiv = document.getElementById("output");
const regexStrHistSelect = document.getElementById("regexStrHist");
const goSound = new Audio('./multimedia_pop_up_alert_tone_1.mp3')
const errSound = new Audio('./app_alert_tone_remove_delete_003.mp3')
let data = {
  regexStr: "",
  regexStrHist: [],
  textBody: "",
  formatResults: "",
  results: [],
}

window.onload = function() {
  loadData();
  displayData();
};
function clearHistory() {
  if (data.regexStrHist) {
    data.regexStrHist = [];
    regexStrHistSelect.innerHTML = "";
    saveData();
    displayData();
  }
}
function formatResults() {
  const formatText = formatTextBodyInput.value;
  if (data.results && formatText) {
    const size = data.results.length;
    let str = "";
    for (let i = 0; i < size; i++) {
      const result = data.results[i];
      const resultLen = data.results[i].length;
      let formattedStr = formatText + "";
      for (let j = 0; j < resultLen; j++) {
        const regex = new RegExp("\{result" + j + "\}", 'g');
        formattedStr = formattedStr.replace(regex, data.results[i][j]);
      }
      str += formattedStr;
    }
    outputDiv.innerHTML = '<strong>Formatted Results (' + size + '):</strong> <textarea rows="10" class="full-width">' + str + '</textarea>';
  }
  saveData();
}
function removeDuplicates() {
  const uniqueSet = [];
  const newResults = [];
  if (data.results) {
    const size = data.results.length;
    for (let i = 0; i < size; i++) {
      const str = data.results[i][0];
      if (!uniqueSet.includes(str)) {
        uniqueSet.push(str);
        newResults.push(data.results[i]);
      }
    }
    data.results = newResults.sort();
    saveData();
    displayData();
  }
}
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
    if (data.regexStrHist.includes(regexStr)) {
      for( var i = 0; i < data.regexStrHist.length; i++){ 
         if ( data.regexStrHist[i] === regexStr) {
           data.regexStrHist.splice(i, 1); 
         }
      }
    }
    //unshift adds it to the top of the array.
    data.regexStrHist.unshift(regexStr);

    data.textBody = textBodyInput.value;
    const textBodyLen = data.textBody.length;
    let results = [];
    let result = null;
    let index = 0;
    let temp = "";
    let done = false;
    while (!done) {
      if (index >= textBodyLen) {
        done = true;
      }
      else {        temp = data.textBody.substr(index);
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
      data.regexStr = regexStr;
      data.results = results;
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
  const parsedData = JSON.parse(localStorage.getItem(APP_DATA_KEY));
  if (parsedData) {
    data = parsedData;
  }
  else {
    alert("failed to parse data");
  }
}
function displayData() {
  if (data) {
    const histLen = data.regexStrHist.length;
    if (histLen > 0) {
      const firstRegexStr = data.regexStrHist[0];
      regexStrInput.value = firstRegexStr;
      regexStrHistSelect.value = firstRegexStr;
      regexStrHistSelect.innerHTML = "";
      for (let i = 0; i < histLen; i++) {
        const str = data.regexStrHist[i];
        regexStrHistSelect.innerHTML += '<option value="' + str.replace(/"/g,"&quot;") + '">' + encodedStr(str) + '</option>';
      }
    }
    textBodyInput.value = data.textBody;
    formatTextBodyInput.value = data.formatResults;
    if (data.results) {
      const count = data.results.length;
      let outputStr = "";
      outputStr = "<strong>Results (" + count + "):</strong> <ul>"
      for (let i = 0; i < count; i++) {
        outputStr += "<li>" + encodedStr(data.results[i][0]) + "</li>";
        outputStr += "<ul>";
        let subSize = data.results[i].length;
        for (let j = 1; j < subSize; j++) {
          outputStr += "<li>" + encodedStr(data.results[i][j]) + "</li>";
        }
        outputStr += "</ul>";
      }
      outputStr += "</ul>";
      outputDiv.innerHTML = outputStr;
    }
  }
}
function playGoSoundFx() {
  // stop the sound of it previously playing the same sound.
  goSound.pause();
  goSound.currentTime = 0;
  goSound.play();
}
function playErrSoundFx() {
  // stop the sound of it previously playing the same sound.
  errSound.pause();
  errSound.currentTime = 0;
  errSound.play();
}
function saveData() {
  data.formatResults = formatTextBodyInput.value;
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}
function clearData() {
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}
function encodedStr(str) {
  return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });
}
