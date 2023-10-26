window.addEventListener('load', async () => {
    // 出欠表表示修正のチェックボックスの初期値設定
    chrome.storage.local.get('fixAttendanceTable').then((obj) => {
        const checkbox = document.querySelector('#fixAttendanceTableCheckBox');
        if (obj.fixAttendanceTable === undefined) checkbox.checked = false;
        else checkbox.checked = obj.fixAttendanceTable;
    });

    // 出欠表表示修正のチェックボックスの初期値設定
    chrome.storage.local.get('emphasisOnPassing').then((obj) => {
        const checkbox = document.querySelector('#emphasisOnPassingCheckBox');
        if (obj.emphasisOnPassing === undefined) checkbox.checked = false;
        else checkbox.checked = obj.emphasisOnPassing;
    });

    // 保存ボタンリスナ
    document.querySelector('#saveSettngsButton').addEventListener('click', () => {
    // 出欠表表示修正の設定を保存
        const fixAttendanceTableCheckBox = document.querySelector('#fixAttendanceTableCheckBox');
        chrome.storage.local.set({ fixAttendanceTable: fixAttendanceTableCheckBox.checked });

        // 合格不合格科目強調表示の設定を保存
        const emphasisOnPassingCheckBox = document.querySelector('#emphasisOnPassingCheckBox');
        chrome.storage.local.set({ emphasisOnPassing: emphasisOnPassingCheckBox.checked });

        // 閉じる
        window.close();
    });
});
