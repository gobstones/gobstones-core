/**
 * @module API.Events
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

/**
 * This type describes the basic mapping of available events to the
 * corresponding subscriber functions that may subscribe to such event.
 * Multiple events could be added, with different signatures for each
 * subscriber.
 *
 * @group Internal: Types
 */
export type EventSignature<L> = {
    [E in keyof L]: (...args: any[]) => any;
};

/**
 * This type is a specification of {@link EventSignature} where each
 * event is key is a string (the most common case), and the subscriber
 * functions are any function. This is the default behavior of most
 * JavaScript event emitter, and the DOM event's signature.
 *
 * @group Internal: Types
 */
export type DefaultEventSignature = {
    [k: string]: (...args: any[]) => any;
};

/**
 * The EventEmitter class is a minimal observer pattern class definition.
 * Instances of this class can be created directly, by `new EventEmitter()`
 * or it can be used as a base class for custom definitions that require
 * support for this pattern in order to allow subscription to custom events.
 *
 * The EventEmitter accepts as a type as a {@link EventSignature}, that is,
 * a set of event names together with the expected parameters that the observer
 * will be called with when the event occurs.
 *
 * @group API: Main
 */
export class EventEmitter<L extends EventSignature<L> = DefaultEventSignature> {
    /** A map of event to observers for the full time observers. */
    private eventObservers: Map<keyof L, Set<L[keyof L]>> = new Map();

    /** A map of event to observers for the one time observers. */
    private eventOnceObservers: Map<keyof L, Set<L[keyof L]>> = new Map();

    /**
     * Register a observer to a particular event of this event emitter, as a
     * one time observer, that is, it will be called on the next emit of the
     * event, but not on the following emits of such event.
     *
     * If the observer is already present as a one time observer, it will remain
     * as a one time observer. If it's a full time observer, it will be transformed
     * to a one time observer.
     *
     * @param event The event that the observer will be registered to.
     * @param observer The observer that will be called when the event occurs.
     *
     * @returns The event emitter.
     */
    public once<U extends keyof L>(event: U, observer: L[U]): this {
        this.removeOfMap(event, observer, this.eventObservers);
        this.appendToMap(event, observer, this.eventOnceObservers);
        return this;
    }

    /**
     * Register a observer to a particular event of this event emitter, as a
     * full time observer, that is, it will be called on the next emit of the
     * event, and on all the following emits of such event.
     *
     * If the observer is already present as a full time observer, it will remain
     * as a full time observer. If it's a one time observer, it will be transformed
     * to a full time observer.
     *
     * @param event The event that the observer will be registered to.
     * @param observer The observer that will be called when the event occurs.
     *
     * @returns The event emitter.
     */
    public on<U extends keyof L>(event: U, observer: L[U]): this {
        this.removeOfMap(event, observer, this.eventOnceObservers);
        this.appendToMap(event, observer, this.eventObservers);
        return this;
    }

    /**
     * Remove an observer from a particular event of this event emitter. That is
     * make the observer not to be called on future emits.
     * If the observer is registered as a one time observer or as a full time
     * observer is not relevant, it's removed anyhow. If an observer that is not
     * registered is given, nothing happens, and no error is thrown.
     *
     * Note that the observer is removed only to the specified event, and such
     * it may still be registered for other events.
     *
     * @param event The event that the observer will be removed from.
     * @param observer The observer that will be removed when the event occurs.
     *
     * @returns The event emitter.
     */
    public off<U extends keyof L>(event: U, observer: L[U]): this {
        this.removeOfMap(event, observer, this.eventObservers);
        this.removeOfMap(event, observer, this.eventOnceObservers);
        return this;
    }

    /**
     * Remove all observers to a given event. That is, no observers will be
     * called when the event is emitted. Wether the observers were one time
     * observers or full time observers is irrelevant, they are removed anyhow.
     *
     * Event if all observers are removed, an observer may subscribe again to
     * the event afterwards.
     *
     * @param event The event that the observers will be removed from.
     *
     * @returns The event emitter.
     */
    public allOff<U extends keyof L>(event: U): this {
        this.deleteEntriesInMap(event, this.eventObservers);
        this.deleteEntriesInMap(event, this.eventOnceObservers);
        return this;
    }

    /**
     * Emit a particular event, calling all the observers that were registered to
     * such event in the process, wether they were one time subscribers or
     * full time subscribers.
     *
     * After the emission, one time subscribers are removed as subscribers to the
     * event, as they should not be called again.
     *
     * @param event The event to emit.
     */
    public emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): void {
        for (const observer of this.getSetOrEmpty(event, this.eventObservers)) {
            observer(...args);
        }
        for (const observer of this.getSetOrEmpty(event, this.eventOnceObservers)) {
            observer(...args);
        }
        this.deleteEntriesInMap(event, this.eventOnceObservers);
    }

    /**
     * Add a particular observer to an event in the given map.
     * If the event does not exists in the map, create it. If it does, add
     * only the new observer. If the observer is already present for that
     * event in the given map, do nothing.
     *
     * @param event The event to add the observer to.
     * @param observer The observer to add.
     * @param map The map to register the event and observer.
     */
    private appendToMap<U extends keyof L>(event: U, observer: L[U], map: Map<U, Set<L[U]>>): void {
        if (map.has(event)) {
            const set = map.get(event);
            set?.add(observer);
        } else {
            const set = new Set<L[U]>();
            set.add(observer);
            map.set(event, set);
        }
    }

    /**
     * Remove a particular observer from an event in the given map.
     * If the observer does not exists in the event for the map, or the event
     * is not present in the map, do nothing.
     *
     * @param event The event to remove the observer from.
     * @param observer The observer to be removed.
     * @param map The map to unregister the event and observer.
     */
    private removeOfMap<U extends keyof L>(event: U, observer: L[U], map: Map<U, Set<L[U]>>): void {
        const set = this.getSetOrEmpty(event, map);
        set.delete(observer);
    }

    /**
     * Remove all entries for an event in the given map. That is, remove the event
     * itself.
     *
     * @param event The event to remove.
     * @param map The map to remove the event from.
     */
    private deleteEntriesInMap<U extends keyof L>(event: U, map: Map<U, Set<L[U]>>): void {
        if (map.has(event)) {
            map.delete(event);
        }
    }

    /**
     * Return a set for the given event. If the event exists in the given map,
     * return the set of that event. If not, return a new set.
     *
     * @param event The event to obtain the set for.
     * @param map The map from where to grab the set from.
     *
     * @returns A set for the given event, a present one, or a new one.
     */
    private getSetOrEmpty<U extends keyof L>(event: U, map: Map<U, Set<L[U]>>): Set<L[U]> {
        if (map.has(event)) {
            return map.get(event) as Set<L[U]>;
        }
        return new Set<L[U]>();
    }
}
