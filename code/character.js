/**
    Global representation of the mario character.
    Code by Rob Kleffner, 2011
*/

Mario.Character = function () {
    //these are static in Notch's code... here it doesn't seem necessary

    this.Large = false;
    this.Fire = false;
    this.Coins = 0;
    this.Lives = 3;
    this.LevelString = "none";
    this.GroundInertia = 0.89;
    this.GroundTraction = 0.89;
    this.AirInertia = 0.89;
    this.GroundPoundTimer = 0;
    this.defaultairinertia = 0.89;
    this.defaultgroundinertia = 0.89;
    this.Gravity = 3;
    this.JumpVel = -1.9;

    // Char specific vars
    this.FloatTimer = 10;
    this.WasKeyDown = 0;

    //non static variables
    this.RunTime = 0;
    this.WasOnGround = false;
    this.OnGround = false;
    this.OnGroundShellCheck = false;
    this.MayJump = false;
    this.Ducking = false;
    this.Sliding = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.CanShoot = false;
    this.collide = true;

    this.Width = 4;
    this.Height = 24;

    //Level scene
    this.World = null;
    this.Facing = 0;
    this.PowerUpTime = 0;

    this.XDeathPos = 0; this.YDeathPos = 0;
    this.DeathTime = 0;
    this.WinTime = 0;
    this.InvulnerableTime = 0;

    //Sprite
    this.Carried = null;
    this.CarriedCheck = false;

    this.LastLarge = false;
    this.LastFire = false;
    this.NewLarge = false;
    this.NewFire = false;

    this.launched = 0;
    this.waslaunched = false;
    this.percentdamage = 0;

    this.launchangleX = null;
    this.launchangleY = null;

    this.EscapePause = false;
    this.DashDance = false;

    this.wavedashtime = 15;
    this.airdodging = false;
    this.DWasDown = false;
    this.UpWasDown = false;
    this.RightWasDown = false;
    this.LeftWasDown = false;
    this.DownWasDown = false;

    this.LevelType = null;
};

Mario.Character.prototype = new Mario.NotchSprite(null);

Mario.Character.prototype.Initialize = function (world) {
    this.World = world;
    if (this.World.LevelType == 3) {
        this.Y = 100;
        this.X = 40;
    }
    else {
        this.X = 32;
        this.Y = -50;
    }
    this.YPic = 0;
    this.PowerUpTime = 0;
    this.character_select = Mario.MarioCharacter.character_select;
    this.percentdamage = 0
    // Character Specific Movement Stats
    if (this.character_select == "mario") {
        this.GroundInertia = 0.9;
        this.AirInertia = 0.9;
        this.GroundTraction = 0.83;
        this.Gravity = 3;
        this.JumpVel = -1.9;
    }
    else if (this.character_select == "luigi") {
        this.GroundInertia = 0.89;
        this.AirInertia = 0.9;
        this.GroundTraction = 0.93;
        this.Gravity = 3;
        this.JumpVel = -2.75;
    }
    else if (this.character_select == "peach") {
        this.GroundInertia = 0.89;
        this.AirInertia = 0.89;
        this.GroundTraction = 0.8;
        this.Gravity = 2;
        this.JumpVel = -1.9;
    }
    else if (this.character_select == "fox") {
        this.GroundInertia = 0.91;
        this.AirInertia = 0.9;
        this.GroundTraction = 0.82;
        this.Gravity = 4.5;
        this.JumpVel = -1.9;
    }

    //non static variables in Notch's code
    this.RunTime = 0;
    this.WasOnGround = false;
    this.OnGround = false;
    this.MayJump = false;
    this.Ducking = false;
    this.Sliding = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.CanShoot = false;

    this.Width = 4;
    this.Height = 24;

    //Level scene
    this.World = world;
    this.Facing = 0;
    this.PowerUpTime = 0;

    this.XDeathPos = 0; this.YDeathPos = 0;
    this.DeathTime = 0;
    this.WinTime = 0;
    this.InvulnerableTime = 0;

    //Sprite
    this.Carried = null;

    this.SetLarge(this.Large, this.Fire);
};

