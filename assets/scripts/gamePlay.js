
const PLAYER={NORTH:2,SOUTH:1}
const STAGE={NAMUA:1,MTAJI:2}
const MODES={NORMAL:1,TAKASA:2}
const ACTIONS={PICK:1,SOW:2,SLEEP:3,CAPTURE:4,TAKASA:5,TAX:6,KICHWAONLY:7}
const DIRECTION={LEFT:1,RIGHT:2,UP:3,DOWN:4,HORIZONTAL:5,VERTICAL:6,DOWN_LEFT:7,DOWN_RIGHT:8,UP_LEFT:9,UP_RIGHT:10}
const BOARD_STATE={NORMAL:1,TAKASA:2,CAPTURING:3}
//neural net parameters
const DEEPQ={INPUTS:40,ACTIONS:64,TEMPORAL_WINDOW:5}
const NET_SIZE=DEEPQ.INPUTS*DEEPQ.TEMPORAL_WINDOW+DEEPQ.ACTIONS*DEEPQ.TEMPORAL_WINDOW+DEEPQ.INPUTS;
let layer_defs=[];
layer_defs.push({type:'input',out_sx:1,out_sy:1,out_depth:NET_SIZE});
layer_defs.push({type:'fc',num_neurons:100,activation:'relu'});
layer_defs.push({type:'fc',num_neurons:100,activation:'relu'});
layer_defs.push({type:'fc',num_neurons:100,activation:'relu'});
layer_defs.push({type:'regression',num_neurons:DEEPQ.ACTIONS});
let tdtrainer_options={learning_rate:0.001,momentum:0.0,batch_size:128,l2_decay:0.01};
let opt={};
opt.temporal_window=DEEPQ.TEMPORAL_WINDOW;
opt.experience_size=5000;
opt.start_learn_threshold=1000
opt.gamma=0.8;
opt.learning_steps_total=50000;
opt.learning_steps_burnin=50000
opt.epsilon_min=0.05
opt.epsilon_test_time=0.05
opt.layer_defs=layer_defs;
opt.tdtrainer_options=tdtrainer_options;



