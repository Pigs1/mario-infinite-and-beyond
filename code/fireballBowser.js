/**
    Represents a Bowser fireball.
    Code by Pigs, 2022
*/

Mario.BowserFireball = function (world, x, y, facing) {
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;

    this.Image = Enjine.Resources.Images["bowserfireball"];

    this.World = world;
    this.X = x;
    this.Y = y;
    this.Facing = facing;

    this.XPicO = 16;
    this.YPicO = 15;
    this.YPic = 0;
    this.XPic = 2;
    this.Height = 10;
    this.Width = 8;
    this.PicWidth = 33;
    this.PicHeight = 31;
    this.Ya = 4;
    this.Dead = false;
    this.DeadTime = 0;
    this.OnGround = false;
    this.Lockon = false;
    this.pictimer = 7;
};

Mario.BowserFireball.prototype = new Mario.NotchSprite();

Mario.BowserFireball.prototype.Move = function () {
    var i = 0, sideWaysSpeed = 4;

    if (this.pictimer == 0) {
        if (this.XPic == 2) {
            this.XPic = 1;
            this.pictimer = 3;
        }
        else if (this.XPic == 1) {
            this.XPic = 0;
            this.pictimer = 3;
        }
        else if (this.XPic == 0) {
            this.XPic = 1;
            this.pictimer = 3;
        }
    }
    this.pictimer -= 1;
    if (this.DeadTime > 0) {
        for (i = 0; i < 8; i++) {
            this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 8 - 4) | 0) + 4, ((this.Y + Math.random() * 8 - 4) | 0) + 2, Math.random() * 2 - 1 * this.Facing, Math.random() * 2 - 1, 0, 1, 5));
        }
        this.World.RemoveSprite(this);
        return;
    }

    this.ExistTime += 1;

    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }

    this.Xa = this.Facing * sideWaysSpeed;

    this.World.CheckFireballCollide(this);

    this.XFlip = this.Facing === 1;

    if (!this.SubMove(this.Xa, 0)) {
        this.Die();
    }

    this.OnGround = false;

    if (Mario.MarioCharacter.Y - this.Y < 10 && Mario.MarioCharacter.Y - this.Y > -10) {
        this.Lockon = true;
    }
    if (!this.Lockon) {
        if (Mario.MarioCharacter.Y - this.Y > 7) {
            this.Ya = 3;
            this.SubMove(0, this.Ya);
        }
        else if (Mario.MarioCharacter.Y - this.Y < 7) {
            this.Ya = -3;
            this.SubMove(0, this.Ya);
        }
    }



    this.Xa *= this.AirInertia;

};

Mario.BowserFireball.prototype.CollideCheck = function () {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y, mariolaunchcheck = true;
    if (xMarioD < this.Width * 2 + 4 && xMarioD > -this.Width * 2 - 4 && yMarioD < this.Height && yMarioD > -this.Height) {

        if (Mario.MarioCharacter.character_select == "fox" && mariolaunchcheck && !Mario.MarioCharacter.airdodging) {
            mariolaunchcheck = false
            if (Mario.MarioCharacter.DashDance && Mario.MarioCharacter.launched > 0 && !Mario.MarioCharacter.collide) {
                Mario.MarioCharacter.X -= 5 * Mario.MarioCharacter.Facing;
                Mario.MarioCharacter.Xa = 0;
            }
            if (Mario.MarioCharacter.launched <= 0) {
                Mario.MarioCharacter.launched += 2 + (Mario.MarioCharacter.percentdamage * 0.3)
                Mario.MarioCharacter.launchangleX = (5 + (Mario.MarioCharacter.percentdamage * 0.45)) * this.Facing
                Mario.MarioCharacter.launchangleY = 3 + (Mario.MarioCharacter.percentdamage * 0.1)
                Mario.MarioCharacter.percentdamage += 2;
            }
        }
        else if (!Mario.MarioCharacter.airdodging) {
            Mario.MarioCharacter.GetHurt();
        }
        this.Die();
    }
};

Mario.BowserFireball.prototype.SubMove = function (xa, ya) {
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
        if (Mario.MarioCharacter.LevelType == Mario.LevelType.Bowser) {
            if (this.Y >= 165) {
                collide = true;
                this.OnGround = true;
            }
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

Mario.BowserFireball.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.BowserFireball.prototype.Die = function () {
    this.Dead = true;
    this.Xa = -this.Facing * 2;
    this.Ya = -5;
    this.DeadTime = 100;
};