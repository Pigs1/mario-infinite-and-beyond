/**
	Just create the global mario object.
	Code by Rob Kleffner, 2011
*/

var Mario = {};

if (Mario.MarioCharacter.cointotal != 0 && !(Mario.MarioCharacter.cointotal > 0)) {
	localStorage.setItem("cointotal", "0");
}