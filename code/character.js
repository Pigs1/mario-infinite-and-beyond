/**
    Global representation of the mario character.
    Code by Rob Kleffner, 2011
*/

//localStorage.setItem("lastname", "Smith");

Mario.Character = function () {
    //these are static in Notch's code... here it doesn't seem necessary

    this.Large = false;
    this.Fire = false;
    this.Coins = 0;
    this.Lives = 5;
    this.LevelString = "none";
    this.GroundInertia = 0.89;
    this.GroundTraction = 0.89;
    this.AirInertia = 0.89;
    this.GroundPoundTimer = 0;
    this.GroundPoundEnabled = true;
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
    this.collisiontype = null;

    this.Width = 4;
    this.Height = 24;

    //Level scene
    this.World = null;
    this.Facing = 0;
    this.PowerUpTime = 0;
    this.EscapePause = false;

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
    //fox vars
    this.launched = 0;
    this.waslaunched = false;
    this.launchtime = 0;
    this.percentdamage = 0;
    this.percentdamageoffset = 0;

    this.launchangleX = null;
    this.launchangleY = null;

    this.DashDance = false;

    this.wavedashtime = 15;
    this.airdodging = false;
    this.DWasDown = false;
    this.UpWasDown = false;
    this.RightWasDown = false;
    this.LeftWasDown = false;
    this.DownWasDown = false;

    this.TechWindow = 0;
    this.PreTech = false;
    this.PreTechWindow = 0;
    this.DHeldtime = 0;

    this.ShieldDamage = 0;
    this.Shieldstun = 0;
    this.ShieldBroken = false;
    this.ShieldRegenTimer = 0;
    this.Shielding = false;
    this.WasShielding = false;
    this.DWasDown = false;
    this.ShieldTime = 0;

    this.illusion = 0;
    this.specialfall = false;
    this.LaserReverseCheck = false;
    this.Laser = 0;

    this.ShineTime = 0;
    //Boss Vars
    this.LevelType = null;
    this.Bowser = null;
    this.BowserHealth = 50;
    this.AxeTriggered = false;
    this.BossFireballCheckX = null;
    this.BossFireballCheckY = null;
    this.BossFireballCheckX2 = null;
    this.BossFireballCheckY2 = null;

    this.FireballAllowed = false;

    this.Spindash = false;
    this.SpindashCharge = 0;
    this.SpindashChargeLoop = 0;
    this.SpindashLoop = 0;
};

Mario.Character.prototype = new Mario.NotchSprite(null);

