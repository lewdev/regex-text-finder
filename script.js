const APP_DATA_KEY = "regex-text-finder";
const regexStrInput = document.getElementById("regexStr");
const textBodyInput = document.getElementById("text-body");
const formatTextBodyInput = document.getElementById("format-text");
const outputDiv = document.getElementById("output");
const regexStrHistSelect = document.getElementById("regexStrHist");
const goSound = new Audio('./multimedia_pop_up_alert_tone_1.mp3')
let data = {
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
      str += formatText.replace(/\{result\}/g, result);
    }
    outputDiv.innerHTML = '<strong>Formatted Results:</strong> <textarea rows="10" style="width: 100%">' + str + '</textarea>';
  }
  saveData();
}
function removeDuplicates() {
  const newArr = [];
  if (data.results) {
    const size = data.results.length;
    for (let i = 0; i < size; i++) {
      const str = data.results[i];
      if (!newArr.includes(str)) {
        newArr.push(str);
      }
    }
    data.results = newArr.sort();
    saveData();
    displayData();
  }
}
function find() {
  playSoundFx();
  if (outputDiv && regexStrInput && textBodyInput) {
    let regexStr = regexStrInput.value;
    let regex = null;
    try {
      regex = new RegExp('(' + regexStr + ')', 'g');
    }
    catch(err) {
      console.log(err);
      outputDiv.innerHTML = (err + err.stack).replace(/\n/g, '<br/>');
      return;
    }

    if (regexStr != data.regexStrHist[data.regexStrHist.length - 1]) {
      data.regexStrHist.push(regexStr);
    }
    data.textBody = textBodyInput.value;

    let re = data.textBody.match(regex);
    if (re) {
      data.results = re;
    }
    else {
      outputDiv.innerHTML = "Nothing found";
    }
    saveData();
    displayData();
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
      const lastRegexStr = data.regexStrHist[histLen - 1];
      regexStrInput.value = lastRegexStr;
      regexStrHistSelect.value = lastRegexStr
      regexStrHistSelect.innerHTML = "";
      for (let i = 0; i < histLen; i++) {
        const str = data.regexStrHist[i];
        regexStrHistSelect.innerHTML += '<option value="' + str + '">' + str + '</option>';
      }
    }
    textBodyInput.value = data.textBody;
    formatTextBodyInput.value = data.formatResults;
    if (data.results) {
      const count = data.results.length;
      let outputStr = "";
      //console.log(re);
      outputStr = "Results (" + count + "): <ul>"
      for (let i = 0; i < count; i++) {
        outputStr += "<li>" + data.results[i] + "</li>";
      }
      outputStr += "</ul>";
      outputDiv.innerHTML = outputStr;
    }
  }
}
function playSoundFx() {
  // stop the sound of it previously playing the same sound.
  goSound.pause();
  goSound.currentTime = 0;
  goSound.play();
}
function saveData() {
  data.formatResults = formatTextBodyInput.value;
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}
function clearData() {
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}
