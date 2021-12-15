/**
    Blastzone sprite
*/

Mario.Blastzone = function (world, x, y, xpic, ypic) {
    this.World = world;
    this.Image = Enjine.Resources.Images["blastzone"];
    this.PicWidth = 156;
    this.PicHeight = 156;
    this.X = x;
    this.Y = y;
    this.Xa = 0;
    this.Ya = -6;
    this.XPicO = 156;
    this.YPicO = 156;
    this.YPic = ypic;
    this.XPic = xpic;
    this.Life = 20;
    this.Direction = null;
};

Mario.Blastzone.prototype = new Mario.NotchSprite();

Mario.Blastzone.prototype.Initialize = function (world) {
    this.World = world
    if (this.Direction == -3) {
        this.XPic = 0
        this.YPic = 1
    }
    else if (this.Direction == 3) {
        this.XPic = 1
        this.YPic = 1
    }
    else if (this.Direction == -1) {
        this.XPic = 0
        this.YPic = 0
    }
    else if (this.Direction == 1) {
        this.XPic = 1
        this.YPic = 0
    }
};

Mario.Blastzone.prototype.Move = function () {

    if (this.Life-- < 0) {
        this.World.RemoveSprite(this);
        this.X = this.X
        this.Y = this.Y
    }
};