const SGFPlayer = function (instance, boardViewer, treeViewer) {
    this.instance       = instance;
    this.boardViewer    = boardViewer;
    // this.tree           = new SGFTree(treeViewer, this.instance);
    this.startup();
}

SGFPlayer.create = function (size, boardViewer, treeViewer) {
    return new SGFPlayer(SGF.create({
        boardSize: size,
        isKo: true
    }), boardViewer, treeViewer);
}

SGFPlayer.open = function (sgfData, boardViewer, treeViewer) {
    return new SGFPlayer(SGF.create({ 
        data: sgfData,
        isKo: true
    }), boardViewer, treeViewer);
}

SGFPlayer.prototype.startup = function () {
    const size = $(document).width();

    // this.instance.onStoneCreated(this.tree.onStoneCreated);
    // this.instance.onStoneDeleted(this.tree.onStoneDeleted);

    this.instance.showOn(this.boardViewer, {
        styleWidth: size,
        styleHeight: size,
        background: THEME.BG_COLOR,
        bgMaterial: THEME.BG_MATERIAL,
        wstoneMaterial: THEME.WHITE_STONE_MATERIAL,
        bstoneMaterial: THEME.BLACK_STONE_MATERIAL
    });

    window.onresize = this.onResize.bind(this);
    window.onresize();
}

SGFPlayer.prototype.onResize = function () {
    const size = $(document).width();
    const boardDiv = $(`#${this.boardViewer}`);
    boardDiv.width(size);
    boardDiv.height(size);
    this.instance.resize(size, size);
    // this.tree.onResize();
}