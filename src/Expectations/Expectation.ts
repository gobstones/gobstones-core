/**
 * @module Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { MatcherCall, Matchers } from './Matchers';

import { FinishedExpectation } from './FinishedExpectation';
import { IFinishedExpectation } from './Interfaces';

/**
 * The expectation class is the class that is actually instantiated for
 * any expectation. It implements all interfaces for expectations, even
 * the finished expectation ones.
 *
 * @group Helper classes and interfaces
 */
export class Expectation<T> extends FinishedExpectation {
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

    /** @inheritDoc {@link IGenericExpectation.not} */
    public get not(): Expectation<T> {
        this.isNot = !this.isNot;
        return this;
    }

    /** @inheritDoc {@link IGenericExpectation.toBe} */
    public toBe(value: any): this & IFinishedExpectation {
        return this.runMatcher('toBe', [value]);
    }

    /** @inheritDoc {@link IGenericExpectation.toBeLike} */
    public toBeLike(value: any): this & IFinishedExpectation {
        return this.runMatcher('toBeLike', [value]);
    }

    /** @inheritDoc {@link IGenericExpectation.toBeNull} */
    public toBeNull(): this & IFinishedExpectation {
        return this.runMatcher('toBeNull', []);
    }

    /** @inheritDoc {@link IGenericExpectation.toBeDefined} */
    public toBeDefined(): this & IFinishedExpectation {
        return this.runMatcher('toBeDefined', []);
    }

    /** @inheritDoc {@link IGenericExpectation.toBeUndefined} */
    public toBeUndefined(): this & IFinishedExpectation {
        return this.runMatcher('toBeUndefined', []);
    }

    /** @inheritDoc {@link IGenericExpectation.toBeTruthy} */
    public toBeTruthy(): this & IFinishedExpectation {
        return this.runMatcher('toBeTruthy', []);
    }

    /** @inheritDoc {@link IGenericExpectation.toBeFalsy} */
    public toBeFalsy(): this & IFinishedExpectation {
        return this.runMatcher('toBeFalsy', []);
    }

    /** @inheritDoc {@link IGenericExpectation.toHaveType} */
    public toHaveType(typeName: string): this & IFinishedExpectation {
        return this.runMatcher('toHaveType', [typeName]);
    }

    // INumberExpectation

    /** @inheritDoc {@link INumberExpectation.toBeGreaterThan} */
    public toBeGreaterThan(value: number): this & IFinishedExpectation {
        return this.runMatcher('toBeGreaterThan', [value]);
    }

    /** @inheritDoc {@link INumberExpectation.toBeGreaterThanOrEqual} */
    public toBeGreaterThanOrEqual(value: number): this & IFinishedExpectation {
        return this.runMatcher('toBeGreaterThanOrEqual', [value]);
    }

    /** @inheritDoc {@link INumberExpectation.toBeLowerThan} */
    public toBeLowerThan(value: number): this & IFinishedExpectation {
        return this.runMatcher('toBeLowerThan', [value]);
    }

    /** @inheritDoc {@link INumberExpectation.toBeLowerThanOrEqual} */
    public toBeLowerThanOrEqual(value: number): this & IFinishedExpectation {
        return this.runMatcher('toBeLowerThanOrEqual', [value]);
    }

    /** @inheritDoc {@link INumberExpectation.toBeBetween} */
    public toBeBetween(from: number, to: number): this & IFinishedExpectation {
        return this.runMatcher('toBeBetween', [from, to]);
    }

    /** @inheritDoc {@link INumberExpectation.toBeInfinity} */
    public toBeInfinity(): this & IFinishedExpectation {
        return this.runMatcher('toBeInfinity', []);
    }

    /** @inheritDoc {@link INumberExpectation.toBeNaN} */
    public toBeNaN(): this & IFinishedExpectation {
        return this.runMatcher('toBeNaN', []);
    }

