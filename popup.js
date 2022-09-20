'use strict';

window.addEventListener('load', () => {
    chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {message: "NU-PortalExtension"}, (response) => {
            //ここに書いていく
            //console.log(response);
            const divElement = document.querySelector("#description");
            divElement.textContent = "";

            const shutokuTable = createTable("取得済み単位", response.shutokuDic, response.kamokuNameArray);
            divElement.after(shutokuTable);
            const rishuchuTable = createTable("履修中単位", response.rishuchuDic, response.kamokuNameArray);
            shutokuTable.after(rishuchuTable);
            const gpaElement = document.createElement('p');
            gpaElement.textContent = 'あなたのGPA: ' + response.gpa + '　(by NU-PortalExtension2)';
            gpaElement.style.fontSize = '1.2em';
            gpaElement.style.marginTop = '1em';
            gpaElement.style.marginBottom = '1em';
            rishuchuTable.after(gpaElement);

        })
    })
});

function createTable(title,dict, keys)
{
    const table =  document.createElement('table');
    let tr = document.createElement('tr');
    const caption = document.createElement('caption');
    let sum = 0;

    caption.textContent = title;
    caption.style.marginTop = '2em';
    table.appendChild(caption);

    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        tr.appendChild(th);
    });
    const sumTh = document.createElement('th');
    sumTh.textContent = '合計';
    sumTh.style.textAlign = 'center';
    tr.appendChild(sumTh);
    table.appendChild(tr);
    
    tr = document.createElement('tr');
    keys.forEach(key => {
        const td = document.createElement('td');
        td.textContent = dict[key];
        sum += Number(dict[key]);
        td.style.textAlign = 'center';
        td.style.border = 'solid 1px';
        tr.appendChild(td);
    })
    const sumTd = document.createElement('td');
    sumTd.textContent = sum;
    sumTd.style.textAlign = 'center';
    sumTd.style.border = 'solid 1px';
    tr.appendChild(sumTd);
    table.appendChild(tr);

    table.style.border = 'solid 1px';
    table.append(tr);

    return table;
}