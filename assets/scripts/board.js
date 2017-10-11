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
       info:{
         default:null,
         type:cc.Label
       },
       holeslist:[Array],

      //  kete:{
      //    default: null,
      //    type:cc.Prefab
      //  },

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

       hand:{
         default: null,
         type:cc.Prefab
       },
       activeHole:{
         default:null,
         type:cc.Node
       },
       turn:0



    },

    // use this for initialization
    onLoad: function () {
  this.holeslist=[new Array(8),new Array(8),new Array(8),new Array(8),new Array(8)];
  this.hands={south:0,north:0,turn:0};
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


     hole.on(cc.Node.EventType.TOUCH_END, function (event)
     {
        // var touches = event.getTouches();
         //var touchLoc = touches[0].getLocation();
         let node =event.target;
         this.removeActiveHole();
         this.setActiveHole(node)

         let value=this.getHoleValue(this.getActiveHole());


         console.log(value);

     }, this);

     this.holeslist[y][x]=hole;

   }

  }

   this.addTouchToStores().initBoardState();



      // this.scheduleOnce(function () {
      //   this.sow(19,this.getHole(7,2),"right","north")
      // }.bind(this),5);

      // var self=this;
      // self.root.on(cc.Node.EventType.TOUCH_START, function (event) {
      //     var touches = event.getTouches();
      //     var touchLoc = touches[0].getLocation();
      //     //console.log(touchLoc);
      //
      // }, self.node);
      // self.root.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      //     var touches = event.getTouches();
      //     var touchLoc = touches[0].getLocation();
      //
      //
      // }, self.node);
      // self.root.on(cc.Node.EventType.TOUCH_END, function (event) {
      //    // when touch ended, stop moving
      // }, self.node);




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

    sow(kete,startHole,direction,player){
      let holePos=this.getHolePos(startHole);
         while(kete>0){


               if(player==="south")
              {
                if (direction==="left")
                 {
                   if(holePos.x===0){
                     holePos.y>0?holePos.y--:holePos.y++;
                     direction="right";
                   }else{
                  holePos.x--;
                }

              }else { //right direction
                  if(holePos.x===7){
                    direction="left";
                    holePos.y>0?holePos.y--:holePos.y++;
                  }else{
                    holePos.x++;
                  }

                }
                }
                else //north player logic
                {

                  if (direction==="left")
                   {
                     if(holePos.x===7){
                      holePos.y>2?holePos.y--:holePos.y++;
                       direction="right";
                     }else{
                    holePos.x++;
                  }

                }else { //right direction
                    if(holePos.x===0){
                      direction="left";
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
                this.getHole(holePos.x,holePos.y).addKete(1)//.highlightBlink(0.1);

         }
         return holePos;
    },
    setActiveHole(hole){
      if(hole)//Todo check if instance of hole
      {
      this.activeHole=hole;
      let node=this.getHoleComponent(hole)
      node.showHightlight();
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

    getHoleComponent(hole)
    {
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
    getHoleValue(hole){
      return hole.getComponent("boardNode").value;
    },
    getHoleType(hole){
        return hole.getComponent("boardNode").bName;
    },
    getHoleX(hole){
        return hole.getComponent("boardNode").nodeY;
    },
    getHoleY(hole){
        return hole.getComponent("boardNode").nodeY;
    },
    getHolePos(hole){
      let holeNode= hole.getComponent("boardNode");
      return {y:holeNode.nodeY,x:holeNode.nodeX,};

    },
    getHoleInfo(hole) {
    let holeNode= hole.getComponent("boardNode");
    return { value:holeNode.value,
      x:holeNode.nodeX,
      y:holeNode.nodeY,
      name:holeNode.bName
    };

    }
  ,
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
    initBoardState(){
      // populate initial state of the board

          //normal holes
           this.getHole(2,1).addKete(2);
          this.getHole(3,1).addKete(2);
           this.getHole(4,2).addKete(2);
           this.getHole(5,2).addKete(2);
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
            return this;
    },

    insertPrefab(prefab){
      var node = cc.instantiate(prefab);
      node.parent = this.root;
      return node;
    },

    getRandomPosition: function() {
          return cc.p(cc.randomMinus1To1() * this.randomRange.x, cc.randomMinus1To1() * this.randomRange.y);
      },
    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
       let info=this.activeHole?this.getHolePos(this.activeHole):{x:0,y:0};
       this.info.string="Turn: Yours"+" Hole: "+info.x+","+info.y

     },
});
