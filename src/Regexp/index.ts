/**
 * This module provides a set of common regular expressions that are useful
 * through the Gobstones Language environment, including but not limited to
 * regular expressions for valid identifiers. This considers all unicode cases,
 * and support languages that uses any latin scripting (english, spanish, french,
 * german and so on), cyrillic scripting (russian, ukranian and other slavic languages),
 * arab scripting (arabian, persian, thaana, etc.), hangul (corean), hiragana and
 * katakana characters (japanese), logograms for CJK languages (chinese characters,
 * japanese kanjis) and others.
 *
 * Some considerations follow:
 * * Identifiers in Gobstones were separated into lower identifiers (lowerId), that
 * is to say, words that start with a lowercase character, and upper identifiers,
 * that is, words that start with an uppercase character.
 * * The former has been extended here to support any scripting that distinguishes between
 * upper and lowercase forms
 * * For scripting that do not have casing, words starting with any character that is a letter
 * is a valid identifier both for places where upperIds and lowerIds were used, with the
 * exception of parameters and variable names, where the word must start with an underscore
 * (as a sigil) and be followed by a letter ns such a scripting.
 *
 * Some examples follow:
 * ```
 * // Valid uppercase identifiers (upperId)
 * [Red, Rojo, Ñandú, Öblast, Солнце]
 *
 * // Valid lowercase identifiers (lowerId)
 * [stones, bolitas, ñoqui, über, солнце]
 *
 * // Non alphabetic identifiers (nonAlphaId)
 * [شمس, 太阳]
 *
 * // Non alphabetic identifiers with sigil (sigiledNonAlphaId)
 * [شمس_, _太阳]    // Note the RTL spelling of arabic
 * ```
 *
 * Thus, the following are now represented to the exports here:
 * * A Number in gobstones must be written in ASCII numerals
 * * A Value Literal name may be an upperId or a nonAlphaId.
 * * A Procedure name may be an upperId or a nonAlphaId.
 * * A Function name may be a lowerId or a nonAlphaId
 * * A Type name may be an upperId or a nonAlphaId.
 * * A Type Constructor may be an upperId or a nonAlphaId.
 * * A Type field may be a lowerId or a nonAlphaId.
 * * A Variable name may be a lowerId or a sigiledNonAlphaId.
 * * A Parameter name may be a lowerId or a sigiledNonAlphaId.
 *
 * The sigiled version is indeed needed for variables and parameters, as a standalone
 * nonAlphaId cannot be identified as a variable/parameter or a 0-arity constructor of a type.
 * Such ambiguity cannot be resolved in a reasonable parser and so the tradeoff is to start with
 * the sigil underscore. Other ambiguities may be solved with lookahead techniques.
 *
 * A last consideration for readers of the implementation: Currently not all browsers have support
 * for RegExp that use the \p and \P escape sequences for matching unicode properties, and as
 * such, a transpiled version is used. The ES compatible version is provided in the documentation
 * in each case. The transpilation has been performed manually by using Regexpu which can
 * be found at [https://github.com/mathiasbynens/regexpu](https://github.com/mathiasbynens/regexpu).
 *
 * @module RegExp
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
export * from './IdentifierRegexp';
