// Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { allLessons, courses, getCourse, nextLesson, progressPercent } from "./courses.ts";
import { certificateCode } from "./mux.ts";

const course = getCourse("brow-architecture")!;
const ids = allLessons(course).map((l) => l.id);

test("lesson ids are unique inside a course", () => {
  for (const c of courses) {
    const list = allLessons(c).map((l) => l.id);
    assert.equal(new Set(list).size, list.length, c.slug);
  }
});

test("progress runs 0 to 100 and rounds", () => {
  assert.equal(progressPercent(course, new Set()), 0);
  assert.equal(progressPercent(course, new Set(ids)), 100);
  assert.equal(progressPercent(course, new Set(ids.slice(0, 4))), 50);
  // Ids from another course must not count towards this one.
  assert.equal(progressPercent(course, new Set(["anatomy", "adhesive"])), 0);
});

test("resume points at the first unfinished lesson", () => {
  assert.equal(nextLesson(course, new Set()).id, ids[0]);
  assert.equal(nextLesson(course, new Set(ids.slice(0, 3))).id, ids[3]);
  // A finished course still has somewhere to land.
  assert.equal(nextLesson(course, new Set(ids)).id, ids[0]);
});

test("certificate codes are stable and distinct per enrollment", () => {
  const a = certificateCode("11111111-1111-4111-8111-111111111111");
  assert.equal(a, certificateCode("11111111-1111-4111-8111-111111111111"));
  assert.notEqual(a, certificateCode("22222222-2222-4222-8222-222222222222"));
  assert.match(a, /^[0-9A-F]{12}$/);
});

test("every free preview lesson sits in the first module", () => {
  for (const c of courses) {
    const free = allLessons(c).filter((l) => l.free);
    assert.ok(free.length >= 1, c.slug);
    assert.ok(free.every((l) => l.moduleId === c.modules[0].id), c.slug);
  }
});
