cc.Class({
    extends: cc.Component,

    properties: {

      root:{
        default:null,
        type:cc.Node
      },
      hightlight:{
        default:null,
        type:cc.Sprite

      },
      kete:{
        default:null,
        type:cc.Prefab
      },
      keteList:{
        default:[],
        type:[cc.Node]
      },
      label:{
        default:null,
        type:cc.Label
      },
      bName:"",
      nodeX:0,
      nodeY:0,
      value:5,
    },
    insertPrefab(prefab){
      var node = cc.instantiate(prefab);
      node.parent = this.root;
      return node;
    },
    getRandomPosition: function() {
          return cc.p(cc.randomMinus1To1() * this.root.width/2, cc.randomMinus1To1() * this.root.height/2);
      },

      showHightlight(){
        this.hightlight.node.active=true;
        return this;
      },
      hideHighlight(){
        this.hightlight.node.active=false;
        return this;
      },
      highlightBlink(t){
        this.showHightlight();
        this.scheduleOnce(this.hideHighlight.bind(this),t)
        return this;
      },
    // use this for initialization
    onLoad: function () {
      this.label.string=this.value;
      this.hideHighlight();


    //  this.addKete(this.value);
    // var self=this;
    // self.root.on(cc.Node.EventType.TOUCH_START, function (event) {
    //     var touches = event.getTouches();
    //     var touchLoc = touches[0].getLocation();
    //     console.log(touchLoc);
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
    addKete(i){
      for (var j = 0; j < i; j++) {
      let kete= this.insertPrefab(this.kete);
      kete.position= this.getRandomPosition();
      this.keteList.push(kete);
      this.value++;

      }
      return this;
    },
    removeKete(i){
      for (var j = 0; j < i; j++) {
      this.keteList.pop().removeFromParent(true);
      this.value--;

    }
    return this;
    },
    setHoleName(name){
      this.bName=name;
      return this;
    },
    setHoleValue(value){
      this.value=value;
      return this;
    },
    setHolePos(x,y){
      this.nodeY=y;
      this.nodeX=x;
      return this;
    },


    // called every frame, uncomment this function to activate update callback
     update: function (dt) {

  this.label.string=this.value;

     },
});
