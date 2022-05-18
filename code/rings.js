/**
    Represents a simple little coin animation when popping out of the box.
    Code by Rob Kleffner, 2011
*/

Mario.Rings = function (world, x, y, Xa, Ya) {
    this.World = world;
    this.Life = 80;
    this.Image = Enjine.Resources.Images["ringmap"];
    this.PicWidth = this.PicHeight = 16;
    this.X = x;
    this.Y = y;
    this.Xa = Xa;
    this.Ya = Ya - (Math.random() * 2 | 0);
    this.XPic = 0;
    this.YPic = 2;
    this.OnGround = false;
    this.Height = 4;
    this.Width = 8;

    this.BounceHeight = -0.8
};

Mario.Rings.prototype = new Mario.NotchSprite();

Mario.Rings.prototype.Move = function () {

    if (this.X - Mario.MarioCharacter.X < 16 && this.Y - Mario.MarioCharacter.Y < 16 && this.X - Mario.MarioCharacter.X > -16 && this.Y - Mario.MarioCharacter.Y > -16) {
        Mario.MarioCharacter.Coins += 1;
        this.World.RemoveSprite(this);
    }

    if (this.Life > 0) {
        this.Life -= 1;
    }

    this.XPic = this.Life & 3;

    this.SubMove(this.Xa, this.Ya);
    if (!this.OnGround) {
        this.Ya += 1;
    }
    else {
        this.Ya *= this.BounceHeight;
        this.OnGround = false;
        this.BounceHeight += 0.2
    }

};

Mario.Rings.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};


Mario.Rings.prototype.SubMove = function (xa, ya) {
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

        if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa + this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
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

        if (this.AvoidCliffs && this.OnGround && !this.World.Level.IsBlocking(((this.X + this.Xa - this.Width) / 16) | 0, ((this.Y / 16) + 1) | 0, this.Xa, 1)) {
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
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 16;
            this.OnGround = true;
            if (this.OnGround && this.Life <= 0) {
                this.World.RemoveSprite(this);
            }
        }

        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};