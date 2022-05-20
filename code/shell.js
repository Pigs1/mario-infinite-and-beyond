/**
    Represents a shell that once belonged to a now expired koopa.
    Code by Rob Kleffner, 2011
*/

Mario.Shell = function (world, x, y, type) {
    this.World = world;
    this.X = x;
    this.Y = y;

    this.YPic = type;
    this.Image = Enjine.Resources.Images["enemies"];

    this.XPicO = 8;
    this.YPicO = 31;
    this.Width = 6;
    this.Height = 12;
    this.Facing = 0;
    this.PicWidth = 16;
    this.XPic = 4;
    this.Ya = -5;

    this.Dead = false;
    this.DeadTime = 0;
    this.Carried = false;

    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    this.OnGround = false;
    this.Anim = 0;

    this.Drop = false;
    this.UpDrop = false;
    this.collide = false;
    this.fallingtime = -1;
    this.fallingtime2 = 5;

    this.sideWaysSpeed = 13;
    this.InitMarioXa = 0;
};

Mario.Shell.prototype = new Mario.NotchSprite();

Mario.Shell.prototype.FireballCollideCheck = function (fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }

    var xD = fireball.X - this.X, yD = fireball.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < fireball.Height) {
            if (this.Facing !== 0) {
                return true;
            }

            Enjine.Resources.PlaySound("kick");

            this.Xa = fireball.Facing * 2;
            this.Ya = -5;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            this.DeadTime = 100;
            this.YFlip = true;

            return true;
        }
    }
    return false;
};

Mario.Shell.prototype.CollideCheck = function () {
    var mariolaunchcheck = true;
    if (this.Carried || this.Dead || this.DeadTime > 0) {
        return;
    }

    var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;


    if (Mario.MarioCharacter.ShineTime > 0) {
        if (xMarioD > -this.Width * 3 - 7 && xMarioD < this.Width * 3 + 7) {
            if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
                this.Xa *= -1;
                if (!Mario.MarioCharacter.OnGround) {
                    Mario.MarioCharacter.ShineTime = 0;
                }
            }
        }
    }

    if (xMarioD > -16 && xMarioD < 16) {
        if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
            if (Mario.MarioCharacter.Ya > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
                Mario.MarioCharacter.Stomp(this);

                if (Mario.MarioCharacter.GroundPoundTimer > 0) {
                    this.Die()
                    this.World.RemoveSprite(this);
                }
                if (this.Facing !== 0) {
                    this.Xa = 0;
                    this.Facing = 0;
                } else {
                    if (!(this.DeadTime > 0)) {
                        this.Facing = Mario.MarioCharacter.Facing;
                    }
                }
            }
            else {
                if (this.Facing !== 0 && !(this.DeadTime > 0)) {
                    if (this.Drop && this.KickCooldown <= 0) {
                        Mario.MarioCharacter.Kick(this);
                        this.Facing = Mario.MarioCharacter.Facing;
                    }
                    else {
                        if (Mario.MarioCharacter.character_select == "fox" && mariolaunchcheck && !Mario.MarioCharacter.airdodging) {
                            if (!Mario.MarioCharacter.Shielding || Mario.MarioCharacter.Shieldstun > 20) {
                                mariolaunchcheck = false
                                Mario.MarioCharacter.Shieldstun = 0;
                                Mario.MarioCharacter.percentdamageoffset = Math.random() * 5 | 0
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
                            else if (Mario.MarioCharacter.Shieldstun == 0) {
                                Mario.MarioCharacter.ShieldDamage += 1;
                                Mario.MarioCharacter.Shieldstun = 20;
                            }
                        }
                        else if (Mario.MarioCharacter.character_select != "fox" && !this.Drop) {
                            Mario.MarioCharacter.GetHurt();
                        }
                    }
                } else {
                    Mario.MarioCharacter.Kick(this);
                    this.Facing = Mario.MarioCharacter.Facing;
                }
            }
        }
    }
};

