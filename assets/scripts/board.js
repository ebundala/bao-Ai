//TODO remove initialization of board to gameplay logic
//TODO enable initialization of board from an array/data structure from gameplay logic;

const PLAYER={NORTH:2,SOUTH:1}
const DIRECTION={LEFT:1,RIGHT:2,UP:3,DOWN:4,HORIZONTAL:5,VERTICAL:6,DOWN_LEFT:7,DOWN_RIGHT:8,UP_LEFT:9,UP_RIGHT:10}
const BOARD_STATE={NORMAL:1,TAKASA:2,CAPTURING:3}
cc.Class({
    extends: cc.Component,

    properties:{


      canvas: {
             default: null,
             type: cc.Canvas
         },
       root:{
         default: null,
         type:cc.Node
       },
       //game infos display
       //Todo add more features and expose to gameplay logic for manipulation
       info:{
         default:null,
         type:cc.Label
       },
       //main array to hold holes
       holeslist:[Array],
       //arrows node
       arrows:{
         default:null,
         type:cc.Node
       },
       arrow:{
         default: null,
         type:cc.Prefab
       },

       hole:{
         default: null,
         type:cc.Prefab
       },

       store:{
         default: null,
         type:cc.Prefab
       },
       pattern:{
         default: null,
         type:cc.Prefab
       },
       mbao:{
         default: null,
         type:cc.Prefab
       },
       nyumba:{
         default: null,
         type:cc.Prefab
       },

     //a hand will be used for sowing animations graphics only probably
       hand:{
         default: null,
         type:cc.Prefab
       },
       activeHole:{
         default:null,
         type:cc.Node
       },
       gameRules:[],
       direction:0
    },

    // use this for initialization
    onLoad: function () {

      this.gameRules=new Array();
      this.arrows=new Object();
    },
    defaultBaoBoardLayout(){
      this.holeslist=[new Array(8),new Array(8),new Array(8),new Array(8),new Array(8)];

      let i=8,j=4,y=0,x=0;
      let dy=(this.root.height-160)/j;
      let dx=(this.root.width-320)/i;
      let offset_x=160,offset_y=80;
      let mbao =this.insertPrefab(this.mbao);
      mbao.setPosition(cc.p(offset_x,offset_y));
      //create the playing board
      for(y=0;y<j;y++){
         for(x=0;x<i;x++)
         {
           let row=[];
           let store;
           let pattern;
           if(x===0&&y===0){
             store=this.insertPrefab(this.store);
             store.position=cc.p(offset_x-80,offset_y);
             pattern=this.insertPrefab(this.pattern);
             pattern.setPosition(cc.p(offset_x-dx,offset_y+2*dy));
             this.holeslist[4][0]=store;//south store hole
           }
           else if (x===7&&y===3) {
             store=this.insertPrefab(this.store);
             store.setPosition(cc.p(offset_x+x*dx+dx,offset_y+y*dy-dy));
             pattern=this.insertPrefab(this.pattern);
             pattern.setPosition(cc.p(offset_x+x*dx+dx,offset_y))
             this.holeslist[4][1]=store;//north store hole

           }

           let hole;
           if(x===3&&y===2||x===4&&y===1){
             hole = this.insertPrefab(this.nyumba);
           }else {
             hole = this.insertPrefab(this.hole);
           }

           hole.setPosition(cc.p(offset_x+x*dx,offset_y+y*dy));
           this.setHolePos(hole,{x,y});


          //  hole.on(cc.Node.EventType.TOUCH_END, function (event)
          //  {
          //    //  var touches = event.getTouches();
          //    // var touchLoc = touches[0].getLocation();
          //
          //    let node =event.target;
          //    this.removeActiveHole();
          //    this.setActiveHole(node)
          //
          //
           //
           //
          //    let pos=node.getPosition();
          //    let width=node.width;
          //    let height=node.height;
           //
          //    this.setArrowsPos(pos,width,height);
          //    this.showArrows(node,"horizontal");
          //    // console.log(value);
           //
          //  }, this);

           this.holeslist[y][x]=hole;

         }

      }
       //this.addTouchToStores();
    },
    initBaoBoardState(state=BOARD_STATE.NORMAL){
      // populate initial state of the board
            for (let y = 0; y < 4; y++) {
              for (let x = 0; x < 8; x++) {
              this.getHole(x,y).reset();
              }


            }

            if(state===BOARD_STATE.NORMAL)
            {
              //normal holes
              this.getHole(1,2).addKete(2);
              this.getHole(2,2).addKete(2);
              this.getHole(5,1).addKete(2);
              this.getHole(6,1).addKete(2);
              //nyumba holes
              this.getHole(4,1).addKete(6);
              this.getHole(4,1).setHoleName("south-nyumba");
              this.getHole(3,2).addKete(6);
              this.getHole(3,2).setHoleName("north-nyumba");

              //stores holes;
              this.getHole(0,4).addKete(22);
              this.getHole(0,4).setHoleName("south-store");
              this.getHole(1,4).addKete(22);
              this.getHole(1,4).setHoleName("north-store");


              //kimbi and kichwa
              this.getHole(0,1).setHoleName("kichwa-l");
              this.getHole(0,2).setHoleName("kichwa-l");
              this.getHole(7,1).setHoleName("kichwa-r");
              this.getHole(7,2).setHoleName("kichwa-r");

              this.getHole(1,1).setHoleName("kimbi-l");
              this.getHole(1,2).setHoleName("kimbi-l");
              this.getHole(6,1).setHoleName("kimbi-r");
              this.getHole(6,2).setHoleName("kimbi-r");
            }
            else if(state===BOARD_STATE.TAKASA) {
              let i=0,j=0;

                for (j = 1;j < 2;j++) {
                  for (i = 0; i < 8; i++) {
                    this.getHole(i,j).addKete(2);
                }
              }
            }
            else if (state===BOARD_STATE.CAPTURING) {
              let i=0,j=0;

                for (j = 1;j < 3;j++) {
                  for (i = 0; i < 8; i++) {
                    this.getHole(i,j).addKete(2);
                }
              }



            }
            else {
              this.getHole(0,4).addKete(19);
              this.getHole(0,4).setHoleName("south-store");
              this.getHole(1,4).addKete(20);
              this.getHole(1,4).setHoleName("north-store");

              //holes
              this.getHole(0,1).addKete(1);
              this.getHole(1,1).addKete(3);
              this.getHole(3,1).addKete(1);
              this.getHole(4,1).addKete(8);
              this.getHole(0,2).addKete(2);
              this.getHole(2,2).addKete(3);
              this.getHole(3,2).addKete(7);
            }








            return this;
    },
    addTouchToStores(){
      this.getRawHole(0,4).on(cc.Node.EventType.TOUCH_END, function (event)
      {
         // var touches = event.getTouches();
          //var touchLoc = touches[0].getLocation();
          //console.log();
          //this.addKete(5);

          let node =event.target;//.getComponent("boardNode");
          this.removeActiveHole();
          this.setActiveHole(node)
          //this.addKete(node,5);
          let value=this.getHoleValue(this.getActiveHole());
          //this.removeKete(node,value);
          //this.sow(value,this.getHoleComponent(node),"left","south");

          console.log(value);

      }, this);

       this.getRawHole(1,4).on(cc.Node.EventType.TOUCH_END, function (event)
       {
          // var touches = event.getTouches();
           //var touchLoc = touches[0].getLocation();
           let node =event.target;
           this.removeActiveHole();
           this.setActiveHole(node)
           let value=this.getHoleValue(this.getActiveHole());
           console.log(value);
       }, this);
       return this;
    },
    insertPrefab(prefab,parent=this.root){
      var node = cc.instantiate(prefab);
      node.parent = parent;
      return node;
    },
    //helper to generate random position within range for kete
    getRandomPosition: function() {
          return cc.p(cc.randomMinus1To1() * this.randomRange.x, cc.randomMinus1To1() * this.randomRange.y);
      },

   //arrows and direction
    setDirection(value){
      this.direction=value;
      console.log(value);
    },
    getDirection(){
      return this.direction;
    },
    invertDirection(direction,commit=true){
      let dir=direction;
      if(direction===DIRECTION.LEFT||direction===DIRECTION.RIGHT){
      dir=direction===DIRECTION.LEFT?DIRECTION.RIGHT:DIRECTION.LEFT;}
      else {
        dir=direction===DIRECTION.UP?DIRECTION.DOWN:DIRECTION.UP;
      }
      if(commit){
      this.setDirection(dir);
       }
      return dir;
    },
    setArrowsPos(pos,width,height){
      pos.y=pos.y+height/2;
      pos.x=pos.x+width/2
      this.arrows.up.setPosition(cc.p(pos.x,pos.y+height));
      this.arrows.down.setPosition(cc.p(pos.x,pos.y-height));
      this.arrows.left.setPosition(cc.p(pos.x+width,pos.y));
      this.arrows.right.setPosition(cc.p(pos.x-width,pos.y));
    },
    addArrows(){
      //insert arrows Prefabs

      this.arrows.right=this.insertPrefab(this.arrow);
      this.arrows.right.setRotation(180);
      this.arrows.left=this.insertPrefab(this.arrow);
      this.arrows.left.setRotation(0);

      this.arrows.up=this.insertPrefab(this.arrow);
      this.arrows.up.setRotation(270);
      this.arrows.down=this.insertPrefab(this.arrow);
      this.arrows.down.setRotation(90);

      //click listeners
      this.arrows.right.on(cc.Node.EventType.TOUCH_END, function (event)
      {
      let node =event.target;
      //set direction here
      this.setDirection(DIRECTION.LEFT);
      console.log("LEFT")

      //hide arrows here
      this.hideArrows();
      //call game logic here
      if(typeof(this.gamePlay)==="function"){
        this.gamePlay();
      }

      }, this);

      this.arrows.left.on(cc.Node.EventType.TOUCH_END, function (event)
      {
      let node =event.target;
      //set direction here
      this.setDirection(DIRECTION.RIGHT);
      console.log("RIGHT")
      //hide arrows here
      this.hideArrows();
      //gamePlay logic
      if(typeof(this.gamePlay)==="function"){
        this.gamePlay();
      }
      }, this);
      this.arrows.up.on(cc.Node.EventType.TOUCH_END, function (event)
      {
      let node =event.target;
      //set direction here
      this.setDirection(DIRECTION.UP);
      console.log("UP")

      //hide arrows here
      this.hideArrows();
      //gamePlay logic
      if(typeof(this.gamePlay)==="function"){
        this.gamePlay();
      }
      }, this);
      this.arrows.down.on(cc.Node.EventType.TOUCH_END, function (event)
      {
      let node =event.target;
      //set direction here
      this.setDirection(DIRECTION.DOWN);
      console.log("DOWN")

      //hide arrows here
      this.hideArrows();
      //gamePlay logic
      if(typeof(this.gamePlay)==="function"){
        this.gamePlay();
      }

      }, this);


        this.hideArrows();
    },
    hideArrows(mode=0){


      switch (mode) {
        case DIRECTION.UP_RIGHT:
        this.arrows.up.active=false;
        this.arrows.right.active=false;
          break;
        case DIRECTION.UP_LEFT:
        this.arrows.up.active=false;
        this.arrows.left.active=false;
          break;
        case DIRECTION.DOWN_RIGHT:
        this.arrows.down.active=false;
        this.arrows.right.active=false;
          break;
        case DIRECTION.DOWN_LEFT:
        this.arrows.down.active=false;
        this.arrows.left.active=false;
          break;
        case DIRECTION.HORIZONTAL:
        this.arrows.left.active=false;
        this.arrows.right.active=false;
          break;
        case DIRECTION.VERTICAL:
        this.arrows.up.active=false;
        this.arrows.down.active=false;
          break;
        case DIRECTION.LEFT:
        this.arrows.left.active=false;
         break;
        case DIRECTION.RIGHT:
        this.arrows.right.active=false;
         break;
        case DIRECTION.UP:
        this.arrows.up.active=false;
        break;
        case DIRECTION.DOWN:
        this.arrows.down.active=false;
        break;
        default:
        this.arrows.left.active=false;
        this.arrows.right.active=false;
        this.arrows.up.active=false;
        this.arrows.down.active=false;
      }

    },
    showArrows(node,mode=0){


      switch (mode) {
        case DIRECTION.UP_RIGHT:
        this.arrows.up.active=true;
        this.arrows.right.active=true;
        this.arrows.left.active=false;
        this.arrows.down.active=false;
        break;
        case DIRECTION.UP_LEFT:
        this.arrows.up.active=true;
        this.arrows.left.active=true;
        this.arrows.right.active=false;
        this.arrows.down.active=false;
        break;
        case DIRECTION.DOWN_RIGHT:
        this.arrows.down.active=true;
        this.arrows.right.active=true;
        this.arrows.left.active=false;
        this.arrows.up.active=false;
        break;
        case DIRECTION.DOWN_LEFT:
        this.arrows.down.active=true;
        this.arrows.left.active=true;
        this.arrows.right.active=false;
        this.arrows.up.active=false;
        break;
        case DIRECTION.HORIZONTAL:
        this.arrows.left.active=true;
        this.arrows.right.active=true;
        this.arrows.up.active=false;
        this.arrows.down.active=false;
        break;
        case DIRECTION.VERTICAL:
        this.arrows.up.active=true;
        this.arrows.down.active=true;
        this.arrows.left.active=false;
        this.arrows.right.active=false;
        break;
        case DIRECTION.LEFT:
        this.arrows.left.active=true;
        this.arrows.right.active=false;
        this.arrows.up.active=false;
        this.arrows.down.active=false;
        break;
        case DIRECTION.RIGHT:
        this.arrows.right.active=true;
        this.arrows.left.active=false;
        this.arrows.up.active=false;
        this.arrows.down.active=false;
        break;
        case DIRECTION.UP:
        this.arrows.up.active=true;
        this.arrows.left.active=false;
        this.arrows.right.active=false;
        this.arrows.down.active=false;
        break;
        case DIRECTION.DOWN:
        this.arrows.down.active=true;
        this.arrows.left.active=false;
        this.arrows.right.active=false;
        this.arrows.up.active=false;
        break;
        default:
        this.arrows.left.active=true;
        this.arrows.right.active=true;
        this.arrows.up.active=true;
        this.arrows.down.active=true;

      }

    },


     //hole manipulators
    sow(kete,startHole,direction,player,test=false,inplace=false){
      let holePos=this.getHolePos(startHole);
      console.log(holePos);
         while(kete>0){
           if(!test&&inplace){
             this.getHole(holePos.x,holePos.y).addKete(1);
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

                  if (direction===DIRECTION.LEFT)
                   {
                     if(holePos.x===7){
                        holePos.y>2?holePos.y--:holePos.y++;
                        direction=DIRECTION.RIGHT;
                     }else{
                      holePos.x++;
                      }

                    }else { //right direction
                     if(holePos.x===0){
                      direction=DIRECTION.LEFT;
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
          this.getHole(holePos.x,holePos.y).addKete(1);
          }
         }
         return holePos;
    },
    setActiveHole(hole){
      if(hole)//Todo check if instance of hole
      {
        this.activeHole=hole;
        let node=this.getHoleComponent(hole)
        node.highlighBlink(3,cc.Color.ORANGE);
        return node;
      }
      return null;
    },
    removeActiveHole(){
        if(this.activeHole)//check if instance of a hole
        {
        let node=this.getHoleComponent(this.activeHole)
        node.hideHighlight();
        return node;
      }
      this.activeHole=null;
      return null;
    },
    getActiveHole(){
      return this.activeHole;
    },
    getHole(x,y){
     return this.getHoleComponent(this.holeslist[y][x]);
    },
    getRawHole(x,y){
      return this.holeslist[y][x];
    },
    getHoleComponent(hole){
     return  hole.getComponent("boardNode");
    },
    addKete(hole,i){
      let node=  hole.getComponent("boardNode");
      node.addKete(i);
      return node;
    },
    removeKete(hole,i){
      let node=hole.getComponent("boardNode")
      node.removeKete(i);
      return node
    },

    //hole content getters and setters
    getHoleValue(hole){
      return hole.getComponent("boardNode").value;
    },
    getHoleType(hole){
        return hole.getComponent("boardNode").bName;
    },
    getHoleX(hole){
        return hole.getComponent("boardNode").getPos().x;
    },
    getHoleY(hole){
        return hole.getComponent("boardNode").getPos().y;
    },
    getHolePos(hole){
      return hole.getComponent("boardNode").getPos();


    },
    getHoleInfo(hole){
      let holeNode= hole.getComponent("boardNode");
      return { value:holeNode.value,
        x:holeNode.nodeX,
        y:holeNode.nodeY,
        name:holeNode.bName
      };

    },
    setHoleName(hole,name){
       let node=hole.getComponent("boardNode");
       node.bName=name;
       return node;
      },
    setHoleValue(hole,value){
      let node= hole.getComponent("boardNode")
      node.setHoleValue=value;
      return node;
    },
    setHoleType(hole,name){
      let node=  hole.getComponent("boardNode");
      node.setHoleName(name);
      return node;
    },
    setHoleX(hole,x){
      let node=  hole.getComponent("boardNode")
      node.nodeX=x;
      return node;
    },
    setHoleY(hole,y){
      let node= hole.getComponent("boardNode")
      node.nodeY=y;
      return node;
     },
    setHolePos(hole,info){
      let node= hole.getComponent("boardNode");
      node.setHolePos(info.x,info.y)
      return node

    },
    setHoleInfo(hole,info){
       let holeNode= hole.getComponent("boardNode");

      holeNode.setHoleY(info.x);
      holeNode.setHoleY(info.y);
      holeNode.setHoleName(info.name);
      holeNode.setHoleValue(info.value);
      return holeNode;

    },
    //gamePlay rules
    addGameRule(rule){
      this.gameRules.push(rule);
      return this;
    },
    removeGameRule(rule){
      //todo logic to remove game rule from rules array
    },
    gamePlay(){
      if(this.gameRules.length){
        for(let i=0;i<this.gameRules.length;i++){
          if(typeof(this.gameRules[i])==="function"){
            this.gameRules[i]();
          }
        }
      }
    },
    setDisplayInfo(info){
      this.info.string=info;
    },

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
      // let info=this.activeHole?this.getHolePos(this.activeHole):{x:0,y:0};
       //

     },
});
