Mario.BowserWall = function (world, x, y) {
    this.RunTime = 0;
    this.GroundInertia = 0.89;
    this.AirInertia = 0.1;

    this.Width = 22;
    this.Height = 200;
    this.World = world;
    this.X = x;
    this.Y = 200;
    this.Image = Enjine.Resources.Images["BowserWall"];
    this.XPicO = 22;
    this.YPicO = 252;
    this.YPic = 0;
    this.Facing = 1;
    this.PicWidth = 22;
    this.PicHeight = 252;
    this.Life = 0;
    this.Layer = 0;
};

Mario.BowserWall.prototype = new Mario.NotchSprite();

Mario.BowserWall.prototype.CollideCheck = function () {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y, sprite = null;

    if (Mario.MarioCharacter.BowserHealth <= 10) {
        this.World.RemoveSprite(this);
    }

    if (Mario.MarioCharacter.X >= this.X && this.X == 50 && Mario.MarioCharacter.X <= 50 + 5) {
        Mario.MarioCharacter.X = 55;
        Mario.MarioCharacter.Xa = 0;
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) {
            Mario.MarioCharacter.Sliding = true;
        }
    }
    if (Mario.MarioCharacter.X <= this.X && this.X == 311 && Mario.MarioCharacter.X >= 311 - 30) {
        Mario.MarioCharacter.X = 311 - 30;
        Mario.MarioCharacter.Xa = 0;
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
            Mario.MarioCharacter.Sliding = true;
        }
    }
    if (Mario.MarioCharacter.X > this.X && this.X == 311) {
        Mario.MarioCharacter.X = 310;
    }
    if (Mario.MarioCharacter.X < this.X && this.X == 50) {
        Mario.MarioCharacter.X = 51;
    }
};

Mario.BowserWall.prototype.Move = function () {
};

Mario.BowserWall.prototype.SubMove = function (xa, ya) {
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

Mario.BowserWall.prototype.IsBlocking = function (x, y, xa, ya) {
}

Mario.BowserWall.prototype.BumpCheck = function (x, y) {

};