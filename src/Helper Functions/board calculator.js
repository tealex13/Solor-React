export function calcRowLen(nCols, rowNumber){
		return (nCols - rowNumber % 2);
	}

export function calculateTotal(nCols, nRows){
		return (calcRowLen(nCols,0)*Math.ceil(nRows/2) + calcRowLen(nCols,1)*Math.floor(nRows/2));
	}