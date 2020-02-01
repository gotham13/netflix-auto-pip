if (!document.pictureInPictureEnabled) {
  chrome.browserAction.setTitle({ title: 'Picture-in-Picture NOT supported' });
} else {

  function make_check(url) {
    let nflx = localStorage.getItem("nflx");
    let urls = localStorage.getItem("urls");
    if (nflx == null && urls == null)
      return false;
    else if(nflx == null) {
      let url_arr = JSON.parse(urls);
      url_arr = url_arr.filter(u=>u.indexOf(url)!==-1);
      return url_arr.length !== 0;
    } else {
      if(nflx=="true"){
        let netflix_regexp = new RegExp('(?:.*)://(?:.*).netflix.com/watch/(?:.*)');
        if(!netflix_regexp.test(url)) {
          if(urls==null)
            return false;
          let url_arr = JSON.parse(urls);
          url_arr = url_arr.filter(u=>u.indexOf(url)!==-1);
          return url_arr.length !== 0;
        }
        return true;
      } else {
        if(urls==null)
          return false;
        let url_arr = JSON.parse(urls);
        url_arr = url_arr.filter(u=>u.indexOf(url)!==-1);
        return url_arr.length !== 0;
      }
    }
  }

  function getBaseUrl(){
    return window.location.origin;
  }

  chrome.tabs.onUpdated.addListener(function listener (tabId, info,tab) {
    if(!tab.url)
        return;
      chrome.tabs.executeScript(tabId,{
        code: '(' + getBaseUrl + ')();'
      }, function (results) {
        if(chrome.runtime.lastError)
          return;

        let check_url = tab.url;
        if(check_url.indexOf("netflix") === -1)
          check_url=results[0];

        if (make_check(check_url) && info.status === 'complete') {
          var scriptInterval = setInterval(function () {
            chrome.tabs.executeScript(tabId,{
              code: '(' + getBaseUrl + ')();'
            },function (res) {
              if(chrome.runtime.lastError) {
                clearInterval(scriptInterval);
              } else {
                let check_url = tab.url;
                if(check_url.indexOf("netflix") === -1)
                  check_url=res[0];
                if(make_check(check_url)) {
                  chrome.tabs.executeScript(tabId,{file: 'script.js', allFrames: true },()=>{
                    if(chrome.runtime.lastError) {
                      clearInterval(scriptInterval);
                    }
                  });
                }
              }
            });
          },1000);

          chrome.tabs.onUpdated.addListener(function listener (tabId1, info,tab1) {
            if(tabId1===tabId) {
              chrome.tabs.executeScript(tabId,{
                code: '(' + getBaseUrl + ')();'
              }, function (results1) {
                if(chrome.runtime.lastError)
                  return;

                let check_url1 = tab1.url;
                if(check_url1.indexOf("netflix") === -1)
                  check_url1=results1[0];
                if (!make_check(check_url1))
                  clearInterval(scriptInterval);
              });
            }
          });
        }
      });
  });
}