    /** @inheritDoc {@link INumberExpectation.toBeCloseTo} */
    public toBeCloseTo(value: number, digits: number = 5): this & IFinishedExpectation {
        return this.runMatcher('toBeCloseTo', [value, digits]);
    }

    // IStringExpectation

    /** @inheritDoc {@link IStringExpectation.toHaveSubstring} */
    public toHaveSubstring(substring: string): this & IFinishedExpectation {
        return this.runMatcher('toHaveSubstring', [substring]);
    }

    /** @inheritDoc {@link IStringExpectation.toStartWith} */
    public toStartWith(start: string): this & IFinishedExpectation {
        return this.runMatcher('toStartWith', [start]);
    }

    /** @inheritDoc {@link IStringExpectation.toEndWith} */
    public toEndWith(end: string): this & IFinishedExpectation {
        return this.runMatcher('toEndWith', [end]);
    }

    /** @inheritDoc {@link IStringExpectation.toMatch} */
    public toMatch(regexp: RegExp): this & IFinishedExpectation {
        return this.runMatcher('toMatch', [regexp]);
    }

    // IArrayExpectation

    /** @inheritDoc {@link IArrayExpectation.toHaveLength} */
    public toHaveLength(count: number): this & IFinishedExpectation {
        return this.runMatcher('toHaveLength', [count]);
    }
    /** @inheritDoc {@link IArrayExpectation.toContain} */
    public toContain(value: T): this & IFinishedExpectation {
        return this.runMatcher('toContain', [value]);
    }
    /** @inheritDoc {@link IArrayExpectation.toHaveAtPosition} */
    public toHaveAtPosition(value: T, position: number): this & IFinishedExpectation {
        return this.runMatcher('toHaveAtPosition', [value, position]);
    }
    /** @inheritDoc {@link IArrayExpectation.allToSatisfy} */
    public allToSatisfy(criteria: (item: T) => boolean): this & IFinishedExpectation {
        return this.runMatcher('allToSatisfy', [criteria]);
    }
    /** @inheritDoc {@link IArrayExpectation.anyToSatisfy} */
    public anyToSatisfy(criteria: (item: T) => boolean): this & IFinishedExpectation {
        return this.runMatcher('anyToSatisfy', [criteria]);
    }
    /** @inheritDoc {@link IArrayExpectation.amountToSatisfy} */
    public amountToSatisfy(
        count: number,
        criteria: (item: T) => boolean
    ): this & IFinishedExpectation {
        return this.runMatcher('amountToSatisfy', [count, criteria]);
    }

    // IObjectExpectation

    /** @inheritDoc {@link IObjectExpectation.toHavePropertyCount} */
    public toHavePropertyCount(count: number): this & IFinishedExpectation {
        return this.runMatcher('toHavePropertyCount', [count]);
    }
    /** @inheritDoc {@link IObjectExpectation.toHaveAtLeast} */
    public toHaveAtLeast(keys: string[]): this & IFinishedExpectation {
        return this.runMatcher('toHaveAtLeast', keys, false);
    }
    /** @inheritDoc {@link IObjectExpectation.toHaveNoOtherThan} */
    public toHaveNoOtherThan(keys: string[]): this & IFinishedExpectation {
        return this.runMatcher('toHaveNoOtherThan', keys, false);
    }
    /** @inheritDoc {@link IObjectExpectation.toHaveProperty} */
    public toHaveProperty(propertyName: string): this & IFinishedExpectation {
        return this.runMatcher('toHaveProperty', [propertyName]);
    }
    /** @inheritDoc {@link IObjectExpectation.toBeInstanceOf} */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public toBeInstanceOf(classConstructor: Function): this & IFinishedExpectation {
        return this.runMatcher('toBeInstanceOf', [classConstructor]);
    }

    // IFinishedExpectation

    /** @inheritDoc {@link IFinishedExpectation.getResult} */
    public getResult(): boolean {
        return this.result || false;
    }

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
}
