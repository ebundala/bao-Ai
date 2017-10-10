cc.Class({
    extends: cc.Component,

    properties: {
      root:{
        default:null,
        type:cc.Node
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
    // use this for initialization
    onLoad: function () {
      this.label.string=this.value;
      this.addKete(this.value);



    },
    addKete(i){
      for (var j = 0; j < i; j++) {
      let kete= this.insertPrefab(this.kete);
      kete.position= this.getRandomPosition();
      this.keteList.push(kete);
      }
    },
    removeKete(i){
      for (var j = 0; j < i; j++) {
      this.keteList.pop().removeFromParent(true);
    }
    },


    // called every frame, uncomment this function to activate update callback
     update: function (dt) {



     },
});
