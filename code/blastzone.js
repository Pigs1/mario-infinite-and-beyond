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
    this.XPic = 1;
    this.YPic = 1;
    this.Layer = 1;
};

Mario.Blastzone.prototype = new Mario.NotchSprite();