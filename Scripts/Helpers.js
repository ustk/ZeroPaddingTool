

//! ================================================== Helper Functions ==================================================

//! Add File To List
inline function addFileToList(f)
{
	if (isNotInList(f))
	{
		local af = f.loadAsAudioFile();
		
		if (!Array.isArray(af))
			af = [af];
		
		local object = {file:			f,
						buffer:			af,
						paddedBuffer:	[],
						originalLength:	af[0].length,
						isRef:			false,
						lengthAdded:	undefined,
						newLength:		undefined,
						isSelected:		false,
						isPadded:		false,
						isExported:		false};
						
		fileList.push(object);
	}
}


//! Check In List
inline function isNotInList(f)
{
	local af = f.loadAsAudioFile();
	
	if (!Array.isArray(af))
		af = [af];
	
	// be sure it's not the same (check filename, buffer length & magnitude altogether)
	for (file in fileList)
	{
		if (file.file.toString(3) == f.toString(3) &&
			file.buffer[0].length == af[0].length &&
			file.buffer[0].getMagnitude(0, file.buffer[0].length) == af[0].getMagnitude(0, af[0].length))
		{
			return false;
		}
	}
	
	return true;
}


//! Get Token List
inline function getTokenList()
{
	local tokens = [];
	
	for (f in fileList)
		tokens.pushIfNotAlreadyThere(getToken(f));
	
	return tokens;
}


//! Get Token
inline function getToken(f)
{
	local separator = tokenSepLbl.getValue();
	local tokens = f.file.toString(1).split(separator);
	
	local tokenNumber = parseInt(tokenNbLbl.getValue()) - 1;
	tokenNumber = Math.range(tokenNumber, 0, tokens.length);
	
	return tokens[tokenNumber];
}



//! Get Paths
inline function getPaths(buffers)
{
	local paths = [];
	
	for (b in buffers)
	{
		local p = Content.createPath();
		
		local normPeak 	= b.getMagnitude();
		p.startNewSubPath(0.0, normPeak);
		p.startNewSubPath(0.0, -normPeak);
		
		p.startNewSubPath(0,b[0]);
		
		local stride = Math.max(Math.round(b.length / this.getWidth() / 4.0), 1);
		
		for (i=1; i<b.length; i+=stride)
		{
			local slice = Buffer.referTo(b, i, Math.min(stride, b.length - i));
			local r = slice.getPeakRange();
			
			if (Math.abs(r[0]) > Math.abs(r[1]))
				p.lineTo(i, r[0]);
			else
				p.lineTo(i, r[1]);
		}
		
		paths.push(p);
	}
	
	return paths;
}



//! Undo
inline function undoPaddedFile(f)
{
	f.paddedBuffer 		= [];
	f.isPadded 			= false;
	f.isRef 			= false;
	f.lengthAdded 		= undefined;
	f.newLength 		= undefined;
}














