Mario.Character.prototype.SetLarge = function (large, fire) {
    if (fire) {
        large = true;
    }
    if (!large) {
        fire = false;
    }

    this.LastLarge = this.Large;
    this.LastFire = this.Fire;
    this.Large = large;
    this.Fire = fire;
    this.NewLarge = this.Large;
    this.NewFire = this.Fire;

    this.Blink(true);
};

Mario.Character.prototype.Blink = function (on) {
    this.Large = on ? this.NewLarge : this.LastLarge;
    this.Fire = on ? this.NewFire : this.LastFire;


    // set character images
    if (this.Large) {
        if (this.Fire) {
            if (this.character_select == "luigi") {
                this.Image = Enjine.Resources.Images["fireLuigi"];
            }
            else if (this.character_select == "peach") {
                this.Image = Enjine.Resources.Images["firePeach"];
            }
            else if (this.character_select == "mario") {
                this.Image = Enjine.Resources.Images["fireMario"];
            }
        }
        else if (this.character_select == "luigi") {
            this.Image = Enjine.Resources.Images["luigi"];
        }
        else if (this.character_select == "peach") {
            this.Image = Enjine.Resources.Images["peach"];
        }
        else if (this.character_select == "mario") {
            this.Image = Enjine.Resources.Images["mario"];
        }

        this.XPicO = 16;
        this.YPicO = 31;
        this.PicWidth = this.PicHeight = 32;
    } else {
        if (this.character_select == "luigi") {
            this.Image = Enjine.Resources.Images["smallLuigi"];
        }
        else if (this.character_select == "peach") {
            this.Image = Enjine.Resources.Images["smallPeach"];
        }
        else if (this.character_select == "mario") {
            this.Image = Enjine.Resources.Images["smallMario"];
        }

        this.XPicO = 8;
        this.YPicO = 15;
        this.PicWidth = this.PicHeight = 16;

    }
};

