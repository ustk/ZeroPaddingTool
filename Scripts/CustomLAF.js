

//! ================================================== Custom LAF ==================================================
//! General Btn
const var btnLAF = Content.createLocalLookAndFeel();

btnLAF.registerFunction("drawToggleButton", function(g, obj)
{
	g.setColour(obj.over ? obj.bgColour : obj.itemColour1);
	g.fillRoundedRectangle(obj.area, 4.0);
	g.setColour(obj.over ?  obj.textColour : 0xFFB6B6B6);
	g.setFont("Arial", 11.0);
	g.drawAlignedText(obj.text, obj.area, "centred");
});

const var btnLAF_targets = [Content.getComponent("addFileBtn"), 
                            Content.getComponent("addDirBtn"), 
                            Content.getComponent("padSelectedBtn"), 
                            Content.getComponent("padAllBtn"), 
                            Content.getComponent("padTokenBtn"), 
                            Content.getComponent("exportBtn"), 
                            Content.getComponent("undoBtn")];

for(c in btnLAF_targets)
    c.setLocalLookAndFeel(btnLAF);


//! Checkbox
const var checkBox = Content.createLocalLookAndFeel();
recursiveBtn.setLocalLookAndFeel(checkBox);
overwriteBtn.setLocalLookAndFeel(checkBox);
newDirectoryBtn.setLocalLookAndFeel(checkBox);

checkBox.registerFunction("drawToggleButton", function(g, obj)
{
	var a = obj.area;
	var remove = 1;
	var l = a[2]-remove;
	
	g.fillAll((obj.text == "disabled") ? obj.itemColour2 : obj.bgColour);
	g.setColour(obj.textColour);
	
	if (obj.value)
	{
		g.drawLine(remove, l, remove, l, 1);
		g.drawLine(remove, l, l, remove, 1);
	}
});



//! Delete/Deselect All
const var deleteAllBtnLAF = Content.createLocalLookAndFeel();
deleteAllBtn.setLocalLookAndFeel(deleteAllBtnLAF);
deselectAllBtn.setLocalLookAndFeel(deleteAllBtnLAF);

deleteAllBtnLAF.registerFunction("drawToggleButton", function(g, obj)
{
	g.setColour(obj.over ? obj.itemColour1 : obj.textColour);
	g.setFont("Arial", 11.0);
	g.drawAlignedText(obj.text, obj.area, obj.text.contains("delete") ? "right" : "left");
});
























































