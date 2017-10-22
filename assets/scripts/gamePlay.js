
const PLAYER={NORTH:2,SOUTH:1}
const STAGE={NAMUA:1,MTAJI:2}
const MODES={NORMAL:1,TAKASA:2}
const ACTIONS={PICK:1,SOW:2,SLEEP:3,CAPTURE:4,TAKASA:5}
const DIRECTION={LEFT:1,RIGHT:2,UP:3,DOWN:4,HORIZONTAL:5,VERTICAL:6,DOWN_LEFT:7,DOWN_RIGHT:8,UP_LEFT:9,UP_RIGHT:10}


cc.Class({
    extends: cc.Component,

    properties: {
      board:{
        default:null,
        type:cc.Node
      },
      turn:1,
      stage:STAGE.NAMUA,
      mode:MODES.NORMAL,
      isSideLimited:false,
      inHand:0,
      action:ACTIONS.PICK,
      activeKichwa:{
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
      let board=this.getBoard();
      this.stage=STAGE.NAMUA;


      //add listeners on holes here
      let x=0,y=0;
      let hole;
      for(y;y<4;y++){
        for(x=0;x<8;x++)
        {


         if(x>=0&&x<=7){
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();
                let hole =event.target;
                let canCaptureList=this.getCanCaptureList();
                if(this.stage===STAGE.NAMUA){
                  //namua stage logic here
                  if(this.isHolePlayable(hole)&&this.isFrontRow(hole)&&this.action===ACTIONS.PICK&&(this.canCapture(hole).state||(canCaptureList.length===0))){
                        this.limitSide(false);
                    board.removeActiveHole();
                    board.setActiveHole(hole);
                    board.addKete(hole,this.pickOneFromStore());
                    if(this.canCapture(hole).state)
                    {

                          this.setMode(MODES.NORMAL);
                          this.capture();
                          if(this.isKimbi(hole)||this.isKichwa(hole)){
                            //handle capture on kimbi/kichwa
                            this.limitSide(true);
                            let holePos=board.getHolePos(hole);
                            let side=holePos.x>1?DIRECTION.RIGHT:DIRECTION.LEFT;
                            let kichwa =this.getKichwa(side);
                            this.setArrows(kichwa);
                            board.showArrows(kichwa,side);

                          }else {
                            //normal capture select side
                            //this.setMode
                            let leftKichwa=board.getHoleComponent(this.getKichwa(DIRECTION.LEFT))
                            leftKichwa.highlighBlink(2,cc.Color.YELLOW);
                            let rightKichwa=board.getHoleComponent(this.getKichwa(DIRECTION.RIGHT))
                            rightKichwa.highlighBlink(2,cc.Color.YELLOW);




                          }

                    }else {
                            //Takasa mode logic
                            let val=board.getHoleValue(hole);
                            board.removeKete(hole,val);
                            this.setInHand(val);
                            this.setMode(MODES.TAKASA);
                            let x=board.getHoleX(hole);
                            let side=x===7?DIRECTION.RIGHT:DIRECTION.LEFT;
                            this.setArrows(hole);
                            let arrows=this.isKichwa(hole)?side:DIRECTION.HORIZONTAL;
                            board.showArrows(hole,arrows);
                    }
                    this.setAction(ACTIONS.SOW)



                  }
                  else if (this.isKichwa(hole)&&this.action===ACTIONS.SOW&&this.isSideLimited===false&&
                         this.mode===MODES.NORMAL&&this.isFrontRow(hole)&&this.isMyHole(hole)&&this.inHand>0){
                           let x=board.getHoleX(hole);
                           let side=x===7?DIRECTION.RIGHT:DIRECTION.LEFT;
                           this.setArrows(hole);
                           board.showArrows(hole,side);
                           this.activeKichwa=hole;


                   console.log("kichwa hole ",x);
                  }

                  else {
                  console.log("illegal hole")
                  }




               }
               else {
                 //mtaji logic here
               }

            },board);
          }
         // store holes
         this.getStore(PLAYER.SOUTH,true).on(cc.Node.EventType.TOUCH_END,(event)=>{
              //  var touches = event.getTouches();
              // var touchLoc = touches[0].getLocation();
               if(this.turn===PLAYER.SOUTH&&this.stage===STAGE.NAMUA&&this.action===ACTIONS.PICK){
              let node =event.target;
              board.removeActiveHole();
              board.setActiveHole(node)




              let pos=node.getPosition();
              let width=node.width;
              let height=node.height;

              board.setArrowsPos(pos,width,height);
              board.showArrows(node,DIRECTION.LEFT);
              // console.log(value);
              }

         },board);

         this.getStore(PLAYER.NORTH,true).on(cc.Node.EventType.TOUCH_END,(event)=>{
              //  var touches = event.getTouches();
              // var touchLoc = touches[0].getLocation();
            if(this.turn===PLAYER.NORTH&&this.stage===STAGE.NAMUA&&this.action===ACTIONS.PICK){
              let node =event.target;
              board.removeActiveHole();
              board.setActiveHole(node)




              let pos=node.getPosition();
              let width=node.width;
              let height=node.height;

              board.setArrowsPos(pos,width,height);
              board.showArrows(node,DIRECTION.RIGHT);
              // console.log(value);
            }

         },board);


        }

      }





      //add gameplay logic here
      this.getBoard().addGameRule(()=>{

        //var board=this.getBoard();
        let hole=board.getActiveHole();
        let holeNode=board.getHoleComponent(hole);

        if (this.action===ACTIONS.SOW&&this.stage===STAGE.NAMUA) {

          let direction=board.getDirection();
        //  if(this.turn===PLAYER.NORTH){
        //  direction=board.invertDirection(direction)
        //  }

        if (this.mode===MODES.TAKASA) {
          //sow TAKASA
          this.sow(this.inHand,hole,direction,this.turn);
        }else {
        ///  sow normal
          let kichwa=this.activeKichwa;
          if (this.isSideLimited) {
          let x=board.getHoleX(hole)
          let side=x>1?DIRECTION.RIGHT:DIRECTION.LEFT;
          kichwa=this.getKichwa(side);
          }

          this.sow(this.inHand,kichwa,direction,this.turn,false,true);
        }

        this.changeTurn();
        this.setMode(MODES.NORMAL);
        this.setAction(ACTIONS.PICK)

        }




      })



    },
    limitSide(state){
      this.isSideLimited=state;
    },
    isMyHole(hole,player=this.turn){
      let board=this.getBoard();
      let y =board.getHoleY(hole);
      let owner=y>1?PLAYER.NORTH:PLAYER.SOUTH;
      return owner===player;
     },
    setArrows(node){

      let pos=node.getPosition();
      let width=node.width;
      let height=node.height;

      this.getBoard().setArrowsPos(pos,width,height);
     },
    setMode(mode=MODES.NORMAL){
      this.mode=mode;
      },
    setAction(action=ACTIONS.PICK){
      this.action=action;
    },
    getAction(){
      return this.action;
    },
    getStore(player=this.turn,raw=false){
      let board=this.getBoard();
      let x=0,y=4
      if(player===PLAYER.NORTH){
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
      if(player===PLAYER.SOUTH){
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
      if(player===PLAYER.SOUTH){
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
    setInHand(value){
      this.inHand=value;
    },
    getInHand(){
      return this.inHand;
    },
    clearInHand(){
      this.inHand=0;
    },
    capture(hole=this.getBoard().getActiveHole()){
      let board=this.getBoard();
      let pos=board.getHolePos(hole)
      let oppositeHolePos=this.getOppositeHolePos(pos)
      let oHole=board.getHole(oppositeHolePos.x,oppositeHolePos.y);
      let oValue=board.getHoleValue(oHole);
      board.removeKete(oHole,oValue);
      this.setInHand(oValue);
    },
    getNyumba(player=this.turn){
        let board=this.getBoard();

      if(player===PLAYER.SOUTH){

          return board.getHole(4,1)


      }
      else {

          return board.getHole(3,2)

      }
    },
    getKichwa(side=DIRECTION.LEFT,player=this.turn){
        let board=this.getBoard();
      if(player===PLAYER.SOUTH){
        if(side===DIRECTION.RIGHT){
          return board.getRawHole(7,1)
        }else{
          return board.getRawHole(0,1)
        }

      }
      else {
        if(side===DIRECTION.RIGHT){
          return board.getRawHole(7,2)

        }else{
          return board.getRawHole(0,2)
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
      this.turn=this.turn==PLAYER.NORTH?PLAYER.SOUTH:PLAYER.NORTH;
    },
    isHolePlayable(hole,turn=this.turn,stage=this.stage){
      let y= this.getBoard().getHoleY(hole);
      let owner=y>1?PLAYER.NORTH:PLAYER.SOUTH;
      if(stage===STAGE.NAMUA){
        return this.getBoard().getHoleValue(hole)>0&&turn===owner;
      }
      return this.getBoard().getHoleValue(hole)>1&&turn===owner;
    },
    canCapture(hole=this.getBoard().getActiveHole(),stage=this.stage){

      let board=this.getBoard();
      if (stage===STAGE.NAMUA)
      {
        let holePos=board.getHolePos(hole);
        if(this._isFrontRow(holePos)){
        let oppositeHolePos=this.getOppositeHolePos(holePos);
        let oHole=board.getHole(oppositeHolePos.x,oppositeHolePos.y);
        let value =board.getHoleValue(hole);
        let oValue=board.getHoleValue(oHole);
        let state=value>0&&oValue>0?true:false;
        return {state,left:0,right:0};
        }
        return {state:false,left:0,right:0};

      }
      else {

      let lastHolePosLeft=this.getlastHolePos(hole,DIRECTION.LEFT);
      let lastHolePosRight=this.getlastHolePos(hole,DIRECTION.RIGHT);
      let vRight=0;
      let vLeft=0;

      //check if front line
      if(this._isFrontRow(lastHolePosLeft)){
      let lastHoleLeft=board.getHole(lastHolePosLeft.x,lastHolePosLeft.y);
      vLeft =board.getHoleValue(lastHoleLeft);
       }
      if(this._isFrontRow(lastHolePosRight)){
      let lastHoleRight=board.getHole(lastHolePosRight.x,lastHolePosRight.y);
      vRight =board.getHoleValue(lastHoleRight);
       }
      //opposites holes
      let lastHolePosLeftO=this.getOppositeHolePos(lastHolePosLeft);
      let lastHolePosRightO=this.getOppositeHolePos(lastHolePosRight);
      let vRightO=0;
      let vLeft0=0
        //check if front line
      if(this._isFrontRow(lastHolePosLeftO)){
      let lastHoleLeftO=board.getHole(lastHolePosLeftO.x,lastHolePosLeftO.y);
      vLeft0=board.getHoleValue(lastHoleLeftO);
       }
      if(this._isFrontRow(lastHolePosRightO)){
      let lastHoleRightO=board.getHole(lastHolePosRightO.x,lastHolePosRightO.y);
       vRightO =board.getHoleValue(lastHoleRightO);
       }
      //console.log(vLeft,vRight,vLeft0,vRightO)
      let left=(vLeft>0)&&(vLeft0>0)?DIRECTION.LEFT:0;
      let right=(vRight>0)&&(vRightO>0)?DIRECTION.RIGHT:0;
      let state=left||right;
      }

      return {state,left,right};
    },
    getCanCaptureList(player=this.turn){
      let y=0,x=0,holeslist=[];
      let board=this.getBoard()
      if(player===PLAYER.SOUTH){
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
      console.log(holeslist);
      return holeslist;
    },
    setCanCaptureList(holeslist){
      this.canCaptureList=holeslist;
    },
    isFrontRow(hole){
      let pos=this.getBoard().getHolePos(hole);
      return pos.y===1||pos.y===2
    },
    _isFrontRow(pos){
      return pos.y===1||pos.y===2
    },
    getOppositeHolePos(pos,player=this.turn){

      if(player===PLAYER.SOUTH){
        pos.y++;
      }
      else if(player===PLAYER.NORTH) {
        pos.y--;
      }
      return pos;
    },
    getlastHolePos(hole,direction,player=this.turn){
      let board=this.getBoard();
      let pos;
      let value=board.getHoleValue(hole);
      //get last hole pos
            if(player===PLAYER.NORTH){
              direction=board.invertDirection(direction,false);
                pos =  board.sow(value,hole,direction,NORTH,true);
            }
            else if(player===PLAYER.SOUTH) {
            pos=  board.sow(value,hole,direction,PLAYER.SOUTH,true);
          }
          //console.log(pos);
          return pos;
    },

     //sow function overide
     sow(kete,startHole,direction,player=this.turn,test=false,inplace=false){
       let board=this.getBoard();
       let holePos=board.getHolePos(startHole);
       console.log(holePos);
          while(kete>0){
            if(!test&&inplace){
              board.getHole(holePos.x,holePos.y).addKete(1);
             }
                if(player===PLAYER.SOUTH)
               {
                 if (direction===DIRECTION.LEFT)
                  {
                    if(holePos.x===0){
                      holePos.y>0?holePos.y--:holePos.y++;
                      direction=DIRECTION.RIGHT;
                     }else{
                       holePos.x--;
                     }

                 }else { //right direction
                   if(holePos.x===7){
                     direction=DIRECTION.LEFT;
                     holePos.y>0?holePos.y--:holePos.y++;
                   }else{
                     holePos.x++;
                   }

                 }
               }
               else if(player===PLAYER.NORTH) //north player logic
                 {

                   if (direction===DIRECTION.RIGHT)
                    {
                      if(holePos.x===7){
                         holePos.y>2?holePos.y--:holePos.y++;
                         direction=DIRECTION.LEFT;
                      }else{
                       holePos.x++;
                       }

                     }else { //right direction
                      if(holePos.x===0){
                       direction=DIRECTION.RIGHT;
                       holePos.y>2?holePos.y--:holePos.y++;
                       }else{
                         holePos.x--;
                       }
                   }

                 }
                 if(kete===0){
                   break;
                 }else{
                   kete--;
                 }
                 //console.log(direction+" x y ",holePos.x+" ",holePos.y);

           if(!test&&!inplace){
           board.getHole(holePos.x,holePos.y).addKete(1);
           }
          }
          return holePos;
     },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
      let hole=this.getBoard().getActiveHole();
      let pos=hole?this.getBoard().getHolePos(hole):{x:0,y:0};
      let turn=this.turn>1?"Opponent":"Your\'s"
      this.getBoard().setDisplayInfo("Turn:"+turn+" Hole: "+pos.x+","+pos.y+" \nInhand: "+this.inHand)
     },





});


//   //first hole first row
//   if(x===0&&y===0){
//       hole=board.getRawHole(x,y);
//       hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//            //  var touches = event.getTouches();
//            // var touchLoc = touches[0].getLocation();
//            let node =event.target;
//         if(this.action===ACTIONS.SOW){
 //
//            board.removeActiveHole();
//            board.setActiveHole(node)
 //
 //
 //
 //
//            let pos=node.getPosition();
//            let width=node.width;
//            let height=node.height;
 //
//            board.setArrowsPos(pos,width,height);
//            board.showArrows(node,"up-left");
//            }
//            // console.log(value);
 //
//       },board);
//   }
//   //last hole first row
//   else if (x===7&&y===0) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//      if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"up-right");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //south kichwa hole left
//   else if (x===0&&y===1) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//       if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
 //
 //
 //
 //
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"down-left");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //south kichwa hole right
//   else if (x===7&&y===1) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//         if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
 //
 //
 //
 //
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"down-right");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //north kichwa hole left
//   else if (x===0&&y===2) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//         if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
 //
 //
 //
 //
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"up-left");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //north kichwa hole left
//   else if (x===7&&y===2) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//       if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
 //
 //
 //
 //
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"up-right");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //first hole last row
//   else if (x===0&&y===3) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//        if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
 //
 //
 //
 //
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"down-left");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //last hole last row
//   else if (x===7&&y===3) {
//     hole=board.getRawHole(x,y);
//     hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
//          //  var touches = event.getTouches();
//          // var touchLoc = touches[0].getLocation();
//        if(this.action===ACTIONS.SOW){
//          let node =event.target;
//          board.removeActiveHole();
//          board.setActiveHole(node)
 //
 //
 //
 //
//          let pos=node.getPosition();
//          let width=node.width;
//          let height=node.height;
 //
//          board.setArrowsPos(pos,width,height);
//          board.showArrows(node,"down-right");
//          // console.log(value);
//        }
 //
//     },board);
//   }
//   //holes not on edges
//  else
