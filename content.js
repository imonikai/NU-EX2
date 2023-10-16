/* 成績詳細表示のコード */
function grades() {
    const KAMOKU_ARRAY = document.querySelectorAll('.kamokuLevel1, .kamokuLevel2, .kamokuLevel7'); // 科目名の配列を取得

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

    for (let i = 0; i < KAMOKU_ARRAY.length; i += 1) {
        if (KAMOKU_ARRAY[i].textContent.includes('（必修）') || KAMOKU_ARRAY[i].textContent.includes('（選択）') || KAMOKU_ARRAY[i].textContent.includes('専門教育科目')) {
            // 連想配列のキーを設定、存在していなかった場合は0で初期化
            dicKey = KAMOKU_ARRAY[i].textContent;
            if ((dicKey in shutokuDic) === false) {
                shutokuDic[dicKey] = 0;
                rishuchuDic[dicKey] = 0;
                kamokuNameArray.push(KAMOKU_ARRAY[i].textContent);
            }
        }

        const tani = Number(TANI_ARRAY[i].textContent);

        // 合格単位数と履修中単位数を計算する。
        switch (HYOKA_ARRAY[i].textContent) {
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
        switch (HYOKA_ARRAY[i].textContent) {
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
        switch (HYOKA_ARRAY[i].textContent) {
        case 'S':
        case 'A':
        case 'B':
        case 'C':
        case 'D':
        case 'E':
            sumRishu += Number(TANI_ARRAY[i].textContent);
            break;
        }

        // 合格した科目を緑、不合格の科目を赤で強調する。（設定でオフならしない）
        chrome.storage.local.get('emphasisOnPassing').then((obj) => {
            if (obj.emphasisOnPassing !== undefined && obj.emphasisOnPassing === true) {
                switch (HYOKA_ARRAY[i].textContent) {
                case 'S':
                case 'A':
                case 'B':
                case 'C':
                case 'N':
                    HYOKA_ARRAY[i].style.background = '#99FF66';
                    break;
                case 'D':
                case 'E':
                    HYOKA_ARRAY[i].style.background = '#FF82B2';
                    break;
                }
            }
        });
    }

    // GPAを計算する
    gpa = Math.round((sumHyoka / sumRishu) * 100) / 100;

    // popupからレスポンスされたらデータを渡すようにする
    chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
        sendReponse(
            {
                status: 'OK',
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

/* 出欠表表示修正関数 */
function attendance() {
    function fixAttendanceTable() {
        document.querySelector('.scroll_div').style.height = '100%';
        const midashiTables = document.querySelectorAll('.fixed_header_display_none_at_print');
        midashiTables.forEach((e) => e.parentNode.removeChild(e));
    }

    /* 出欠表のテーブルが出来るまで待ち、テーブルができたら表示修正をする */
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

function main() {
    // h2要素の取得は現在のページを判定するのに必要
    const h2 = document.querySelector('h2');

    // 成績詳細表示 成績ページでないならポップアップに返す何もないデータを設定する
    const isScorePage = (h2 !== null && h2.textContent.includes('成績照会'));
    if (isScorePage === true) {
        grades();
    } else {
        // ポップアップされたときに返すデータがないとエラーになるので、何もないデータを返すことにしておく
        chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
            sendReponse({ status: 'default' });
            return true;
        });
    }

    // 出席表表示修正 出席ページでない、または設定がオフなら何もしない
    const isAttendancePage = (h2 !== null && h2.textContent.includes('学生出欠状況確認'));
    if (isAttendancePage === true) {
        chrome.storage.local.get('fixAttendanceTable').then((obj) => {
            if (obj.fixAttendanceTable !== undefined && obj.fixAttendanceTable === true) {
                attendance();
            }
        });
    }
}

window.addEventListener('load', () => {
    main();
});
