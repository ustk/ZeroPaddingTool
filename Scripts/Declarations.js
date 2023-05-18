
//! ================================================== Declarations ==================================================

//! Components
const var framePnl 			= Content.getComponent("framePnl");
const var recursiveBtn 		= Content.getComponent("recursiveBtn");
const var tokenSepLbl 		= Content.getComponent("tokenSepLbl");
const var tokenNbLbl 		= Content.getComponent("tokenNbLbl");
const var deselectAllBtn 	= Content.getComponent("deselectAllBtn");
const var deleteAllBtn 		= Content.getComponent("deleteAllBtn");
const var overwriteBtn 		= Content.getComponent("overwriteBtn");
const var newDirectoryBtn 	= Content.getComponent("newDirectoryBtn");



//! Variables
const var LINE_HEIGHT = 40;

const var fileList = [];

const var BGT = Engine.createBackgroundTask("BGT");

reg currentDirectory = undefined;
reg listToBePadded = [];


//! Enums
namespace Mode
{
	reg mode;
	const var ALL = 0;
	const var SEL = 1;
	const var TOK = 2;
}


















