Mario.Character.prototype.Move = function () {
    var launchfirsttime = true, launchtime = 0;
    if (this.WinTime > 0) {
        this.WinTime++;
        this.Xa = 0;
        this.Ya = 0;
        return;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Escape) && !this.WasEscapeDown && !this.World.Paused) {
        this.World.Paused = true;
        this.WasEscapeDown = true;
        this.EscapePause = true;
        return;
    }
    else if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Escape) && !this.WasEscapeDown && this.World.Paused) {
        this.World.Paused = false;
        this.WasEscapeDown = true;
        this.EscapePause = false;
    }

    if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Escape)) {
        this.WasEscapeDown = false;
    }

    if (this.EscapePause) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.X)) {
            this.Die();
            this.EscapePause = false;
        }
        return;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.D) && this.character_select == "fox" && this.wavedashtime > 0 || this.DWasDown && this.wavedashtime > 0) {
        if (!this.OnGround) {

            this.DWasDown = true;

            this.airdodging = true;

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up) && this.wavedashtime >= 13) {
                this.UpWasDown = true;
            }

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && this.wavedashtime >= 13) {
                this.DownWasDown = true;
            }

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && this.wavedashtime >= 13) {
                this.RightWasDown = true;
            }

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && this.wavedashtime >= 13) {
                this.LeftWasDown = true;
            }

            if (this.RightWasDown) {
                this.Xa = 2 + (this.wavedashtime / 4);
            }

            if (this.LeftWasDown) {
                this.Xa = -2 - (this.wavedashtime / 4);
            }

            if (this.UpWasDown) {
                this.Ya = -2 - (this.wavedashtime / 4);
            }
            else if (this.DownWasDown) {
                this.Ya = 7 + (this.wavedashtime / 4);
            }

            if (!this.UpWasDown && !this.DownWasDown) {
                this.Ya = 0;
            }

            if (this.wavedashtime == 15 || this.wavedashtime <= 2) {
                this.Xa = 0;
                this.Ya = 0;
            }

            this.wavedashtime -= 1;

            if (this.wavedashtime == 0) {
                this.JumpTime = 0;
                this.airdodging = false;
            }
        }
    }
    if (this.character_select == "fox" && this.OnGround) {
        if (!this.airdodgingwastrue && this.RightWasDown) {
            this.wavedashslidetime = 6;
        }
        this.wavedashtime = 15;
        this.DWasDown = false;
        this.UpWasDown = false;
        this.DownWasDown = false;
        this.RightWasDown = false;
        this.LeftWasDown = false;
        if (this.airdodging || this.airdodgingwastrue) {
            if (this.wavedashslidetime > 0) {
                this.Xa = (2 + this.wavedashslidetime) * this.Facing;
                this.airdodgingwastrue = true;
                this.wavedashslidetime -= 1;
            }
            else {
                this.airdodgingwastrue = false;
            }
        }
        this.airdodging = false;
    }

    if ((this.XPic == 7 && this.RunTime <= 120 && this.character_select == "fox") && this.OnGround || this.RunTime == 0) {
        this.DashDance = true;
    }
    else if (this.RunTime > 120) {
        this.DashDance = false;
    }
    if (this.Xa > 0 && Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && this.OnGround && this.character_select == "fox") {
        if (this.RunTime <= 120) {
            this.RunTime = 0;
        }
    }
    if (this.Xa < 0 && Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && this.OnGround && this.character_select == "fox") {
        if (this.RunTime <= 120) {
            this.RunTime = 0;
        }
    }
    if (this.Xa != 0 && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && this.OnGround && this.character_select == "fox") {
        this.Xa *= this.GroundTraction;
    }


    if (this.launched > 0) {
        this.launched -= 1
        if (launchfirsttime == true) {
            this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 25 - 20) | 0) + this.Facing * 8, ((this.Y + Math.random() * 6) | 0) - 8, Math.random() * 2 - 1, Math.random(), 0, 1, 5));
            this.Xa = 0
            this.Ya = 0
            launchfirsttime = false
        }
        else if (this.launched > 2) {
            launchfirsttime = true
        }
        launchtime += 1
        this.Xa = this.launchangleX

        this.Ya -= this.launchangleY / launchtime

        this.waslaunched = true;
    }
    else {
        launchtime = 0
    }

    if (this.Carried !== null) {
        this.Carried.X = this.X + 10 * this.Facing;
        this.Carried.Y = this.Y;
        this.Carried.Ya = this.Ya;
        this.Carried.Xa = this.Xa;

        if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
                this.Carried.Drop = true;
                this.Carried.Release(this);
            }
            this.Carried.Release(this);
            this.Carried = null;
        }
        else {
            this.Carried.Drop = false;
        }
    }

    if (this.DeathTime > 0) {
        this.DeathTime++;
        if (this.DeathTime < 11) {
            this.Xa = 0;
            this.Ya = 0;
        } else if (this.DeathTime === 11) {
            this.Ya = -15;
        } else {
            this.Ya += 2;
        }
        this.X += this.Xa;
        this.Y += this.Ya;
        return;
    }

    if (this.PowerUpTime !== 0) {
        if (this.PowerUpTime > 0) {
            this.PowerUpTime--;
            this.Blink((((this.PowerUpTime / 3) | 0) & 1) === 0);
        } else {
            this.PowerUpTime++;
            this.Blink((((-this.PowerUpTime / 3) | 0) & 1) === 0);
        }

        if (this.PowerUpTime === 0) {
            this.World.Paused = false;
        }

        this.CalcPic();
        return;
    }

    if (this.InvulnerableTime > 0) {
        this.InvulnerableTime--;
    }

    this.Visible = (((this.InvulerableTime / 2) | 0) & 1) === 0;

    this.WasOnGround = this.OnGround;
    var sideWaysSpeed = Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) ? 1.005 : 0.8;

    if (this.OnGround) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && this.Large) {
            this.Ducking = true;
            if (this.Carried !== null) {
                this.Carried.Drop = true;
                this.Carried.Release(this);
                this.Carried = null;
            }
        } else {
            this.Ducking = false;
        }
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && !this.Large) {
            this.Ducking = false;
            if (this.Carried !== null) {
                this.Carried.Drop = true;
                this.Carried.Release(this);
                this.Carried = null;
            }
        }
    }

    if (!this.CarriedCheck && !this.waslaunched && !this.Ducking) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && !this.OnGround && this.character_select != "peach" && this.character_select != "fox") {
            this.Xa = 0;
            this.Ya = 15;
            this.GroundPoundTimer = 10;
            this.defaultairinertia = this.AirInertia
            this.defaultgroundinertia = this.GroundInertia
        }
    }
    if (this.OnGround && this.GroundPoundTimer > 0) {
        this.Xa *= 0
        this.Ducking = true
        this.GroundPoundTimer -= 1;
        this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 25 - 15) | 0) + this.Facing * 1,
            ((this.Y + Math.random() * 6) | 0) - 8, Math.random() * 2 - 1, Math.random(), 0, 1, 5));
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) && this.JumpTime != 0) {
            this.GroundPoundTimer = 0
            this.Ducking = false
        }
    }

    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    // Time Freeze
    // if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.E) && this.WasKeyDown == 0) {
    //     if (this.World.Paused == false) {
    //         this.World.Paused = true;
    //     }
    //     else {
    //         this.World.Paused = false;
    //     }
    //     this.WasKeyDown = 1;
    // }
    // else if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.E) && this.WasKeyDown == 1) {
    //     this.WasKeyDown = 0;
    // }

    // peach float
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.E) && this.FloatTimer > 0 && !this.OnGround && this.character_select == "peach") {
        this.Ya = 0
        this.Xa *= 0.9
        this.FloatTimer -= 1
    }
    else if (this.OnGround) {
        this.FloatTimer = 30;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) && this.GroundPoundTimer < 5 && !this.airdodging || (this.JumpTime < 0 && !this.OnGround && !this.Sliding)) {

        if (this.JumpTime < 0) {
            this.Xa = this.XJumpSpeed;
            this.Ya = -this.JumpTime * this.YJumpSpeed;
            this.JumpTime++;
        } else if (this.OnGround && this.MayJump) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = 0;
            this.YJumpSpeed = this.JumpVel;
            this.JumpTime = 7;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
            // walljump
        } else if (this.Sliding && this.MayJump && this.Carried == null) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = -this.Facing * 6;
            if (this.character_select == "mario") {
                this.YJumpSpeed = -2;
            } else if (this.character_select == "luigi") {
                this.YJumpSpeed = -5;
            }
            else {
                this.YJumpSpeed = -2;
            }
            this.JumpTime = -6;
            this.Xa = this.XJumpSpeed;
            this.Ya = -this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
            this.Facing = -this.Facing;
        } else if (this.JumpTime > 0) {
            this.Xa += this.XJumpSpeed;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.JumpTime--;
        }
    } else {
        this.JumpTime = 0;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !this.Ducking) {
        if (this.Facing === 1) {
            this.Sliding = false;
        }
        if (this.OnGround && this.DashDance && this.character_select == "fox") {
            this.Xa = -7
            if (this.RunTime <= 30) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
        }
        else {
            this.Xa -= sideWaysSpeed;
        }
        if (this.JumpTime >= 0) {
            this.Facing = -1;
        }
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && !this.Ducking) {
        if (this.Facing === -1) {
            this.Sliding = false;
        }
        if (this.OnGround && this.DashDance && this.character_select == "fox") {

            this.Xa = 7
            if (this.RunTime <= 30) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
        }
        else {
            this.Xa += sideWaysSpeed;
        }
        if (this.JumpTime >= 0) {
            this.Facing = 1;
        }
    }

    if ((!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) || this.Ducking || this.Ya < 0 || this.OnGround) {
        this.Sliding = false;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.CanShoot && this.Fire && this.World.FireballsOnScreen < 2) {
        Enjine.Resources.PlaySound("fireball");
        this.World.AddSprite(new Mario.Fireball(this.World, this.X + this.Facing * 6, this.Y - 20, this.Facing));
    }

    this.CanShoot = !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A);
    this.MayJump = (this.OnGround || this.Sliding) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S);
    this.XFlip = (this.Facing === -1);
    this.RunTime += Math.abs(this.Xa) + 5;

    if (Math.abs(this.Xa) < 0.5) {
        this.RunTime = 0;
        this.Xa = 0;
    }

    this.CalcPic();

    if (this.Sliding) {
        this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 4 - 2) | 0) + this.Facing * 8,
            ((this.Y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5));
        this.Ya *= 0.5;
    }

    this.OnGround = false;
    this.SubMove(this.Xa, 0);
    this.SubMove(0, this.Ya);
    if (this.Y > this.World.Level.Height * 16 + 16) {
        this.Die();
    }

    if (this.X < 0) {
        this.X = 0;
        this.Xa = 0;
    }

    if (this.X > this.World.Level.ExitX * 16) {
        this.Win();
    }

    if (this.X > this.World.Level.Width * 16) {
        this.X = this.World.Level.Width * 16;
        this.Xa = 0;
    }

    this.Ya *= 0.85;
    if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) || this.XPic == 7) {
        this.Xa *= this.GroundTraction;
    }
    else if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    }
    else if (!this.OnGround && !this.airdodging) {
        this.Xa *= this.AirInertia;
    }

    if (!this.OnGround) {
        // falling speed
        this.Ya += this.Gravity;
    }
};

