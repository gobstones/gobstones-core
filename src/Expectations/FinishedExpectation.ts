/**
 * @module Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { IFinishedExpectation } from './Interfaces';

/**
 * This abstract class provides finished expectation behavior for
 * all actions based on the fact that it's subclass provides
 * an implementation for {@link getResult}.
 *
 * @group Helper classes and interfaces
 */
export abstract class FinishedExpectation implements IFinishedExpectation {
    /** @inheritDoc {@link IFinishedExpectation.orThrow} */
    public orThrow(error: Error): void {
        if (!this.getResult()) {
            throw error;
        }
    }

    /** @inheritDoc {@link IFinishedExpectation.orYield} */
    public orYield<T>(value: T): T | undefined {
        return !this.getResult() ? value : undefined;
    }

    /** @inheritDoc {@link IFinishedExpectation.andDoOr} */
    public andDoOr(actionWhenTrue: () => void, actionWhenFalse: () => void): void {
        if (this.getResult()) {
            actionWhenTrue();
        } else {
            actionWhenFalse();
        }
    }

    /** @inheritDoc {@link IFinishedExpectation.andDo} */
    public andDo(action: () => void): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        this.andDoOr(action, () => {});
    }

    /** @inheritDoc {@link IFinishedExpectation.orDo} */
    public orDo(action: () => void): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        this.andDoOr(() => {}, action);
    }

    /** @inheritDoc {@link IFinishedExpectation.getResult} */
    public abstract getResult(): boolean;
}
