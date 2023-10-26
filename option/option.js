window.addEventListener('load', async () => {
    /* 設定の初期値 */
    let settings = {
        fixAttendanceTable: false,
        emphasisOnPassing: false,
    };
    settings = await chrome.storage.local.get(settings);

    // 出欠表表示修正のチェックボックスの初期値設定
    const fixAttendanceTableCheckbox = document.querySelector('#fixAttendanceTableCheckBox');
    fixAttendanceTableCheckbox.checked = settings.fixAttendanceTable;

    // 出欠表表示修正のチェックボックスの初期値設定
    const emphasisOnPassingCheckbox = document.querySelector('#emphasisOnPassingCheckBox');
    emphasisOnPassingCheckbox.checked = settings.emphasisOnPassing;

    // 保存ボタンリスナ
    document.querySelector('#saveSettngsButton').addEventListener('click', () => {
        // 出欠表表示修正の設定を保存
        settings.fixAttendanceTable = fixAttendanceTableCheckbox.checked;
        settings.emphasisOnPassing = emphasisOnPassingCheckbox.checked;
        chrome.storage.local.set(settings);
        // 閉じる
        window.close();
    });
});
