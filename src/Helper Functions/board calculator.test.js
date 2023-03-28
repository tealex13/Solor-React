import React from "react";

import * as bc from "./board calculator";

beforeEach(() => {
});

afterEach(() => {
});

it("bc.dist is 0 when coords are equal", () => {
  const a = Math.floor(Math.random()*100);
  const d = bc.dist([a,a],[a,a]);
  expect(d).toBe(0);
});

it("bc.dist is equal to bc.distance on row in positive direction", () => {
  const a = Math.floor(Math.random()*100);
  const d = bc.dist([0,0],[0,a]);
  expect(d).toBe(a);
});

it("bc.dist is equal to bc.distance on row in negative direction", () => {
  const a = Math.floor(Math.random()*100);
  const d = bc.dist([0,a],[0,0]);
  expect(d).toBe(a);
});

it("bc.dist from a row with less to next row left", () => {
  const d = bc.dist([1,1],[2,0]);
  expect(d).toBe(2);
});

it("bc.dist from a row with less to next row right", () => {
  const d = bc.dist([1,1],[2,1]);
  expect(d).toBe(1);
});

it("bc.dist from a row with more to next row left", () => {
  const d = bc.dist([0,1],[1,0]);
  expect(d).toBe(1);
});

it("bc.dist from a row with more to next row right", () => {
  const d = bc.dist([0,1],[1,1]);
  expect(d).toBe(1);
});

it("bc.dist from a row with more to new row right", () => {
  const d = bc.dist([2,1],[6,6]);
  expect(d).toBe(7);
});

it("bc.dist from a row with more to new row left", () => {
  const d = bc.dist([2,6],[6,1]);
  expect(d).toBe(7);
});

it("bc.dist from a row with more to new row left", () => {
  const d = bc.dist([2,4],[6,3]);
  expect(d).toBe(4);
});

it("bc.dist in the negative direction", () => {
  const d = bc.dist([6,3],[2,4]);
  expect(d).toBe(4);
});

it("bc.dist in the negative direction equal cols", () => {
  const d = bc.dist([6,3],[2,3]);
  expect(d).toBe(4);
});


//bc.moveDir()----------------
it("The same space is center", () => {
  const d = Math.floor(Math.random()*100);
  expect(bc.moveDir([d,d],[d,d])).toBe("center");
});

it("Same column from even to even is center", () => {
  const d = Math.floor(Math.random()*100)*2;
  const c = Math.floor(Math.random()*100)*2;
  const e = Math.floor(Math.random()*100);
  expect(bc.moveDir([c,e],[d,e])).toBe("center");
});

it("Same column from odd to odd is center", () => {
  const d = Math.floor(Math.random()*100)*2+1;
  const c = Math.floor(Math.random()*100)*2+1;
  const e = Math.floor(Math.random()*100);
  expect(bc.moveDir([c,e],[d,e])).toBe("center");
});

it("Directly to the right is right", () => {
  const d = Math.ceil(Math.random()*5);
  const e = Math.floor(Math.random()*100)-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(bc.moveDir([e,c],[e,c+d])).toBe("right");
});

it("Directly to the left is left", () => {
  const d = Math.ceil(Math.random()*5);
  const e = Math.floor(Math.random()*100)-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(bc.moveDir([e,c],[e,c-d])).toBe("left");
});

it("Same 'column' even to odd is right", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(bc.moveDir([e,c],[e+d,c])).toBe("right");
});

it("Same 'column' odd to even is left", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(bc.moveDir([e+d,c],[e,c])).toBe("left");
});

it("Same 'column' and right are right for even to odd", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.floor(Math.random()*10);
  expect(bc.moveDir([e,c],[e+d,c+f])).toBe("right");
});

it("Left of same 'column' are left for even to odd", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.ceil(Math.random()*10);
  expect(bc.moveDir([e,c+f],[e+d,c])).toBe("left");
});

it("Right of the same 'column' is right for odd to even", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.ceil(Math.random()*10);
  expect(bc.moveDir([e+d,c],[e,c+f])).toBe("right");
});

it("Same 'column' and left are left for odd to even", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.floor(Math.random()*10);
  expect(bc.moveDir([e+d,c+f],[e,c])).toBe("left");
});


//isMoveOnTree

it("Options are all on tree", () => {
  const moveTree = {orange: {green: {left: {right: {}}}}};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green"]},{moveType:["left"]}];
  console.log(moveHistory);
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(true);
})

it("Options are all on tree including last", () => {
  const moveTree = {orange: {green: {left: {right: {}}}}};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green"]},{moveType:["left"]},{moveType: ["right"]}];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(true);
})

it("Option not on tree", () => {
  const moveTree = {orange: {green: {left: {right: {}}}}};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green"]},{moveType: ["wrong","alsowrong"]},{moveType: ["right"]}];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(false);
})

it("One option is on the tree another is not", () => {
  const moveTree = {orange: {green: {left: {right: {}}}}};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green"]},{moveType: ["wrong","left"]},{moveType: ["right"]}];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(true);
})

it("One valid branch and one invalid branch returns true", () => {
  const moveTree = {orange: {green: {red:{}, left: {right: {}}}}};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green"]},{moveType:["red","left"]},{moveType: ["right"]}];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(true);
})

it("Empty tree returns false", () => {
  const moveTree = {};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green"]},{moveType:["red","left"]},{moveType: ["right"]}];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(false);
})

it("Empty history returns true", () => {
  const moveTree = {orange: {green: {red:{}, left: {right: {}}}}};
  const moveHistory = [];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(true);
})

it("Multiple valid branches returns true", () => {
  const moveTree = {orange: {
    green: {blue:{}, left: {right: {}}},
    yellow: {blue:{}, left: {right: {}}}
}};
  const moveHistory = [{moveType: ["orange"]},{moveType: ["green","yellow"]},{moveType:["red","left"]},{moveType: ["right"]}];
  expect(bc.areMovesOnTree(moveTree,moveHistory)).toBe(true);
})