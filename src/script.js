(async () => {
    const videos = Array.from(document.querySelectorAll('video'))
        .filter(video => video.readyState != 0)
        .filter(video => video.disablePictureInPicture == false)
        .sort((v1, v2) => {
          let v1Rect = v1.getClientRects()[0];
          let v2Rect = v2.getClientRects()[0];
          if(typeof v1Rect == "undefined")
              v1Rect = {width:0,height:0};
          if(typeof v2Rect == "undefined")
              v2Rect = {width:0,height:0};
          return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
        });

    if (videos.length === 0)
      return;


    const video = videos[0];

    if (!video.hasAttribute('__pip__')) {
        await video.requestPictureInPicture();
        video.setAttribute('__pip__', true);
        video.addEventListener('leavepictureinpicture', event => {
        video.removeAttribute('__pip__');
        }, {once: true});
    }
})();
