/**
	Represents a fire powerup.
	Code by Rob Kleffner, 2011
*/

Mario.FireFlower = function (world, x, y) {
	this.Width = 4;
	this.Height = 24;

	this.World = world;
	this.X = x;
	this.Y = y;
	this.Image = Enjine.Resources.Images["items"];
	this.OnGround = false;
	this.GroundInertia = 0.89;
	this.AirInertia = 0.89;

	this.XPicO = 8;
	this.YPicO = 15;
	this.XPic = 1;
	this.YPic = 0;
	this.Height = 12;
	this.Facing = 1;
	this.PicWidth = this.PicHeight = 16;

	this.Life = 0;
};

Mario.FireFlower.prototype = new Mario.NotchSprite();

Mario.FireFlower.prototype.CollideCheck = function () {
	var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
	if (xMarioD > -16 && xMarioD < 16) {
		if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
			Mario.MarioCharacter.GetFlower();
			this.World.RemoveSprite(this);
		}
	}
};

Mario.FireFlower.prototype.Move = function () {

	if (this.Life < 9) {
		this.Layer = 0;
		if (Mario.MarioCharacter.GroundPoundTimer > 0) {
			this.Y++;
		}
		else {
			this.Y--;
		}
		this.Life++;
		return;
	}

	if (!this.SubMove(this.Xa, 0)) {
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

Mario.FireFlower.prototype.SubMove = function (xa, ya) {
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

Mario.FireFlower.prototype.IsBlocking = function (x, y, xa, ya) {
	x = (x / 16) | 0;
	y = (y / 16) | 0;

	if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
		return false;
	}

	return this.World.Level.IsBlocking(x, y, xa, ya);
};