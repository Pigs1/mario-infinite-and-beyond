Mario.BuzzShot = function (world, x, y) {

    this.World = world;

    this.Image = Enjine.Resources.Images["buzzshot"];

    this.PicWidth = 16;
    this.PicHeight = 16;
    this.Height = 12;
    this.Width = 4;
    this.XPic = 0
    this.YPic = 0
    this.X = x
    this.Y = y
    this.InitY = y
    this.InitX = x
    this.MarioX = Mario.MarioCharacter.X
    this.MarioY = Mario.MarioCharacter.Y
    this.MarioXa = Mario.MarioCharacter.Xa
    this.Xa = 0;
    this.OnGround = false;
    this.travelangle = null;
    this.XPicO = 8;
    this.YPicO = 15;

    this.Yinput = this.MarioY - this.InitY
    this.Xinput = this.MarioX - this.InitX

    this.Reflected = false;

    this.Life = 0;
}


Mario.BuzzShot.prototype = new Mario.NotchSprite();

Mario.BuzzShot.prototype.Move = function () {
    var mariolaunchcheck = true, xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y, speed = 1.5;

    if (this.Life < 30) {
        this.Life++;
    }
    if (this.Reflected) {
        this.World.CheckFireballCollide(this);
        speed = 2;
    }


    this.travelangle = Math.atan2(this.Yinput, this.Xinput)

    this.Xa = speed * Math.cos(this.travelangle)
    this.Ya = speed * Math.sin(this.travelangle)

    if (this.Reflected) {
        this.Xa *= -1
        this.Ya *= -1
    }

    if (this.Life > 4) {
        if (this.Life < 8) {
            this.XPic = 1;
        }
        else {
            this.XPic = 2;
        }
    }

    if (Mario.MarioCharacter.ShineTime > 0) {
        if (xMarioD > -this.Width * 3 - 10 && xMarioD < this.Width * 3 + 10) {
            if (yMarioD > -this.Height - 4 && yMarioD < Mario.MarioCharacter.Height) {
                if (!Mario.MarioCharacter.OnGround) {
                    Mario.MarioCharacter.ShineTime = 0;
                }
                this.Reflected = true;
            }
        }
    }

    if (xMarioD > -16 && xMarioD < 16 && yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height && !this.Reflected) {
        if (Mario.MarioCharacter.character_select == "fox" && mariolaunchcheck && !Mario.MarioCharacter.airdodging) {
            if (!Mario.MarioCharacter.Shielding || Mario.MarioCharacter.Shieldstun > 20) {
                mariolaunchcheck = false;
                Mario.MarioCharacter.Shieldstun = 0;
                Mario.MarioCharacter.percentdamageoffset = Math.random() * 5 | 0
                if (Mario.MarioCharacter.DashDance && Mario.MarioCharacter.launched > 0 && !Mario.MarioCharacter.collide) {
                    Mario.MarioCharacter.X -= 5 * Mario.MarioCharacter.Facing;
                    Mario.MarioCharacter.Xa = 0;
                }
                if (Mario.MarioCharacter.launched <= 0) {
                    Mario.MarioCharacter.launched += 5 + (Mario.MarioCharacter.percentdamage * 0.6)
                    if (this.X > Mario.MarioCharacter.X) {
                        Mario.MarioCharacter.launchangleX = -1 * (5 + (Mario.MarioCharacter.percentdamage * 0.45))
                    }
                    else {
                        Mario.MarioCharacter.launchangleX = 5 + (Mario.MarioCharacter.percentdamage * 0.45)
                    }
                    Mario.MarioCharacter.launchangleY = 4 + (Mario.MarioCharacter.percentdamage * 0.1)
                    Mario.MarioCharacter.percentdamage += 2;
                    if (Mario.MarioCharacter.Ducking && Mario.MarioCharacter.OnGround) {
                        Mario.MarioCharacter.launched = Mario.MarioCharacter.launched * 0.5 + (Mario.MarioCharacter.percentdamage)
                        if (this.X > Mario.MarioCharacter.X) {
                            Mario.MarioCharacter.launchangleX = Mario.MarioCharacter.launchangleX * 0.5 - (Mario.MarioCharacter.percentdamage * 0.6)
                        }
                        else {
                            Mario.MarioCharacter.launchangleX = Mario.MarioCharacter.launchangleX * 0.5 + (Mario.MarioCharacter.percentdamage * 0.6)
                        }
                    }
                }
            }
            else if (Mario.MarioCharacter.Shieldstun == 0) {
                Mario.MarioCharacter.ShieldDamage += 1;
                Mario.MarioCharacter.Shieldstun = 20;
            }
        }
        else if (Mario.MarioCharacter.character_select != "fox") {
            Mario.MarioCharacter.GetHurt();
        }
    }

    this.SubMove(2 * this.Xa, 2 * this.Ya)
};

Mario.BuzzShot.prototype.SubMove = function (xa, ya) {

    this.X += xa;
    this.Y += ya;
    return true;

};

Mario.BuzzShot.prototype.IsBlocking = function (x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.Level.IsBlocking(x, y, xa, ya);
};