Mario.Shell.prototype.Move = function () {
    i = 0;
    if (this.Drop) {
        this.KickCooldown -= 1;
        if (this.OnGround) {
            this.fallingtime = -1;
            this.fallingtime2 = 5;

            this.Ya += 1;
            this.SubMove(0, this.Ya)
            return;

        }
        else {
            if (this.sideWaysSpeed != 0) {
                this.sideWaysSpeed = 5 + (Math.abs(this.InitMarioXa) * 0.25);
            }
        }
        if (this.UpDrop) {
            this.sideWaysSpeed = 0;

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) {
                this.sideWaysSpeed -= 3;
            }
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
                this.sideWaysSpeed += 3;
            }
            if (!(Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) && !(Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right))) {
                this.sideWaysSpeed = 0;
            }

            this.Ya = -20;
            this.UpDrop = false;
            this.Xa = this.sideWaysSpeed;
        }
        else {
            this.Xa = this.Facing * this.sideWaysSpeed;
        }
    }
    else {
        this.sideWaysSpeed = 13;
    }

    if (this.Carried && !this.Drop) {
        this.World.CheckShellCollide(this);
        return;
    }

    if (this.DeadTime > 0) {
        this.DeadTime--;

        if (this.DeadTime === 0) {
            this.DeadTime = 1;
            for (i = 0; i < 8; i++) {
                this.World.AddSprite(new Mario.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.World.RemoveSprite(this);
        }

        this.X += this.Xa;
        this.Y += this.Ya;
        this.Ya *= 0.95;
        this.Ya += 1;
        return;
    }

    if (this.Facing !== 0) {
        this.Anim++;
    }

    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    if (!this.Drop) {
        this.Xa = this.Facing * this.sideWaysSpeed;
    }

    if (this.Facing !== 0) {
        this.World.CheckShellCollide(this);
    }

    this.XFlip = this.Facing === -1;

    this.XPic = ((this.Anim / 2) | 0) % 4 + 3;

    if (!this.SubMove(this.Xa, 0)) {
        Enjine.Resources.PlaySound("bump");
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

Mario.Shell.prototype.SubMove = function (xa, ya) {
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
        this.collide = true;
        if (xa < 0) {
            this.X = ((((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width);
            this.Xa = 0;
            if (this.Drop) {
                this.sideWaysSpeed = 0;

            }
        }
        if (xa > 0) {
            this.X = ((((this.X - this.Width) / 16) | 0) * 16 + this.Width);
            this.Xa = 0;
            if (this.Drop) {
                this.sideWaysSpeed = 0;

            }
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
            this.Ya = 0;
            this.sideWaysSpeed = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
            this.OnGround = true;
            this.sideWaysSpeed = 0;
        }
        else {
            this.OnGround = false;
        }
        return false;
    } else {
        this.collide = false;
        this.X += xa;
        this.Y += ya;

        return true;
    }
};

Mario.Shell.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === ((this.X / 32) | 0) && y === ((this.Y / 20) | 0)) {
        return false;
    }

    var blocking = this.World.Level.IsBlocking(x, y, xa, ya);

    if (blocking && ya === 0 && xa !== 0 && (!this.Drop || this.Ya < 0)) {
        this.World.Bump(x, y, true);
    }
    return blocking;
};

Mario.Shell.prototype.BumpCheck = function (x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 + 16 && y === (((this.Y - 1) / 16) | 0)) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};

Mario.Shell.prototype.Die = function () {
    this.Dead = true;
    this.Carried = false;
    this.Xa = -this.Facing * 2;
    this.Ya = -5;
    this.DeadTime = 100;
};

Mario.Shell.prototype.ShellCollideCheck = function (shell) {
    if (this.DeadTime !== 0) {
        return false;
    }

    var xD = shell.X - this.X, yD = shell.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < shell.Height) {
            Enjine.Resources.PlaySound("kick");
            if (Mario.MarioCharacter.Carried === shell || Mario.MarioCharacter.Carried === this) {
                Mario.MarioCharacter.Carried = null;
            }
            this.Die();
            shell.Die();
            return true;
        }
    }
    return false;
};

Mario.Shell.prototype.Release = function (mario) {
    this.Carried = false;
    this.Facing = Mario.MarioCharacter.Facing;
    if (this.Drop) {
        this.KickCooldown = 10;
        if (Mario.MarioCharacter.OnGround && !(Mario.MarioCharacter.collisiontype == "left" || Mario.MarioCharacter.collisiontype == "right")) {
            if (Mario.MarioCharacter.Xa == 0) {
                this.X += 4 * this.Facing;
            }
            else if (!(Mario.MarioCharacter.collisiontype == "left" || Mario.MarioCharacter.collisiontype == "right")) {
                this.X += ((Math.abs(Mario.MarioCharacter.Xa) * 0.25)) * this.Facing;
            }
        }
        else if (!(Mario.MarioCharacter.collisiontype == "left" || Mario.MarioCharacter.collisiontype == "right")) {
            this.X += (1 + (Math.abs(Mario.MarioCharacter.Xa))) * this.Facing;
        }
        if (!Mario.MarioCharacter.OnGround) {
            this.Xa = 2 * this.Facing;
            this.OnGround = false;
        }
        this.InitMarioXa = Mario.MarioCharacter.Xa;
    }
    else {
        this.X += 2 * this.Facing;
    }
};