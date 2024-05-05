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
/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 *
 * Additional terms added in compliance to section 7 of such license apply.
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * This module exports the {@link expect} function, that is the kickoff to
 * create "expectations" over a specific element as shown in the following
 * example:
 *
 * @example
```
expect(x+y).toBeGreaterThan(z)
    .orThrow(new Error('x and y need to add up to more than z'));
```
 *
 * The {@link expect} function expects to receive a single argument of any type.
 * Given that element a new "expectation" is returned, whose specific type depends
 * of the type of the element given to expect as an argument. So `expect(x)`
 * returns an expectation. An expectation is an object that accepts any number of
 * matchers to be called upon it, such as `toBe`, `toBeGreaterThan`, `toHaveLength`
 * and so on. The specific set of matchers available depends on the type of the
 * expectation, which, as said, depends on the type of the argument given to
 * expect.
 *
 * When a matcher is called, the element given to expect is passed to the
 * {@link Matchers} as the actual value, where the additional arguments over the
 * matcher are the arguments given to the matcher method called, so for example,
 * `expect(x).toBe(y)` calls the {@link Matchers.toBe} with `x` as `actual` argument
 * and `y` as `expected` argument.
 *
 * Once the first matcher is called over an expectation, a {@link FinishedExpectation}
 * is obtained. A finished matcher has a result, that may be one of `true`
 * (if the matcher was satisfied) or `false` if not. A finished matcher may be
 * queried for the result, by calling {@link FinishedExpectation.getResult | getResult},
 * but additional helper methods are provided by the interface in order to fulfill
 * different needs, such as throwing an error if the expectation was not satisfied,
 * or calling a function if it was.
 *
 * New matchers may be called over a finished expectation, and the result of the
 * matcher would be calculated as an "and" over all the results. e.g.
 * `expect(x).toBeGreaterThan(y).toBeLowerThan(z)`. This creates a new expectations
 * that is satisfied only when both parts (x being greater than y, and x being
 * lower than z) are true. This itself returns a new {@link FinishedExpectation},
 * that can be extended with new matchers, or queried about the results as
 * previously mentioned.
 *
 * To see a list of all matchers, read the {@link expect} documentation, and the
 * {@link Matchers} documentation.
 *
 * @module API.Expectations
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
export * from './expect';