Mario.Character.prototype.CalcPic = function () {
    var runFrame = 0, i = 0;

    if (this.Large) {
        runFrame = ((this.RunTime / 20) | 0) % 4;
        if (runFrame === 3) {
            runFrame = 1;
        }
        if (this.Carried === null && Math.abs(this.Xa) > 10) {
            runFrame += 3;
        }
        if (this.Carried !== null) {
            runFrame += 10;
        }
        if (!this.OnGround) {
            if (this.Carried !== null) {
                runFrame = 12;
            } else if (Math.abs(this.Xa) > 10) {
                runFrame = 7;
            } else {
                runFrame = 6;
            }
        }
    } else {
        runFrame = ((this.RunTime / 20) | 0) % 2;
        if (this.Carried === null && Math.abs(this.Xa) > 10) {
            runFrame += 2;
        }
        if (this.Carried !== null) {
            runFrame += 8;
        }
        if (!this.OnGround) {
            if (this.Carried !== null) {
                runFrame = 9;
            } else if (Math.abs(this.Xa) > 10) {
                runFrame = 5;
            } else {
                runFrame = 4;
            }
        }
    }

    if (this.GroundPoundTimer > 0) {
        if (this.Large) {
            runFrame = 8;
        }
        else {
            runFrame = 6;
        }

    }

    if (this.OnGround && ((this.Facing === -1 && this.Xa > 0) || (this.Facing === 1 && this.Xa < 0))) {
        if (this.Xa > 1 || this.Xa < -1) {
            if (this.character_select == "fox") {
                runFrame = this.Large ? 7 : 7;
            }
            else {
                runFrame = this.Large ? 9 : 7;
            }
        }

        if (this.Xa > 3 || this.Xa < -3) {
            for (i = 0; i < 3; i++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
        }
    }

    if (this.Large) {
        if (this.Ducking && this.GroundPoundTimer == 0) {
            runFrame = 14;
        }
        this.Height = this.Ducking ? 12 : 24;
    } else {
        this.Height = 12;
    }

    this.XPic = runFrame;
};

Mario.Character.prototype.SubMove = function (xa, ya) {
    var collide = false, shell_unmoving_collide = false;

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
        if (this.Carried !== null) {
            if (Mario.Tile.BlockLower) {
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
            else {
                if (this.IsBlocking(this.X + xa - 16, this.Y + ya, xa, 0)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa + 16, this.Y + ya, xa, 0)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa - 16, this.Y + ya + 1, xa, ya)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa + 16, this.Y + ya + 1, xa, ya)) {
                    collide = true;
                }
            }
        }
        else {
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
    }

    if (ya < 0) {
        if (this.Carried !== null) {
            if (this.Facing < 0) {
                if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa - 16, this.Y + ya - this.Height, xa, ya)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                    collide = true;
                }
            }
            else {
                if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                    collide = true;
                } else if (this.IsBlocking(this.X + xa + 16, this.Y + ya - this.Height, xa, ya)) {
                    collide = true;
                }
            }
        }
        else {
            if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            }
        }
    }

    if (xa > 0) {
        this.Sliding = true;
        if (this.Carried !== null) {
            if (this.IsBlocking(this.X + xa + 16, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            }
            else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa + 16, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa + 16, this.Y + ya, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }
        }
        else {
            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }
        }
    }
    if (xa < 0) {
        if (this.Carried !== null) {
            if (this.IsBlocking(this.X + xa - 16, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }
            if (this.IsBlocking(this.X + xa - 16, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa - 16, this.Y + ya, xa, ya)) {
                collide = true;
            }
            else {
                this.Sliding = false;
            }
        }
        else {
            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
                collide = true;
            } else {
                this.Sliding = false;
            }

            if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
                collide = true;
            }
            else {
                this.Sliding = false;
            }
        }

    }
    if (this.Xa == 0) {
        if (this.Carried !== null) {
            if (this.Ya >= 0) {
                //facing right
                if (this.Facing < 0) {
                    if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa - 16, this.Y + ya - this.Height, xa, ya)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                }
                else {
                    if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa + 16, this.Y + ya - this.Height, xa, ya)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                }
            }



            //shell_unmoving_collide = true;
        }
    }


    if (collide) {
        this.collide = true;

        if (xa < 0) {
            if (this.Carried !== null) {
                this.X = (((this.X - 16) / 16) | 0) * 16 + 16;
                this.Xa = 0;
                if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya) || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya) || this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
                    this.X += 16
                }
            }
            else {
                this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
                this.Xa = 0;
            }
        }

        if (xa > 0) {
            if (this.Carried !== null) {
                this.X = (((this.X + 16) / 16 + 1) | 0) * 16 - 16 - 1;
                this.Xa = 0;
                if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya) || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya) || this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
                    this.X -= 16;
                }
            }
            else {
                this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
                this.Xa = 0;

            }
        }
        if (this.Xa == 0) {
            if (shell_unmoving_collide) {
                if (this.Carried !== null) {
                    if (this.Facing < 0) {
                        this.X = (((this.X + 14) / 16 + 1) | 0) * 16 - 14 - 1;
                        this.Xa = 0;
                    }
                    else {
                        this.X = (((this.X - 14) / 16) | 0) * 16 + 14;
                        this.Xa = 0;
                    }
                }
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
            this.waslaunched = false;
            if (this.Carried == null) {
                this.CarriedCheck = false;
            }
        }

        return false;
    } else {
        this.collide = false;
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Mario.Character.prototype.IsBlocking = function (x, y, xa, ya) {
    var blocking = false, block = 0, xx = 0, yy = 0;

    x = (x / 16) | 0;
    y = (y / 16) | 0;
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false;
    }

    block = this.World.Level.GetBlock(x, y);

    if (((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.PickUpable) > 0) {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
        this.World.Level.SetBlock(x, y, 0);
        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5));
            }
        }
    }

    blocking = this.World.Level.IsBlocking(x, y, xa, ya);
    // & this.Large
    if (blocking && ya < 0 || this.GroundPoundTimer > 0) {
        this.World.Bump(x, y, this.Large);
    }

    return blocking;
};

