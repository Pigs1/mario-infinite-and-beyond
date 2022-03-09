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
    this.X = 250;
    this.Y = 179;
    this.Image = Enjine.Resources.Images["Bowser"];
    this.XPicO = 30;
    this.YPicO = 85;
    this.YPic = 0;
    this.PicWidth = 66;
    this.PicHeight = 81;
    this.Layer = 1;
    this.Facing = 0;
    this.Health = 50;
    this.Deadtime = 0;
    this.State = null;
    this.Begin = true;
    this.Begin2 = true;

    this.walkframe = 0;
    this.walkframetimer = 10;
    this.WalkTotalTime = 0;

    this.FireballTimer = 10;

    this.PunchTimer = 10;
    this.PunchMomentumMult = 1.0;

    this.SpinTimer = 2;
    this.ShellMomentumMult = 6;
    this.ShellTotalTime = 0;

    this.JumpTimer = 20;
    this.JumpVelMult = 1.3;
    this.JumpLockOn = false;

    this.RoarFrameTimer = 5;

    this.ConsecutiveJumps = 0;

    this.AxeSummoned = false;
    this.DeathTimer = 50;
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
    9 = Roar
*/

Mario.Bowser.prototype.CollideCheck = function () {
    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y, sprite = null, mariolaunchcheck = true;

    if (xMarioD > -this.Width * 2 - 4 && xMarioD < this.Width * 2 + 4) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            if (yMarioD <= 0 && Mario.MarioCharacter.Ya > 0 && Mario.MarioCharacter.launched == 0 && this.State != 4 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
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
                        if (this.State != 6) {
                            Mario.MarioCharacter.GetHurt();
                        }
                    }
                }
            }
        }
    }
    if (Mario.MarioCharacter.X >= 49) {
        this.Begin = false;
    }

    if (this.ConsecutiveJumps >= 5 && this.OnGround) {
        this.State = 9;
    }

    if (Mario.MarioCharacter.OnGround) {
        this.ConsecutiveJumps = 0;
    }

    if (this.X < 50 + this.Width) {
        this.X = 50 + this.Width;
    }
    else if (this.X > 300 - this.Width) {
        this.X = 300 - this.Width;
    }
};

