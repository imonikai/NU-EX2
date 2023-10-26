/* 設定の初期値 */
let settings = {
    fixAttendanceTable: false,
    emphasisOnPassing: false,
};

/* 拡張機能がインストールされたら設定の初期値をセットする */
chrome.runtime.onInstalled.addListener(async () => {
    settings = await chrome.storage.local.get(settings);
    chrome.storage.local.set(settings);
});
