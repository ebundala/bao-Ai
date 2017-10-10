cc.Class({
    extends: cc.Component,

    properties:{
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...


        canvas: {
             default: null,
             type: cc.Canvas
         },
       root:{
         default: null,
         type:cc.Node
       },

       kete:{
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

       hand:{
         default: null,
         type:cc.Prefab
       }


    },

    // use this for initialization
    onLoad: function () {


  let i=8,j=4,k=0,l=0;
  let dy=(this.root.height-160)/j;
  let dx=(this.root.width-320)/i;
  let offset_x=160,offset_y=80;
  let mbao =this.insertPrefab(this.mbao);
  mbao.setPosition(cc.p(offset_x,offset_y));

  for(k=0;k<j;k++){
   for(l=0;l<i;l++)
   {
     let store;
     let pattern;
     if(l===0&&k===0){
      store=this.insertPrefab(this.store);
      store.position=cc.p(offset_x-80,offset_y);
      pattern=this.insertPrefab(this.pattern);
      pattern.setPosition(cc.p(offset_x-dx,offset_y+2*dy));

     }
     else if (l===7&&k===3) {
       store=this.insertPrefab(this.store);

      // store.setAnchorPoint(cc.p(1,1));
       //store.setRotation(180);
       store.setPosition(cc.p(offset_x+l*dx+dx,offset_y+k*dy-dy));

       pattern=this.insertPrefab(this.pattern);
       pattern.setPosition(cc.p(offset_x+l*dx+dx,offset_y))

     }

     let hole;
     if(l===3&&k===2||l===4&&k===1){
        hole = this.insertPrefab(this.nyumba);
     }else {
         hole = this.insertPrefab(this.hole);
     }


      //if(k>1) {
      // var hole = this.insertPrefab(this.hole);
      //  hole.setRotation(180);
    //    hole.setPosition(cc.p(offset_x+l*dx+dx,offset_y+k*dy+dy));
    // }else{
    //var hole = this.insertPrefab(this.hole);
     hole.setPosition(cc.p(offset_x+l*dx,offset_y+k*dy));
   //}

   }

  }



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
    // update: function (dt) {

    // },
});