Mario.Bowser.prototype.Move = function () {
    if (Mario.MarioCharacter.BowserHealth <= 0 && this.Health != 50) {
        this.Health = 0;
    }

    if (this.Health <= 10) {
        if (!this.AxeSummoned) {
            this.AxeSummoned = true;
            this.World.AddSprite(new Mario.Axe(this.World, 50, 50));
        }
    }

    if (this.Health <= 0) {
        this.State = 6;
    }
    Mario.MarioCharacter.BowserHealth = this.Health;

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

    if (this.Begin) {
        this.State = 0;
        this.Facing = -1;
        this.IdleTime = (Math.random() * 30 | 0);
        if (this.IdleTime < 5) {
            this.IdleTime == 5;
        }
    }
    else if (this.Begin2) {
        this.Begin2 = false;
        this.State = 1;
        if (Mario.MarioCharacter.character_select != "fox") {
            this.World.AddSprite(new Mario.BowserWall(this.World, 50, 50));
            this.World.AddSprite(new Mario.BowserWall(this.World, 311, 50));
        }
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

    if (this.State == 1) {
        this.IdleTime -= 1;
        this.walkframe = 0;
        this.walkframetimer = 10;
        this.WalkTotalTime = 0;
        this.FireballTimer = 10;
        this.PunchTimer = 10;
        this.PunchMomentumMult = 1.0;
        this.SpinTimer = 2;
        this.ShellMomentumMult = 6;
        this.ShellTotalTime = 0;
        this.JumpTimer = 20;
        this.JumpVelMult = 1.3;
        this.JumpLockOn = false;
        this.RoarFrameTimer = 5;
        if (Mario.MarioCharacter.X <= this.X) {
            this.Facing = -1;
        }
        else {
            this.Facing = 1;
        }
        this.XPic = 0;
        this.YPic = 1;
        this.PicWidth = 69;
        if (this.IdleTime <= 0) {
            this.State = (Math.random() * 8) | 0;
            this.IdleTime = (Math.random() * 30 | 0);
        }
    }
    if (!this.Begin && this.State == 0 || !this.Begin && this.State == 6) {
        this.State = 1;
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
        this.WalkTotalTime += 1;
        if (this.WalkTotalTime == 65) {
            this.WalkTotalTime = 0;
            this.walkframetimer = 10;
            this.State = 1;
            this.XPic = 1;
        }
    }

    if (this.State == 3) {
        this.PicWidth = 84;
        // this.XPic = 0;
        if (this.XPic == 2) {
            this.Xa = 8 * this.Facing * Math.abs(this.PunchMomentumMult);
            this.PunchMomentumMult -= 0.04;
            this.SubMove(this.Xa, 0);
        }
        else {
            this.Xa = 0;
        }
        if (this.PunchTimer == 0) {
            if (this.XPic != 2) {
                this.XPic += 1;
                this.PunchTimer = 20;
            }
            else {
                this.PunchTimer = 10;
                this.State = 1;
                this.XPic = 1;
            }
        }
        this.PunchTimer -= 1;
    }

    if (this.State == 4) {
        this.PicWidth = 50;
        this.Width = 10;
        this.Height = 50;
        if (this.Xa > 0 && Mario.MarioCharacter.X < this.X) {
            if (this.ShellMomentumMult == 0) {
                this.ShellMomentumMult = 10;
            }
            if (this.ShellMomentumMult > -0.5) {
                this.ShellMomentumMult -= 0.25;
            }
            this.Xa = 6 * this.ShellMomentumMult;
        }
        else if (this.Xa < 0 && Mario.MarioCharacter.X > this.X) {
            if (this.ShellMomentumMult == 0) {
                this.ShellMomentumMult = 10;
            }
            if (this.ShellMomentumMult > -0.5) {
                this.ShellMomentumMult -= 0.25;
            }
            this.Xa = -6 * this.ShellMomentumMult;
        }
        else {
            this.ShellMomentumMult = 0;
        }

        if (Mario.MarioCharacter.X > this.X) {
            this.Xa = 6 - this.ShellMomentumMult;
        }
        else if (Mario.MarioCharacter.X < this.X) {
            this.Xa = -6 + this.ShellMomentumMult;
        }

        this.SubMove(this.Xa, 0);

        if (this.SpinTimer == 0) {
            if (this.XPic < 3) {
                this.XPic += 1;
            }
            else {
                this.XPic = 0;
            }
            this.SpinTimer = 2;
        }
        this.SpinTimer -= 1;
        this.ShellTotalTime += 1;

        if (this.ShellTotalTime == 80) {
            this.XPic = 0;
            this.State = 1;
        }
    }
    else {
        this.Width = 15;
        this.Height = 71;
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
                this.FireballTimer = 10;
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

    if (this.State == 5) {
        this.Ya = 0;
        this.PicWidth = 61;
        this.Xa = 0;
        if (this.JumpTimer == 0) {
            this.XPic = 1;
            this.Ya = -5 * this.JumpVelMult;
            this.JumpVelMult -= 0.1;
            if (this.JumpVelMult == 0 || Mario.MarioCharacter.X - this.X < 5 && Mario.MarioCharacter.X - this.X > -5) {
                this.Xa = 0;
                this.JumpLockOn = true;
            }
            else {
                this.Xa = 0;
                if (!this.JumpLockOn) {
                    if (Mario.MarioCharacter.X > this.X) {
                        this.Xa = 3 - this.JumpVelMult;
                    }
                    else if (Mario.MarioCharacter.X < this.X) {
                        this.Xa = -3 + this.JumpVelMult;
                    }
                }
            }
            if (this.OnGround) {
                this.Ya = 0;
                this.State = 1;
            }
        }
        else {
            this.Ya = 0;
            this.JumpTimer -= 1;
        }
        if (!this.OnGround) {
            this.SubMove(this.Xa, this.Ya);
        }
    }

    if (this.State == 9) {
        this.PicWidth = 67;
        if (this.X >= (312 + 50) / 2) {
            this.Facing = -1;
        } else {
            this.Facing = 1;
        }
        this.YPic = 0;
        Mario.MarioCharacter.Sliding = false;
        Mario.MarioCharacter.Xa = 12 * this.Facing;
        if (this.XPic == 0) {
            this.XPic = 1;
        }
        if (this.RoarFrameTimer == 0 && this.XPic < 3) {
            this.XPic += 1;
            this.RoarFrameTimer = 5;
        }
        else if (this.XPic == 3 && this.RoarFrameTimer <= 0) {
            this.State = 1;
        }
        this.RoarFrameTimer -= 1;
    }

    this.XFlip = this.Facing === -1;

    if (!this.OnGround) {
        if (this.JumpTimer != 0) {
            this.Ya = 2;
        }
        this.SubMove(0, this.Ya);
    }
};

Mario.Bowser.prototype.FireballCollideCheck = function (fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }

    var xd = fireball.X - this.X, yd = fireball.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < fireball.Height) {

            this.Health -= 1;
            return true;
        }
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
    y = (y / 17) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 17) | 0 || this.State == 6) {
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