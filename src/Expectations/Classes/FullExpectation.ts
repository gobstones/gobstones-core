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
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractFinishedExpectation } from './AbstractFinishedExpectation';

import {
    ArrayExpectation,
    FinishedExpectation,
    NumberExpectation,
    ObjectExpectation,
    StringExpectation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Expectation
} from '../Interfaces';
import { MatcherCall, Matchers } from '../Matchers';

/**
 * The expectation class is the class that is actually instantiated for
 * any expectation. It implements all interfaces for expectations, even
 * the finished expectation ones.
 *
 * @group Internal: Types
 */
export class FullExpectation<T> extends AbstractFinishedExpectation {
    // -----------------------------------------------
    // #region Internal: Properties
    // -----------------------------------------------
    /**
     * The querying element of this expectation.
     */
    protected element: any;
    /**
     * The current result of this expectation. Undefined until
     * the first matcher is run.
     */
    protected result: boolean | undefined;
    /**
     * true if this expectation is a negated expectation, that is,
     * the `not` property was accessed.
     */
    protected isNot: boolean;
    /**
     * An array of the matchers run in this expectation.
     */
    protected states: MatcherCall[];
    // -----------------------------------------------
    // #endregion Internal: Properties
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Internal: Constructors
    // -----------------------------------------------
    /**
     * Create a new expectation for the given element.
     *
     * @param element The element to query to.
     */
    public constructor(element: any) {
        super();
        this.states = [];
        this.element = element;
        this.isNot = false;
        this.result = undefined;
    }
    // -----------------------------------------------
    // #endregion Internal: Constructors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region IGenericExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link Expectation.not} */
    public get not(): FullExpectation<T> {
        this.isNot = !this.isNot;
        return this;
    }

    /** @inheritDoc {@link Expectation.toBe} */
    public toBe(value: any): this & FinishedExpectation {
        return this.runMatcher('toBe', [value]);
    }

    /** @inheritDoc {@link Expectation.toBeLike} */
    public toBeLike(value: any): this & FinishedExpectation {
        return this.runMatcher('toBeLike', [value]);
    }

    /** @inheritDoc {@link Expectation.toBeNull} */
    public toBeNull(): this & FinishedExpectation {
        return this.runMatcher('toBeNull', []);
    }

    /** @inheritDoc {@link Expectation.toBeDefined} */
    public toBeDefined(): this & FinishedExpectation {
        return this.runMatcher('toBeDefined', []);
    }

    /** @inheritDoc {@link Expectation.toBeUndefined} */
    public toBeUndefined(): this & FinishedExpectation {
        return this.runMatcher('toBeUndefined', []);
    }

    /** @inheritDoc {@link Expectation.toBeTruthy} */
    public toBeTruthy(): this & FinishedExpectation {
        return this.runMatcher('toBeTruthy', []);
    }

    /** @inheritDoc {@link Expectation.toBeFalsy} */
    public toBeFalsy(): this & FinishedExpectation {
        return this.runMatcher('toBeFalsy', []);
    }

    /** @inheritDoc {@link Expectation.toHaveType} */
    public toHaveType(typeName: string): this & FinishedExpectation {
        return this.runMatcher('toHaveType', [typeName]);
    }

    /* istanbul ignore next */
    /** @inheritDoc {@link Expectation.asNumber} */
    public asNumber(): NumberExpectation {
        return this as NumberExpectation;
    }

    /* istanbul ignore next */
    /** @inheritDoc {@link Expectation.asString} */
    public asString(): StringExpectation {
        return this as StringExpectation;
    }

    /* istanbul ignore next */
    /** @inheritDoc {@link Expectation.asObject} */
    public asObject<E>(): ObjectExpectation<E> {
        return this as unknown as ObjectExpectation<E>;
    }

