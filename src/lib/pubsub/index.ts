import { TOPICS } from "./topics";

interface Listener<T extends {name: string, params: any[]}> {
  (...args: T["params"]): void;
}

export default class PubSub {
  private readonly _topics: { [K in  keyof TOPICS]?: Listener<TOPICS[K]>[] } = {};

  constructor() {
    this._topics = {};
  }

  subscribe<K extends keyof TOPICS>(topic: K, listener: Listener<TOPICS[K]>) {
    if (!this._topics[topic]) this._topics[topic] = [];

    // @ts-ignore
    const index = this._topics[topic].push(listener) - 1;

    return {
      remove: () => {
        // @ts-ignore
        delete this._topics[topic][index];
      }
    };
  }

  publish<K extends keyof TOPICS>(topic: K, ...info: TOPICS[K]["params"]) {
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if (!this._topics[topic]) return;

    // Cycle through topics queue, fire!
    // @ts-ignore
    this._topics[topic].forEach((handler: Listener<TOPICS[K]>) => {
      handler(...info);
    });
  }
}
