const SGFTree = function (viewer, sgfObject) {
    this.viewer = viewer;
    this.sgf = sgfObject;
    this.isOpen = false;
    this.card = $(`#${this.viewer}-card`);
    $(`#${viewer}`).jstree({
        core: {
            check_callback: true,
            data : [
                {
                    id: '0',
                    type: '#',
                    text: 'GoDojo SGF Editor',
                    state: {
                        opened: true,
                        selected: true
                    },
                    children: []
                }
            ],
        },
        types: {
            '#': {
                icon: 'img/logo32.png',
                valid_children: ['wstone', 'bstone']
            },
            wstone: {
                icon: 'img/wstone.png',
                valid_children: ['wstone', 'bstone']
            },
            bstone: {
                icon: 'img/bstone.png',
                valid_children: ['wstone', 'bstone']
            }
        },
        contextmenu: {
            items: {
                delete: {
                    label: '删除',
                    action: function () {
                    }
                }
            }
        },
        plugins: [
            "contextmenu", "types", "wholerow"
        ]
    });
    this.instance = $(`#${viewer}`).jstree();

    this.onStoneCreated = this._onStoneCreated.bind(this);
    this.onStoneDeleted = this._onStoneDeleted.bind(this);
}

SGFTree.prototype.onResize = function () {
    this.card.height($(document).height() * 0.7);
}

SGFTree.prototype._onStoneCreated = function (route, step) {
    if (!this.isOpen) {
        if (clound_autosave_status()) {
            update_cloud_sgf(true);
        } else {
            cloud_update_status();
        }
    }

    this._updateTree();

    let nid = '0_';
    for (let i = 0; i < route.length - 1; i++) {
        nid += `${route[i]}_`;
    }
    nid += route[route.length - 1];
    
    this.instance.deselect_all();
    this.instance.select_node(nid);
    this.card.animate({ scrollTop: $(`#${nid}_anchor`).position().top }, 100);
    this.card.animate({ scrollLeft: $(`#${nid}_anchor`).position().left }, 100);
}

SGFTree.prototype._onStoneDeleted = function (route) {
    if (!this.isOpen) {
        if (clound_autosave_status()) {
            update_cloud_sgf(true);
        } else {
            cloud_update_status();
        }
    }

    this._updateTree();
}

SGFTree.prototype._translateX = function (x) {
    const a = 'A'.charCodeAt();
    if (x >= 8) {
        x++;
    }
    return String.fromCharCode(a + x);
}

SGFTree.prototype._updateTree = function () {
    this._clearTree();
    this._doUpdateTree('0', this.sgf.runtime.branch.data, ['0']);
}

SGFTree.prototype._doUpdateTree = function (node, branch, prev) {
    let branchBegin = false;
    let lastId = false;
    let prevId = '';
    prev.forEach(p => prevId += `${p}_`);

    for (let i = 0; i < branch.length; i++) {
        if (branch[i] instanceof Array) {
            branchBegin = i;
            lastId = `${prevId}${i - 1}`;
            break;
        } else if (branch[i] === false) {
            continue;
        } else {
            const stone = branch[i].stone;
            const id = `${prevId}${i}`;
            this.instance.create_node(node, {
                id: id,
                type: `${stone.color}stone`,
                text: `[${this._translateX(stone.x)}, ${stone.y + 1}]`
            }, 'last', false, true);
        }
    }
    if (branchBegin !== false) {
        prev.push(branchBegin);
        this._doUpdateTree(node, branch[branchBegin], prev);
        prev.pop();

        if (branch.length - branchBegin > 2) {
            for (let i = branchBegin + 1; i < branch.length; i++) {
                const beginId = `${prevId}${i}_0`;
                const beginStone = branch[i][0].stone;
                this.instance.create_node(lastId, {
                    id: beginId,
                    type: `${beginStone.color}stone`,
                    text: `[${this._translateX(beginStone.x)}, ${beginStone.y + 1}]`
                }, 'last', false, true);
                prev.push(i);
                const br = branch[i].slice();
                br[0] = false;
                this._doUpdateTree(beginId, br, prev);
                prev.pop();
            }
        } else {
            prev.push(branchBegin + 1);
            this._doUpdateTree(lastId, branch[branchBegin + 1], prev);
            prev.pop();
        }
    }
}

SGFTree.prototype._clearTree = function () {
    const json = this.instance.get_json();
    return this.instance.delete_node(this._doClearTree(json[0].children));
}

SGFTree.prototype._doClearTree = function (array) {
    const deleted = [];
    array.forEach(node => {
        let children = [];
        if (node.children.length > 0) {
            children = this._doClearTree(children);
        }
        children.forEach(id => deleted.push(id));
        deleted.push(node.id);
    });
    return deleted;
}
