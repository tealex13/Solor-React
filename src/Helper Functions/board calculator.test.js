import React from "react";

import {dist} from "./board calculator";

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