import * as bc from "./Helper Functions/board calculator";

function Tester (props) {

	const moveTree = {"orange":{},"notAmove":{"green":{}}};
	console.log("remaining:",bc.flattenMoves(moveTree));

	return <h1> tester </h1>

}

export default Tester;