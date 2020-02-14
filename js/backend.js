const USER_COMPONENT = {
    LOGIN_BTN: $('#user-login-btn'),
    RELOGIN_MODAL: $('#relogin-modal'),
    RELOGIN_MODAL_TITLE: $('#relogin-modal-title')
}

const SGFDBInterface = function () {
    this.url = 'https://api.godojo.cn/serve/sgf'
}

SGFDBInterface.prototype.request = function (method, data, callback) {
    data.method = method;
    data.token = NETAUTH.getInfo('token');
    $.ajax({
        url: this.url,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(data),
        success: res => {
            if (res.code == 2001) {
                $('#user-info-view').remove()
                logout();
                retryLogin('登录信息失效, 是否重新登录？')
            } else {
                callback(res);
            }
        }
    });
}

SGFDBInterface.prototype.existFilename = function (name, callback) {
    this.request('is_exist_filename', {
        filename: name
    }, res => callback(res.payload.exist));
}

SGFDBInterface.prototype.create = function (newSGF, callback) {
    const filename  = newSGF.filename ? $.trim(newSGF.filename) : false;
    const content   = newSGF.content ? $.trim(newSGF.content) : false;

    if (filename && content) {
        if (newSGF.comment) {
            newSGF.comment = $.trim(newSGF.comment);
        }

        this.request('create', newSGF, callback);
    }
}

SGFDBInterface.prototype.update = function (id, sgfInfo, callback) {
    const filename  = sgfInfo.filename ? $.trim(sgfInfo.filename) : false;
    const content   = sgfInfo.content ? $.trim(sgfInfo.content) : false;
    const comment   = sgfInfo.comment ? $.trim(sgfInfo.comment) : false;
    const data = {};
    if (filename) {
        data.filename = filename;
    }
    if (content) {
        data.content = content;
    }
    if (comment) {
        data.comment = comment;
    }
    if (sgfInfo.share != undefined) {
        data.share = sgfInfo.share;
    }
    data.id = id;
    this.request('update', data, callback);
}

SGFDBInterface.prototype.getMyList = function (callback, search=false) {
    this.request('get_my_list', {}, callback);
}

SGFDBInterface.prototype.get = function (id, callback) {
    this.request('get', { id: id }, callback);
}

SGFDBInterface.prototype.delete = function (id, callback) {
    this.request('delete', { id: id }, callback);
}

window.SGFDB = new SGFDBInterface();

function tryLogin() {
    if (NETAUTH.isLogin()) {
        headurl = NETAUTH.getInfo('headurl');
        USER_COMPONENT.LOGIN_BTN.css('display', 'none');
        USER_COMPONENT.LOGIN_BTN.after(`<div id="user-info-view" class="chip">
            <img src="${headurl == 'null' ? 'img/logo.png' : headurl}">
            ${NETAUTH.getInfo('name')}
            <i class="close material-icons" onclick="logout();">close</i>
            </div>`);
    }
}

function logout() {
    USER_COMPONENT.LOGIN_BTN.css('display', '');
    NETAUTH.logout();
}

function retryLogin(msg) {
    USER_COMPONENT.RELOGIN_MODAL_TITLE.text(msg);
    USER_COMPONENT.RELOGIN_MODAL.modal('open');
}

$(document).ready(() => {
    tryLogin();
});