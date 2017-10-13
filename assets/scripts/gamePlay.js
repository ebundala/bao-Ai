cc.Class({
    extends: cc.Component,

    properties: {
      board:{
        default:null,
        type:cc.Node
      }
    },
    getBoard(){
      return this.board.getComponent("board");
    },

    // use this for initialization
    onLoad: function () {
      this.getBoard().initBoardState();
      //add listeners here


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
