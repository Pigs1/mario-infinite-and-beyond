/**
    Global representation of the Bowser Boss
    Original sprites by Fnafguy123
*/

Mario.Bowser = function (world, x, y) {
    this.RunTime = 0;
    this.GroundInertia = 0.89;
    this.AirInertia = 0.1;
    this.OnGround = false;
    this.Width = 15;
    this.Height = 71;
    this.World = world;
    this.X = 300;
    this.Y = 180;
    this.Image = Enjine.Resources.Images["Bowser"];
    this.XPicO = 30;
    this.YPicO = 93;
    this.YPic = 0;
    this.PicWidth = 66;
    this.PicHeight = 81;
    this.Layer = 1;
    this.Facing = 0;
    this.Health = 20;
    this.Deadtime = 0;
    this.State = null;
    this.Begin = true;

    this.walkframe = 0;
    this.walkframetimer = 10;

    this.FireballTimer = 10;
};

Mario.Bowser.prototype = new Mario.NotchSprite();

/**
    States:
    0 = Waiting for fight pose
    1 = Idle
    2 = Walk
    3 = Punch
    4 = Shell Attack
    5 = Jump Attack
    6 = Death State
    7 = Fireball 
*/

Mario.Bowser.prototype.CollideCheck = function () {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y, sprite = null, mariolaunchcheck = true;

    if (xMarioD > -this.Width * 2 - 4 && xMarioD < this.Width * 2 + 4) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            if (yMarioD <= 0 && Mario.MarioCharacter.Ya > 0 && Mario.MarioCharacter.launched == 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
                Mario.MarioCharacter.Stomp(this);
                if (Mario.MarioCharacter.GroundPoundTimer > 0) {
                    this.Health -= 5;
                    Mario.MarioCharacter.GroundPoundEnabled = false;
                    Mario.MarioCharacter.GroundPoundTimer = 0;
                    if (xMarioD >= 0) {
                        Mario.MarioCharacter.Xa = 18;
                    }
                    else {
                        Mario.MarioCharacter.Xa = -18;
                    }
                    Mario.MarioCharacter.Ya = -3;
                }
                else {
                    this.Health -= 1;
                }
            }
            else {
                if (!(this.Deadtime > 1) && yMarioD < Mario.MarioCharacter.Height) {
                    if (Mario.MarioCharacter.character_select == "fox" && mariolaunchcheck && !Mario.MarioCharacter.airdoging) {
                        mariolaunchcheck = false
                        if (Mario.MarioCharacter.DashDance && Mario.MarioCharacter.launched > 0 && !Mario.MarioCharacter.collide) {
                            Mario.MarioCharacter.X -= 5 * Mario.MarioCharacter.Facing;
                            Mario.MarioCharacter.Xa = 0;
                        }
                        if (Mario.MarioCharacter.launched <= 0) {
                            Mario.MarioCharacter.launched += 2 + (Mario.MarioCharacter.percentdamage * 0.3)
                            if (this.X > Mario.MarioCharacter.X) {
                                Mario.MarioCharacter.launchangleX = -1 * (5 + (Mario.MarioCharacter.percentdamage * 0.45))
                            }
                            else {
                                Mario.MarioCharacter.launchangleX = 5 + (Mario.MarioCharacter.percentdamage * 0.45)
                            }
                            Mario.MarioCharacter.launchangleY = 3 + (Mario.MarioCharacter.percentdamage * 0.1)
                            Mario.MarioCharacter.percentdamage += 2;
                        }
                    }
                    else if (yMarioD < 0) {
                        Mario.MarioCharacter.GetHurt();
                    }
                }
            }
        }
    }
    if (Mario.MarioCharacter.X >= 49) {
        this.Begin = false;
    }
};

Mario.Bowser.prototype.Move = function () {
    if (this.Health <= 0) {
        this.Deadtime = 10;
        this.World.RemoveSprite(this);
    }

    if (this.Begin) {
        this.State = 0;
        this.Facing = -1
    }
    else {
        if (this.State != 1) {
            this.State = 7;
        }
    }
    this.YPic = this.State;
    if (this.State == 1) {
        this.XPic = 0;
        this.PicWidth = 69;
        // this.State = (Math.random() * 7) | 0;
    }
    if (this.State == 2) {
        this.PicWidth = 67;
        if (Mario.MarioCharacter.X <= this.X) {
            this.Facing = -1;
        }
        else {
            this.Facing = 1;
        }
        if (this.walkframetimer == 0) {
            this.walkframetimer = 10;
            if (this.walkframe < 3) {
                this.walkframe += 1;
            }
            else {
                this.walkframe = 0;
            }
        }
        else {
            this.walkframetimer -= 1;
        }
        this.XPic = this.walkframe;
        if (this.XPic == 1 || this.XPic == 3) {
            this.Xa = 0.2 * this.Facing
        }
        else {
            this.Xa = 1.5 * this.Facing;
        }
        this.SubMove(this.Xa, 0);
    }
    if (this.State == 7) {
        this.YPic = 0;
        if (this.XPic == 0) {
            this.XPic = 1;
        }
        this.PicWidth = 67;
        if (this.FireballTimer == 0) {
            if (this.XPic == 2) {
                this.FireballTimer = 25;
            }
            else {
                this.FireballTimer = 10;
            }
            if (this.XPic < 3) {
                this.XPic += 1;
            }
            else {
                this.State = 1;
            }
        }
        else {
            if (this.XPic == 3 && this.FireballTimer == 25) {
                this.World.AddSprite(new Mario.BowserFireball(this.World, this.X + this.Facing * 6, this.Y - 50, this.Facing));
            }
            this.FireballTimer -= 1;
        }
    }
    this.XFlip = this.Facing === -1;
    this.Ya = 2;
    if (this.Y <= 192) {
        this.SubMove(0, this.Ya);
    }
};

Mario.Bowser.prototype.SubMove = function (xa, ya) {
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

Mario.Bowser.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.Bowser.prototype.BumpCheck = function (x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 - 16 && y === ((y - 1) / 16) | 0) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};