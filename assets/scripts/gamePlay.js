const NAMUA=1;
const MTAJI=2;
const TAKASA=2;
const NORMAL=1;
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
      turn:1,
      stage:NAMUA,
      mode:NORMAL
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
      let board=this.getBoard();


      //add listeners on holes here
      let x=0,y=0;
      let hole;
      for(y;y<4;y++){
        for(x=0;x<8;x++)
        {

          //first hole first row
          if(x===0&&y===0){
              hole=board.getRawHole(x,y);
              hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                   //  var touches = event.getTouches();
                   // var touchLoc = touches[0].getLocation();

                   let node =event.target;
                   board.removeActiveHole();
                   board.setActiveHole(node)




                   let pos=node.getPosition();
                   let width=node.width;
                   let height=node.height;

                   board.setArrowsPos(pos,width,height);
                   board.showArrows(node,"up-left");
                   // console.log(value);

              },board);
          }
          //last hole first row
          else if (x===7&&y===0) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)
                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"up-right");
                 // console.log(value);

            },board);
          }
          //south kichwa hole left
          else if (x===0&&y===1) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"down-left");
                 // console.log(value);

            },board);
          }
          //south kichwa hole right
          else if (x===7&&y===1) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"down-right");
                 // console.log(value);

            },board);
          }
          //north kichwa hole left
          else if (x===0&&y===2) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"up-left");
                 // console.log(value);

            },board);
          }
          //north kichwa hole left
          else if (x===7&&y===2) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"up-right");
                 // console.log(value);

            },board);
          }
          //first hole last row
          else if (x===0&&y===3) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"down-left");
                 // console.log(value);

            },board);
          }
          //last hole last row
          else if (x===7&&y===3) {
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"down-right");
                 // console.log(value);

            },board);
          }
          //holes not on edges
         else if(x>0&&x<7){
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();

                 let node =event.target;
                 board.removeActiveHole();
                 board.setActiveHole(node)




                 let pos=node.getPosition();
                 let width=node.width;
                 let height=node.height;

                 board.setArrowsPos(pos,width,height);
                 board.showArrows(node,"horizontal");
                 // console.log(value);

            },board);
          }
         // store holes
         this.getStore(SOUTH,true).on(cc.Node.EventType.TOUCH_END,(event)=>{
              //  var touches = event.getTouches();
              // var touchLoc = touches[0].getLocation();

              let node =event.target;
              board.removeActiveHole();
              board.setActiveHole(node)




              let pos=node.getPosition();
              let width=node.width;
              let height=node.height;

              board.setArrowsPos(pos,width,height);
              board.showArrows(node,"left");
              // console.log(value);

         },board);

         this.getStore(NORTH,true).on(cc.Node.EventType.TOUCH_END,(event)=>{
              //  var touches = event.getTouches();
              // var touchLoc = touches[0].getLocation();

              let node =event.target;
              board.removeActiveHole();
              board.setActiveHole(node)




              let pos=node.getPosition();
              let width=node.width;
              let height=node.height;

              board.setArrowsPos(pos,width,height);
              board.showArrows(node,"right");
              // console.log(value);

         },board);


        }

      }





      //add gameplay logic here
      this.getBoard().addGameRule(()=>{

        var board=this.getBoard();
        let hole=board.getActiveHole();
        let holeNode=board.getHoleComponent(hole);
        //this.canCapture(hole)
         this.isKimbi(hole);
         this.isKichwa(hole);
         this.isNyumba(hole);
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
        this.getCanCaptureList();
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
    getStore(player=this.turn,raw=false){
      let board=this.getBoard();
      let x=0,y=4
      if(player===NORTH){
          x=1;
          y=4;
      }
      if(raw){
        return board.getRawHole(x,y);
      }else {
        return board.getHole(x,y);
      }

    },
    isStoreNotEmpty(player=this.turn){
      let board=this.getBoard();
      let store;
      if(player===SOUTH){
        store=board.getRawHole(0,4);
      }
      else {
        store=board.getRawHole(1,4);
      }
      return board.getHoleValue(store)>0;
    },
    pickOneFromStore(player=this.turn){
      let board=this.getBoard();
      let store;
      let kete=0;
      if(player===SOUTH){
        store=board.getRawHole(0,4);
        if(this.isStoreNotEmpty())
        {
        board.removeKete(store,1);
          kete=1;
      }
      }
      else {
        store=board.getRawHole(1,4);
        if(this.isStoreNotEmpty()){
          board.removeKete(store,1);
          kete=1;
        }
      }
     return kete
    },
    getNyumba(player=this.turn){
        let board=this.getBoard();

      if(player===SOUTH){

          return board.getHole(4,1)


      }
      else {

          return board.getHole(3,2)

      }
    },
    getKichwa(side=LEFT,player=this.turn){
        let board=this.getBoard();
      if(player===SOUTH){
        if(side===RIGHT){
          return board.getHole(7,1)
        }else{
          return board.getHole(0,1)
        }

      }
      else {
        if(side===RIGHT){
          return board.getHole(7,2)
        }else{
          return board.getHole(0,2)
        }
      }
    },
    isKichwa(hole){
      let board=this.getBoard();
      let pos=board.getHolePos(hole);

      return (pos.x===0||pos.x===7)&&(pos.y===1||pos.y===2);
    },
    isKimbi(hole){
      let board=this.getBoard();
      let pos=board.getHolePos(hole);

      return (pos.x===1||pos.x===6)&&(pos.y===1||pos.y===2);
    },
    isNyumba(hole){
      let board=this.getBoard();
      let pos=board.getHolePos(hole);
      return (pos.x===4&&pos.y===1)||(pos.x===3||pos.y===2);
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



      //console.log(vLeft,vRight,vLeft0,vRightO)
      let left=(vLeft>0)&&(vLeft0>0)?LEFT:0;
      let right=(vRight>0)&&(vRightO>0)?RIGHT:0;
      let state=left||right;

      return {state,left,right};
    },
    getCanCaptureList(player=this.turn){
      let y=0,x=0,holeslist=[];
      let board=this.getBoard()
      if(player===SOUTH){
        for(y=0;y<2;y++){
          for(x=0;x<8;x++){
            //find all holes that can be captured by  south player;

            let hole=board.getHole(x,y);
            if(this.isHolePlayable(hole))
            {
            let direction=this.canCapture(hole);
            if (direction.state)
            {
              holeslist.push({x,y,direction});
            }
          }
          }
        }

      }
      else{
        for(y=2;y<4;y++){
          for(x=0;x<8;x++){
            //find all holes that can be captured by  north player;
            let hole=board.getHole(x,y);
            if(this.isHolePlayable(hole))
          {
            let direction=this.canCapture(hole);
            if (direction.state)
            {
              holeslist.push({x,y,direction});
            }
          }
          }
        }
      }
      //console.log(holeslist);
      return holeslist;
    },
    setCanCaptureList(holeslist){
      this.canCaptureList=holeslist;
    },
    isFrontRow(pos){
      return pos.y===1||pos.y===2
    },
    getOppositeHolePos(pos,player=this.turn){

      if(player===SOUTH){
        pos.y++;
      }
      else if(player===NORTH) {
        pos.y--;
      }
      return pos;
    },
    getlastHolePos(hole,direction,player=this.turn){
      let board=this.getBoard();
      let pos;
      let value=board.getHoleValue(hole);
      //get last hole pos
            if(player===NORTH){
              direction=board.invertDirection(direction,false);
                pos =  board.sow(value,hole,direction,NORTH,true);
            }
            else if(player===SOUTH) {
            pos=  board.sow(value,hole,direction,SOUTH,true);
          }
          //console.log(pos);
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
