/* 成績ページの関数 */
function gradesPage(settings) {
    const KAMOKU_ARRAY = Array.from(document.querySelectorAll('.kamokuLevel1, .kamokuLevel2, .kamokuLevel7')); // 科目名の配列を取得

    const TANI_ARRAY = Array.from(document.querySelectorAll('.colTani')); // 単位数の配列を取得
    const HYOKA_ARRAY = Array.from(document.querySelectorAll('.colHyoka')); // 成績評価の配列を取得

    TANI_ARRAY.shift(); // 先頭にth要素が入ってしまって処理に不都合なので削除
    HYOKA_ARRAY.shift(); // 先頭にth要素が入ってしまって処理に不都合なので削除

    const shutokuDic = {}; // 授業種別をキーとして合格単位を格納する連想配列
    const rishuchuDic = {}; // 授業種別をキーとして履修中単位を格納する連想配列
    let dicKey; // 連想配列dicのキー。forループで使う
    const kamokuNameArray = []; // 科目名のリスト
    let sumHyoka = 0; // 重み付けした評価の総数
    let sumRishu = 0; // 合計履修数
    let sumShutoku = 0; // 合計取得単位数
    let sumRishuchu = 0; // 合計履修中単位数
    let gpa = 0; // GPA

    /* 成績表の指定された行の情報を上記の変数から読み取って、処理を行う関数 */
    function processTableRow(index) {
        if (KAMOKU_ARRAY[index].textContent.includes('（必修）')
         || KAMOKU_ARRAY[index].textContent.includes('（選択）')
         || KAMOKU_ARRAY[index].textContent.includes('専門教育科目')) {
            // 連想配列のキーを設定、存在していなかった場合は0で初期化
            dicKey = KAMOKU_ARRAY[index].textContent;
            if ((dicKey in shutokuDic) === false) {
                shutokuDic[dicKey] = 0;
                rishuchuDic[dicKey] = 0;
                kamokuNameArray.push(KAMOKU_ARRAY[index].textContent);
            }
        }

        /* 単位 */
        const tani = Number(TANI_ARRAY[index].textContent);

        // 合格単位数と履修中単位数を計算する。
        switch (HYOKA_ARRAY[index].textContent) {
        case 'S':
        case 'A':
        case 'B':
        case 'C':
        case 'N':
            shutokuDic[dicKey] += tani;
            sumShutoku += tani;
            break;
        case '':
            rishuchuDic[dicKey] += tani;
            sumRishuchu += tani;
            break;
        }

        // 重み付けした評価の総計を計算する
        switch (HYOKA_ARRAY[index].textContent) {
        case 'S':
            sumHyoka += tani * 4;
            break;
        case 'A':
            sumHyoka += tani * 3;
            break;
        case 'B':
            sumHyoka += tani * 2;
            break;
        case 'C':
            sumHyoka += tani;
            break;
        }

        // 合計履修数を計算する
        switch (HYOKA_ARRAY[index].textContent) {
        case 'S':
        case 'A':
        case 'B':
        case 'C':
        case 'D':
        case 'E':
            sumRishu += Number(TANI_ARRAY[index].textContent);
            break;
        }

        // 合格した科目を緑、不合格の科目を赤で強調する。（設定でオフならしない）
        if (settings.emphasisOnPassing === true) {
            switch (HYOKA_ARRAY[index].textContent) {
            case 'S':
            case 'A':
            case 'B':
            case 'C':
            case 'N':
                HYOKA_ARRAY[index].style.background = '#99FF66';
                break;
            case 'D':
            case 'E':
                HYOKA_ARRAY[index].style.background = '#FF82B2';
                break;
            }
        }
    }

    /* すべての行の情報分処理を行う */
    for (let i = 0; i < KAMOKU_ARRAY.length; i += 1) {
        processTableRow(i);
    }

    // GPAを計算する
    gpa = Math.round((sumHyoka / sumRishu) * 100) / 100;

    // popupからレスポンスされたらデータを渡すようにする
    chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
        sendReponse(
            {
                status: 'gradesPage',
                shutokuDic,
                rishuchuDic,
                kamokuNameArray,
                sumShutoku,
                sumRishuchu,
                gpa,
            },
        );
        return true;
    });
}

/* 出欠表ページの関数 */
function attendancePage(settings) {
    /* テーブルの修正関数 */
    function fixAttendanceTable() {
        document.querySelector('.scroll_div').style.height = '100%';
        const midashiTables = document.querySelectorAll('.fixed_header_display_none_at_print');
        midashiTables.forEach((e) => e.parentNode.removeChild(e));
    }

    /* 出欠表のテーブルが出来るまで待ち、テーブルができたら表示修正をする（設定でオフなら何もしない） */
    if (settings.fixAttendanceTable === true) {
        let tableExistCheckCount = 0;
        const intervalId = setInterval(() => {
            tableExistCheckCount += 1;
            console.log(`出席テーブルが存在するか調べています。チェック回数:${tableExistCheckCount}`);
            if (document.querySelector('.scroll_div') !== null) {
                console.log('出席テーブルが見つかりました。チェックを停止します。');
                clearInterval(intervalId);
                console.log('チェックが停止されたはずです。');
                fixAttendanceTable();
            } else if (tableExistCheckCount === 10) {
                console.log('出席テーブルが存在しませんでした。チェックを停止します。');
                clearInterval(intervalId);
                console.log('チェックが停止されたはずです。');
            }
        }, 1000);
    }
}

async function main() {
    /* 設定を読み込み */
    const mySettings = (await chrome.storage.local.get('settings')).settings;

    /* ポップアップするデータを設定されているかのフラグ */
    let existPopupData = false;

    // h2要素の取得は現在のページを判定するのに必要
    const h2 = document.querySelector('h2');

    // 成績ページでgradePage関数を呼び出し 成績ページでないなら呼び出さない
    const isScorePage = (h2 !== null && h2.textContent.includes('成績照会'));
    if (isScorePage === true) {
        gradesPage(mySettings);
        existPopupData = true;
    }

    // 出欠表ページでattendancePage関数を呼び出し 出席ページでないなら呼び出さない
    const isAttendancePage = (h2 !== null && h2.textContent.includes('学生出欠状況確認'));
    if (isAttendancePage === true) {
        attendancePage(mySettings);
    }

    // ポップアップされたときに返すデータがないとエラーになるので、何もないデータを返すことにしておく
    if (existPopupData === false) {
        chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
            sendReponse({ status: 'default' });
            return true;
        });
    }
}

window.addEventListener('load', main);
