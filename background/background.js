/* 拡張機能がインストールされたら設定の初期値をセットする */
chrome.runtime.onInstalled.addListener(async () => {
    /* 設定の初期値 */
    let mySettings = {
        emphasisOnPassing: false,
    };

    /* すでに設定が存在していたならその設定をセットする */
    const tmpSettings = (await chrome.storage.local.get('settings')).settings;
    if (tmpSettings !== undefined) {
        mySettings = tmpSettings;
    }

    chrome.storage.local.set({ settings: mySettings });
});