Mario.Character.prototype.Stomp = function (object) {
    var targetY = 0;

    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }

    targetY = object.Y - object.Height / 2;
    this.SubMove(0, targetY - this.Y);

    if (object instanceof Mario.Enemy && this.GroundPoundTimer == 0 || object instanceof Mario.BulletBill && this.GroundPoundTimer == 0) {

        Enjine.Resources.PlaySound("kick");
        this.XJumpSpeed = 0;
        this.YJumpSpeed = -1.9;
        this.JumpTime = 8;
        this.Ya = this.JumpTime * this.YJumpSpeed;
        this.OnGround = false;
        this.Sliding = false;
        this.InvulnerableTime = 1;
    } else if (object instanceof Mario.Shell && this.GroundPoundTimer == 0) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.Carried == null) {
            if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && object.Xa == 0) {
                this.Carried = object;
                object.Carried = true;
                this.CarriedCheck = true;
            }
        }
    } else {
        Enjine.Resources.PlaySound("kick");
        this.XJumpSpeed = 0;
        this.YJumpSpeed = -1.9;
        this.JumpTime = 8;
        if (this.GroundPoundTimer == 0) {
            this.Ya = this.JumpTime * this.YJumpSpeed;
        }
        this.OnGround = false;
        this.Sliding = false;
        this.InvulnerableTime = 1;

    }
};

