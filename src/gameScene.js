/**
 * Created by Wang Yihan on 2014/7/14.
 */

var gameLayer = cc.LayerColor.extend({
    groundArray : null,
    rockArray : null,
    player : null,

    ctor : function(){
        this._super();
        this.init();
    },

    init : function(){
        //background
        var bg = cc.Sprite.create(s_background);
        this.addChild(bg, 0);
        //this.gameLayer.setColor(cc.c4(255,255,255,255));
        bg.setAnchorPoint(0,0);
        bg.setPosition(0,0);
        //player
        this.spriteBall = cc.Sprite.create(s_player);
        this.spriteBall.setPosition(100,50);
        this.addChild(this.spriteBall);
        //ground and rock
        this.groundArray = [];
        this.rockArray = [];
        this.groundArray[0] = new ground(500, 300);
        this.addChild(this.groundArray[0], 1);
        this.schedule(this.updateGround, 0);
        //event
        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);
    },

    updateGround : function(){
        if(this.groundArray.length <= 0){
            this.addGround();
            return;
        }
        if(this.groundArray[0].posX + this.groundArray[0].len/2 <= 0){
            this.delGround();
        }
        if(this.rockArray[0] && this.rockArray[0].posX + 20 <= 0){
            this.delRock();
        }
        var num = this.groundArray.length;
        var screenWidth = cc.Director.getInstance().getWinSize().width;
        if(screenWidth - (this.groundArray[num-1].posX + this.groundArray[num-1].len/2) >= 100){
            this.addGround();
        }
    },

    addGround : function(){
        var size = cc.Director.getInstance().getWinSize();
        var num = this.groundArray.length;
        var len = GetRandomNum(1200, 1800);
        var delta = GetRandomNum(100, 400);
        var upOrDown = GetRandomNum(-10, 10);
        var high;
        //确定与前面一块ground的高度差
        if(upOrDown >= 0 && delta <= 200){
            high = this.groundArray[num-1].posY + delta;
        }else{
            high = this.groundArray[num-1].posY - delta;
        }
        if(high >= size.height - 200){
            high = this.groundArray[num-1].posY - delta;
        }
        if(high < 100){
            if(delta > 200)
                high = this.groundArray[num-1].posY + delta;
            else
                high = this.groundArray[num-1].posY + delta - 200;
        }
        //根据长度确定是否加入障碍物
        if(len > 1300){
            for(var i = 400; i < 1000; i+=200){
                if(GetRandomNum(-10, 10) > 0)
                    this.addRock(i, high, 0);
                else
                    this.addRock(i, high, 1);
            }
        }
        this.groundArray[num] = new ground(len, high);
        this.addChild(this.groundArray[num], 1);

        function GetRandomNum(Min, Max){
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }
    },

    addRock : function(x, y, style){
        var num = this.rockArray.length;
        this.rockArray[num] = new rock(x, y, style);
        this.addChild(this.rockArray[num], 1);
    },

    delGround : function(){
        var toDelete = this.groundArray.shift();
        this.removeChild(toDelete, true);
    },
    delRock : function(){
        var toDelete = this.rockArray.shift();
        this.removeChild(toDelete, true);
    },

    onMouseDown:function(event) {
        this.jump();
    },

    jump:function(){
        var actionBy = cc.JumpBy.create(0.5, cc.p(0, 0), 100, 1);
        this.spriteBall.runAction(actionBy);
    }
})

var gameScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        this.addChild(new gameLayer);
    }
});