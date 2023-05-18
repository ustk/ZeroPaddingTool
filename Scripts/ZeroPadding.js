

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
