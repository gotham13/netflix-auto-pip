function getBaseUrl() {
    return window.location.origin;
}

$('#togglepip').click(()=>{
    chrome.tabs.query({active:true, currentWindow:true},(tabs)=> {
        chrome.tabs.executeScript(tabs[0].id, {file: 'script1.js', allFrames: true});
    });
});

    $('#nflxpip').checkbox({
            onChecked:()=>{
                localStorage.setItem("nflx","true");
            },
            onUnchecked:()=>{
                localStorage.setItem("nflx","false");
            }
    });

    $('#sitepip').checkbox({
            onChecked:()=>{
                chrome.tabs.query({active:true, currentWindow:true},(tabs)=>{
                    chrome.tabs.executeScript(tabs[0].id,{
                        code: '(' + getBaseUrl + ')();'
                    }, function (results) {
                        if(chrome.runtime.lastError)
                            console.log("aaa");
                        if(typeof results !== 'undefined') {
                            if(results[0].indexOf("netflix")!==-1)
                                localStorage.setItem("nflx","true");
                            else {
                                let urls = localStorage.getItem("urls");
                                if(urls !== null) {
                                    let url_arr = JSON.parse(urls);
                                    url_arr.push(results[0]);
                                    localStorage.setItem("urls",JSON.stringify(url_arr));
                                } else {
                                    localStorage.setItem("urls",JSON.stringify([results[0]]));
                                }
                            }
                        }
                    });
                });
            },
            onUnchecked:()=>{
                chrome.tabs.query({active:true, currentWindow:true},(tabs)=>{
                    chrome.tabs.executeScript(tabs[0].id,{
                        code: '(' + getBaseUrl + ')();'
                    }, function (results) {
                        if(chrome.runtime.lastError)
                            console.log("aaa");
                        if(typeof results !== 'undefined') {
                            if (results[0].indexOf("netflix") !== -1)
                                localStorage.setItem("nflx", "false");
                            else {
                                let urls = localStorage.getItem("urls");
                                if (urls !== null) {
                                    let url_arr = JSON.parse(urls);
                                    url_arr = url_arr.filter(url => url !== results[0]);
                                    localStorage.setItem("urls", JSON.stringify(url_arr));
                                }
                            }
                        }
                    });
                });
            }
    });

    let nflx = localStorage.getItem("nflx");
    let urls = localStorage.getItem("urls");
    chrome.tabs.query({active:true, currentWindow:true},(tabs)=>{
        chrome.tabs.executeScript(tabs[0].id,{
            code: '(' + getBaseUrl + ')();'
        }, function (results) {
            if(chrome.runtime.lastError)
                console.log("aaa");
            if(typeof results !== 'undefined') {
                if (nflx !== null) {
                    if (nflx == "true")
                        $('#nflxpip')
                            .checkbox("set checked");}

                if (urls !== null) {
                    let url_arr = JSON.parse(urls);
                    url_arr = url_arr.filter(u => u.indexOf(results[0]) !== -1);
                    if (url_arr.length > 0)
                        $('#sitepip')
                            .checkbox("set checked");}
            }
        });
    });