/* 設定の初期値 */
const settings = {
    fixAttendanceTable: false,
    emphasisOnPassing: false,
};

/* 拡張機能がインストールされたら設定の初期値をセットする */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set(settings);
});
