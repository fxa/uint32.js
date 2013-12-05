/* global describe, it, require, window */

if (typeof window === 'undefined') {
    var uint32 = require('./uint32.js');
    var expect = require('expect.js');
}

(function () {
    "use strict";

    describe('Creating and Extracting', function () {
        describe('fromBytesBigEndian()', function () {
            it('should create an uint32 of given bytes', function () {
                expect(uint32.fromBytesBigEndian(1,2,3,4)).to.be(0x01020304);
            });
        });
        
        describe('getByteBigEndian()', function () {
            it('should extract the high byte', function () {
                expect(uint32.getByteBigEndian(0xf1f2f3f4, 0)).to.be(0xf1);
            });
            it('should extract the 2nd high byte', function () {
                expect(uint32.getByteBigEndian(0xf1f2f3f4, 1)).to.be(0xf2);
            });
            it('should extract the 3rd high byte', function () {
                expect(uint32.getByteBigEndian(0xf1f2f3f4, 2)).to.be(0xf3);
            });
            it('should extract the low byte', function () {
                expect(uint32.getByteBigEndian(0xf1f2f3f4, 3)).to.be(0xf4);
            });
        });
        
        describe('toHex()', function () {
            it('should fill with leading zeros', function () {
                expect(uint32.toHex(0x01)).to.be('00000001');
            });
            it('should use the optionalLength parameter', function () {
                expect(uint32.toHex(0x01, 2)).to.be('01');
            });
        });
        
        describe('toUint32()', function () {
            it('should convert an uint32 value', function () {
                expect(uint32.toUint32(0xf1f2f3f4)).to.be(0xf1f2f3f4);
            });
            it('should convert a negative value', function () {
                expect(uint32.toUint32(-1)).to.be(0xffffffff);
            });
            it('should convert a high value', function () {
                expect(uint32.toUint32(0x010000000004)).to.be(4);
            });
            it('should ignore values after decimal point', function () {
                expect(uint32.toUint32(3.5)).to.be(3);
            });
        });
    });
    
    describe('Bitwise Logical Operations', function () {
        describe('or', function () {
            it('should handle low bits', function () {
                expect(uint32.or(1, 1)).to.be(1);
                expect(uint32.or(1, 0)).to.be(1);
                expect(uint32.or(1, 2)).to.be(3);
            });
            it('should handle high bits', function () {
                expect(uint32.or(0xffffffff, 0)).to.be(0xffffffff);
            });
            it('should handle more than two values', function () {
                expect(uint32.or(1, 2, 4)).to.be(7);
                expect(uint32.or(1, 2, 4, 8)).to.be(15);
            });
        });
        
        describe('and', function () {
            it('should handle low bits', function () {
                expect(uint32.and(1, 1)).to.be(1);
                expect(uint32.and(1, 0)).to.be(0);
                expect(uint32.and(1, 2)).to.be(0);
            });
            it('should handle high bits', function () {
                expect(uint32.or(0xffffffff, 0xffffffff)).to.be(0xffffffff);
            });
            it('should handle more than two values', function () {
                expect(uint32.and(1, 3, 5)).to.be(1);
                expect(uint32.and(3, 11, 19, 35)).to.be(3);
            });
        });

        describe('xor', function () {
            it('should xor high bit to off', function () {
                expect(uint32.xor(0x80000000, 0xffffffff)).to.be(0x7fffffff);
            });
            it('should xor high bit to on', function () {
                expect(uint32.xor(0x40000000, 0x80000000)).to.be(0xc0000000);
            });
            it('should xor more than two values', function () {
                expect(uint32.xor(1, 2, 4)).to.be(7);
                expect(uint32.xor(1, 3, 5)).to.be(7);
                expect(uint32.xor(1, 2, 4, 8)).to.be(15);
            });
        });
        
        describe('not', function () {
            it('should negate 0', function () {
                expect(uint32.not(0)).to.be(0xffffffff);
            });
            it('should negate negative values', function () {
                expect(uint32.not(-1)).to.be(0);
            });
            it('should negate values with high bit set', function () {
                expect(uint32.not(0xc0000000)).to.be(0x3fffffff);
            });
        });
    });
    
    describe('Shifting and Rotating', function () {
        describe('shiftLeft()', function () {
            it('should handle the high bit', function () {
                expect(uint32.shiftLeft(3, 30)).to.be(0xc0000000);
                expect(uint32.shiftLeft(0x40000000, 1)).to.be(0x80000000);
                expect(uint32.shiftLeft(0x40000000, 2)).to.be(0);
                expect(uint32.shiftLeft(0x80000000, 1)).to.be(0);
            });
        });
        describe('shiftRight()', function () {
            it('should handle the high bit', function () {
                expect(uint32.shiftLeft(0x40000000, 1)).to.be(0x80000000);
                expect(uint32.shiftLeft(0x80000000, 1)).to.be(0);
            });
        });
        
        describe('rotateLeft()', function () {
            it('should rotate little values', function () {
                expect(uint32.rotateLeft(0x01, 1)).to.be(0x02);
                expect(uint32.rotateLeft(0x02, 1)).to.be(0x04);
            });
            it('should rotate big values', function () {
                expect(uint32.rotateLeft(0x40000000, 1)).to.be(0x80000000);
                expect(uint32.rotateLeft(0x80000000, 1)).to.be(0x00000001);
            });
        });
        
        describe('rotateRight()', function () {
            it('should rotate little values', function () {
                expect(uint32.rotateRight(0x01, 1)).to.be(0x80000000);
                expect(uint32.rotateRight(0x02, 1)).to.be(0x01);
            });
            it('should rotate big values', function () {
                expect(uint32.rotateRight(0x40000000, 1)).to.be(0x20000000);
                expect(uint32.rotateRight(0x80000000, 1)).to.be(0x40000000);
            });
        });        
    });
    
    describe('Logical Gates', function () {
        describe('choose()', function () {
            
            it('should use y, if x flag is set', function () {
                expect(uint32.choose(1, 0, 0)).to.be(0);
                expect(uint32.choose(1, 0, 1)).to.be(0);
                expect(uint32.choose(1, 1, 0)).to.be(1);
                expect(uint32.choose(1, 1, 1)).to.be(1);
                
                expect(uint32.choose(0xffffffff,  0,  0)).to.be(0);
                expect(uint32.choose(0xffffffff,  0, 0xffffffff)).to.be(0);
                expect(uint32.choose(0xffffffff, 0xffffffff,  0)).to.be(0xffffffff);
                expect(uint32.choose(0xffffffff, 0xffffffff, 0xffffffff)).to.be(0xffffffff);
            });
            it('should use z, if x flag is not set', function () {
                expect(uint32.choose(0, 0, 0)).to.be(0);
                expect(uint32.choose(0, 0, 1)).to.be(1);
                expect(uint32.choose(0, 1, 0)).to.be(0);
                expect(uint32.choose(0, 1, 1)).to.be(1);
                
                expect(uint32.choose(0,  0,  0)).to.be(0);
                expect(uint32.choose(0,  0, 0xffffffff)).to.be(0xffffffff);
                expect(uint32.choose(0, 0xffffffff,  0)).to.be(0);
                expect(uint32.choose(0, 0xffffffff, 0xffffffff)).to.be(0xffffffff);
            });
            it('should use the proper y or z', function () {
                expect(uint32.choose(0x01010202, 0x00010001, 0x01000100)).to.be(0x00010100);
            });
        });
        describe('majority()', function () {});
    });
    
})(); 