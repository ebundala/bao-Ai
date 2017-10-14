const NAMUA=1;
const MTAJI=2;
const NORTH=2;
const SOUTH=1;
const LEFT=1;
const RIGHT=2;
const UP=3;
const DOWN=4;

cc.Class({
    extends: cc.Component,

    properties: {
      board:{
        default:null,
        type:cc.Node
      },
      turn:1
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
        let holeNode=board.getHoleComponent(hole);

        if(this.isHolePlayable(hole)){
          holeNode.hideHighlight();
        let kete=board.getHoleValue(hole);
        let direction=board.getDirection();
        if(this.turn===NORTH){
        direction=board.invertDirection(direction)
        }

        board.removeKete(hole,kete)

        board.sow(kete,hole,direction,this.turn);
        this.changeTurn();
        }
        else {

        //  hole.hideHighlight();
          holeNode.highlighBlink(0.5);
          console.log("hole not allowed");
        }
      });



    },

    changeTurn(){
      this.turn=this.turn==NORTH?SOUTH:NORTH;
    },
    isHolePlayable(hole){
      let y= this.getBoard().getHoleY(hole);
      let owner=y>1?NORTH:SOUTH;
      return this.getBoard().getHoleValue(hole)>1&&this.turn===owner;
    },
    canCapture(hole)
    {

      if(this.turn===NORTH){

      }
      else if(this.turn===SOUTH) {

      }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
      let hole=this.getBoard().getActiveHole();
      let pos=hole?this.getBoard().getHolePos(hole):{x:0,y:0};
      let turn=this.turn>1?"Opponent":"Your\'s"
      this.getBoard().setDisplayInfo("Turn:"+turn+" Hole: "+pos.x+","+pos.y)
     },
});
