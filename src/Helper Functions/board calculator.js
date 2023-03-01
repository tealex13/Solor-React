export function calcRowLen(nCols, rowNumber){
		return (nCols - rowNumber % 2);
	}

export function calculateTotalHolds(nRows, nCols){
		return (calcRowLen(nCols,0)*Math.ceil(nRows/2) + calcRowLen(nCols,1)*Math.floor(nRows/2));
	}

export function mapFromBoard(rowIndex, colIndex, nCols) {
	return calculateTotalHolds(rowIndex, nCols) + colIndex;
}

export function mapToBoard(Index, nRows, nCols){
	//not tested
	let rowIndex = Math.floor(Index/calcTwoRowsLen(nCols));
	rowIndex = Index - rowIndex * calcTwoRowsLen(nCols) < calcRowLen(nCols,0) ? rowIndex : rowIndex + 1 ; 

	let colIndex = Index % (calcRowLen(nCols,0) + calcRowLen(nCols,1));
	colIndex = colIndex < calcRowLen(nCols,0) ? colIndex : colIndex - calcRowLen(nCols,0);
	return ({rowIndex: rowIndex, colIndex: colIndex});
}

export function mapLastInRowFromBoard (rowIndex, nCols){
	return mapFromBoard(rowIndex,calcRowLen(nCols,rowIndex)-1,nCols);
}

function calcTwoRowsLen(nCols){
	return calcRowLen(nCols,0) + calcRowLen(nCols,1);
}