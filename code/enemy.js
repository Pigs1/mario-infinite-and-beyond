/**
    A generic template for an enemy in the game.
    Code by Rob Kleffner, 2011
*/

Mario.Enemy = function (world, x, y, dir, type, winged) {
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    this.RunTime = 0;
    this.OnGround = false;
    this.MayJump = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.Width = 4;
    this.Height = 24;
    this.DeadTime = 0;
    this.FlyDeath = false;
    this.WingTime = 0;
    this.NoFireballDeath = false;

    this.X = x;
    this.Y = y;
    this.World = world;

    this.Type = type;
    this.Winged = winged;

    this.Image = Enjine.Resources.Images["enemies"];

    this.XPicO = 8;
    this.YPicO = 31;
    this.AvoidCliffs = this.Type === Mario.Enemy.RedKoopa;
    this.NoFireballDeath = this.Type === Mario.Enemy.Spiky;

    this.YPic = this.Type;
    if (this.YPic > 1) {
        this.Height = 12;
    }
    this.Facing = dir;
    if (this.Facing === 0) {
        this.Facing = 1;
    }

    this.PicWidth = 16;
    if (this.Type == 3) {
        this.PicWidth = 24
        this.Width = 7
        this.Height = 22
    }

    this.chucktype = 1;
    this.looktimer = 30;
    this.chuckrun = false;
    this.collidetimer = 0;
    this.chuckstomptimer = 0;
    this.chuckstomped = false;
};

Mario.Enemy.prototype = new Mario.NotchSprite();

Mario.Enemy.prototype.CollideCheck = function () {
    var mariolaunchcheck = true;
    if (this.DeadTime > 0 || this.Dead || this.DeadTime !== 0) {
        return;
    }

    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;

    if (xMarioD > -this.Width * 2 - 4 && xMarioD < this.Width * 2 + 4) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            if (this.Type !== Mario.Enemy.Spiky && Mario.MarioCharacter.Ya > 0 && yMarioD <= 0 && Mario.MarioCharacter.launched == 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {

                if (this.Type == 3) {
                    if (this.chuckstomptimer > 0) {
                        Mario.MarioCharacter.Stomp(this);
                        this.PicHeight = 12;
                    }
                    else {
                        this.chuckstomped = true;
                        Mario.MarioCharacter.Stomp(this);
                        this.XPic = 6
                    }
                }
                else {
                    Mario.MarioCharacter.Stomp(this);
                }

                if (this.Winged) {
                    this.Winged = false;
                    this.Ya = 0;
                    if (Mario.MarioCharacter.GroundPoundTimer != 0 && !Mario.MarioCharacter.waslaunched) {
                        Mario.MarioCharacter.Stomp(this);
                    }
                } else {
                    if (this.Type != 3) {
                        this.YPicO = 31 - (32 - 8);
                        this.PicHeight = 8;
                    }

                    if (this.SpriteTemplate !== null) {
                        this.SpriteTemplate.IsDead = true;
                    }
                    if (this.Type == 3) {
                        if (this.chuckstomptimer > 0) {
                            this.DeadTime = 10;
                        }
                    }
                    else {
                        this.DeadTime = 10;
                    }
                    this.Winged = false;

                    if (this.Type === Mario.Enemy.RedKoopa && Mario.MarioCharacter.GroundPoundTimer == 0) {
                        this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 0));
                    } else if (this.Type === Mario.Enemy.GreenKoopa && Mario.MarioCharacter.GroundPoundTimer == 0) {
                        this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 1));
                    }
                }
            } else {
                if (!(this.Deadtime > 1)) {
                    if (Mario.MarioCharacter.character_select == "fox" && mariolaunchcheck) {
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
                    else {
                        Mario.MarioCharacter.GetHurt();
                    }
                }
            }
        }
    }
};

