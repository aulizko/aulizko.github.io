(function () {
    var a = window.allThat = {
        userId : '123345456',
        server : 'http://mysite.com/',
        css : document.createElement('link'),
        script : document.createElement('script')
    },
    h = document.getElementsByTagName('head')[0];
    a.css.rel = 'stylesheet';
    a.css.href = a.server + 'css/bookmarklet.2.css';
    h.appendChild(a.css);
    a.script.src = a.server + 'js/bookmarklet.7.js';
    h.appendChild(a.script);
    h=null;
})();