Mario.Character.prototype.GetHurt = function () {
    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }
    if (this.InvulnerableTime > 0) {
        return;
    }

    if (this.Large) {
        this.World.Paused = true;
        this.PowerUpTime = -18;
        Enjine.Resources.PlaySound("powerdown");
        if (this.Fire) {
            this.SetLarge(true, false);
        } else {
            this.SetLarge(false, false);
        }
        this.InvulnerableTime = 32;
    } else {
        this.Die();
    }
};

Mario.Character.prototype.Win = function () {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.WinTime = 1;
    Enjine.Resources.PlaySound("exit");
};

Mario.Character.prototype.Die = function () {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.DeathTime = 1;
    Enjine.Resources.PlaySound("death");
    this.SetLarge(false, false);

};

Mario.Character.prototype.GetFlower = function () {
    var y = this.Y / 16, x = (this.X / 16), world = this.World;
    if (this.DeathTime > 0 && this.World.Paused || this.character_select == "fox") {
        if (this.percentdamage > 10) {
            this.percentdamage -= 10
        }
        else {
            this.percentdamage = 0
        }
        return;
    }

    if (!this.Fire) {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, true);
    } else {
        for (let i = 0; i < 20; i += 0.25) {
            if (i == 0 || i == 2 || i == 4 || i == 6 || i == 8 || i == 10 || i == 12 || i == 14 || i == 16 || i == 18 || i == 20) {
                this.GetCoin();
                Enjine.Resources.PlaySound("coin");
                this.World.AddSprite(new Mario.CoinAnim(this.World, x, y + ((Math.random() * 0.5) * (Math.random() * -1))));
            }
        }
    }
};