    /* istanbul ignore next */
    /** @inheritDoc {@link Expectation.asArray} */
    public asArray<E>(): ArrayExpectation<E> {
        return this as unknown as ArrayExpectation<E>;
    }
    // -----------------------------------------------
    // #endregion IGenericExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region IBooleanExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link Expectation.toBeTruthy} */
    public toBeTrue(): this & FinishedExpectation {
        return this.runMatcher('toBeTrue', []);
    }

    /** @inheritDoc {@link Expectation.toBeFalsy} */
    public toBeFalse(): this & FinishedExpectation {
        return this.runMatcher('toBeFalse', []);
    }
    // -----------------------------------------------
    // #endregion IBooleanExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region INumberExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link NumberExpectation.toBeGreaterThan} */
    public toBeGreaterThan(value: number): this & FinishedExpectation {
        return this.runMatcher('toBeGreaterThan', [value]);
    }

    /** @inheritDoc {@link NumberExpectation.toBeGreaterThanOrEqual} */
    public toBeGreaterThanOrEqual(value: number): this & FinishedExpectation {
        return this.runMatcher('toBeGreaterThanOrEqual', [value]);
    }

    /** @inheritDoc {@link NumberExpectation.toBeLowerThan} */
    public toBeLowerThan(value: number): this & FinishedExpectation {
        return this.runMatcher('toBeLowerThan', [value]);
    }

    /** @inheritDoc {@link NumberExpectation.toBeLowerThanOrEqual} */
    public toBeLowerThanOrEqual(value: number): this & FinishedExpectation {
        return this.runMatcher('toBeLowerThanOrEqual', [value]);
    }

    /** @inheritDoc {@link NumberExpectation.toBeBetween} */
    public toBeBetween(from: number, to: number): this & FinishedExpectation {
        return this.runMatcher('toBeBetween', [from, to]);
    }

    /** @inheritDoc {@link NumberExpectation.toBeInfinity} */
    public toBeInfinity(): this & FinishedExpectation {
        return this.runMatcher('toBeInfinity', []);
    }

    /** @inheritDoc {@link NumberExpectation.toBeNaN} */
    public toBeNaN(): this & FinishedExpectation {
        return this.runMatcher('toBeNaN', []);
    }

    /** @inheritDoc {@link NumberExpectation.toBeCloseTo} */
    public toBeCloseTo(value: number, digits: number = 5): this & FinishedExpectation {
        return this.runMatcher('toBeCloseTo', [value, digits]);
    }
    // -----------------------------------------------
    // #endregion INumberExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region IStringExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link StringExpectation.toHaveSubstring} */
    public toHaveSubstring(substring: string): this & FinishedExpectation {
        return this.runMatcher('toHaveSubstring', [substring]);
    }

    /** @inheritDoc {@link StringExpectation.toStartWith} */
    public toStartWith(start: string): this & FinishedExpectation {
        return this.runMatcher('toStartWith', [start]);
    }

    /** @inheritDoc {@link StringExpectation.toEndWith} */
    public toEndWith(end: string): this & FinishedExpectation {
        return this.runMatcher('toEndWith', [end]);
    }

