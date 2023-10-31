/* 設定の初期値 */
const mySettings = {
    fixAttendanceTable: false,
    emphasisOnPassing: false,
};

/* 拡張機能がインストールされたら設定の初期値をセットする */
chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.local.set({ settings: mySettings });
});
