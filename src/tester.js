import * as bc from "./Helper Functions/board calculator";

function Tester (props) {

	const moveTree = {"orange":{"white":{"yellow":{}}},"left":{"red":{"blue":{}}}};
const moveHistory = [{moveType:["dirWild"]},{moveType:["white","red"]}];
	console.log("remaining:",bc.getRemainingMoves(moveTree,moveHistory));

	return <h1> tester </h1>

}

export default Tester;