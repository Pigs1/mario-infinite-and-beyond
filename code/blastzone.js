/**
    Blastzone sprite
*/

Mario.Blastzone = function (world, x, y) {
    this.World = world;
    this.Image = Enjine.Resources.Images["blastzone"];
    this.PicWidth = 144;
    this.PicHeight = 156;
    this.X = x;
    this.Y = y;
    this.Xa = 0;
    this.Ya = -6;
    this.XPic = 0;
    this.YPic = 0;
    this.Life = 5;

};

Mario.Blastzone.prototype = new Mario.NotchSprite();

Mario.Blastzone.prototype.Move = function () {
    var x = 0, y = 0;
    if (this.Life-- < 0) {
        this.World.RemoveSprite(this);
        this.X = this.X
        this.Y = this.Y
    }
};