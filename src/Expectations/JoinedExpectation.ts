/**
 * @module Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { FinishedExpectation } from './FinishedExpectation';
import { IFinishedExpectation } from './Interfaces';

/**
 * A joined expectation consist of multiple expectations joined by a specific
 * joiner function. A JoinedExpectation implements {@link FinishedExpectation},
 * where the result is calculated using the given joiner function.
 *
 * Currently two join forms are provided, {@link Expectations!and},
 * and {@link Expectations!or}.
 *
 * @group Helper classes and interfaces
 */
export class JoinedExpectation extends FinishedExpectation {
    /**
     * The result of a joined expectation, set at construction time.
     */
    private result: boolean;

    /**
     * Create a new instance of a JoinedExpectation for the given set
     * of expectations, using the provided joiner.
     *
     * @param expectations The expectations that ought to be joined.
     * @param joiner The joiner to use to calculate the result.
     */
    public constructor(
        expectations: IFinishedExpectation[],
        joiner: (expectations: IFinishedExpectation[]) => boolean
    ) {
        super();
        this.result = joiner(expectations);
    }

    /** @inheritDoc {@link Expectations!IFinishedExpectancy.getResult} */
    public getResult(): boolean {
        return this.result;
    }
}
