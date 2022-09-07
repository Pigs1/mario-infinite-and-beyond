/**
    Global representation of the MasterHand Boss
*/

Mario.MasterHand = function (world, x, y) {
    this.RunTime = 0;
    this.GroundInertia = 0.89;
    this.AirInertia = 0.1;
    this.OnGround = false;
    this.Width = 15;
    this.Height = 71;
    this.World = world;
    this.X = 250;
    this.Y = 179;
    this.Image = Enjine.Resources.Images["MasterHand"];
    this.XPicO = 41;
    this.YPicO = 65;
    this.YPic = 0;
    this.PicWidth = 65;
    this.PicHeight = 61;
    this.Layer = 1;
    this.Facing = 0;
    this.Health = 50;
    this.Deadtime = 0;
    this.State = 0;

    this.IdleFrame = 0;

    this.FireballTimer = 10;

    this.DeathTimer = 50;
};

Mario.MasterHand.prototype = new Mario.NotchSprite();

/**
    States:
    0 = Idle
    1 = ?
    2 = Sideways Punch
    3 = Downwards Punch
    4 = Grab
    5 = Gun
    6 = Death State
*/

Mario.MasterHand.prototype.CollideCheck = function () {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y, sprite = null, mariolaunchcheck = true, xd = Mario.MarioCharacter.BossFireballCheckX - this.X, yd = Mario.MarioCharacter.BossFireballCheckY - this.Y;

    if (xMarioD > -this.Width * 2 - 4 && xMarioD < this.Width * 2 + 4) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            if (yMarioD <= -50 && Mario.MarioCharacter.Ya > 0 && Mario.MarioCharacter.launched == 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
                if (!Mario.MarioCharacter.airdodging) {
                    Mario.MarioCharacter.Stomp(this);
                    this.ConsecutiveJumps += 1;

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
            }
            else {
                if (!(this.Deadtime > 1) && yMarioD < Mario.MarioCharacter.Height) {
                    if (Mario.MarioCharacter.character_select == "fox" && mariolaunchcheck && !Mario.MarioCharacter.airdodging) {
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
                    else if (yMarioD < 0 && !Mario.MarioCharacter.airdodging) {
                        if (this.State != 5) {
                            Mario.MarioCharacter.GetHurt();
                        }
                    }
                }
            }
        }
    }

    if (Mario.MarioCharacter.character_select != "fox") {
        if (this.X < 50 + this.Width) {
            this.X = 50 + this.Width;
        }
        else if (this.X > 300 - this.Width) {
            this.X = 300 - this.Width;
        }
    }

    if (Mario.MarioCharacter.character_select == "fox") {
        if (xd > -70 && xd < 70) {
            if (yd > -this.Height && yd < 8) {

                this.Health -= 1;

            }
        }
    }
    else {
        if (xd > -50 && xd < 50) {
            if (yd > -this.Height && yd < 8) {

                this.Health -= 1;

            }
        }
    }
};

Mario.MasterHand.prototype.Move = function () {
    if (Mario.MarioCharacter.BowserHealth <= 0 && this.Health != 50) {
        this.Health = 0;
    }

    if (this.Health <= 0) {
        this.State = 6;
    }
    Mario.MarioCharacter.BowserHealth = this.Health;

    Mario.MarioCharacter.BossFireballCheckX2 = this.X;
    Mario.MarioCharacter.BossFireballCheckY2 = this.Y;

    if (this.State == 6) {
        this.PicWidth = 84;
        this.Layer = 1;
        this.XPic = 0;
        this.YPic = 6;
        if (this.DeathTimer <= 0) {
            this.XPic = 1;

            this.Ya += 1;
            this.SubMove(0, this.Ya);
        }
        else {
            this.Ya = 2;
        }
        this.DeathTimer -= 1;
        return;
    }


    this.YPic = this.State;
    if (this.Y >= 185 && this.Ya > 0) {
        this.OnGround = true;
        if (this.Y > 185) {
            this.Y = 185;
        }
    }
    else if (this.JumpTimer == 0) {
        this.OnGround = false;
    }

    if (this.State == 0) {
        this.IdleTime -= 1;
        this.PicWidth = 65;

        if (Mario.MarioCharacter.X <= this.X) {
            this.Facing = -1;
        }
        else {
            this.Facing = 1;
        }
        if (this.IdleFrame < 21) {
            this.IdleFrame += 1;
            if (this.IdleFrame % 3 == 0) {
                this.XPic = this.IdleFrame / 3;
            }
        }
        else {
            this.IdleFrame = 0;
        }

        this.YPic = 0;


        // if (this.IdleTime <= 0) {
        //     this.State = (Math.random() * 6) | 0;
        //     this.IdleTime = (Math.random() * 30 | 0);
        // }
    }

    if (this.State == 2) {

        if (this.WalkTotalTime == 65) {
            this.State = 0;
        }
    }

    if (this.State == 3) {
        this.State = 0
    }

    if (this.State == 4) {

        if (this.ShellTotalTime == 80) {
            this.State = 0;
        }
    }
    else {
        this.Width = 15;
        this.Height = 71;
    }

    if (this.State == 4) {
        this.State = 0;
    }

    if (this.State == 5) {

        this.State = 0;

    }

    if (!this.OnGround) {
        this.SubMove(this.Xa, this.Ya);
    }

    this.XFlip = this.Facing === -1;

    if (!this.OnGround) {
        if (this.JumpTimer != 0) {
            this.Ya = 2;
        }
        this.SubMove(0, this.Ya);
    }
};

Mario.MasterHand.prototype.FireballCollideCheck = function (fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }


};

Mario.MasterHand.prototype.SubMove = function (xa, ya) {
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

Mario.MasterHand.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 17) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 17) | 0 || this.State == 6) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.MasterHand.prototype.BumpCheck = function (x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 - 16 && y === ((y - 1) / 16) | 0) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};