Mario.Character.prototype.Initialize = function (world) {
    this.World = world;
    Mario.MarioCharacter.AxeTriggered = false;
    Mario.MarioCharacter.BowserHealth = 50;

    this.FireballAllowed = false;
    this.percentdamage = 0;
    this.percentdamageoffset = 0;
    this.specialfall = false;

    if (this.World.LevelType == Mario.LevelType.Toad) {
        this.Y = 100;
        this.X = 40;
    }
    else {
        this.X = 32;
        this.Y = -50;
    }
    if (this.LevelType == Mario.LevelType.Bowser) {
        this.Y = 100;
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
    else if (this.character_select == "sonic") {
        this.SetLarge(true, false);
        this.GroundInertia = 0.8;
        this.AirInertia = 0.89;
        this.GroundTraction = 0.9;
        this.Gravity = 3;
        this.JumpVel = -1.9;
    }
    else if (this.character_select == "fox") {
        this.SetLarge(true, true);
        this.GroundInertia = 0.91;
        this.AirInertia = 0.9;
        this.GroundTraction = 0.82;
        this.Gravity = 4.3;
        this.JumpVel = -1.8;
        this.launched = 0;
        this.Xa = 0;
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
    if (this.WinTime < 1) {
        this.Blink(true);
    }
};

Mario.Character.prototype.Blink = function (on) {
    this.Large = on ? this.NewLarge : this.LastLarge;
    this.Fire = on ? this.NewFire : this.LastFire;


    // set character images
    if (this.Large) {
        if (this.Fire) {
            if (this.character_select == "luigi") {
                this.Image = Enjine.Resources.Images["fireLuigi"];
                if (this.SkinSelect == 1) {
                    this.Image = Enjine.Resources.Images["FireMrLsheet"];
                }
            }
            else if (this.character_select == "peach") {
                this.Image = Enjine.Resources.Images["firePeach"];
            }
            else if (this.character_select == "mario") {
                this.Image = Enjine.Resources.Images["fireMario"];
            }
            else if (this.character_select == "fox") {
                this.Image = Enjine.Resources.Images["Fox"];
            }
        }
        else if (this.character_select == "luigi") {
            this.Image = Enjine.Resources.Images["luigi"];
            if (this.SkinSelect == 1) {
                this.Image = Enjine.Resources.Images["MrLsheet"];
            }
        }
        else if (this.character_select == "peach") {
            this.Image = Enjine.Resources.Images["peach"];
        }
        else if (this.character_select == "mario") {
            this.Image = Enjine.Resources.Images["mario"];
        }
        else if (this.character_select == "fox") {
            this.Image = Enjine.Resources.Images["Fox"];
        }
        else if (this.character_select == "sonic") {
            this.Image = Enjine.Resources.Images["sonic"];
        }

        this.XPicO = 16;
        this.YPicO = 31;
        this.PicWidth = this.PicHeight = 32;
        if (this.character_select == "fox") {
            this.PicWidth = 36;
            this.PicHeight = 50;
            this.YPicO = 49;
        }
    } else {
        if (this.character_select == "luigi") {
            this.Image = Enjine.Resources.Images["smallLuigi"];
            if (this.SkinSelect == 1) {
                this.Image = Enjine.Resources.Images["smallMrLsheet"];
            }
        }
        else if (this.character_select == "peach") {
            this.Image = Enjine.Resources.Images["smallPeach"];
        }
        else if (this.character_select == "mario") {
            this.Image = Enjine.Resources.Images["smallMario"];
        }
        else if (this.character_select == "fox") {
            this.Image = Enjine.Resources.Images["Fox"];
        }
        else if (this.character_select == "sonic") {
            this.Image = Enjine.Resources.Images["sonic"];
        }

        this.XPicO = 8;
        this.YPicO = 15;
        this.PicWidth = this.PicHeight = 16;

    }
};

Mario.Character.prototype.Move = function () {
    var launchfirsttime = true;
    var levelGenerator = new Mario.LevelGenerator(320, 15), i = 0, scrollSpeed = 0, w = 0, h = 0, bgLevelGenerator = null;
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
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Escape) && !this.WasEscapeDown && this.World.Paused) {
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
    if (this.character_select == "sonic") {
        if (this.Ducking && this.OnGround) {
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.CanShoot) {
                this.Spindash = true;
                if (this.SpindashCharge < 80) {
                    this.SpindashCharge += 5;
                }
                this.SpindashStop = 7;
                this.Xa = 0;
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 10 * this.Facing) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5, 0));
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 12 * this.Facing) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5, 0));
            }
            else {
                this.SpindashStop -= 1;
                if (this.SpindashStop == 0) {
                    this.Xa = this.SpindashCharge * 0.5 * this.Facing;
                }
            }
            if (this.SpindashCharge == 80) {
                this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 5 - (3 * this.Facing)) | 0) + this.Facing * 8, ((this.Y + Math.random() * 6) | 0) - 12, Math.random(), Math.random(), 1, 1, 5, 1));
            }
            if (this.SpindashChargeLoop < 3) {
                this.SpindashChargeLoop += 1;
            }
            else {
                this.SpindashChargeLoop = 1;
            }
        }
        else if (!this.Ducking && this.XPic == 0) {
            this.SpindashCharge = 0;
            this.SpindashChargeLoop = 0;
        }
        if (this.Spindash && this.Xa != 0) {
            this.SpindashCharge *= this.GroundTraction;
            if (this.SpindashChargeLoop < 3) {
                this.SpindashChargeLoop += 1;
            }
            else {
                this.SpindashChargeLoop = 1;
            }
        }
        if (this.SpindashCharge < 2 || !this.OnGround && this.Xa == 0 || this.collisiontype == "left" || this.collisiontype == "right") {
            this.Spindash = false;
            this.SpindashChargeLoop = 0;
            this.SpindashCharge = 0;
        }
    }

    //fox stuff
    if (this.Laser > 0 && !this.WasOnGround && this.OnGround) {
        this.Laser = 0;
    }
    if (this.Laser > 0 && this.OnGround) {
        this.Laser -= 1;
        this.Xa = 0;
        return;
    }
    if (this.LevelType != Mario.LevelType.Bowser && (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right))) {
        this.FireballAllowed = true;
    }
    if ((Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && this.Facing > 0 || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && this.Facing < 0) && this.Xa != 0) {

        this.LaserReverseCheck = true;
    }

    if (this.ShineTime > 0) {
        this.ShineTime += 1;
        this.Xa *= 0.3
        this.Ya *= 0.3
    }
    if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.E) || !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) && this.OnGround || Mario.MarioCharacter.launched > 0) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) || !this.OnGround) {
            this.ShineTime = 0;
        }
        if (this.ShineTime > 0) {
            this.ShineTime = -5;
        }
    }
    if (this.ShineTime < 0) {
        this.ShineTime += 1;
        this.Xa = 0;
        return;
    }

    if (this.specialfall && this.illusion == 0 && !this.airdodging && !this.airdodgingwastrue) {
        this.Xa *= 0.75
    }

    if (this.illusion > 0) {
        this.Ya = 0;
        this.Xa = (this.illusion * 0.95) * this.Facing;
        if (!this.OnGround) {
            this.specialfall = true;
        }
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.D)) {
        this.PreTech = true;
        this.DHeldtime += 1;
    }
    else {
        this.DHeldtime = 0;
    }
    if (this.PreTech && this.DHeldtime <= 1) {
        this.PreTechWindow += 1;
    }
    if (this.OnGround) {
        this.PreTech = false;
        this.LaserReverseCheck = false;
    }
    if (this.launched < 0) {
        this.launched = 0;
    }

    if (this.TechWindow > 0) {
        this.TechWindow -= 1;

        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.D) && this.DHeldtime <= 3 || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.D) && this.PreTechWindow < 5) {
            this.Xa = 0;
            this.Ya = 0;
            this.WasShielding = true;
            this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 25 - 20) | 0) + this.Facing * 8, ((this.Y + Math.random() * 6) | 0) - 8, Math.random() * 2 - 1, Math.random(), 0, 1, 5, 1));
        }
    }

    if (this.ShieldDamage == 3) {
        this.ShieldBroken = true;
        this.ShieldDamage = 1;
    }
    if (this.ShieldBroken) {
        this.Shielding = false;
        this.Shieldstun = 90;
        this.ShieldBroken = false;
        this.XPic = 9;
        return;
    }
    if (this.Shieldstun > 0) {
        this.Shieldstun -= 1;
        return;
    }

    if (!this.WasShielding && this.TechWindow == 0 && Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.D) && this.character_select == "fox" && this.wavedashtime > 0 && this.ShineTime <= 0 && !this.specialfall && this.DeathTime <= 0 || this.DWasDown && this.wavedashtime > 0 && this.DeathTime <= 0) {
        if (!this.OnGround && this.launched <= 0) {

            this.DWasDown = true;

            this.airdodging = true;

            this.JumpTime = 0;

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up) && this.wavedashtime >= 14) {
                this.UpWasDown = true;
            }

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && this.wavedashtime >= 14) {
                this.DownWasDown = true;
            }

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && this.wavedashtime >= 14) {
                this.RightWasDown = true;
                this.Facing = 1;
            }

            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && this.wavedashtime >= 14) {
                this.LeftWasDown = true;
                this.Facing = -1;
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
                this.specialfall = true;
                this.airdodging = false;
            }
        }
        else {
            if (this.OnGround && this.launched == 0 && !this.Shielding && this.Shieldstun == 0 && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && !this.DWasDown) {
                this.Xa = 0;
                this.WasShielding = true;
                this.World.AddSprite(new Mario.Shield(this.World, this.X - 8, this.Y - 16))
                this.Shielding = true;
                this.DWasDown = false;
            }
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
                this.Shieding = false;
                this.WasShielding = false;
            }
        }
    }
    else if (!this.WasShielding) {
        this.Shielding = false;
    }

    if (this.WasShielding) {
        this.ShieldTime += 1;
        this.ShieldRegenTimer = 0;
    }
    else {
        this.ShieldTime = 0;
    }
    if (this.ShieldTime == 20) {
        this.ShieldDamage += 1;
        this.ShieldTime = 0;
    }

    this.ShieldRegenTimer += 1;

    if (this.ShieldRegenTimer == 300) {
        if (this.ShieldDamage > 0) {
            this.ShieldDamage -= 1;
        }
        this.ShieldRegenTimer = 0;
    }

    if (this.Shieldstun > 0) {
        this.ShieldRegenTimer = 0;
    }

    if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.D)) {
        this.WasShielding = false;
    }

    if (this.character_select == "fox" && this.OnGround) {
        if (!this.airdodgingwastrue && this.RightWasDown) {
            this.wavedashslidetime = 6;
        }
        this.specialfall = false;
        this.wavedashtime = 15;
        this.DWasDown = false;
        this.UpWasDown = false;
        this.DownWasDown = false;
        this.RightWasDown = false;
        this.LeftWasDown = false;
        if (this.airdodging || this.airdodgingwastrue) {
            if (this.wavedashslidetime > 0) {
                this.Xa = (2.4 + this.wavedashslidetime) * this.Facing;
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
        if (this.Spindash && this.character_select == "sonic") {
            this.Xa *= 0.9
        }
        else {
            this.Xa *= this.GroundTraction;
        }
    }


    if (this.launched > 0) {
        this.specialfall = false;
        this.Laser = 0;
        this.illusion = 0;
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
            this.launchangleY += 1 - (this.launchtime * 0.1);
        }
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
            this.launchangleY -= 1 - (this.percentdamage * 0.1);

        }


        this.launched -= 1
        if (launchfirsttime) {
            this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 25 - 20) | 0) + this.Facing * 8, ((this.Y + Math.random() * 6) | 0) - 8, Math.random() * 2 - 1, Math.random(), 1, 1, 5, 1));
            this.Xa = 0
            this.Ya = 0
            launchfirsttime = false
        }
        else if (this.launched > 2) {
            launchfirsttime = true
        }
        this.launchtime += 1
        this.Xa = this.launchangleX

        this.Ya -= this.launchangleY - (this.launchtime * 0.5)

        this.waslaunched = true;
    }
    else {
        this.launchtime = 0
    }

    if (this.Carried !== null) {
        this.Carried.X = this.X + 10 * this.Facing;
        this.Carried.Y = this.Y;
        this.Carried.Ya = this.Ya;
        this.Carried.Xa = this.Xa;

        if ((!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) && this.illusion <= 0 && !this.airdodging && this.Laser <= 0) {
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
                this.Carried.Drop = true;
                this.Carried.Release(this);
            }
            else if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
                this.Carried.Drop = true;
                this.Carried.UpDrop = true;
                this.Carried.OnGround = false;
                this.Carried.Release(this);
            }
            else {
                this.Carried.Drop = false;
                this.Carried.UpDrop = false;
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
    if (this.OnGround) {
        this.GroundPoundEnabled = true;
    }

    if (!this.CarriedCheck && !this.waslaunched && !this.Ducking) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && !this.OnGround && this.character_select != "peach" && this.character_select != "fox" && this.GroundPoundEnabled && this.character_select != "sonic") {
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
            ((this.Y + Math.random() * 6) | 0) - 8, Math.random() * 2 - 1, Math.random(), 0, 1, 5, 0));
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) && this.JumpTime != 0) {
            this.GroundPoundTimer = 0
            this.Ducking = false
        }
    }
    if (!this.LaserReverseCheck) {

        if (this.Xa > 2) {
            this.Facing = 1;
        }
        if (this.Xa < -2) {
            this.Facing = -1;
        }
    }
    if ((this.launched > 0 || this.waslaunched) && !this.specialfall && this.Laser == 0) {
        if (this.Xa > 0) {
            this.Facing = -1
        }
        else {
            this.Facing = 1;
        }
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

    if (this.JumpTime == 0) {
        this.Jumpsquat = false;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) && this.GroundPoundTimer < 5 && !this.airdodging || (this.JumpTime < 0 && !this.OnGround && !this.Sliding) || this.Jumpsquat) {

        if (this.JumpTime < 0) {
            this.Xa = this.XJumpSpeed;
            this.Ya = -this.JumpTime * this.YJumpSpeed;
            this.JumpTime++;
        } else if (this.OnGround && this.MayJump) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = 0;
            this.YJumpSpeed = this.JumpVel;
            if (this.character_select == "fox" && !this.Jumpsquat) {
                this.JumpTime = 8;
                this.Jumpsquat = true;
            }
            else {
                this.JumpTime = 7;
            }
            if (this.JumpTime <= 7) {
                this.Jumpsquat = false;
                this.Ya = this.JumpTime * this.YJumpSpeed;
            }
            this.OnGround = false;
            this.Sliding = false;
            // walljump
        } else if (this.Sliding && this.MayJump && this.Carried == null && !this.specialfall) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = -this.Facing * 6;
            if (this.character_select == "mario") {
                this.YJumpSpeed = -2;
            } else if (this.character_select == "luigi") {
                this.YJumpSpeed = -3;
            }
            else if (this.character_select == "fox") {
                this.YJumpSpeed = -1.5;
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
            if (this.JumpTime <= 7) {
                this.Ya = this.JumpTime * this.YJumpSpeed;
            }
            this.JumpTime--;
        }
    } else {
        this.Jumpsquat = false;
        this.JumpTime = 0;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !this.Ducking) {
        if (this.Facing === 1) {
            this.Sliding = false;
        }
        if (this.OnGround && this.DashDance && this.character_select == "fox") {
            this.Xa = -7
            if (this.RunTime <= 30) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5, 0));
            }
        }
        else {
            if (this.character_select == "sonic" && Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A)) {
                if (this.GroundInertia <= 1) {
                    this.GroundInertia += 0.025;
                }
            }

            this.Xa -= sideWaysSpeed;
        }
        if (this.JumpTime >= 0 && this.illusion == 0 && !this.airdodging) {
            this.Facing = -1;
        }
    }
    else if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && this.character_select == "sonic") {
        this.GroundInertia = 0.8;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && !this.Ducking) {
        if (this.Facing === -1) {
            this.Sliding = false;
        }
        if (this.OnGround && this.DashDance && this.character_select == "fox") {

            this.Xa = 7
            if (this.RunTime <= 30) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5, 0));
            }
        }
        else {
            if (this.character_select == "sonic" && Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A)) {
                if (this.GroundInertia <= 1) {
                    this.GroundInertia += 0.025;
                }
            }
            this.Xa += sideWaysSpeed;
        }
        if (this.JumpTime >= 0 && this.illusion == 0 && !this.airdodging) {
            this.Facing = 1;
        }
    }
    else if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && this.character_select == "sonic") {
        this.GroundInertia = 0.8;
    }

    if ((!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) || this.Ducking || this.Ya < 0 || this.OnGround) {
        this.Sliding = false;
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.CanShoot && this.Fire && this.World.FireballsOnScreen < 2 && this.FireballAllowed) {
        if (this.character_select != "fox") {
            Enjine.Resources.PlaySound("fireball");
            this.World.AddSprite(new Mario.Fireball(this.World, this.X + this.Facing * 6, this.Y - 20, this.Facing));
        }
    }

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.E) && this.CanShoot2 && this.Fire && this.World.FireballsOnScreen < 3 && !this.airdodging) {
        if (this.character_select == "fox") {
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && !this.specialfall && this.illusion == 0) {
                this.World.AddSprite(new Mario.Shine(this.World, this.X - 8, this.Y - 16, this.Facing));
                this.ShineTime += 1;
                this.JumpTime = 0;
            }
            else if ((Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) || Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) && !this.specialfall && this.DeathTime <= 0) {
                this.illusion = 12;
                this.JumpTime = 0;
            }
            else if (this.illusion == 0 && !this.specialfall && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && this.FireballAllowed) {
                this.XPic = 10;
                this.Laser = 10;
                this.JumpTime = 0;
                this.World.AddSprite(new Mario.Fireball(this.World, this.X, this.Y - 14, this.Facing));
            }
        }
    }

    this.CanShoot = !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A);
    this.CanShoot2 = !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.E);
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
            ((this.Y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5, 0));
        this.Ya *= 0.5;
    }

    this.OnGround = false;
    this.SubMove(this.Xa, 0);
    this.SubMove(0, this.Ya);
    if (this.Y > this.World.Level.Height * 16 + 16) {
        this.Die();
    }

    if (this.X < 0 && this.character_select != "fox") {
        this.X = 0;
        this.Xa = 0;
    }

    if (this.X > this.World.Level.ExitX * 16 && this.LevelType != Mario.LevelType.BigCastle) {
        this.Win();
    }
    else if (this.LevelType === Mario.LevelType.BigCastle) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up) && Math.abs(this.X - (this.World.Level.ExitX * 16 + 10)) < 25) {
            this.Bowser = true;
            this.Win();
            this.World.Level = levelGenerator.CreateLevel(this.LevelType, this.LevelDifficulty);
        }
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

    if (this.character_select == "fox") {
        runFrame = 0;
        if (this.Xa > 0 || this.Xa < 0) {
            if (this.wavedashslidetime > 0 && this.wavedashslidetime < 6) {
                runFrame = 1;
            }
            else {
                runFrame = 2;
            }
        }
        if (!this.OnGround) {

            runFrame = 3;

        }
        if (this.airdodging) {
            if (this.wavedashtime >= 12) {
                runFrame = 7;
            }
            else {
                runFrame = 8;
            }

        }
        if (this.launched > 0) {
            runFrame = 9;
        }
    }

    if (this.OnGround && ((this.Facing === -1 && this.Xa > 0) || (this.Facing === 1 && this.Xa < 0))) {
        if (this.Xa > 1 || this.Xa < -1) {
            if (this.character_select == "fox") {
                runFrame = 2;
            }
            else {
                runFrame = this.Large ? 9 : 7;
            }

        }

        if (this.Xa > 3 || this.Xa < -3) {
            for (i = 0; i < 3; i++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5, 0));
            }
        }
    }

    if (this.Large) {
        if (this.Ducking && this.GroundPoundTimer == 0 || this.JumpTime > 7) {
            if (this.character_select == "fox") {
                if (!this.airdodging) {
                    runFrame = 1;
                }
            }
            else if (this.character_select == "sonic") {
                runFrame = 14;

                if (this.SpindashCharge > 0) {
                    this.YPic = this.SpindashChargeLoop
                }
                else {
                    this.YPic = 0;
                }
            }
            else {
                runFrame = 14;
            }
        }
        this.Height = this.Ducking ? 12 : 24;
    } else {
        this.Height = 12;
    }

    if (this.Spindash && this.Xa != 0) {
        runFrame = 6;
    }


    if (this.SpindashCharge > 0 && this.Spindash) {
        this.YPic = this.SpindashChargeLoop
    }
    else {
        this.YPic = 0;
    }

    if (this.Laser > 0) {
        runFrame = 10;
        this.Laser -= 1;
    }

    if (this.illusion > 0) {
        if (this.illusion > 10 || this.illusion < 2) {
            runFrame = 5;
        }
        else {
            runFrame = 6;
        }
        this.illusion -= 1;
    }

    if (this.specialfall && this.illusion == 0 && !this.OnGround && !this.airdodging && this.launched == 0) {
        runFrame = 4;
    }

    if (runFrame == 0 && this.character_select == "sonic") {
        this.YPic = 0;
    }

    this.XPic = runFrame;
};

