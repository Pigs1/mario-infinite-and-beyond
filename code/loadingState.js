/**
    State that loads all the resources for the game.
    Code by Rob Kleffner, 2011
*/

Mario.LoadingState = function () {
    this.Images = [];
    this.ImagesLoaded = false;
    this.ScreenColor = 0;
    this.ColorDirection = 1;
    this.ImageIndex = 0;
    this.SoundIndex = 0;
};

Mario.LoadingState.prototype = new Enjine.GameState();

Mario.LoadingState.prototype.Enter = function () {
    var i = 0;
    for (i = 0; i <= 52; i++) {
        this.Images[i] = {};
    }

    this.Images[0].name = "background";
    this.Images[1].name = "endScene";
    this.Images[2].name = "enemies";
    this.Images[3].name = "fireMario";
    this.Images[4].name = "font";
    this.Images[5].name = "gameOverGhost";
    this.Images[6].name = "items";
    this.Images[7].name = "logo";
    this.Images[8].name = "map";
    this.Images[9].name = "mario";
    this.Images[10].name = "particles";
    this.Images[11].name = "racoonMario";
    this.Images[12].name = "smallMario";
    this.Images[13].name = "title";
    this.Images[14].name = "worldMap";
    this.Images[15].name = "worldMap2";
    this.Images[16].name = "luigi";
    this.Images[17].name = "smallLuigi";
    this.Images[18].name = "PeachworldMap";
    this.Images[19].name = "peach";
    this.Images[20].name = "fireLuigi";
    this.Images[21].name = "firePeach";
    this.Images[22].name = "smallPeach";
    this.Images[23].name = "mapsheetinverted";
    this.Images[24].name = "blastzone";
    this.Images[25].name = "blastzonesideways";
    this.Images[26].name = "blastzoneleft";
    this.Images[27].name = "blastzonetop";
    this.Images[28].name = "toadmap";
    this.Images[29].name = "toadbackground";
    this.Images[30].name = "chest";
    this.Images[31].name = "Toad";
    this.Images[32].name = "Door";
    this.Images[33].name = "Bridge";
    this.Images[34].name = "Bowser";
    this.Images[35].name = "bowserfireball";
    this.Images[36].name = "BowserWall";
    this.Images[37].name = "Axe";
    this.Images[38].name = "Fox";
    this.Images[39].name = "FoxworldMap";
    this.Images[40].name = "Shield";
    this.Images[41].name = "Shine";
    this.Images[42].name = "foxitems";
    this.Images[43].name = "sonic";
    this.Images[44].name = "SonicworldMap";
    this.Images[45].name = "ShopMenu";
    this.Images[46].name = "MrLicon";
    this.Images[47].name = "MrLsheet";
    this.Images[48].name = "FireMrLsheet";
    this.Images[49].name = "smallMrLsheet";
    this.Images[50].name = "MrLmapsheet";
    this.Images[51].name = "buzzshot";
    this.Images[52].name = "ringmap";

    this.Images[0].src = "images/level/default/bgsheet.png";
    this.Images[1].src = "images/menu/endscene.gif";
    this.Images[2].src = "images/enemies/enemysheet.png";
    this.Images[3].src = "images/character/mario/firemariosheet.png";
    this.Images[4].src = "images/menu/font.gif";
    this.Images[5].src = "images/menu/gameovergost.gif";
    this.Images[6].src = "images/items/itemsheet.png";
    this.Images[7].src = "images/menu/logo.gif";
    this.Images[8].src = "images/level/default/mapsheet.png";
    this.Images[9].src = "images/character/mario/mariosheet.png";
    this.Images[10].src = "images/particle/particlesheet.png";
    this.Images[11].src = "images/character/mario/racoonmariosheet.png";
    this.Images[12].src = "images/character/mario/smallmariosheet.png";
    this.Images[13].src = "images/menu/title.gif";
    this.Images[14].src = "images/worldmap/worldmap.png";
    this.Images[15].src = "images/worldmap/worldmapcopy.png";
    this.Images[16].src = "images/character/luigi/luigisheet.png";
    this.Images[17].src = "images/character/luigi/smallluigisheet.png";
    this.Images[18].src = "images/worldmap/worldmappeach.png";
    this.Images[19].src = "images/character/peach/peachsheet.png";
    this.Images[20].src = "images/character/luigi/fireluigisheet.png";
    this.Images[21].src = "images/character/peach/firepeachsheet.png";
    this.Images[22].src = "images/character/peach/smallpeachsheet.png";
    this.Images[23].src = "images/mapsheetinverted.png";
    this.Images[24].src = "images/character/fox/blastzone.png";
    this.Images[25].src = "images/character/fox/blastzonesideways.png";
    this.Images[26].src = "images/character/fox/blastzoneleft.png";
    this.Images[27].src = "images/character/fox/blastzonetop.png";
    this.Images[28].src = "images/level/toad/toadmapsheet.png";
    this.Images[29].src = "images/level/toad/toadbgsheet.png";
    this.Images[30].src = "images/level/toad/chest.png";
    this.Images[31].src = "images/level/toad/toad.png";
    this.Images[32].src = "images/level/castle/door.png";
    this.Images[33].src = "images/level/bowser/bridge.png";
    this.Images[34].src = "images/enemies/bowser/Bowser.png";
    this.Images[35].src = "images/enemies/bowser/bowserfireball.png";
    this.Images[36].src = "images/level/bowser/bowserwall.png";
    this.Images[37].src = "images/level/bowser/Axe.png";
    this.Images[38].src = "images/character/fox/fox sheet.png";
    this.Images[39].src = "images/worldmap/foxworldmap.png";
    this.Images[40].src = "images/character/fox/shieldbubble.png";
    this.Images[41].src = "images/character/fox/shine.png";
    this.Images[42].src = "images/items/fox/foxitemsheet.png";
    this.Images[43].src = "images/character/sonic/sonicsheet.png";
    this.Images[44].src = "images/worldmap/worldmapsonic.png";
    this.Images[45].src = "images/menu/shopmenu.png";
    this.Images[46].src = "images/menu/MrL.png";
    this.Images[47].src = "images/character/luigi/mrLsheet.png";
    this.Images[48].src = "images/character/luigi/firemrLsheet.png";
    this.Images[49].src = "images/character/luigi/smallmrLsheet.png";
    this.Images[50].src = "images/worldmap/mrLworldmap.png";
    this.Images[51].src = "images/enemies/buzzshot.png";
    this.Images[52].src = "images/level/default/ringmapsheet.png";

    Enjine.Resources.AddImages(this.Images);

    var testAudio = new Audio();

    if (testAudio.canPlayType("audio/mp3")) {
        Enjine.Resources.AddSound("1up", "sounds/1-up.mp3", 1)
            .AddSound("breakblock", "sounds/breakblock.mp3")
            .AddSound("bump", "sounds/bump.mp3", 4)
            .AddSound("cannon", "sounds/cannon.mp3")
            .AddSound("coin", "sounds/coin.mp3", 5)
            .AddSound("death", "sounds/death.mp3", 1)
            .AddSound("exit", "sounds/exit.mp3", 1)
            .AddSound("fireball", "sounds/fireball.mp3", 1)
            .AddSound("jump", "sounds/jump.mp3")
            .AddSound("kick", "sounds/kick.mp3")
            .AddSound("pipe", "sounds/pipe.mp3", 1)
            .AddSound("powerdown", "sounds/powerdown.mp3", 1)
            .AddSound("powerup", "sounds/powerup.mp3", 1)
            .AddSound("sprout", "sounds/sprout.mp3", 1)
            .AddSound("stagestart", "sounds/stagestart.mp3", 1)
            .AddSound("stomp", "sounds/stomp.mp3", 2);
    } else {
        Enjine.Resources.AddSound("1up", "sounds/1-up.wav", 1)
            .AddSound("breakblock", "sounds/breakblock.wav")
            .AddSound("bump", "sounds/bump.wav", 2)
            .AddSound("cannon", "sounds/cannon.wav")
            .AddSound("coin", "sounds/coin.wav", 5)
            .AddSound("death", "sounds/death.wav", 1)
            .AddSound("exit", "sounds/exit.wav", 1)
            .AddSound("fireball", "sounds/fireball.wav", 1)
            .AddSound("jump", "sounds/jump.wav", 1)
            .AddSound("kick", "sounds/kick.wav", 1)
            .AddSound("message", "sounds/message.wav", 1)
            .AddSound("pipe", "sounds/pipe.wav", 1)
            .AddSound("powerdown", "sounds/powerdown.wav", 1)
            .AddSound("powerup", "sounds/powerup.wav", 1)
            .AddSound("sprout", "sounds/sprout.wav", 1)
            .AddSound("stagestart", "sounds/stagestart.wav", 1)
            .AddSound("stomp", "sounds/stomp.wav", 1);
    }

    //load the array of tile behaviors
    Mario.Tile.LoadBehaviors();
};

Mario.LoadingState.prototype.Exit = function () {
    delete this.Images;
};

Mario.LoadingState.prototype.Update = function (delta) {
    if (!this.ImagesLoaded) {
        this.ImagesLoaded = true;
        var i = 0;
        for (i = 0; i < this.Images.length; i++) {
            if (Enjine.Resources.Images[this.Images[i].name].complete !== true) {
                this.ImagesLoaded = false;
                break;
            }
        }
    }

    this.ScreenColor += this.ColorDirection * 255 * delta;
    if (this.ScreenColor > 255) {
        this.ScreenColor = 255;
        this.ColorDirection = -1;
    } else if (this.ScreenColor < 0) {
        this.ScreenColor = 0;
        this.ColorDirection = 1;
    }
};

Mario.LoadingState.prototype.Draw = function (context) {
    if (!this.ImagesLoaded) {
        var color = parseInt(this.ScreenColor, 10);
        context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
        context.fillRect(0, 0, 640, 480);
    } else {
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, 640, 480);
    }
};

Mario.LoadingState.prototype.CheckForChange = function (context) {
    if (this.ImagesLoaded) {
        //set up the global map state variable
        Mario.GlobalMapState = new Mario.MapState();

        context.ChangeState(new Mario.TitleState());
    }
};
