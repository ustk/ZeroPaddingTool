

//! ================================================== Buttons ==================================================
//! Add File
inline function onaddFileBtnControl(component, value)
{
	if (value)
	{
		local dir = isDefined(currentDirectory) ? currentDirectory : FileSystem.Desktop;
		
		FileSystem.browse(dir, false, "*", function(f)
		{
			if (f.isFile())
			{
				// until we can regex the file type
				if (isAudioFile(f))
					addFileToList(f);
				
				BGT_Browser.callOnBackgroundThread(updateList);
				currentDirectory = f.getParentDirectory();
			}
		});
	}
};

Content.getComponent("addFileBtn").setControlCallback(onaddFileBtnControl);


//! Add Directory
inline function onaddDirBtnControl(component, value)
{
	if (value)
	{
		local dir = isDefined(currentDirectory) ? currentDirectory : FileSystem.Desktop;
		
		FileSystem.browseForDirectory(dir, function(r)
		{
			if (r.isDirectory())
			{
				var files = FileSystem.findFiles(r, "*", true);
				
				for (f in files)
				{
					// until we can regex the file type
					if (isAudioFile(f))
						addFileToList(f);
				}
				
				BGT_Browser.callOnBackgroundThread(updateList);
				currentDirectory = r;
			}
		});
	}
};

Content.getComponent("addDirBtn").setControlCallback(onaddDirBtnControl);



inline function isAudioFile(f)
{
	local ext = [".wav", ".aif", ".aiff"];
	
	for (e in ext)
	{
		if (f.toString(2) == e)
			return true;
	}
	
	return false;
}


//! ================================================== Add Zero Padding ==================================================
//! To Selected
inline function onpadSelectedBtnControl(component, value)
{
	if (value)
	{
		local list = [];
		
		for (f in fileList)
		{
			if (f.isSelected)
				list.push(f);
		}
		
		addZeroPadding(list);
		BGT_Browser.callOnBackgroundThread(updateList);
	}
};
Content.getComponent("padSelectedBtn").setControlCallback(onpadSelectedBtnControl);


//! To All
inline function onpadAllBtnControl(component, value)
{
	if (value)
	{
		addZeroPadding(fileList);
		BGT_Browser.callOnBackgroundThread(updateList);
	}
};
Content.getComponent("padAllBtn").setControlCallback(onpadAllBtnControl);


//! By Token
inline function onpadTokenBtnControl(component, value)
{
	if (value)
	{
		for (t in getTokenList())
		{
			local list = [];
			
			for (f in fileList)
			{
				if (getToken(f) == t)
					list.push(f);
			}
			
			addZeroPadding(list);
		}
		
		BGT_Browser.callOnBackgroundThread(updateList);
	}
};
Content.getComponent("padTokenBtn").setControlCallback(onpadTokenBtnControl);



//! ================================================== Undo All Padding ==================================================
inline function onundoBtnControl(component, value)
{
	if (value)
	{
		local atLeastOneAction = false;
		
		for (f in fileList)
		{
			if (f.isPadded)
			{
				f.paddedBuffer 		= [];
				f.isPadded 			= false;
				f.lengthAdded 		= undefined;
				f.newLength 		= undefined;
				atLeastOneAction 	= true;
			}
			
			f.isRef = false;
		}
		
		if (atLeastOneAction)
			BGT_Browser.callOnBackgroundThread(updateList);
	}

};
Content.getComponent("undoBtn").setControlCallback(onundoBtnControl);



//! ================================================== Export Padded ==================================================
//! Overwrite
inline function onoverwriteBtnControl(component, value)
{
	if (value)
		newDirectoryBtn.setValue(false);
	
	newDirectoryBtn.set("enabled", !value);
	newDirectoryBtn.set("text", value ? "disabled" : "");
};
overwriteBtn.setControlCallback(onoverwriteBtnControl);

//! New Directory
inline function onnewDirectoryBtnControl(component, value)
{
	if (value)
		overwriteBtn.setValue(false);
	
	overwriteBtn.set("enabled", !value);
	overwriteBtn.set("text", value ? "disabled" : "");
};
newDirectoryBtn.setControlCallback(onnewDirectoryBtnControl);


//! Export
inline function onexportBtnControl(component, value)
{
	if (value)
	{
		local atLeastOneExportedFile = false;
		
		for (f in fileList)
		{
			if (f.isPadded)
			{
				local md = f.file.loadAudioMetadata();
				
				if (overwriteBtn.getValue())
				{
					f.file.writeAudioFile(f.paddedBuffer, md.SampleRate, md.BitDepth);
					
					if (f.file.isFile())
						f.isSelected = false;
					
					atLeastOneExportedFile = true;
				}
				else
				{
					local dir = f.file.getParentDirectory();
					local name = f.file.toString(1) + tokenSepLbl.getValue() + "zp" + f.file.toString(2);
					
					if (newDirectoryBtn.getValue())
					{
						local newDir = dir.createDirectory("_padded");
						writeNewFile(newDir.getChildFile(name), f);
						
						atLeastOneExportedFile = true;
					}
					else
					{
						writeNewFile(dir.getChildFile(name), f);
						
						atLeastOneExportedFile = true;
					}
				}
			}
		}
		
		if (atLeastOneExportedFile)
		{
			BGT_Browser.callOnBackgroundThread(updateList);
			
			Engine.showMessageBox("EXPORT", "All padded files have been successfully exported!", 0);
		}
	}
};

Content.getComponent("exportBtn").setControlCallback(onexportBtnControl);



inline function writeNewFile(newFile, f)
{
	local md = f.file.loadAudioMetadata();
	
	newFile.writeAudioFile(f.paddedBuffer, md.SampleRate, md.BitDepth);
	
	if (newFile.isFile())
		f.isSelected = false;
}


//! ================================================== Delete/Deselect All ==================================================
inline function ondeleteAllBtnControl(component, value)
{
	if (value)
	{
		fileList.clear();
		BGT_Browser.callOnBackgroundThread(updateList);
	}
};
deleteAllBtn.setControlCallback(ondeleteAllBtnControl);



inline function ondeselectAllBtnControl(component, value)
{
	if (value)
	{
		for (f in fileList)
			f.isSelected = false;
		
		for (child in framePnl.getChildPanelList())
			child.data.selectBtn.repaint();
	}
};
deselectAllBtn.setControlCallback(ondeselectAllBtnControl);













































