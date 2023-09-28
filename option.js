window.addEventListener("load", async() => {


    chrome.storage.local.get("fixAttendanceTable").then( (obj) => {
        const checkbox = document.querySelector("#fixAttendanceTableCheckBox");
        if( obj.fixAttendanceTable === undefined )
            checkbox.checked = false;
        else
            checkbox.checked = obj.fixAttendanceTable;
    });

    document.querySelector("#saveSettngsButton").addEventListener("click", () => {
        const checkbox = document.querySelector("#fixAttendanceTableCheckBox");
        chrome.storage.local.set({ fixAttendanceTable: checkbox.checked });
        window.close();
    });

});
