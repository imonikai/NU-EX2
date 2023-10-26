window.addEventListener('load', async () => {
    // 出欠表表示修正のチェックボックスの初期値設定
    const fixAttendanceTableFlag = await chrome.storage.local.get('fixAttendanceTable');
    const fixAttendanceTableCheckbox = document.querySelector('#fixAttendanceTableCheckBox');
    if (fixAttendanceTableFlag.fixAttendanceTable === undefined) {
        fixAttendanceTableCheckbox.checked = false;
    } else {
        fixAttendanceTableCheckbox.checked = fixAttendanceTableFlag.fixAttendanceTable;
    }

    // 出欠表表示修正のチェックボックスの初期値設定
    const emphasisOnPassingFlag = await chrome.storage.local.get('emphasisOnPassing');
    const emphasisOnPassingCheckbox = document.querySelector('#emphasisOnPassingCheckBox');
    if (emphasisOnPassingFlag.emphasisOnPassing === undefined) {
        emphasisOnPassingCheckbox.checked = false;
    } else {
        emphasisOnPassingCheckbox.checked = emphasisOnPassingFlag.emphasisOnPassing;
    }

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
