/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
import { Changeable } from './Changeable';
import { Compactable } from './Compactable';
import { Transactional } from './Transactional';
import { Undoable } from './Undoable';

/**
 * A basic implementation for the 3 interfaces giving a history.
 *
 * The interface for {@link Changeable} is used to register the changes over which the other
 * interfaces operate.
 *
 * The interface for {@link Compactable} has precedence over the others, thus
 * a {@link compact} undo all changes and all transactions, and {@link numAllChanges}
 * and {@link allChanges} inform of ALL changes, in all transactions.
 *
 * The interface for {@link Transactional} has precedence over the {@link Undoable}, thus
 * {@link undo}s can only undo changes in the current transaction -- to access previous
 * transactions, a {@link rollback} is needed.
 * @group History
 */
export class History<A> implements Changeable<A>, Compactable<A>, Undoable, Transactional<A> {
    // ====================================================
    // #region Implementation details {
    // ----------------------------------------------------
    /**
     * The implementation has two main groups of properties:
     * * those related to the changes, and
     * * those related to the transactions.
     *
     * The main property in the former group is the array of {@link _changes}.
     * It stores all the changes from all the transactions.
     * Other property in this group is the index of the change that
     * is considered the current version of the value, {@link _currentValueIndex}.
     *
     * The main property in the latter group, {@link _transactionOffset}, keeps in which
     * positions of the array of {@link _changes} is stored the initial value of each transaction.
     * The other property, {@link _currentTransaction}, indicates the active transaction.
     * Transactions operate as a stack, with the offset of the initial value of current transaction
     * stored as the last element in {@link _transactionOffset}.
     *
     * The difference between the {@link _currentValueIndex} and the offset of the initial value of
     * the current transaction indicates the number of possible undos in this transaction, and the
     * difference between that index and the number of changes indicates the number of possible redos.
     * To access changes of previous transactions the current transaction has to be rolled back, losing
     * its information.
     *
     * The representation invariants guarantee the coherence of the parameters with respect to this interpretation.
     *
     * **REPRESENTATION INVARIANTS:**
     * * `0 <= _currentTransactionIndex < _changes.length`
     * * for all `0 <= i < _transactionOffset.length`, `0 <= _transactionOffset[i] < _changes.length`
     * * `_transactionOffset[_currentTransaction] <= _currentChange < _changes.length`
     * * `_currentTransaction` elements are sorted (ascending)
     */
    // ----------------------------------------------------
    // #endregion } Implementation details
    // ====================================================

    // ====================================================
    // #region Internal properties {
    // ----------------------------------------------------
    /**
     * The array with all the changes registered through all transactions.
     * It is related to the {@link _currentValueIndex} property, that indicates which of its
     * elements is the current value.
     * @group Internal properties
     * @private
     */
    private _changes: A[];
    /**
     * An index to the array of {@link _changes} indicating which one is the current value.
     * It has the property of being between 0 and the number of changes minus 1
     * (see **REPRESENTATION INVARIANTS**).
     * @group Internal properties
     * @private
     */
    private _currentValueIndex: number;
    /**
     * An array indicating which of the elements of {@link _changes} is the initial
     * value of each registered transaction.
     * All its values are positive and less than the number of changes, so they really point
     * to {@link _changes} positions, and they are stored in sorted in ascending order,
     * because of the stack nature of transactions (see **REPRESENTATION INVARIANTS**).
     * @group Internal properties
     * @private
     */
    private _transactionOffset: number[];
    // ----------------------------------------------------
    // #endregion } Internal properties
    // ====================================================

    // ====================================================
    // #region API {
    // ----------------------------------------------------
    // #region API: Constructor {
    // ----------------------------------------------------
    /**
     * It creates a structure that is able to track the changes made to a certain
     * initial value, with the posibility to undo and redo the changes, and to access
     * the current version of it.
     * Also transactions can be started and rolled back, and all changes can be compacted.
     *
     * @param e the initial value of the history.
     */
    public constructor(e: A) {
        this._initializeWith(e);
    }
    // ----------------------------------------------------
    // #endregion } API: Constructor
    // ----------------------------------------------------
    // #region API: Change management {
    // ----------------------------------------------------
    /**
     * @inheritdoc
     */
    public currentValue(): A {
        return this._changes[this._currentValueIndex];
    }

