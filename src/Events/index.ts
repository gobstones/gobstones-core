/**
 * This module provides support for typed events,
 * wether is for classes that emit a particular
 * event, and allowing others to subscribe to that
 * event emission, or by simply creating objects that
 * can emit and be subscribed to.
 *
 * The main and only class exported is {@link EventEmitter},
 * which can be extended (the preferred way) or instantiated.
 * Events are typed so typescript support is a fully implemented
 * through generics.
 *
 * The following is an example of how to create a class that emits
 * some events.
 * @example
 * ```
 *
import { EventEmitter } from './EventEmitter';

type StringChangeEventFunctionCall = (newString: string, oldString: string) => void;

interface StringChangedEventSignature {
    onStringChanged: StringChangeEventFunctionCall;
}

class StringChangeEmitter extends EventEmitter<StringChangedEventSignature> {

    ...

    protected onSomeAction(): void {
        const oldString = ...;
        const newString = ...;
        this.emit('onStringChanged', newString, oldString);
    }

    ...
}

...

const subscriberToStringChanged: StringChangeEventFunctionCall = (
    newString: string,
    oldString: string
): void => {
    if (newString.length > 100) {
        someGlobalString = oldString;
    } else {
        someGlobalString = newString;
    }
};

export function subscribeToEvent(): void {
    const emitter = new StringChangeEmitter();
    emitter.on('onStringChanged', subscriberToStringChanged);
}
 * ```
 * @module Events
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
export * from './EventEmitter';
