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
import { FinishedExpectation } from '../Interfaces';

/**
 * This abstract class provides finished expectation behavior for
 * all actions based on the fact that it's subclass provides
 * an implementation for {@link getResult}.
 *
 * @group Internal: Types
 */
export abstract class AbstractFinishedExpectation implements FinishedExpectation {
    /** @inheritDoc {@link FinishedExpectation.getResult} */
    public abstract getResult(): boolean;

    /** @inheritDoc {@link FinishedExpectation.orThrow} */
    public orThrow(error: Error): void {
        if (!this.getResult()) {
            throw error;
        }
    }

    /** @inheritDoc {@link FinishedExpectation.orYield} */
    public orYield<T>(value: T): T | undefined {
        return !this.getResult() ? value : undefined;
    }

    /** @inheritDoc {@link FinishedExpectation.andDoOr} */
    public andDoOr(actionWhenTrue: () => void, actionWhenFalse: () => void): void {
        if (this.getResult()) {
            actionWhenTrue();
        } else {
            actionWhenFalse();
        }
    }

    /** @inheritDoc {@link FinishedExpectation.andDo} */
    public andDo(action: () => void): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        this.andDoOr(action, () => {});
    }

    /** @inheritDoc {@link FinishedExpectation.orDo} */
    public orDo(action: () => void): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
        this.andDoOr(() => {}, action);
    }
}
