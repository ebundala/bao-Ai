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
     //initialize board layout here
      this.getBoard().defaultBaoBoardLayout();
      this.getBoard().initBaoBoardState();
      this.getBoard().addArrows();
      //this.getBoard().hideArrows("vertical");

      //add listeners on holes here
      //add gameplay logic here
      this.getBoard().addGameRule(()=>{
        var board=this.getBoard();
        let hole=board.getActiveHole();
        let kete=board.getHoleValue(hole);
        let direction=board.getDirection();
        board.removeKete(hole,kete)
        board.sow(kete,hole,direction,"south");
      });



    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
