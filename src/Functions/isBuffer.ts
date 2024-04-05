/**
 * @module API.Functions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
/**
 * Answer if an element is a Buffer.
 *
 * @param obj The element to test if it's a buffer
 *
 * @returns `true` if the element is a Buffer, `false` otherwise.
 *
 * @group API: Function
 */
export const isBuffer = (obj: any): boolean =>
    obj && obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