Mario.Character.prototype.GetMushroom = function () {
    var y = this.Y / 16, x = this.X / 16;
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }

    if (this.character_select == "fox") {
        this.percentdamage -= 10
    }

    if (!this.Large && this.character_select != "fox") {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, false);
    } else {

        for (let i = 0; i < 20; i += 0.25) {
            if (i == 0 || i == 2 || i == 4 || i == 6 || i == 8 || i == 10 || i == 12 || i == 14 || i == 16 || i == 18 || i == 20) {
                this.GetCoin();
                Enjine.Resources.PlaySound("coin");
                this.World.AddSprite(new Mario.CoinAnim(this.World, x, y + ((Math.random() * 0.5) * (Math.random() * -1))));
            }
        }
    }

};

Mario.Character.prototype.Kick = function (shell) {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
        this.Carried = shell;
        shell.Carried = true;
        this.CarriedCheck = true;
    } else {
        Enjine.Resources.PlaySound("kick");
        this.InvulnerableTime = 1;
    }
};

Mario.Character.prototype.Get1Up = function () {
    Enjine.Resources.PlaySound("1up");
    this.Lives++;
    if (this.Lives === 99) {
        this.Lives = 99;
    }
};

Mario.Character.prototype.GetCoin = function () {
    this.Coins++;
    if (this.Coins === 100) {
        this.Coins = 0;
        this.Get1Up();
    }
};