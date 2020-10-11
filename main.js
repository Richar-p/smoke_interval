//  libs
const { app, BrowserWindow, TouchBar, ipcMain }         = require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

//  vars
let startTime         = new Date(2012, 10, 22, 23, 0, 1);
let spinLength        = 0;
let window

//  touchBar objects
const ask_smoke       = new TouchBarButton({
                          label: '🤔 Can i smoke?',
                          backgroundColor: '#7851A9',
                          click: () => {
                            if (timeCalc()) {
                              return setOkLabel();
                            }
                            setNotLabel();
                          }
                        })
const result          = new TouchBarLabel()
const conf_smoke      = new TouchBarButton({
                          enabled: false,
                          click: () => {
                            goSmokeLabel()
                          }
                        });
const conf_no_smoke   = new TouchBarButton({
                          enabled: false,
                          click: () => {
                            notGoSmokeLabel()
                          }
                        });
const touchBar        = new TouchBar({
  items: [
    ask_smoke,
    new TouchBarSpacer({ size: 'small' }),
    result,
    new TouchBarSpacer({ size: 'large' }),
    conf_smoke,
    new TouchBarSpacer({ size: 'small' }),
    conf_no_smoke
  ]
})

//  functions
const timeCalc        = () => {
  return Date.now() - startTime >= spinLength
}
const setOkLabel      = () => {
  result.label          = 'Yes you can smoke 🥳'
  conf_smoke.label      = '🚬 Thank\'s i go smoke'
  conf_no_smoke.label   = '🚭 Hmm no thank\'s'
  conf_smoke.enabled    = true
  conf_no_smoke.enabled = true
  ask_smoke.enabled     = false
}
const setNotLabel     = () => {
  result.label = 'No you cannot, you need to wait ' + remaining() + ' more second(s) 😡'
  setTimeout(function(){ result.label = '' }, 10000);
}
const goSmokeLabel    = () => {
  conf_smoke.label      = ''
  conf_no_smoke.label   = ''
  result.label          = 'Have a good time 🥳'

  conf_smoke.enabled    = false
  conf_no_smoke.enabled = false
  ask_smoke.enabled     = true

  startTime             = Date.now();
  setTimeout(function(){ result.label = '' }, 3000);
}
const notGoSmokeLabel = () => {
  conf_smoke.label      = ''
  conf_no_smoke.label   = ''
  result.label          = 'Yeh, that\'s a good choice 🚭'

  conf_smoke.enabled    = false
  conf_no_smoke.enabled = false
  ask_smoke.enabled     = true

  setTimeout(function(){ result.label = '' }, 3000);
}
const remaining       = () => {
  return Math.floor(((startTime - Date.now()) + spinLength) / 1000)
}
const createWindow    = () => {
  window = new BrowserWindow({
    width: 200,
    height: 200,
    backgroundColor: '#000',
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadFile('index.html');
  window.setTouchBar(touchBar);
}

//  events
ipcMain.on('change-interval', (event, arg) => {
  spinLength = arg * 1000 * 3600
});

//  window
app.whenReady().then(() => {
  createWindow();
})
