
//! ================================================== clean residuals at init... ==================================================
inline function removeDanglingPanels()
{
	for (child in framePnl.getChildPanelList())
		child.removeFromParent();
	
	framePnl.set("height", 2);
}
removeDanglingPanels();


//! ================================================== Update List ==================================================
inline function updateList(BGT_Browser)
{
	removeDanglingPanels();
	
	for (i=0; i<fileList.length; i++)
	{
		createRow(i, fileList[i].isDir);
	}
	
	framePnl.set("height", fileList.length * LINE_HEIGHT);
	
	tokenSepLbl.changed();
}


//! ================================================== Repaint List ==================================================
inline function repaintList()
{
	for (child in framePnl.getChildPanelList())
	{
		child.repaint();
		child.data.undoBtn.repaint();
	}
}


//! ================================================== Create Rows ==================================================
inline function createRow(idx, isDir)
{
	local p = framePnl.addChildPanel();
	framePnl.data.row = p;
	p.data.element = fileList[idx];
	p.data.index = idx;
	
	p.setPosition(0, idx * LINE_HEIGHT, framePnl.getWidth(), LINE_HEIGHT - 1);
	
	//!> Paint routine
	p.setPaintRoutine(function(g)
	{
		g.setColour(0xff525252);
		g.fillRoundedRectangle([0, 0, this.getWidth(), this.getHeight()], 4.0);
		
		g.setColour(Colours.white);
		g.setFont("Source Code Pro", 12.0);
		g.drawAlignedText(this.data.element.file.toString(3), [20, 0, this.getWidth(), this.getHeight()/2.0], "bottomLeft");
		
		var string = "L: " + this.data.element.originalLength;
	
		if (isDefined(this.data.element.lengthAdded))
			string += " << " + this.data.element.lengthAdded;
		
		if (isDefined(this.data.element.newLength))
			string += " = " + this.data.element.newLength;
			
		g.setColour(0xffb2b2b2);
		g.drawAlignedText(string, [20, this.getHeight()/2.0, this.getWidth(), this.getHeight()/2.0], "topLeft");
		
		if (this.data.element.isRef)
		{
			g.setColour(Colours.white);
			g.drawAlignedText("Ref.", [this.getWidth()/2 - 40, 0, 38, this.getHeight()], "right");
		}
		
		if (this.data.element.isPadded)
		{
			g.setColour(Colours.indianred);
			g.drawAlignedText("Pad.", [this.getWidth()/2 - 40, 0, 38, this.getHeight()], "right");
		}
		
		// Waveform
		var bg = [this.getWidth()/2, 2, this.getWidth()/2 - 20, this.getHeight() - 4];
		
		g.setColour(0xff363636);
		g.fillRoundedRectangle(bg, 0.0);
		
		var paths;
		
		if (this.data.element.isPadded)
			paths = getPaths(this.data.element.paddedBuffer);
		else
			paths = getPaths(this.data.element.buffer);
		
		for (i=0; i<paths.length; i++)
		{
			if (this.data.element.isPadded)
			{
				g.setColour(Colours.indianred);
				var x1 = bg[0] + bg[2] / this.data.element.newLength * this.data.element.originalLength;
				var x2 = x1 + bg[2] / this.data.element.newLength * this.data.element.lengthAdded;
				var y = 2 + i * bg[3]/paths.length + bg[3]/(2*paths.length);
				g.drawLine(x1, x2, y, y, 2.0);
			}
			
			var a = [bg[0], 2 + i * bg[3]/paths.length, bg[2], bg[3]/paths.length];
			
			g.setColour(0xffb2b2b2);
			g.drawPath(paths[i], a, 0.50);
		}
	});
	
	addSelectBtn(p);
	addRemoveBtn(p);
	addUndoBtn(p);
}



//! ================================================== Add Select Btn ==================================================
inline function addSelectBtn(parent)
{
	local b = parent.addChildPanel();
	parent.data.selectBtn = b;
	
	b.setPosition(5, (parent.getHeight()-10)/2, 10, 10);
	b.set("allowCallbacks", "Clicks Only");
	
	//!> Paint routine
	b.setPaintRoutine(function(g)
	{
		g.fillAll(0xff6e6e6e);
		g.setColour(Colours.white);
		
		var remove = 1;
		
		if (this.getParentPanel().data.element.isSelected)
		{
			g.drawLine(1, 4, 4, 9, 1.0);
			g.drawLine(4, 9, 9, 1, 1.0);
		}
	});
	
	//!> Mouse CB
	b.setMouseCallback(function(event)
	{
		if (event.clicked)
		{
			this.getParentPanel().data.element.isSelected = !this.getParentPanel().data.element.isSelected;
			this.repaint();
		}
	});
}


//! ================================================== Add Remove Btn ==================================================
inline function addRemoveBtn(parent)
{
	local b = parent.addChildPanel();
	parent.data.removeBtn = b;
	
	b.setPosition(parent.getWidth() - 15, (parent.getHeight()-20)/3, 10, 10);
	b.set("allowCallbacks", "Clicks & Hover");
	
	//!> Paint routine
	b.setPaintRoutine(function(g)
	{
		g.setColour(this.data.hover ? Colours.red : 0xff363636);
		
		var remove = 1;
		g.drawLine(remove, this.getWidth() - remove, remove, this.getWidth() - remove, 1.0);
		g.drawLine(remove, this.getWidth() - remove, this.getWidth() - remove, remove, 1.0);
	});
	
	//!> Mouse CB
	b.setMouseCallback(function(event)
	{
		this.data.hover = event.hover;
		
		if (event.clicked)
		{
			fileList.remove(this.getParentPanel().data.element);
			this.getParentPanel().removeFromParent();
			BGT_Browser.callOnBackgroundThread(updateList);
		}
		
		this.repaint();
	});
}
	


//! ================================================== Add Undo Btn ==================================================
inline function addUndoBtn(parent)
{
	local b = parent.addChildPanel();
	parent.data.undoBtn = b;
	
	b.setPosition(parent.getWidth() - 15, 2*(parent.getHeight()-20)/3+10, 10, 10);
	b.set("allowCallbacks", "Clicks & Hover");
	
	//!> Paint routine
	b.setPaintRoutine(function(g)
	{
		g.setColour(this.data.hover ? Colours.red : this.getParentPanel().data.element.isPadded ? 0xff363636 : 0x88363636);
		g.fillPath(Paths.undo, this.getLocalBounds(0.0));
	});
	
	//!> Mouse CB
	b.setMouseCallback(function(event)
	{
		if (this.getParentPanel().data.element.isPadded)
		{
			this.data.hover = event.hover;
			
			if (event.clicked)
			{
				undoPaddedFile(this.getParentPanel().data.element);
				this.data.hover = false;
				this.getParentPanel().repaint();
			}
			
			this.repaint();
		}
	});
}
	



















































