import React from "react";

import {dist, moveDir} from "./board calculator";

beforeEach(() => {
});

afterEach(() => {
});

it("Dist is 0 when coords are equal", () => {
  const a = Math.floor(Math.random()*100);
  const d = dist([a,a],[a,a]);
  expect(d).toBe(0);
});

it("Dist is equal to distance on row in positive direction", () => {
  const a = Math.floor(Math.random()*100);
  const d = dist([0,0],[0,a]);
  expect(d).toBe(a);
});

it("Dist is equal to distance on row in negative direction", () => {
  const a = Math.floor(Math.random()*100);
  const d = dist([0,a],[0,0]);
  expect(d).toBe(a);
});

it("Dist from a row with less to next row left", () => {
  const d = dist([1,1],[2,0]);
  expect(d).toBe(2);
});

it("Dist from a row with less to next row right", () => {
  const d = dist([1,1],[2,1]);
  expect(d).toBe(1);
});

it("Dist from a row with more to next row left", () => {
  const d = dist([0,1],[1,0]);
  expect(d).toBe(1);
});

it("Dist from a row with more to next row right", () => {
  const d = dist([0,1],[1,1]);
  expect(d).toBe(1);
});

it("Dist from a row with more to new row right", () => {
  const d = dist([2,1],[6,6]);
  expect(d).toBe(7);
});

it("Dist from a row with more to new row left", () => {
  const d = dist([2,6],[6,1]);
  expect(d).toBe(7);
});

it("Dist from a row with more to new row left", () => {
  const d = dist([2,4],[6,3]);
  expect(d).toBe(4);
});

it("Dist in the negative direction", () => {
  const d = dist([6,3],[2,4]);
  expect(d).toBe(4);
});

it("Dist in the negative direction equal cols", () => {
  const d = dist([6,3],[2,3]);
  expect(d).toBe(4);
});


//moveDir()----------------
it("The same space is center", () => {
  const d = Math.floor(Math.random()*100);
  expect(moveDir([d,d],[d,d])).toBe("center");
});

it("Same column from even to even is center", () => {
  const d = Math.floor(Math.random()*100)*2;
  const c = Math.floor(Math.random()*100)*2;
  const e = Math.floor(Math.random()*100);
  expect(moveDir([c,e],[d,e])).toBe("center");
});

it("Same column from odd to odd is center", () => {
  const d = Math.floor(Math.random()*100)*2+1;
  const c = Math.floor(Math.random()*100)*2+1;
  const e = Math.floor(Math.random()*100);
  expect(moveDir([c,e],[d,e])).toBe("center");
});

it("Directly to the right is right", () => {
  const d = Math.ceil(Math.random()*5);
  const e = Math.floor(Math.random()*100)-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(moveDir([e,c],[e,c+d])).toBe("right");
});

it("Directly to the left is left", () => {
  const d = Math.ceil(Math.random()*5);
  const e = Math.floor(Math.random()*100)-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(moveDir([e,c],[e,c-d])).toBe("left");
});

it("Same 'column' even to odd is right", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(moveDir([e,c],[e+d,c])).toBe("right");
});

it("Same 'column' odd to even is left", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  expect(moveDir([e+d,c],[e,c])).toBe("left");
});

it("Same 'column' and right are right for even to odd", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.floor(Math.random()*10);
  expect(moveDir([e,c],[e+d,c+f])).toBe("right");
});

it("Left of same 'column' are left for even to odd", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.ceil(Math.random()*10);
  expect(moveDir([e,c+f],[e+d,c])).toBe("left");
});

it("Right of the same 'column' is right for odd to even", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.ceil(Math.random()*10);
  expect(moveDir([e+d,c],[e,c+f])).toBe("right");
});

it("Same 'column' and left are left for odd to even", () => {
  const d = Math.floor(Math.random()*5)*2-5;
  const e = Math.floor(Math.random()*50)*2-50;
  const c = Math.floor(Math.random()*100)-50;
  const f = Math.floor(Math.random()*10);
  expect(moveDir([e+d,c+f],[e,c])).toBe("left");
});

