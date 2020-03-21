const CLOUD_COMPONENT = {
    LIST: $('#cloud-list-modal-list'),
    AUTOSAVE_SWITCH: $('#cloud-autosave-switch'),
    UPDATE_BTN: $('#cloud-update-btn'),
    EDITOR_BTN: $('#cloud-editor-btn'),
    SHARE_BTN: $('#cloud-share-btn'),
    DELETE_BTN: $('#cloud-remove-btn'),
    LOADING: false,
    CURRENT: false
};

function cloud_list_open() {
    if (NETAUTH.isLogin()) {
        $('#cloud-list-modal').modal('open');
        SGFDB.getMyList(res => {
            const list = res.payload.list;
            CLOUD_COMPONENT.LIST.empty();
            list.forEach(record => CLOUD_COMPONENT.LIST.append(`<a class="collection-item" onclick="load_cloud_sgf(${record.id});">
                    <span class="title">${record.filename} <span class="secondary-content">${record.updated_at}</span></span>
                    <p style="margin: 0;">${record.comment} &nbsp; </p></a>`));
        });
    } else {
        retryLogin('请先登录');
    }
}
