/**
    Represents a life-giving mushroom.
    Code by Rob Kleffner, 2011
*/

Mario.Chest = function (world, x, y) {
    this.RunTime = 0;
    this.GroundInertia = 0.89;
    this.AirInertia = 0.1;
    this.OnGround = false;
    this.Width = 17;
    this.Height = 50;
    this.World = world;
    this.X = 150;
    this.Y = 200;
    this.Image = Enjine.Resources.Images["chest"];
    this.XPicO = 17;
    this.YPicO = 32;
    this.YPic = 0;
    this.Height = 50;
    this.Facing = 1;
    this.PicWidth = this.PicHeight = 33;
    this.Life = 0;

    this.Open = false;
    this.Reward = 0;
    this.layertimer = 10;
    this.EndTimer = 125;
};

Mario.Chest.prototype = new Mario.NotchSprite();

Mario.Chest.prototype.CollideCheck = function () {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
    if (xMarioD > -31 && xMarioD < 31) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            this.XPic = 1;
            if (!this.Open) {
                for (i = 0; i <= 2; i++) {
                    if (Math.random() * 2 | 0) {
                        this.Reward += 1
                    }
                }
                if (this.Reward == 1) {
                    this.Layer = 1;
                    this.World.AddSprite(new Mario.Mushroom(this.World, this.X, this.Y - 5));
                }
                else {
                    this.World.AddSprite(new Mario.FireFlower(this.World, this.X, this.Y - 5));
                }
                this.Open = true;
            }
        }
    }
};

Mario.Chest.prototype.Move = function () {

    if (this.Life < 9) {
        this.Layer = 1;
        this.Y--;
        this.Life++;
        return;
    }

    var sideWaysSpeed = 0;

    if (this.Open) {
        this.layertimer -= 1
        this.EndTimer -= 1
    }
    if (this.layertimer == 0) {
        this.Layer = 0;
    }
    if (this.EndTimer == 0) {
        Mario.MarioCharacter.Win()
    }

    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    if (Mario.MarioCharacter.character_select == "fox") {
        return;
    }
    this.Xa = this.Facing * sideWaysSpeed;

    this.XFlip = this.Facing === -1;
    this.RunTime += Math.abs(this.Xa) + 5;

    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);

    this.Ya *= 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }

    if (!this.OnGround) {
        this.Ya += 2;
    }
};

Mario.Chest.prototype.SubMove = function (xa, ya) {
    var collide = false;

    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }

    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }

    if (xa > 0) {
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }
    if (xa < 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        }
    }

    if (collide) {
        if (xa < 0) {
            this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.JumpTime = 0;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
        }

        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Chest.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.Chest.prototype.BumpCheck = function (x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 - 16 && y === ((y - 1) / 16) | 0) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};