Mario.Enemy.prototype.Move = function () {
    var i = 0, sideWaysSpeed = 1.75, runFrame = 0;
    if (this.Type == 3 && this.DeadTime == 0) {

        if (this.chucktype == 1) {
            if (this.looktimer > 0) {
                this.looktimer -= 1
            }
            if (this.collidetimer > 0) {
                this.collidetimer -= 1
            }
            if (this.chuckstomped && this.chuckstomptimer == 0) {
                this.chuckstomptimer = 30
            }
            if (this.chuckstomptimer > 0) {
                this.chuckstomptimer -= 1
                this.collidetimer = 0
                this.chuckrun = false
            }

            if (this.looktimer == 0 && !this.chuckrun && this.collidetimer == 0 && this.chuckstomptimer == 0) {
                this.Facing *= -1
                if (this.XPic != 0) {
                    this.XPic = 0
                }
                if (this.XFlip) {
                    this.XFlip = false
                }
                else {
                    this.XFlip = true
                }
                this.chuckstomped = false;
                this.looktimer = 30
            }
            if (this.collidetimer == 0 && this.chuckstomptimer == 0 && this.Facing == 1 && Mario.MarioCharacter.X > this.X && Mario.MarioCharacter.Y - this.Y <= 2 && Mario.MarioCharacter.Y - this.Y >= -2) {
                this.chuckrun = true
                this.collidetimer = 55
                this.chuckstomped = false
            }
            else if (this.collidetimer == 0 && this.chuckstomptimer == 0 && this.Facing == -1 && Mario.MarioCharacter.X < this.X && Mario.MarioCharacter.Y - this.Y <= 2 && Mario.MarioCharacter.Y - this.Y >= -2) {
                this.chuckrun = true
                this.collidetimer = 55
                this.chuckstomped = false
            }
            if (this.chuckrun) {
                if (this.XPic == 3) [
                    this.XPic = 4
                ]
                else {
                    this.XPic = 3
                }
                this.Xa = 4.3 * this.Facing
            }
        }
    }

    this.WingTime++;
    if (this.DeadTime > 0) {
        this.DeadTime--;

        if (this.DeadTime === 0) {
            this.DeadTime = 1;
            for (i = 0; i < 8; i++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y - Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.World.RemoveSprite(this);
        }

        if (this.FlyDeath) {
            this.X += this.Xa;
            this.Y += this.Ya;
            this.Ya *= 0.95;
            this.Ya += 1;
        }
        return;
    }

    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    if (this.Type != 3) {
        this.Xa = this.Facing * sideWaysSpeed;
    }

    this.MayJump = this.OnGround;

    this.XFlip = this.Facing === -1;

    this.RunTime += Math.abs(this.Xa) + 5;

    runFrame = ((this.RunTime / 20) | 0) % 2;

    if (!this.OnGround) {
        runFrame = 1;
    }

    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);

    this.Ya *= this.Winged ? 0.95 : 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }

    if (!this.OnGround) {
        if (this.Winged) {
            this.Ya += 0.6;
        } else {
            this.Ya += 2;
        }
    } else if (this.Winged) {
        this.Ya = -10;
    }

    if (this.Winged) {
        runFrame = ((this.WingTime / 4) | 0) % 2;
    }
    if (this.Type != 3) {
        this.XPic = runFrame;
    }
};

Mario.Enemy.prototype.SubMove = function (xa, ya) {
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
            if (this.Type == 3) {
                this.chuckrun = false
                this.XPic = 5
                this.collidetimer = 55
            }
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
            if (this.Type == 3) {
                this.chuckrun = false
                this.XPic = 5
                this.collidetimer = 55
            }
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

Mario.Enemy.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};

Mario.Enemy.prototype.ShellCollideCheck = function (shell) {
    if (this.DeadTime !== 0) {
        return false;
    }

    var xd = shell.X - this.X, yd = shell.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < shell.Height) {
            Enjine.Resources.PlaySound("kick");

            this.Xa = shell.Facing * 2;
            this.Ya = -5;
            this.FlyDeath = true;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            if (Mario.MarioCharacter.Carried === shell || Mario.MarioCharacter.Carried === shell) {
                Mario.MarioCharacter.Carried = null;
                shell.Die()
            }
            this.DeadTime = 100;
            this.Winged = false;
            this.YFlip = true;
            return true;
        }
    }
    return false;
};

Mario.Enemy.prototype.FireballCollideCheck = function (fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }

    var xd = fireball.X - this.X, yd = fireball.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < fireball.Height) {
            if (this.NoFireballDeath) {
                return true;
            }

            Enjine.Resources.PlaySound("kick");

            this.Xa = fireball.Facing * 2;
            this.Ya = -5;
            this.FlyDeath = true;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            this.DeadTime = 100;
            this.Winged = false;
            this.YFlip = true;
            return true;
        }
    }
};

Mario.Enemy.prototype.BumpCheck = function (xTile, yTile) {
    if (this.DeadTime !== 0) {
        return;
    }

    if (this.X + this.Width > xTile * 16 && this.X - this.Width < xTile * 16 + 16 && yTile === ((this.Y - 1) / 16) | 0) {
        Enjine.Resources.PlaySound("kick");

        this.Xa = -Mario.MarioCharacter.Facing * 2;
        this.Ya = -5;
        this.FlyDeath = true;
        if (this.SpriteTemplate !== null) {
            this.SpriteTemplate.IsDead = true;
        }
        this.DeadTime = 100;
        this.Winged = false;
        this.YFlip = true;
    }
};

Mario.Enemy.prototype.SubDraw = Mario.NotchSprite.prototype.Draw;

Mario.Enemy.prototype.Draw = function (context, camera) {
    var xPixel = 0, yPixel = 0;

    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;

        if (this.Type !== Mario.Enemy.RedKoopa && this.Type !== Mario.Enemy.GreenKoopa) {
            this.XFlip = !this.XFlip;
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
            this.XFlip = !this.XFlip;
        }
    }

    this.SubDraw(context, camera);

    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;

        if (this.Type === Mario.Enemy.RedKoopa && this.Type === Mario.Enemy.GreenKoopa) {
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel) : yPixel - 8, 16, 32);
            context.restore();
        } else {
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
        }
    }
};

//Static variables
Mario.Enemy.RedKoopa = 0;
Mario.Enemy.GreenKoopa = 1;
Mario.Enemy.Goomba = 2;
Mario.Enemy.Spiky = 4;
Mario.Enemy.Flower = 5;
Mario.Enemy.Chuck = 3;