Mario.Character.prototype.SubMove = function (xa, ya) {
    var collide = false, shell_unmoving_collide = false

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
                }
                else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
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
                if (this.IsBlocking(this.X + xa, this.Y, xa, 0)) {
                    collide = true;
                }
                else if (this.IsBlocking(this.X + xa - 16, this.Y + ya - this.Height, xa, ya)) {
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
        this.Sliding = true;
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
                    if (this.IsBlocking(this.X + xa, this.Y, xa, 0)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa - 16, this.Y, xa, 0)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa + this.Width, this.Y, xa, 0)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                }
                else {
                    if (this.IsBlocking(this.X + xa, this.Y, xa, 0)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa - this.Width, this.Y, xa, 0)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                    else if (this.IsBlocking(this.X + xa + 16, this.Y, xa, 0)) {
                        collide = true;
                        shell_unmoving_collide = true;
                    }
                }
            }
        }
    }


    if (collide) {
        this.collide = true;
        if (this.launched > 0) {
            if (ya < 0 || ya > 0) {
                this.Xa *= 0.7
            }
            else {
                this.Xa *= -0.7;
            }
            this.launched = 0;
            this.TechWindow = 5;
        }
        else {

            if (xa < 0) {
                //Wall Collision
                this.collisiontype = "left";
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
                //Wall Collision
                this.collisiontype = "right";
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
                //Ceiling Collision
                this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
                this.JumpTime = 0;
                this.Ya = 0;
            }
            if (ya > 0) {
                //Floor Collision
                this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
                this.OnGround = true;
                this.waslaunched = false;
                if (this.Carried == null) {
                    this.CarriedCheck = false;
                }
            }
        }

        return false;
    } else {
        this.collisiontype = null;
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
        this.cointotal = Number(localStorage.getItem("cointotal")) + 1;
        localStorage.setItem("cointotal", this.cointotal);
        Enjine.Resources.PlaySound("coin");
        this.World.Level.SetBlock(x, y, 0);
        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5, 0));
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
    if (object instanceof Mario.Bowser) {
        this.SubMove(0, targetY - this.Y - object.Height);
    }
    else {
        this.SubMove(0, targetY - this.Y);
    }

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
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.Carried == null && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
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
    if (this.character_select == "sonic") {
        if (this.Coins == 0 && this.InvulnerableTime == 0) {
            this.Die();
        }
        else {
            this.InvulnerableTime = 10;
            for (let i = 0; i < this.Coins / 2; i += 1) {
                this.World.AddSprite(new Mario.Rings(this.World, this.X, this.Y - 20, Math.random() * 5, -10));
            }
            this.Coins = 0;
        }
    }
    else {
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
    }
};

