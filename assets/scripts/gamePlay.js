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

        if(this.isHolePlayable(hole)&&this.canCapture(hole)){
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
      })
    //  .addGameRule(()=>{console.log("another rule")})
    //  .addGameRule(()=>{console.log("another rule")})
    //  .addGameRule(()=>{console.log("another rule")})
      //.addGameRule(()=>{console.log("another rule")})


    },

    changeTurn(){
      this.turn=this.turn==NORTH?SOUTH:NORTH;
    },
    isHolePlayable(hole){
      let y= this.getBoard().getHoleY(hole);
      let owner=y>1?NORTH:SOUTH;
      return this.getBoard().getHoleValue(hole)>1&&this.turn===owner;
    },
    canCapture(hole=this.getBoard().getActiveHole())
    {

      let board=this.getBoard();
      let lastHolePosLeft=this.getlastHolePos(hole,LEFT);
      let lastHolePosRight=this.getlastHolePos(hole,RIGHT);
      let vRight=0;
      let vLeft=0;

      //check if front line
      if(this.isFrontRow(lastHolePosLeft)){
      let lastHoleLeft=board.getHole(lastHolePosLeft.x,lastHolePosLeft.y);
      vLeft =board.getHoleValue(lastHoleLeft);
       }
      if(this.isFrontRow(lastHolePosRight)){
      let lastHoleRight=board.getHole(lastHolePosRight.x,lastHolePosRight.y);
      vRight =board.getHoleValue(lastHoleRight);
       }
      //opposites holes
      let lastHolePosLeftO=this.getOppositeHolePos(lastHolePosLeft);
      let lastHolePosRightO=this.getOppositeHolePos(lastHolePosRight);
      let vRightO=0;
      let vLeft0=0
        //check if front line
      if(this.isFrontRow(lastHolePosLeftO)){
      let lastHoleLeftO=board.getHole(lastHolePosLeftO.x,lastHolePosLeftO.y);
      vLeft0=board.getHoleValue(lastHoleLeftO);
       }
      if(this.isFrontRow(lastHolePosRightO)){
      let lastHoleRightO=board.getHole(lastHolePosRightO.x,lastHolePosRightO.y);
       vRightO =board.getHoleValue(lastHoleRightO);
       }



      console.log(vLeft,vRight,vLeft0,vRightO)
      return ((vLeft>0)&&(vLeft0>0))||((vRight>0)&&(vRightO>0))
    },
    isFrontRow(pos){
      return pos.y===1||pos.y===2
    },
    getOppositeHolePos(pos){

      if(this.turn===SOUTH){
        pos.y++;
      }
      else if(this.turn===NORTH) {
        pos.y--;
      }
      return pos;
    },
    getlastHolePos(hole,direction){
      let board=this.getBoard();
      let pos;
      let value=board.getHoleValue(hole);
      //get last hole pos
            if(this.turn===NORTH){
              direction=board.invertDirection(direction,false);
                pos =  board.sow(value,hole,direction,NORTH,true);
            }
            else if(this.turn===SOUTH) {
            pos=  board.sow(value,hole,direction,SOUTH,true);
          }
          console.log(pos);
          return pos;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
      let hole=this.getBoard().getActiveHole();
      let pos=hole?this.getBoard().getHolePos(hole):{x:0,y:0};
      let turn=this.turn>1?"Opponent":"Your\'s"
      this.getBoard().setDisplayInfo("Turn:"+turn+" Hole: "+pos.x+","+pos.y)
     },
});
