(function (){ 
    const UA = navigator.userAgent;
    const isMobile = /AppleWebKit.*Mobile.*/.test(UA);
    if (/leaf.html/.test(window.location.href)) {
        !isMobile && (window.location.href = 'index.html');
    } else {
        isMobile && (window.location.href = 'leaf.html');
    }
})();