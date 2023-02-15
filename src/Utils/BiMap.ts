/**
 * @module Utils
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * A bidirectional map is a map that represents biyective association between
 * keys and values, and such that it can be accessed both by the keys or by the
 * values. The types of both the keys and the values should be comparable by
 * identity (`===` comparison).
 *
 * The order of association is important, so for example a `BiMap<string, number>`
 * strings can be accessed by value using numbers, and numbers can accessed by
 * key using strings.
 *
 * The API of BiMaps resembles that of a Map, but with two versions for each
 * operation involving keys or values.
 *
 * The operations allow:
 *  * to create one BiMap, with `new BiMap` (and an optional list of pairs key-value for
 *    initialization -- if some values are associated to more than one key, information is lost),
 *  * to ask the number of associations kept by the map, with {@link BiMap.size | size},
 *  * to delete all associations at once, with {@link BiMap.clear | clear},
 *  * to check that a given key or value has been associated, with {@link BiMap.hasKey | hasKey} and
 *    {@link BiMap.hasValue | hasValue},
 *  * to retrieve the value or key associated with a given key or value, with
 *    {@link BiMap.getByKey | getByKey} and {@link BiMap.getByValue | getByValue},
 *  * to set a particular association between a key and a value, with
 *    {@link BiMap.setByKey | setByKey} and {@link BiMap.setByValue | setByValue} (these operations
 *    imply the other one, and also undo previous associations of the same key and value),
 *  * to unset a particular association between a key and a value, with
 *    {@link BiMap.deleteByKey | deleteByKey} and {@link BiMap.deleteByValue | deleteByValue} (these
 *    operations imply each other),
 *  * to produce iterators for the keys, the values, and the entries, with
 *    {@link BiMap.keys | keys}, {@link BiMap.values | values}, and {@link BiMap.entries | entries},
 *    and
 *  * to produce a string version of a BiMap, with {@link BiMap.toString | toString}.
 *
 * Instances of BiMap can be iterated directly through for-of loops, which
 * achieves the same result as iterating through the entries of such BiMap.
 *
 * #### Implementation details
 *
 * The implementation of a BiMap is given by two synchronized maps: a straight one, from keys
 * to values, and a reversed one, from values to keys.
 * These maps satisfy the invariant that every association in one of them has its reversed
 * counterpart in the other one.
 * The auxiliary operations take care of keeping the invariant, by allowing the deletion of a
 * given key or value in the map where they are values, if they appear there, and the
 * association of a new pair key-value, deleting the old associations for both, if they exist.
 *
 * @param K The type of the keys.
 * @param V The type of the values.
 */
export class BiMap<K, V> {
    /**
     * The map from key to values.
     *
     * **INVARIANT:** for any key `k` associated with a value `v` in this map,
     *                `v` is a key in `_mapVK` with value `k`.
     *
     * @private
     */
    private mapKV: Map<K, V>;

    /** The map from values to keys.
     *
     * **INVARIANT:** for any key `v` associated with a value `k` in this map,
     *                `k` is a key in `_mapKV` with value `v`.
     *
     * @private
     */
    private mapVK: Map<V, K>;

    /**
     * Create a new BiMap associating keys to values biyectively.
     *
     * An optional list of pairs key-value can be used for initialization, but
     * if some values are associated to more than one key (that is, the
     * relationship is not biyective, information is lost -- only the last value
     * is associated, so the list order is relevant.
     *
     * Examples:
     *   ```
     *     new BiMap([['A', 1],['B',2]])                 -> { 'A' <-> 1, 'B' <-> 2 }
     *     new BiMap([['A', 1],['B',1]])                 -> { 'B' <-> 1 }
     *     new BiMap([['B', 1],['A',1]])                 -> { 'A' <-> 1 }
     *     new BiMap([['A', 1],['B',1],['B',2]])         -> { 'B' <-> 2 }
     *     new BiMap([['A', 1],['B',1],['B',2],['C',2]]) -> { 'C' <-> 2 }
     *   ```
     *
     * @group Constructors
     * @param map Optional list of associations to contain in the new BiMap.
     */
    public constructor(map?: [K, V][]) {
        this.mapKV = new Map<K, V>();
        this.mapVK = new Map<V, K>();
        for (const [key, value] of map || []) {
            this.biassociateKeyAndValue(key, value);
        }
    }

    /**
     * Return the number of associations this BiMap has.
     *
     * @group Querying
     * @returns An integer with the number of associations in the map.
     */
    public get size(): number {
        return this.mapKV.size;
        // By the invariants, `mapVK.size` is the same number.
    }

    /**
     * Delete all associations in this BiMap.
     *
     * @group Manipulation
     */
    public clear(): void {
        this.mapKV.clear();
        this.mapVK.clear();
    }

