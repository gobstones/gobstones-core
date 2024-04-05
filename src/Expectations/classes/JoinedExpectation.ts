/**
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { AbstractFinishedExpectation } from './AbstractFinishedExpectation';

import { FinishedExpectation } from '../interfaces';

/**
 * A joined expectation consist of multiple expectations joined by a specific
 * joiner function. A JoinedExpectation implements {@link AbstractFinishedExpectation},
 * where the result is calculated using the given joiner function.
 *
 * Currently two join forms are provided, {@link Expectations!and},
 * and {@link Expectations!or}.
 *
 * @group API: Types
 */
export class JoinedExpectation extends AbstractFinishedExpectation {
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
    public constructor(expectations: FinishedExpectation[], joiner: (expectations: FinishedExpectation[]) => boolean) {
        super();
        this.result = joiner(expectations);
    }

    /** @inheritDoc {@link Expectations!IFinishedExpectancy.getResult} */
    public getResult(): boolean {
        return this.result;
    }
}