const deepqlearn=require("deepqlearn")
cc.Class({
    extends: cc.Component,

    properties: {
      board:{
        default:null,
        type:cc.Node
      },

      brain:{default:null,type:cc.Node},
      hasNyumba:{default:null,type:cc.Node},
      turn:1,
      stage:STAGE.NAMUA,
      mode:MODES.NORMAL,
      isSideLimited:false,
      inHand:0,
      action:ACTIONS.PICK,
      isAi:false,
      aiSwitch:{
        default:null,
        type:cc.Node
      },
      aiSwitchString:{
        default:null,
        type:cc.Label
      },
      activeKichwa:{
        default:null,
        type:cc.Node
      }
    },
    toggleAI(){
      this.isAi=!this.isAi
      //this.aiSwitch.titleText=(this.isAi?"AI on":"AI off");
      this.aiSwitchString.string=(this.isAi?"AI on":"AI off");
    },
    getBoard(){
      return this.board.getComponent("board");
    },
    //AI
    computeHolePosition(action){

      let y=action>7?Math.floor(action/8):0;
      let x=action>7?Math.floor(action%8):action;

     return cc.v2(x,y);
     },
    getBoardState(){
      let board=this.getBoard();

      let state=[];
      for(let y=0;y<5;y++){
        for(let x=0;x<8;x++){
          if(!(x>1&&y>3)){
            state.push(board.getHole(x,y).value);
          }
          else {
            state.push(board.holeslist[y][x]||0)
          }

        }
      }
      return state;
    },
    changeTurn(){

      this.turn=this.turn==PLAYER.NORTH?PLAYER.SOUTH:PLAYER.NORTH;


      if(this.turn===PLAYER.NORTH&&this.isAi){

        this.scheduleOnce(()=>{
        let state=this.getBoardState();
        let board=this.getBoard();
        let reward=0
        let actionDirection;
        let action;
        let pos;
        let hole;
        let direction;
        do {
          actionDirection=this.brain.forward(state);
          //debugger;
          action=actionDirection>32?actionDirection-32:actionDirection;
          direction =actionDirection>32?DIRECTION.RIGHT:DIRECTION.LEFT;
          pos=this.computeHolePosition(action);

          hole =board.getRawHole(pos.x,pos.y);

          reward=this.handleHole(hole)

              if(reward>0){

                board.setDirection(direction);
                this.activeKichwa=this.getKichwa(direction);
              reward=reward+this.handleMove();
              cc.log(action,direction,pos,reward);

              }

          this.brain.backward(reward);
         }
         while (reward<1)
        //this.taxNyumba();
       },1)


      }

    },
    handleHole(hole){
      let board=this.getBoard();
      let canCaptureList=this.getCanCaptureList();
      let canCapture=this.canCapture(hole);
      let reward=0;
      let playable=this.isHolePlayable(hole)&&this.action===ACTIONS.PICK&&(canCapture.state||(canCaptureList.length===0))
      let takasaAllowed=this.isTakasaAllowed(hole,this.turn)
      if(this.stage===STAGE.NAMUA){
        //namua stage logic here
        if(playable&&this.isFrontRow(hole)){
          this.limitSide(false);
          board.removeActiveHole();
          //debugger
          board.setActiveHole(hole);




          if(canCapture.state)
          {
            board.addKete(hole,this.pickOneFromStore());
            reward++;
            this.setMode(MODES.NORMAL);
            reward+=this.capture();
            if(this.isKimbi(hole)||this.isKichwa(hole)){
              //handle capture on kimbi/kichwa
              this.limitSide(true);
              let holePos=board.getHolePos(hole);
              let side=holePos.x>1?DIRECTION.RIGHT:DIRECTION.LEFT;
              let kichwa =this.getKichwa(side);
              this.setArrows(kichwa);
              board.showArrows(kichwa,side);
              //TODO handle ai capture on kimbi
              cc.log("side limited");

              }else {
                //normal capture select side
                let leftKichwa=board.getHoleComponent(this.getKichwa(DIRECTION.LEFT))
                leftKichwa.highlighBlink(2,cc.Color.YELLOW);
                let rightKichwa=board.getHoleComponent(this.getKichwa(DIRECTION.RIGHT))
                rightKichwa.highlighBlink(2,cc.Color.YELLOW);
              }
             this.setAction(ACTIONS.SOW)
          }else {
            //Takasa mode logic
            if(takasaAllowed.state){
              board.addKete(hole,this.pickOneFromStore());
              reward++;
              let val=0;
              //TODO move state change code to handle move for better AI performance
              if(takasaAllowed.action===ACTIONS.TAX){

                val=this.taxNyumba();

              }
              else{
                //lose nyumba logic
                //nyumba emptied logic
                if(this.isNyumba(hole)&&this.playerHasNyumba(this.turn)){
                  this.playerLostNyumba(this.turn);
                  cc.log("Nyumba lost by emptying ",this.hasNyumba)
                }
                val=board.getHoleValue(hole);
                board.removeKete(hole,val);
              }
              this.setInHand(val);
              this.setMode(MODES.TAKASA);
              let x=board.getHoleX(hole);
              let side=x===7?DIRECTION.RIGHT:DIRECTION.LEFT;
              this.setArrows(hole);
              let arrows=this.isKichwa(hole)?side:DIRECTION.HORIZONTAL;
              board.showArrows(hole,arrows);
              if(takasaAllowed.action===ACTIONS.KICHWAONLY){
                this.limitSide(true);
              }
              this.setAction(ACTIONS.SOW)
          }
          else
          {
            board.getHoleComponent(hole).highlighBlink(0.5,cc.Color.RED);
            reward--;
            //console.log("illegal hole")
          }
          }





        }
        else if (this.isKichwa(hole)&&this.action===ACTIONS.SOW&&this.isSideLimited===false&&
        this.mode===MODES.NORMAL&&this.isFrontRow(hole)&&this.isMyHole(hole)&&this.inHand>0)
        {
          let x=board.getHoleX(hole);
          let side=x===7?DIRECTION.RIGHT:DIRECTION.LEFT;
          this.setArrows(hole);
          board.showArrows(hole,side);
          this.activeKichwa=hole;
          reward++;
          //console.log("kichwa hole ",x);
        }

        else  {
          board.getHoleComponent(hole).highlighBlink(0.5,cc.Color.RED);
          reward--;
          //console.log("illegal hole")
        }
      }
      if(this.stage===STAGE.MTAJI) {
        //mtaji logic here
       if(playable){
         board.removeActiveHole();
         //debugger
         board.setActiveHole(hole);
         //board.addKete(hole,this.pickOneFromStore());
         reward++;

         cc.log("mtaji playable")
       }
       else
       {
           board.getHoleComponent(hole).highlighBlink(0.5,cc.Color.RED);
           reward--;
           cc.log("mtaji not playable")
        }

      }

     return reward;
    },
    handleMove(){

      let board=this.getBoard();
      let hole=board.getActiveHole();
      let holeNode=board.getHoleComponent(hole);
      let reward=0;
      //debugger
      if (this.action===ACTIONS.SOW&&this.stage===STAGE.NAMUA) {

        let direction=board.getDirection();
        //  if(this.turn===PLAYER.NORTH){
        //  direction=board.invertDirection(direction)
        //  }

        if (this.mode===MODES.TAKASA) {
          //sow TAKASA

          //debugger;
          //handle only kichwa has kete prevent moving to outer row
          if(this.isSideLimited){
            let x=board.getHoleX(hole);
            direction=x===7?DIRECTION.LEFT:DIRECTION.RIGHT;

          }
          this.limitSide(false);
          let currentHole=hole;
          do {

            currentHole=this.sow(this.inHand,currentHole,direction,this.turn);

            this.clearInHand();


            let val=board.getHoleValue(currentHole);

            if(val>1){
              this.setInHand(val);
              board.removeKete(currentHole,val)
            }
          }
          while (this.inHand>1);


        }else {
          ///  sow normal
          let kichwa=this.activeKichwa;

          if (this.isSideLimited) {
            let x=board.getHoleX(hole)
            let side=x>1?DIRECTION.RIGHT:DIRECTION.LEFT;
            kichwa=this.getKichwa(side);
          }
          //TODO resolve direction issues on AI
          if (this.turn===PLAYER.NORTH&&this.isAi) {
            direction=direction===DIRECTION.RIGHT?DIRECTION.LEFT:DIRECTION.RIGHT;
            cc.log("Bot direction changed ",direction)
          }
          let currentHole=kichwa;
          //let pos=board.getHolePos(kichwa);
          //direction=pos.x>1?DIRECTION.RIGHT:DIRECTION.LEFT;
          do {
            //  debugger;
            currentHole=this.sow(this.inHand,currentHole,direction,this.turn,false,true);

            this.clearInHand();
            cc.log("hole val n ",board.getHoleValue(currentHole));
            if(this.canCapture(currentHole)){

              reward+= this.capture(currentHole);

             if(this.turn===PLAYER.NORTH&&this.isAi){
                //TODO handle capturing for ai

             }else {
               //break so a user can choose a kichwa
               break;
             }

            }else {

              this.setInHand(board.getHoleValue(currentHole))
            }

          }
          while (this.inHand>1);
          //this.sow(this.inHand,kichwa,direction,this.turn,false,true);

        }
        this.setMode(MODES.NORMAL);
        this.setAction(ACTIONS.PICK)
        this.checkStage();
        this.changeTurn();
       return reward;
      }
      else if(this.action===ACTIONS.SOW&&this.stage===STAGE.MTAJI) {
        cc.log("mtaji stage reached")
        this.getBoard().initBaoBoardState();
      }

    },
    checkStage(){
      this.stage=this.isMtaji()?STAGE.MTAJI:STAGE.NAMUA;
      cc.log("stage "+this.stage)
      return this.stage;
    },
    isMtaji(){
      return !(this.getStore(PLAYER.NORTH).value||this.getStore(PLAYER.SOUTH).value);
    },
    // use this for initialization
    onLoad: function () {
      this.hasNyumba={north:true,south:true};
      this.brain=new deepqlearn.Brain(DEEPQ.INPUTS,DEEPQ.ACTIONS,opt),
      //  cc.log(this.brain);
      //  cc.director.getCollitionsManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity=cc.p(0,0);
     //initialize board layout here
      this.getBoard().defaultBaoBoardLayout();
      this.getBoard().initBaoBoardState(BOARD_STATE.NORMAL);
      //this.turn=PLAYER.NORTH;
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
              this.handleHole(hole);


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



          this.handleMove();


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
      let canCapture=board.getHoleValue(hole)>1&&oValue;
      if (canCapture) {
        //nyumba captured logic
        let opponent=this.getOpponent(this.turn);
        if(this.isNyumba(oHole)&&this.playerHasNyumba(opponent)){
          this.playerLostNyumba(opponent);
          cc.log("Nyumba lost by capture ",this.hasNyumba)
        }
      board.removeKete(oHole,oValue);
      this.setInHand(oValue);
      }

      return oValue;
    },
    getOpponent(player=this.turn){
      return player===PLAYER.SOUTH?PLAYER.NORTH:PLAYER.SOUTH;
    },
    getNyumba(raw=false,player=this.turn){
        let board=this.getBoard();
        let hole;

      if(player===PLAYER.SOUTH){
        if(raw){
          return board.getRawHole(4,1);
        }
          return board.getHole(4,1);


      }
      else {

         if(raw){
           return board.getRawHole(3,2)
         }
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
      return (pos.x===4&&pos.y===1)||(pos.x===3&&pos.y===2);
    },
    isHolePlayable(hole,turn=this.turn,stage=this.stage){
      let y= this.getBoard().getHoleY(hole);
      let owner=y>1?PLAYER.NORTH:PLAYER.SOUTH;
      let kete=this.getBoard().getHoleValue(hole);
      if(stage===STAGE.NAMUA){
        return kete>0&&turn===owner;
      }
      else {
        return kete>1&&kete<16&&turn===owner;
      }

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
      return {state,left,right};
      }
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
      //console.log(holeslist);
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
    getNyumbaValue(player=this.turn){

      return this.getNyumba(false,player).value;
    },
    canTakasaNyumba(player=this.turn){

      return this.getNyumbaValue(player)<6;
     },
    isNyumbaOnlyAvailable(player=this.turn){
      let house=false;
      let board=this.getBoard();
      for (var i = 0; i < 8; i++) {
        let hole=board.getRawHole(i,player);
        let val=board.getHoleValue(hole);
        let isNyumba=this.isNyumba(hole)
        if(val>0&&!isNyumba){
         house=false;
         break;
        }
        else if(val>0&&isNyumba){

          house=true

        }

      }
      //cc.log("only house ",house);
      return house;
    },
    isKichwaOnlyAvailable(player=this.turn){
      let kichwa=false;
      let board=this.getBoard();
      for (var i = 0; i < 8; i++) {
        let hole=board.getRawHole(i,player);
        let val=board.getHoleValue(hole);
        let isKichwa=this.isKichwa(hole);

        if(val>0&&!isKichwa){
         kichwa=false;
         break;
        }
        else if(val>0&&isKichwa){

          kichwa=kichwa===false?true:false;

        }

      }
      //cc.log("only house ",house);
      return kichwa;
    },
    taxNyumba(){
       //let hole=;
     //  let board =this.getBoard();
     let nyumba=this.getNyumba()
     let val=nyumba.value;
     nyumba.removeKete(2);
      return val==(nyumba.value+2)?2:0;
    },
    isTakasaAllowed(hole,player=this.turn){
      let board=this.getBoard();

      let canCapture=this.canCapture(hole);
      let kete=board.getHoleValue(hole);
      let allowedHoles=this.getHolesWithMoreThan_1_kete(player).length;
      let hasNyumba=this.playerHasNyumba(player);
      let isNyumba=this.isNyumba(hole);
      let isKichwaOnlyAvailable=this.isKichwaOnlyAvailable(player);

     //debugger;
      if ((!canCapture.state))
      {

        if(kete>1&&!(isNyumba&&hasNyumba&&!this.canTakasaNyumba(player)&&this.stage===STAGE.NAMUA)&&!isKichwaOnlyAvailable){
          return {state:true,action:ACTIONS.TAKASA}
        }
        else if(((kete===1)&&(allowedHoles===0)||hasNyumba)&&!(isNyumba&&hasNyumba)&&this.stage===STAGE.NAMUA&&!isKichwaOnlyAvailable)
        {
         return {state:true,action:ACTIONS.TAKASA};
        }
        else if (kete>1&&isKichwaOnlyAvailable) {
          cc.log("only kichwa limit side");
          return {state:true,action:ACTIONS.KICHWAONLY};
        }
        else if (isNyumba&&hasNyumba&&this.isNyumbaOnlyAvailable(player))
        {
          //cc.log("only nyumba play taxation");
          return {state:true,action:ACTIONS.TAX};
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }

    },
    playerLostNyumba(player=this.getOpponent()){
      if(player===PLAYER.SOUTH){
        this.hasNyumba.south=false;
      }
      else if(player===PLAYER.NORTH) {
        this.hasNyumba.north=false;
      }
    },
    playerHasNyumba(player=this.turn){
      if(player===PLAYER.SOUTH){
        return this.hasNyumba.south;
      }
      else if(player===PLAYER.NORTH) {
        return this.hasNyumba.north;
      }
    },
    getHolesWithMoreThan_1_kete(player=this.turn){
      let y=0,x=0,holeslist=[];
      let board=this.getBoard()

      if(player===PLAYER.SOUTH){
        for(y=0;y<2;y++){
          for(x=0;x<8;x++){
            //find all holes that can be captured by  south player;

            let hole=board.getHole(x,y);
           if(this.isHolePlayable(hole))
           {
            let kete=board.getHoleValue(hole);
            if (kete>1)
            {
              holeslist.push(hole);
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
            let kete=board.getHoleValue(hole);
            if (kete>1)
            {
              holeslist.push(hole);
            }
          }
          }
        }
      }
      //console.log(holeslist);
      return holeslist;
    },

     //sow function overide
    sow(kete,startHole,direction,player=this.turn,test=false,inplace=false){
       let board=this.getBoard();
       let holePos=board.getHolePos(startHole);
       let hole;
       //console.log(holePos);
      //debugger;
          while(kete>0){
            if(!test&&inplace){
            hole= board.getHole(holePos.x,holePos.y).addKete(1);

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
           hole= board.getHole(holePos.x,holePos.y).addKete(1);
           }
          }
     //console.log(holePos);
         holePos=hole.getPos();
          return board.getRawHole(holePos.x,holePos.y);
     },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
      let hole=this.getBoard().getActiveHole();
      let pos=hole?this.getBoard().getHolePos(hole):{x:0,y:0};
      let turn=this.turn>1?"Oppo":"Your\'s"
      this.getBoard().setDisplayInfo("Turn:"+turn+" Hole: "+pos.x+","+pos.y+" hand: "+this.inHand+" stage: "+this.stage)
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
