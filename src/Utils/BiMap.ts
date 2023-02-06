/* eslint-disable no-underscore-dangle */
/**
 * A bidirectional map is a map that represents biyective association between keys and values, and
 * such that it can be accessed both by the keys or by the values. The types of both the keys and
 * the values should be comparable by identity (`===` comparison).
 *
 * See the documentation for the class {@link BiMap} for details.
 * @module BiMap
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/** A bidirectional map is a map that represents biyective association between keys and values, and
 * such that it can be accessed both by the keys or by the values. The types of both the keys and
 * the values should be comparable by identity (`===` comparison).
 * The order of association is important, so for example a `BiMap<string, number>` strings can be
 * accessed by value using numbers, and numbers can accessed by key using strings,.
 *
 * The API of BiMaps resembles that of a Map, but with two versions for each operation involving
 * keys or values.
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
 */
export class BiMap<K, V> {
    // #region Private elements
    /** The implementation of a BiMap is given by two synchronized maps: a straight one, from keys
     * to values, and a reversed one, from values to keys.
     * These maps satisfy the invariant that every association in one of them has its reversed
     * counterpart in the other one.
     * The auxiliary operations take care of keeping the invariant, by allowing the deletion of a
     * given key or value in the map where they are values, if they appear there, and the
     * association of a new pair key-value, deleting the old associations for both, if they exist.
     * @group Implementation: Summary
     */
    private static _implementationDetails = 'Dummy for documentation';
    /** The map from key to values.
     *
     * **INVARIANT:** for any key `k` associated with a value `v` in this map,
     *                `v` is a key in `_mapVK` with value `k`.
     * @group Implementation: State
     * @private
     */
    private _mapKV: Map<K, V>;
    /** The map from values to keys.
     *
     * **INVARIANT:** for any key `v` associated with a value `k` in this map,
     *                `k` is a key in `_mapKV` with value `v`.
     * @group Implementation: State
     * @private
     */
    private _mapVK: Map<V, K>;
    // #endregion

    // #region API
    /** It creates a new BiMap associating keys to values biyectively.
     *
     * An optional list of pairs key-value can be used for initialization, but if some values are
     * associated to more than one key (that is, the relationship is not biyective, information is
     * lost -- only the last value is associated, so the list order is relevant.
     *
     * Examples:
     *   ```
     *     new BiMap([['A', 1],['B',2]])                 -> { 'A' <-> 1, 'B' <-> 2 }
     *     new BiMap([['A', 1],['B',1]])                 -> { 'B' <-> 1 }
     *     new BiMap([['B', 1],['A',1]])                 -> { 'A' <-> 1 }
     *     new BiMap([['A', 1],['B',1],['B',2]])         -> { 'B' <-> 2 }
     *     new BiMap([['A', 1],['B',1],['B',2],['C',2]]) -> { 'C' <-> 2 }
     *   ```
     * @group API: Creation
     */
    public constructor(map?: [K, V][]) {
        this._mapKV = new Map<K, V>();
        this._mapVK = new Map<V, K>();
        for (const [key, value] of map || []) {
            this._biassociateKeyAndValue(key, value);
        }
    }

    /** It returns the number of associations this BiMap kept.
     * @group API: Access
     */
    public get size(): number {
        return this._mapKV.size;
        // By the invariants, `_mapVK.size` is the same number.
    }

    /** It deletes all associations in this BiMap.
     * @group API: Modification
     */
    public clear(): void {
        this._mapKV.clear();
        this._mapVK.clear();
    }

    /** It indicates if this BiMap has the given key associated with a value.
     * @group API: Access
     * @param key The key to search
     */
    public hasKey(key: K): boolean {
        return !!this._mapKV.has(key); // !! transforms falsy values into booleans
    }

    /** It retrieves the value associated with the given key in this BiMap.
     *  It returns undefined if the key is not associated with any value.
     * @group API: Access
     * @param key The key to retrieve the associated value
     */
    public getByKey(key: K): V | undefined {
        return this._mapKV.get(key);
    }

