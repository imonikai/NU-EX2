window.addEventListener('load', async () => {
    const mySettings = (await chrome.storage.local.get('settings')).settings;

    // 出欠表表示修正のチェックボックスの初期値設定
    const fixAttendanceTableCheckbox = document.querySelector('#fixAttendanceTableCheckBox');
    fixAttendanceTableCheckbox.checked = mySettings.fixAttendanceTable;

    // 出欠表表示修正のチェックボックスの初期値設定
    const emphasisOnPassingCheckbox = document.querySelector('#emphasisOnPassingCheckBox');
    emphasisOnPassingCheckbox.checked = mySettings.emphasisOnPassing;

    // 保存ボタンリスナ
    document.querySelector('#saveSettngsButton').addEventListener('click', () => {
        // 出欠表表示修正の設定を保存
        mySettings.fixAttendanceTable = fixAttendanceTableCheckbox.checked;
        mySettings.emphasisOnPassing = emphasisOnPassingCheckbox.checked;
        chrome.storage.local.set({ settings: mySettings });
        // 閉じる
        window.close();
    });
});
