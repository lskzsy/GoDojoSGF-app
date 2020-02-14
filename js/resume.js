function dataBackup() {
    /** 保存棋谱信息和播放器信息 */
    if (sgf) {
        localStorage.setItem('resume_data_title', $('#page-title').text());
        localStorage.setItem('resume_data_sgf', sgf.instance.save());
        localStorage.setItem('resume_data_route', 
            JSON.stringify(sgf.instance.runtime.player.getRoute()));
    }

    /** 保存云棋谱信息 */
    if (CLOUD_COMPONENT && CLOUD_COMPONENT.CURRENT) {
        localStorage.setItem('resume_data_cloud', JSON.stringify(CLOUD_COMPONENT.CURRENT));
    }
}

function dataResume() {
    let isResume = false;
    const title         = localStorage.getItem('resume_data_title');
    const sgfData       = localStorage.getItem('resume_data_sgf');
    const playerRoute   = localStorage.getItem('resume_data_route');
    const cloudInfo     = localStorage.getItem('resume_data_cloud');

    if (sgfData) {
        isResume = true;
        window.sgf = SGFPlayer.open(sgfData, 'chessboard', 'tree');
        $('#cloud-list-modal').modal('close');
        $('#begin-modal').modal('close');
        $('#page-title').text(title);
        console.log(playerRoute);
        setTimeout(() => sgf.instance.jump(JSON.parse(playerRoute)), 500);

        localStorage.removeItem('resume_data_sgf');
        localStorage.removeItem('resume_data_route');
        localStorage.removeItem('resume_data_title');
    }
    if (cloudInfo) {
        const cloud = JSON.parse(cloudInfo);
        CLOUD_COMPONENT.CURRENT = cloud;
        CLOUD_COMPONENT.SHARE_BTN.attr('data-clipboard-text', `https://sgf.godojo.cn/?visit=${cloud.id}`);
        cloud_mode(true);
        localStorage.removeItem('resume_data_cloud');
    }
    return isResume;
}