    /** @inheritDoc {@link StringExpectation.toMatch} */
    public toMatch(regexp: RegExp): this & FinishedExpectation {
        return this.runMatcher('toMatch', [regexp]);
    }
    // -----------------------------------------------
    // #endregion IStringExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region IArrayExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link ArrayExpectation.toBeEmptyArray} */
    public toBeEmptyArray(count: number): this & FinishedExpectation {
        return this.runMatcher('toBeEmptyArray', [count]);
    }
    /** @inheritDoc {@link ArrayExpectation.toHaveLength} */
    public toHaveLength(count: number): this & FinishedExpectation {
        return this.runMatcher('toHaveLength', [count]);
    }
    /** @inheritDoc {@link ArrayExpectation.toContain} */
    public toContain(value: T): this & FinishedExpectation {
        return this.runMatcher('toContain', [value]);
    }
    /** @inheritDoc {@link ArrayExpectation.toHaveAtPosition} */
    public toHaveAtPosition(value: T, position: number): this & FinishedExpectation {
        return this.runMatcher('toHaveAtPosition', [value, position]);
    }
    /** @inheritDoc {@link ArrayExpectation.allToSatisfy} */
    public allToSatisfy(criteria: (item: T) => boolean): this & FinishedExpectation {
        return this.runMatcher('allToSatisfy', [criteria]);
    }
    /** @inheritDoc {@link ArrayExpectation.anyToSatisfy} */
    public anyToSatisfy(criteria: (item: T) => boolean): this & FinishedExpectation {
        return this.runMatcher('anyToSatisfy', [criteria]);
    }
    /** @inheritDoc {@link ArrayExpectation.amountToSatisfy} */
    public amountToSatisfy(count: number, criteria: (item: T) => boolean): this & FinishedExpectation {
        return this.runMatcher('amountToSatisfy', [count, criteria]);
    }
    // -----------------------------------------------
    // #endregion IArrayExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region IObjectExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link ObjectExpectation.toBeEmptyObject} */
    public toBeEmptyObject(count: number): this & FinishedExpectation {
        return this.runMatcher('toBeEmptyObject', [count]);
    }
    /** @inheritDoc {@link ObjectExpectation.toHavePropertyCount} */
    public toHavePropertyCount(count: number): this & FinishedExpectation {
        return this.runMatcher('toHavePropertyCount', [count]);
    }
    /** @inheritDoc {@link ObjectExpectation.toHaveAtLeast} */
    public toHaveAtLeast(keys: string[]): this & FinishedExpectation {
        return this.runMatcher('toHaveAtLeast', keys, false);
    }
    /** @inheritDoc {@link ObjectExpectation.toHaveNoOtherThan} */
    public toHaveNoOtherThan(keys: string[]): this & FinishedExpectation {
        return this.runMatcher('toHaveNoOtherThan', keys, false);
    }
    /** @inheritDoc {@link ObjectExpectation.toHaveProperty} */
    public toHaveProperty(propertyName: string): this & FinishedExpectation {
        return this.runMatcher('toHaveProperty', [propertyName]);
    }
    /** @inheritDoc {@link ObjectExpectation.toBeInstanceOf} */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public toBeInstanceOf(classConstructor: Function): this & FinishedExpectation {
        return this.runMatcher('toBeInstanceOf', [classConstructor]);
    }
    // -----------------------------------------------
    // #endregion IObjectExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region IFinishedExpectation implementors
    // -----------------------------------------------
    /** @inheritDoc {@link FinishedExpectation.getResult} */
    public getResult(): boolean {
        return this.result || false;
    }
    // -----------------------------------------------
    // #endregion IFinishedExpectation implementors
    // -----------------------------------------------

    // -----------------------------------------------
    // #region Internal: Helpers
    // -----------------------------------------------
    /**
     * Set the given value as the result of this
     * expectation. The result is directly set, when
     * no previous result existed, or joined with a
     * logic conjunction with the previous result if
     * a value already exists.
     *
     * @value The value to set.
     */
    protected setResult(value: boolean): void {
        if (this.result === undefined) {
            this.result = value;
        } else {
            this.result = this.result && value;
        }
    }

    /**
     * Run a matcher with the given name, passing the
     * querying element as a first argument, and all additional
     * given arguments. The result of running the matcher is stores,
     * and a new state is pushed to this particular matcher.
     *
     * @param matcherName The matcher name to run
     * @param args The arguments to pass to the matcher
     */
    protected runMatcher(matcherName: string, args: any[], sparse: boolean = true): this {
        const matcherArgs = sparse ? [this.element, ...args] : [this.element, args];
        const matcherToCall = (Matchers as any)[matcherName] as any;
        const matcherResult = matcherToCall.call(this, ...matcherArgs);
        const result = this.isNot ? !matcherResult : matcherResult;
        this.states.push({
            matcher: matcherName,
            args,
            result
        });
        this.setResult(result);
        return this;
    }
    // -----------------------------------------------
    // #endregion Internal: Helpers
    // -----------------------------------------------
}
