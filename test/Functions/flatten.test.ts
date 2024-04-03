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
import { describe, expect, it } from '@jest/globals';
import { flatten, unflatten } from '../../src/Functions/flatten';

const primitives = {
    String: 'good morning',
    Number: 1234.99,
    Boolean: true,
    Date: new Date(),
    // eslint-disable-next-line no-null/no-null
    null: null,
    // eslint-disable-next-line object-shorthand
    undefined: undefined
};

describe('flatten', () => {
    it('should retain primitive values an object', () => {
        Object.keys(primitives).forEach(function (key) {
            const value = primitives[key];

            expect(
                flatten({
                    hello: {
                        world: value
                    }
                })
            ).toStrictEqual({
                'hello.world': value
            });
        });
    });
    it('should flatten an object nested once correctly', () => {
        expect(
            flatten({
                hello: {
                    world: 'good morning'
                }
            })
        ).toStrictEqual({
            'hello.world': 'good morning'
        });
    });

    it('should flatten an object nested twice it correctly', () => {
        expect(
            flatten({
                hello: {
                    world: {
                        again: 'good morning'
                    }
                }
            })
        ).toStrictEqual({
            'hello.world.again': 'good morning'
        });
    });

    it('should flatten an object with multiple keys it correctly', () => {
        expect(
            flatten({
                hello: {
                    lorem: {
                        ipsum: 'again',
                        dolor: 'sit'
                    }
                },
                world: {
                    lorem: {
                        ipsum: 'again',
                        dolor: 'sit'
                    }
                }
            })
        ).toStrictEqual({
            'hello.lorem.ipsum': 'again',
            'hello.lorem.dolor': 'sit',
            'world.lorem.ipsum': 'again',
            'world.lorem.dolor': 'sit'
        });
    });

    it('should flatten with a custom delimiter', () => {
        expect(
            flatten(
                {
                    hello: {
                        world: {
                            again: 'good morning'
                        }
                    }
                },
                {
                    delimiter: ':'
                }
            )
        ).toStrictEqual({
            'hello:world:again': 'good morning'
        });
    });

    it('should flatten empty objects on leaves', () => {
        expect(
            flatten({
                hello: {
                    empty: {
                        nested: {}
                    }
                }
            })
        ).toStrictEqual({
            'hello.empty.nested': {}
        });
    });

    it('should flatten a buffer', () => {
        expect(
            flatten({
                hello: {
                    empty: {
                        nested: Buffer.from('test')
                    }
                }
            })
        ).toStrictEqual({
            'hello.empty.nested': Buffer.from('test')
        });
    });

    it('should flatten typed arrays', () => {
        expect(
            flatten({
                hello: {
                    empty: {
                        nested: new Uint8Array([1, 2, 3, 4])
                    }
                }
            })
        ).toStrictEqual({
            'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
        });
    });

    it('should flatten only to the custom depth given', () => {
        expect(
            flatten(
                {
                    hello: {
                        world: {
                            again: 'good morning'
                        }
                    },
                    lorem: {
                        ipsum: {
                            dolor: 'good evening'
                        }
                    }
                },
                {
                    maxDepth: 2
                }
            )
        ).toStrictEqual({
            'hello.world': {
                again: 'good morning'
            },
            'lorem.ipsum': {
                dolor: 'good evening'
            }
        });
    });

    it('should transform keys as requested', () => {
        expect(
            flatten(
                {
                    hello: {
                        world: {
                            again: 'good morning'
                        }
                    },
                    lorem: {
                        ipsum: {
                            dolor: 'good evening'
                        }
                    }
                },
                {
                    transformKey: (key) => '__' + key + '__'
                }
            )
        ).toStrictEqual({
            '__hello__.__world__.__again__': 'good morning',
            '__lorem__.__ipsum__.__dolor__': 'good evening'
        });
    });

    it('Should keep number in the left when object has numeric keys', () => {
        expect(
            flatten({
                hello: {
                    '0200': 'world',
                    '0500': 'darkness my old friend'
                }
            })
        ).toStrictEqual({
            'hello.0200': 'world',
            'hello.0500': 'darkness my old friend'
        });
    });
});

