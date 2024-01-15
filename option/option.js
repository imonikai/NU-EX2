window.addEventListener('load', async () => {
    const mySettings = (await chrome.storage.local.get('settings')).settings;

    // 合格強調のチェックボックスの初期値設定
    const emphasisOnPassingCheckbox = document.querySelector('#emphasisOnPassingCheckBox');
    emphasisOnPassingCheckbox.checked = mySettings.emphasisOnPassing;

    // 保存ボタンリスナ
    document.querySelector('#saveSettngsButton').addEventListener('click', () => {
        // 設定を保存
        mySettings.emphasisOnPassing = emphasisOnPassingCheckbox.checked;
        chrome.storage.local.set({ settings: mySettings });
        // 閉じる
        window.close();
    });
});
