

//! Prepare For Padding
inline function prepareForPadding(BGT)
{
	switch (Mode.mode)
	{
		case Mode.ALL: 	addZeroPadding(fileList);
						break;
		
		case Mode.SEL: 	local list = [];
						
						for (f in fileList)
						{
							if (f.isSelected)
								list.push(f);
						}
						
						addZeroPadding(list);
						break;
						
		case Mode.TOK:	for (t in getTokenList())
						{
							for (d in getDirectoryList())
							{
								local list = [];
								
								for (f in fileList)
								{
									if (getToken(f) == t && f.file.getParentDirectory().toString(0) == d)
										list.push(f);
								}
								
								addZeroPadding(list);
							}
						}
						
						break;
	}
}


//! Add Padding
inline function addZeroPadding(list)
{
	local l = maxLength(list);

	for (f in list)
	{
		for (b in f.buffer)
		{
			local idx = f.buffer.indexOf(b);
			
			if (b.length < l)
			{
				local pad = Buffer.create(l);
				pad << 0.0;
				
				local temp = Buffer.referTo(pad, 0, f.originalLength);
				b >> temp;
				
				f.paddedBuffer[idx] = pad;
				
				f.isPadded 		= true;
				f.isRef			= false;
				f.lengthAdded 	= l - f.originalLength;
				f.newLength 	= f.paddedBuffer[idx].length;
			}
			else
			{
				f.isRef			= true;
				f.isPadded 		= false;
				f.lengthAdded 	= undefined;
				f.newLength 	= undefined;
			}
		}
		
		for (child in framePnl.getChildPanelList())
		{
			if (child.data.element == f)
			{
				child.repaint();
				child.data.undoBtn.repaint();
			}
		}
	}
}


//! Find Max Length
inline function maxLength(list)
{
	local maxLength = 0;
	
	for (f in list)
	{
		if (f.originalLength > maxLength)
			maxLength = f.originalLength;
	}
	
	return maxLength;
}