describe('unflatten', () => {
    Object.keys(primitives).forEach(function (key) {
        const value = primitives[key];

        describe(key, () => {
            expect(
                unflatten({
                    'hello.world': value
                })
            ).toStrictEqual({
                hello: {
                    world: value
                }
            });
        });
    });

    describe('Should be able to flatten arrays properly', () => {
        expect({
            'a.0': 'foo',
            'a.1': 'bar'
        }).toStrictEqual(
            flatten({
                a: ['foo', 'bar']
            })
        );
    });

    it('should unflatted an object nested once', () => {
        expect(
            unflatten({
                'hello.world': 'good morning'
            })
        ).toStrictEqual({
            hello: {
                world: 'good morning'
            }
        });
    });

    it('should unflatten an object nested twice', () => {
        expect(
            unflatten({
                'hello.world.again': 'good morning'
            })
        ).toStrictEqual({
            hello: {
                world: {
                    again: 'good morning'
                }
            }
        });
    });

    it('should unflatten an object with multiple keys', () => {
        expect(
            unflatten({
                'hello.lorem.ipsum': 'again',
                'hello.lorem.dolor': 'sit',
                'world.lorem.ipsum': 'again',
                'world.lorem.dolor': 'sit',
                world: { greet: 'hello' }
            })
        ).toStrictEqual({
            hello: {
                lorem: {
                    ipsum: 'again',
                    dolor: 'sit'
                }
            },
            world: {
                greet: 'hello',
                lorem: {
                    ipsum: 'again',
                    dolor: 'sit'
                }
            }
        });
    });

    it('should not clobber nested object on each other when a.b inserted before a', () => {
        const x: any = {};
        x['foo.bar'] = { t: 123 };
        x.foo = { p: 333 };
        expect(unflatten(x)).toStrictEqual({
            foo: {
                bar: {
                    t: 123
                },
                p: 333
            }
        });
    });

    it('should unflatten with custom delimiter', () => {
        expect(
            unflatten(
                {
                    'hello world again': 'good morning'
                },
                {
                    delimiter: ' '
                }
            )
        ).toStrictEqual({
            hello: {
                world: {
                    again: 'good morning'
                }
            }
        });
    });

    it('should overwrite if the option is passed', () => {
        expect(
            unflatten(
                {
                    travis: 'true',
                    // eslint-disable-next-line camelcase
                    travis_build_dir: '/home/travis/build/kvz/environmental'
                },
                {
                    delimiter: '_',
                    overwrite: true
                }
            )
        ).toStrictEqual({
            travis: {
                build: {
                    dir: '/home/travis/build/kvz/environmental'
                }
            }
        });
    });

    it('should unflatten with transformed keys', () => {
        expect(
            unflatten(
                {
                    '__hello__.__world__.__again__': 'good morning',
                    '__lorem__.__ipsum__.__dolor__': 'good evening'
                },
                {
                    transformKey: (key) => key.substring(2, key.length - 2)
                }
            )
        ).toStrictEqual({
            hello: {
                world: {
                    again: 'good morning'
                }
            },
            lorem: {
                ipsum: {
                    dolor: 'good evening'
                }
            }
        });
    });

    it('should unflatten even messy object', () => {
        expect(
            unflatten({
                'hello.world': 'again',
                'lorem.ipsum': 'another',
                'good.morning': {
                    'hash.key': {
                        'nested.deep': {
                            'and.even.deeper.still': 'hello'
                        }
                    }
                },
                'good.morning.again': {
                    'testing.this': 'out'
                }
            })
        ).toStrictEqual({
            hello: { world: 'again' },
            lorem: { ipsum: 'another' },
            good: {
                morning: {
                    hash: {
                        key: {
                            nested: {
                                deep: {
                                    and: {
                                        even: {
                                            deeper: { still: 'hello' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    again: { testing: { this: 'out' } }
                }
            }
        });
    });

    describe('Given overwrite and non-object values in key positions', () => {
        it('should be overwritten when non object keys', () => {
            expect(
                // eslint-disable-next-line no-null/no-null
                unflatten({ a: null, 'a.b': 'c' }, { overwrite: true })
            ).toStrictEqual({
                a: { b: 'c' }
            });
            expect(unflatten({ a: 0, 'a.b': 'c' }, { overwrite: true })).toStrictEqual({
                a: { b: 'c' }
            });
            expect(unflatten({ a: 1, 'a.b': 'c' }, { overwrite: true })).toStrictEqual({
                a: { b: 'c' }
            });
            expect(unflatten({ a: '', 'a.b': 'c' }, { overwrite: true })).toStrictEqual({
                a: { b: 'c' }
            });
        });

        it('should not affect undefined keys', () => {
            expect(unflatten({ a: undefined, 'a.b': 'c' }, { overwrite: true })).toStrictEqual({
                a: { b: 'c' }
            });
            expect(unflatten({ a: undefined, 'a.b': 'c' }, { overwrite: false })).toStrictEqual({
                a: { b: 'c' }
            });
        });

        it('should ignore nested values under non-object key if no overwrite', () => {
            // eslint-disable-next-line no-null/no-null
            expect(unflatten({ a: null, 'a.b': 'c' })).toStrictEqual({ a: null });
            expect(unflatten({ a: 0, 'a.b': 'c' })).toStrictEqual({ a: 0 });
            expect(unflatten({ a: 1, 'a.b': 'c' })).toStrictEqual({ a: 1 });
            expect(unflatten({ a: '', 'a.b': 'c' })).toStrictEqual({ a: '' });
        });
    });

    describe('safe option is given', () => {
        it('should protect arrays when true', () => {
            expect(
                flatten(
                    {
                        hello: [{ world: { again: 'foo' } }, { lorem: 'ipsum' }],
                        another: {
                            nested: [{ array: { too: 'deep' } }]
                        },
                        lorem: {
                            ipsum: 'whoop'
                        }
                    },
                    {
                        safe: true
                    }
                )
            ).toStrictEqual({
                hello: [{ world: { again: 'foo' } }, { lorem: 'ipsum' }],
                'lorem.ipsum': 'whoop',
                'another.nested': [{ array: { too: 'deep' } }]
            });
        });

        it('should not protect arrays when false', () => {
            expect(
                flatten(
                    {
                        hello: [{ world: { again: 'foo' } }, { lorem: 'ipsum' }]
                    },
                    {
                        safe: false
                    }
                )
            ).toStrictEqual({
                'hello.0.world.again': 'foo',
                'hello.1.lorem': 'ipsum'
            });
        });

        it('should not remove empty objects', () => {
            expect(
                unflatten({
                    foo: [],
                    bar: {}
                })
            ).toStrictEqual({ foo: [], bar: {} });
        });
    });

    describe('When the option object is given', () => {
        it('should create object instead of array when true', () => {
            const unflattened = unflatten(
                {
                    'hello.you.0': 'ipsum',
                    'hello.you.1': 'lorem',
                    'hello.other.world': 'foo'
                },
                {
                    object: true
                }
            );
            expect({
                hello: {
                    you: {
                        0: 'ipsum',
                        1: 'lorem'
                    },
                    other: { world: 'foo' }
                }
            }).toStrictEqual(unflattened);
            expect(!Array.isArray(unflattened.hello.you)).toBeTruthy();
        });

        it('should create object instead of array when nested', () => {
            const unflattened = unflatten(
                {
                    hello: {
                        'you.0': 'ipsum',
                        'you.1': 'lorem',
                        'other.world': 'foo'
                    }
                },
                {
                    object: true
                }
            );
            expect({
                hello: {
                    you: {
                        0: 'ipsum',
                        1: 'lorem'
                    },
                    other: { world: 'foo' }
                }
            }).toStrictEqual(unflattened);
            expect(!Array.isArray(unflattened.hello.you)).toBeTruthy();
        });

        it('should keep the zero in the left when object is true', () => {
            const unflattened = unflatten(
                {
                    'hello.0200': 'world',
                    'hello.0500': 'darkness my old friend'
                },
                {
                    object: true
                }
            );

            expect({
                hello: {
                    '0200': 'world',
                    '0500': 'darkness my old friend'
                }
            }).toStrictEqual(unflattened);
        });

        it('should not create object when false', () => {
            const unflattened = unflatten(
                {
                    'hello.you.0': 'ipsum',
                    'hello.you.1': 'lorem',
                    'hello.other.world': 'foo'
                },
                {
                    object: false
                }
            );
            expect({
                hello: {
                    you: ['ipsum', 'lorem'],
                    other: { world: 'foo' }
                }
            }).toStrictEqual(unflattened);
            expect(Array.isArray(unflattened.hello.you)).toBeTruthy();
        });
    });

    it('Should unflatten a buffer correctly', () => {
        expect(
            unflatten({
                'hello.empty.nested': Buffer.from('test')
            })
        ).toStrictEqual({
            hello: {
                empty: {
                    nested: Buffer.from('test')
                }
            }
        });
    });

    it('should unflatten a typed array corretly', () => {
        expect(
            unflatten({
                'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
            })
        ).toStrictEqual({
            hello: {
                empty: {
                    nested: new Uint8Array([1, 2, 3, 4])
                }
            }
        });
    });

    it('should not pollute prototype', () => {
        unflatten({
            '__proto__.polluted': true
        });
        unflatten({
            'prefix.__proto__.polluted': true
        });
        unflatten({
            'prefix.0.__proto__.polluted': true
        });

        expect(({} as any).polluted).not.toStrictEqual(true);
    });

    it('should be able to revert and reverse array serialization via unflatten', () => {
        expect({
            a: ['foo', 'bar']
        }).toStrictEqual(
            unflatten({
                'a.0': 'foo',
                'a.1': 'bar'
            })
        );
    });

    it('should be restored from array typed objects by unflatten', () => {
        expect(Object.prototype.toString.call(['foo', 'bar'])).toStrictEqual(
            Object.prototype.toString.call(
                unflatten({
                    'a.0': 'foo',
                    'a.1': 'bar'
                }).a
            )
        );
    });

    it('Should not include keys with numbers inside them', () => {
        expect(
            unflatten({
                '1key.2_key': 'ok'
            })
        ).toStrictEqual({
            '1key': {
                '2_key': 'ok'
            }
        });
    });

    it('should not change order of keys after round trip flatten/unflatten', () => {
        const obj = {
            b: 1,
            abc: {
                c: [
                    {
                        d: 1,
                        bca: 1,
                        a: 1
                    }
                ]
            },
            a: 1
        };
        const result = unflatten(flatten(obj));

        expect(Object.keys(obj)).toStrictEqual(Object.keys(result));
        expect(Object.keys(obj.abc)).toStrictEqual(Object.keys(result.abc));
        expect(Object.keys(obj.abc.c[0])).toStrictEqual(Object.keys(result.abc.c[0]));
    });
});
