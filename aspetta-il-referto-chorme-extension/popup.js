'use strict';


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('codiceFiscale').addEventListener('change', updateValue);
    document.getElementById('idReferto').addEventListener('change', updateValue);
    document.getElementById('minuti').addEventListener('change', (e) => {
        updateValue(e)
        setMinutiSlider(e.target.value)
    });

    document.getElementById('emailNotifica').addEventListener('change', updateValue)

    console.log("Added listeners")

    loadData()
  });

  function setMinutiSlider(newValue) {
    document.getElementById('minutiDisplay').innerHTML = `${newValue} minuti`
  }

function loadData() {
    console.log("Loading values from storage")

    chrome.storage.sync.get({codiceFiscale: '', idReferto: '', minuti: '10', emailNotifica: ''}, function(items) {
        document.getElementById('codiceFiscale').value = items.codiceFiscale;
        document.getElementById('idReferto').value = items.idReferto;
        document.getElementById('minuti').value = items.minuti;
        setMinutiSlider(items.minuti);

        document.getElementById('emailNotifica').value = items.emailNotifica;
    });
}

function updateValue(event) {
    let id = event.target.id
    let value = event.target.value
    chrome.storage.sync.set({[id]: value }, function() {
        console.log(`Saved ${id} with value ${value}`)
        notifyBackgroundOfChange()
    });
}

function notifyBackgroundOfChange() {
    console.log("Notifiying background.js of a change")
 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {method: "updated-values"}, function(response) {
            console.log(response);
        });
      });
}