    /**
     * @inheritdoc
     */
    public addChange(e: A): void {
        const size: number = this._changes.length;
        this._currentValueIndex++;
        if (this._currentValueIndex === size) {
            this._changes.push(e);
        } else {
            this._changes[this._currentValueIndex] = e;
            const newSize = this._currentValueIndex + 1;
            // After a change, all old redos are lost.
            this._changes.splice(newSize, size - newSize);
        }
    }
    // ----------------------------------------------------
    // #endregion } API: Change management
    // ----------------------------------------------------
    // #region API: Compacting operations {
    // ----------------------------------------------------
    /**
     * @inheritdoc
     */
    public compact(): void {
        this._initializeWith(this._changes[this._currentValueIndex]);
    }

    /**
     * @inheritdoc
     */
    public numAllChanges(): number {
        return this._currentValueIndex;
    }

    /**
     * @inheritdoc
     */
    public allChanges(): A[] {
        return this._changes.slice(0, this._currentValueIndex);
    }

    // ----------------------------------------------------
    // #endregion } API: Compacting operations
    // ----------------------------------------------------
    // #region API: Undoing operations {
    // ----------------------------------------------------
    /**
     * @inheritdoc
     */
    public undo(): void {
        if (this.numUndos() > 0) {
            this._currentValueIndex--;
        }
    }

    /**
     * @inheritdoc
     */
    public redo(): void {
        if (this.numRedos() > 0) {
            this._currentValueIndex++;
        }
    }

    /**
     * @inheritdoc
     */
    public numUndos(): number {
        return this._currentValueIndex - this._transactionOffset[this._transactionOffset.length - 1];
    }

    /**
     * @inheritdoc
     */
    public numRedos(): number {
        return this._changes.length - this._currentValueIndex - 1;
    }
    // ----------------------------------------------------
    // #endregion } Undoing operations
    // ----------------------------------------------------
    // #region Transaction management {
    // ----------------------------------------------------
    /**
     * @inheritdoc
     */
    public startTransaction(): void {
        this._transactionOffset.push(this._currentValueIndex);
    }

    /**
     * @inheritdoc
     */
    public rollback(): void {
        const currentTransaction = this._transactionOffset.length - 1;
        this._changes.splice(
            this._transactionOffset[currentTransaction] + 1,
            this._changes.length - this._transactionOffset[currentTransaction]
        );
        this._currentValueIndex = this._transactionOffset[currentTransaction];
        if (currentTransaction > 0) {
            this._transactionOffset.pop();
        }
    }

    /**
     * @inheritdoc
     */
    public numCurrentTransactionChanges(): number {
        return this._currentValueIndex - this._transactionOffset[this._transactionOffset.length - 1];
    }

    /**
     * @inheritdoc
     */
    public currentTransactionChanges(): A[] {
        return this._changes.slice(
            this._transactionOffset[this._transactionOffset.length - 1] + 1,
            this._currentValueIndex + 1
        );
    }
    // ----------------------------------------------------
    // #endregion } Transaction management
    // ----------------------------------------------------
    // #endregion } API
    // ====================================================

    // ====================================================
    // #region Auxiliaries {
    // ----------------------------------------------------
    /**
     * It initializes the different internal properties for the structure,
     * setting up the given element as the current version, with no changes
     * and no transactions.
     * It is supposed to be used at creation, and after a save.
     * @group Auxiliaries
     * @private
     */
    private _initializeWith(e: A): void {
        this._changes = [e];
        this._currentValueIndex = 0;
        this._transactionOffset = [this._currentValueIndex];
    }
    // ----------------------------------------------------
    // #endregion } Auxiliaries
    // ====================================================
}