Mario.Character.prototype.Win = function () {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.WinTime = 1;
    if (this.character_select == "fox") {
        this.SetLarge(false, false);
        this.PicWidth = 36;
        this.PicHeight = 50;
    }
    if (this.character_select == "sonic") {
        this.SetLarge(false, false);
        this.PicWidth = this.PicHeight = 32;
    }
    Enjine.Resources.PlaySound("exit");
};

Mario.Character.prototype.Die = function () {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.DeathTime = 1;
    Enjine.Resources.PlaySound("death");
    this.SetLarge(false, false);
    if (this.character_select == "sonic") {
        this.YPic = 1;
        this.XPic = 0;
        this.PicWidth = this.PicHeight = 32;
    }

};

Mario.Character.prototype.GetFlower = function () {
    var y = this.Y / 16, x = (this.X / 16), world = this.World, percentdamage = Mario.MarioCharacter.percentdamage, healamount = (Math.random() * 3 | 0);
    if (this.DeathTime > 0 && this.World.Paused || this.character_select == "fox") {
        if (percentdamage > 1) {
            if (healamount >= 1) {
                this.percentdamage = percentdamage - healamount
            }
            else {
                this.percentdamage -= 1;
            }
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
            if (i % 2 == 0) {
                this.GetCoin();
                Enjine.Resources.PlaySound("coin");
                this.World.AddSprite(new Mario.CoinAnim(this.World, x, y + ((Math.random() * 0.5) * (Math.random() * -1))));
            }
        }
    }
};

Mario.Character.prototype.GetMushroom = function () {
    var y = this.Y / 16, x = this.X / 16, healamount2 = (Math.random() * 3 | 0), percentdamage2 = Mario.MarioCharacter.percentdamage;
    if (this.DeathTime > 0 && this.World.Paused || this.character_select == "fox") {
        if (percentdamage > 1) {
            if (healamount >= 1) {
                this.percentdamage = percentdamage2 - healamount2
            }
            else {
                this.percentdamage -= 1;
            }
        }
        else {
            this.percentdamage = 0
        }
        return;
    }


    if (!this.Large) {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, false);
    } else {

        for (let i = 0; i < 20; i += 0.25) {
            if (i % 2 == 0) {
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

    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
        this.Carried = shell;
        shell.Carried = true;
        this.CarriedCheck = true;
    } else {
        Enjine.Resources.PlaySound("kick");
        this.InvulnerableTime = 1;
        shell.Drop = false;
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