    /**
     * Answer if this BiMap has the given key associated with a value.
     *
     * @group Querying
     * @param key The key to search
     * @returns true if the key is present, false otherwise.
     */
    public hasKey(key: K): boolean {
        return !!this.mapKV.has(key); // !! transforms falsy values into booleans
    }

    /**
     * Retrieve the value associated with the given key in this BiMap or
     * undefined if the key is not associated with any value.
     *
     * @group Querying
     * @param key The key to retrieve the associated value
     * @returns true if the key is present, false otherwise.
     */
    public getByKey(key: K): V | undefined {
        return this.mapKV.get(key);
    }

    /**
     * Associate the given key to the given value in this BiMap.
     * If any of both have previous associations, they are lost.
     *
     * @group Manipulation
     * @param key The key to associate with the value
     * @param value The value to associate with the key
     */
    public setByKey(key: K, value: V): void {
        this.biassociateKeyAndValue(key, value);
    }

    /**
     * Delete the association between the given key and its value, if it exists.
     *
     * @group Manipulation
     * @param key The key to delete its association
     */
    public deleteByKey(key: K): void {
        this.reverseDeleteKey(key);
        this.mapKV.delete(key);
    }

    /**
     * Answer if this BiMap has the given value associated with a key.
     *
     * @group Querying
     * @param value The value to search
     */
    public hasValue(value: V): boolean {
        return !!this.mapVK.has(value); // !! transforms falsy values into booleans
    }

    /**
     * Retrieve the key associated with the given value in this BiMap or
     * undefined if the value is not associated with any key.
     *
     * @group Querying
     * @param value The value to retrieve the associated key
     */
    public getByValue(value: V): K | undefined {
        return this.mapVK.get(value);
    }

    /**
     * Associate the given value to the given key in this BiMap.
     * If any of both have previous associations, they are lost.
     *
     * @group Manipulation
     * @param value The value to associate with the key
     * @param key The key to associate with the value
     */
    public setByValue(value: V, key: K): void {
        this.biassociateKeyAndValue(key, value);
    }

    /**
     * Delete the association between the given key and its value, if it exists.
     *
     * @group Manipulation
     * @param value The value to delete its association.
     */
    public deleteByValue(value: V): void {
        this.reverseDeleteValue(value);
        this.mapVK.delete(value);
    }

    /**
     * Return an iterator for the keys of this BiMap.
     *
     * @group Querying
     */
    public keys(): K[] {
        return [...this.mapKV.keys()];
    }

    /**
     * Return an iterator for the values of this BiMap.
     *
     * @group Querying
     */
    public values(): V[] {
        return [...this.mapVK.keys()];
    }

    /**
     * Return an iterator for the entries of this BiMap, from keys to values.
     *
     * @group Querying
     */
    public entries(): [K, V][] {
        return [...this.mapKV.entries()];
    }

    /**
     * Retrieve an iterator that can be used in a for-of loop.
     *
     * @group Querying
     */
    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        let counter = 0;
        const entries = this.entries();
        while (counter < entries.length) {
            yield entries[counter++];
        }
    }

    /**
     * Return a string representation of this BiMap.
     *
     * @group Printing
     */
    public toString(): string {
        let str: string = 'BiMap:{ ';
        const entries = this.entries();
        if (entries.length > 0) {
            let k: K;
            let v: V;
            for (let i = 0; i < entries.length - 1; i++) {
                [k, v] = entries[i];
                str += k + ' <-> ' + v + ', ';
            }
            [k, v] = entries[entries.length - 1];
            str += k + ' <-> ' + v + ' ';
        }
        str += '}';
        return str;
    }

    /**
     * Implement the association of a key-value pair biyectively, deleting the
     * old associations between both the key and the value given.
     *
     * @group Private
     */
    private biassociateKeyAndValue(key: K, value: V): void {
        this.reverseDeleteKey(key);
        this.reverseDeleteValue(value);
        this.mapKV.set(key, value);
        this.mapVK.set(value, key);
    }

    /**
     * Delete the occurrence of the given key as a value in the reversed map by
     * retrieving its value from the straight map, if it is associated.
     *
     * It may left the BiMap inconsistent, so it MUST NOT be used by itself alone.
     *
     * @group Private
     */
    private reverseDeleteKey(key: K): void {
        const oldValue: V | undefined = this.mapKV.get(key);
        if (oldValue !== undefined) {
            this.mapVK.delete(oldValue);
        }
    }

    /**
     * Delete the occurrence of the given value in the straight map by retrieving
     * its key from the reversed map, if it is associated.
     *
     * It may left the BiMap inconsistent, so it MUST NOT be used by itself alone.
     *
     * @group Private
     */
    private reverseDeleteValue(value: V): void {
        const oldKey: K | undefined = this.mapVK.get(value);
        if (oldKey !== undefined) {
            this.mapKV.delete(oldKey);
        }
    }
}