    /** It associates the given key to the given value in this BiMap.
     * If any of both have previous associations, they are lost.
     * @group API: Modification
     * @param key The key to associate with the value
     * @param value The value to associate with the key
     */
    public setByKey(key: K, value: V): void {
        this._biassociateKeyAndValue(key, value);
    }

    /** It deletes the association between the given key and its value, if it exists.
     * @group API: Modification
     * @param key The key to delete its association
     */
    public deleteByKey(key: K): void {
        this._revDeleteKey(key);
        this._mapKV.delete(key);
    }

    /** It returns an iterator for the keys of this BiMap.
     * @group API: Access
     */
    public keys(): Iterable<K> {
        return this._mapKV.keys();
    }

    /** It indicates if this BiMap has the given value associated with a key.
     * @group API: Access
     * @param value The value to search
     */
    public hasValue(value: V): boolean {
        return !!this._mapVK.has(value); // !! transforms falsy values into booleans
    }

    /** It retrieves the key associated with the given value in this BiMap.
     *  It returns undefined if the value is not associated with any key.
     * @group API: Access
     * @param value The value to retrieve the associated key
     */
    public getByValue(value: V): K | undefined {
        return this._mapVK.get(value);
    }

    /** It associates the given value to the given key in this BiMap.
     * If any of both have previous associations, they are lost.
     * @group API: Modification
     * @param value The value to associate with the key
     * @param key The key to associate with the value
     */
    public setByValue(value: V, key: K): void {
        this._biassociateKeyAndValue(key, value);
    }

    /** It deletes the association between the given key and its value, if it exists.
     * @group API: Modification
     * @param value The value to delete its association.
     */
    public deleteByValue(value: V): void {
        this._revDeleteValue(value);
        this._mapVK.delete(value);
    }

    /** It returns an iterator for the values of this BiMap.
     * @group API: Access
     */
    public values(): Iterable<V> {
        return this._mapVK.keys();
    }

    /** It returns an iterator for the entries of this BiMap.
     * @group API: Access
     */
    public entries(): Iterable<[K, V]> {
        return this._mapKV.entries();
    }

    /** It returns string version of this BiMap.
     * @group API: Access
     */
    public toString(): string {
        let str: string = 'BiMap:{ ';
        for (const k of this._mapKV.keys()) {
            str += k + ' <-> ' + this._mapKV.get(k) + ', ';
        }
        // Replace the last comma with '}', if it exists
        return (
            (str[str.length - 2] === ',' && str[str.length - 1] === ' '
                ? str.slice(0, str.length - 2)
                : str) + ' }'
        );
    }
    // #endregion

    // #region Implementation: Auxiliaries
    /** It implements the association of a key-value pair biyectively, deleting the old associations
     * between both the key and the value given.
     * @group Implementation: Auxiliaries
     */
    private _biassociateKeyAndValue(key: K, value: V): void {
        this._revDeleteKey(key);
        this._revDeleteValue(value);
        this._mapKV.set(key, value);
        this._mapVK.set(value, key);
    }

    /** It deletes the occurrence of the given key as a value in the reversed map by retrieving
     * its value from the straight map, if it is associated.
     *
     *  It may left the BiMap inconsistent, so it MUST NOT be used by itself alone.
     * @group Implementation: Auxiliaries
     */
    private _revDeleteKey(key: K): void {
        const oldValue: V | undefined = this._mapKV.get(key);
        if (oldValue !== undefined) {
            this._mapVK.delete(oldValue);
        }
    }

    /** It deletes the occurrence of the given value in the straight map by retrieving its key from
     * the reversed map, if it is associated.
     *
     *  It may left the BiMap inconsistent, so it MUST NOT be used by itself alone.
     * @group Implementation: Auxiliaries
     */
    private _revDeleteValue(value: V): void {
        const oldKey: K | undefined = this._mapVK.get(value);
        if (oldKey !== undefined) {
            this._mapKV.delete(oldKey);
        }
    }
    // #endregion
}
