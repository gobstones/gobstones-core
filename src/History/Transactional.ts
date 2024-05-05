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
/**
 * A {@link Transactional} is a data structure that changes over time, with the possibility
 * to group changes and later rollback those groups of changes as a whole.
 *
 * So, a "transaction" is a group of changes that can be undone all together.
 * The operation {@link startTransaction} initiates the transaction, using the current value
 * as the initial value of the transaction, and changes made during the transaction can be
 * undone using {@link rollback}, which restore the initial value of the transaction, with
 * no further possibility to access the changes made during the transaction.
 * Thus, transactions behave as a stack, where only the last, active transaction can be
 * accessed.
 *
 * Information about the changes made during the active transaction can be accessed
 * using {@link numCurrentTransactionChanges} and {@link currentTransactionChanges}.
 * @group History
 */
export interface Transactional<A> {
    /**
     * Start a new transaction, using the last version of the value from the
     * previous transaction as the starting one of the new one.
     * Once a transaction is started, the other operations work relative to it --
     * the only way to access previous transactions is rolling back the current one.
     * @group API
     */
    startTransaction(): void;
    /**
     * Roll back the current transaction undoing all the changes made in it.
     * After a transaction is rolled back, all the changes made in it are lost.
     * The current value after the rollback is the last value of the previous transaction,
     * or the initial value, if there is no transaction started.
     * @group API
     */
    rollback(): void;
    /**
     * Describes the number of changes made in the current transaction since it started.
     * @group API
     */
    numCurrentTransactionChanges(): number;
    /**
     * Describes the list of all values since the initial one in the transaction, and
     * the resulting after each of the changes made in the current transaction since it started.
     * The first element is the one after the first change on the initial value, and the last
     * one is the more current one.
     * @group API
     */
    currentTransactionChanges(): A[];
}
