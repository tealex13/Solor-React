import {mergeObjects} from "./Generic Helpers"

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

export function dist (a,b){
	const rs = Math.abs(b[0]-a[0]); //row shift
	const goingRight =  Math.floor((rs + a[0]%2)/2);
	const goingLeft =  Math.floor((rs + (a[0]+1)%2)/2);
	const left = Math.max(a[1] - b[1] - goingLeft,0);
	const right = Math.max(b[1] - a[1] - goingRight,0);
	const dist =  rs + Math.max(left,right);
	return dist;
}

export function moveDir (fromCoords,toCoords){
	const firstIsEven = fromCoords[0]%2 === 0;
	const secondIsEven = toCoords[0]%2 === 0;
	if (firstIsEven === secondIsEven){
		if (fromCoords[1] === toCoords[1]){
			return dirs.center;
		} else{
			return toCoords[1] - fromCoords[1] > 0 ? dirs.right : dirs.left;
		}
	} else if (firstIsEven & !secondIsEven){
		return toCoords[1] - fromCoords[1] >= 0 ? dirs.right : dirs.left;
	} else {
		return toCoords[1] - fromCoords[1] > 0 ? dirs.right : dirs.left;
	}
}

export const getOppositeDir = (direction) => {
	switch(direction){
	case dirs.left:
		return dirs.right;
	case dirs.right:
		return dirs.left;
	case dirs.center:
		return dirs.center;
	}
}

export function areMovesOnTree(moveTree, moves) {
	if (moves.length === 0){
		return true;
	} 
	if (moveTree === undefined){
		return false;
	} else {
		const isAnyMoveOptionANode = (moveTree, moves, validationMethod) => {
		return convertMoveTypes(moves[0].moveType).reduce((valid,move) => {return valid || validationMethod(move)},false);
		};
	    if (moves.length > 1){
	    	return isAnyMoveOptionANode(moveTree, moves, (move) => areMovesOnTree(moveTree[move],moves.slice(1)));
	    } else {
	        return isAnyMoveOptionANode(moveTree, moves, (move) => moveTree[move] ? true : false);
	    } 
	}	   
}

export function getRemainingMoves(moveTree, moves) {
	if (moves.length === 0){
		return moveTree;
	} 
	if (moveTree === undefined){
		return {};
	} else {
		const isAnyMoveOptionANode = (moveTree, moves, validationMethod) => {
			return convertMoveTypes(moves[0].moveType)
			.filter(move => Object.keys(moveTree).includes(move))
			.reduce((valid,move) => {return mergeObjects(valid, validationMethod(move))},{});
		};
	    if (moves.length > 1){
	    	return isAnyMoveOptionANode(moveTree, moves, (move) => getRemainingMoves(moveTree[move],moves.slice(1)));
	    } else {
	        return isAnyMoveOptionANode(moveTree, moves, (move) => {return moveTree[move]});
	    } 
	}	   
}

const convertMoveTypes = (typeIn) => {

	if (typeIn.includes(dirWild)){
		return [dirs.left, dirs.right, dirs.center, dirWild];
	} else if(Object.values(dirs).reduce((includes,dir) => includes || typeIn.includes(dir),false)){
		return [...typeIn, ...[dirWild]];
	} else if(typeIn.includes(colorWild)){
		return [...colorsArray, ...[colorWild]];
	} else {
		return typeIn;
	}
}

export function getUnusedCards(moveTree) {
	if (typeof moveTree === "object" && moveTree !=  null){
		let nums = moveTree.cardNum ?  
		Object.keys(moveTree.cardNum) : [];
		return Object.entries(moveTree).reduce((unusedCards,[move,submoves]) => {
			//only add id the value is unique
			return [...unusedCards,...getUnusedCards(submoves).filter(cardNum => !unusedCards.includes(cardNum))];  
		},nums)
	} else {
		return [];
	}
}


export function getRemainingMoveTree(moveTree,moveHistory){
	if(moveHistory.length > 0){
		return getRemainingMoveTree(moveTree[moveHistory[0].moveType],moveHistory.slice(1));
	} else {
		return moveTree[moveHistory[0].moveType];
	}
}

export const colorsArray = ["white","orange","green","purple","black","red"];
export const dirs = {left: "left", right: "right", center: "center"};
export const dirWild = "dirWild";
export const colorWild = "colorWild";