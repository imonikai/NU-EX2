/* 設定の初期値 */
let mySettings = {
    fixAttendanceTable: false,
    emphasisOnPassing: false,
};

/* 拡張機能がインストールされたら設定の初期値をセットする */
chrome.runtime.onInstalled.addListener(async () => {
    mySettings = (await chrome.storage.local.get('settings')).settings;
    chrome.storage.local.set({ settings: mySettings });
});
