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
const ACTIONS={PICK:1,SOW:2,SLEEP:3,CAPTURE:4,TAKASA:5}


cc.Class({
    extends: cc.Component,

    properties: {
      board:{
        default:null,
        type:cc.Node
      },
      turn:1,
      stage:NAMUA,
      mode:NORMAL,
      isSideLimited:false,
      inHand:0,
      action:ACTIONS.PICK
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
      this.stage=NAMUA;


      //add listeners on holes here
      let x=0,y=0;
      let hole;
      for(y;y<4;y++){
        for(x=0;x<8;x++)
        {

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
         if(x>=0&&x<=7){
            hole=board.getRawHole(x,y);
            hole.on(cc.Node.EventType.TOUCH_END,(event)=>{
                 //  var touches = event.getTouches();
                 // var touchLoc = touches[0].getLocation();
                let hole =event.target;
                let canCaptureList=this.getCanCaptureList();
                if(this.stage===NAMUA){
                  //namua stage logic here
                  if(this.isHolePlayable(hole)&&this.isFrontRow(hole)&&this.action===ACTIONS.PICK&&(this.canCapture(hole).state||(canCaptureList.length===0))){
                        this.limitSide(false);
                    board.removeActiveHole();
                    board.setActiveHole(hole);
                    board.addKete(hole,this.pickOneFromStore());
                    if(this.canCapture(hole).state)
                    {

                          this.setMode(NORMAL);
                          this.capture();
                          if(this.isKimbi(hole)||this.isKichwa(hole)){
                            //handle capture on kimbi/kichwa
                            this.limitSide(true);
                            let holePos=board.getHolePos(hole);
                            let side=holePos.x>2?RIGHT:LEFT;
                            let kichwa =this.getKichwa(side);
                            this.setArrows(kichwa);
                            board.showArrows(kichwa,"horizontal");

                          }else {
                            //normal capture select side
                            //this.setMode
                            let leftKichwa=board.getHoleComponent(this.getKichwa(LEFT))
                            leftKichwa.highlighBlink(2,cc.Color.YELLOW);
                            let rightKichwa=board.getHoleComponent(this.getKichwa(RIGHT))
                            rightKichwa.highlighBlink(2,cc.Color.YELLOW);




                          }

                    }else {
                            //Takasa mode logic
                            let val=board.getHoleValue(hole);
                            board.removeKete(hole,val);
                            this.setInHand(val);
                            this.setMode(TAKASA);
                            this.setArrows(hole);
                            board.showArrows(hole,"horizontal");
                    }
                    this.setAction(ACTIONS.SOW)



                  }
                  else if (this.isKichwa(hole)&&this.action===ACTIONS.SOW&&this.isSideLimited===false&&
                         this.mode===NORMAL&&this.isFrontRow(hole)&&this.isMyHole(hole)&&this.inHand>0){
                           this.setArrows(hole);
                           board.showArrows(hole,"horizontal");


                   console.log("kichwa hole");
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
         this.getStore(SOUTH,true).on(cc.Node.EventType.TOUCH_END,(event)=>{
              //  var touches = event.getTouches();
              // var touchLoc = touches[0].getLocation();
               if(this.turn===SOUTH&&this.stage===NAMUA&&this.action===ACTIONS.PICK){
              let node =event.target;
              board.removeActiveHole();
              board.setActiveHole(node)




              let pos=node.getPosition();
              let width=node.width;
              let height=node.height;

              board.setArrowsPos(pos,width,height);
              board.showArrows(node,"left");
              // console.log(value);
              }

         },board);

         this.getStore(NORTH,true).on(cc.Node.EventType.TOUCH_END,(event)=>{
              //  var touches = event.getTouches();
              // var touchLoc = touches[0].getLocation();
            if(this.turn===NORTH&&this.stage===NAMUA&&this.action===ACTIONS.PICK){
              let node =event.target;
              board.removeActiveHole();
              board.setActiveHole(node)




              let pos=node.getPosition();
              let width=node.width;
              let height=node.height;

              board.setArrowsPos(pos,width,height);
              board.showArrows(node,"right");
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

        if (this.action===ACTIONS.SOW) {

          let direction=board.getDirection();
          if(this.turn===NORTH){
          direction=board.invertDirection(direction)
          }

        if (this.mode===TAKASA) {
          //sow TAKASA
          board.sow(this.inHand,hole,direction,this.turn);
        }else {
          //sow normal
          let side=holeNode.nodeX>2?RIGHT:LEFT;
          let kichwa=this.getKichwa(side);
          board.sow(this.inHand,kichwa,direction,this.turn);
        }

        this.changeTurn();
        this.setMode(NORMAL);
        this.setAction(ACTIONS.PICK)

        }



        // if(this.isHolePlayable(hole)){
        //   holeNode.hideHighlight();
        // let kete=board.getHoleValue(hole);
        // let direction=board.getDirection();
        // if(this.turn===NORTH){
        // direction=board.invertDirection(direction)
        // }
        //
        // board.removeKete(hole,kete)
        //
        // board.sow(kete,hole,direction,this.turn);
        // this.changeTurn();
        // this.getCanCaptureList();
        // }
        // else {
        //
        // //  hole.hideHighlight();
        //   holeNode.highlighBlink(0.5);
        //   console.log("hole not allowed");
        // }
      })
    //  .addGameRule(()=>{console.log("another rule")})
    //  .addGameRule(()=>{console.log("another rule")})
    //  .addGameRule(()=>{console.log("another rule")})
      //.addGameRule(()=>{console.log("another rule")})


    },
    limitSide(state){
      this.isSideLimited=state;
    },
    isMyHole(hole,player=this.turn){
      let board=this.getBoard();
      let y =board.getHoleY(hole);
      let owner=y>1?NORTH:SOUTH;
      return owner===player;
    },
    setArrows(node){

      let pos=node.getPosition();
      let width=node.width;
      let height=node.height;

      this.getBoard().setArrowsPos(pos,width,height);
    },
    setMode(mode=NORMAL){
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
          return board.getRawHole(7,1)
        }else{
          return board.getRawHole(0,1)
        }

      }
      else {
        if(side===RIGHT){
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
      this.turn=this.turn==NORTH?SOUTH:NORTH;
    },
    isHolePlayable(hole,turn=this.turn,stage=this.stage){
      let y= this.getBoard().getHoleY(hole);
      let owner=y>1?NORTH:SOUTH;
      if(stage===NAMUA){
        return this.getBoard().getHoleValue(hole)>0&&turn===owner;
      }
      return this.getBoard().getHoleValue(hole)>1&&turn===owner;
    },
    canCapture(hole=this.getBoard().getActiveHole(),stage=this.stage){

      let board=this.getBoard();
      if (stage===NAMUA)
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

      let lastHolePosLeft=this.getlastHolePos(hole,LEFT);
      let lastHolePosRight=this.getlastHolePos(hole,RIGHT);
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
      let left=(vLeft>0)&&(vLeft0>0)?LEFT:0;
      let right=(vRight>0)&&(vRightO>0)?RIGHT:0;
      let state=left||right;
      }

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
      this.getBoard().setDisplayInfo("Turn:"+turn+" Hole: "+pos.x+","+pos.y+" Inhand: "+this.inHand)
     },
});
