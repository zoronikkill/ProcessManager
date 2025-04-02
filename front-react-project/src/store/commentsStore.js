import { createStore, createEvent } from "effector";

export const comment = createEvent();
export const $commentStore = createStore([]).on(comment, (state, newData) => [...state, newData]);
