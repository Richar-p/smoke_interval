const { ipcRenderer } = require('electron')

document.getElementById('interval').addEventListener('change', function() {
  ipcRenderer.send('change-interval', document.getElementById("interval").value)
});
