/* jshint bitwise: false */

/**
 * @license (c) Franz X Antesberger 2013
 */
(function (exporter) {
    'use strict';

    //
    //  Creating and Extracting
    //
    
    /**
     *  Creates an uint32 from the given bytes in big endian order.
     *  @param {Number} highByte the high byte
     *  @param {Number} secondHighByte the 2nd high byte
     *  @param {Number} thirdHighByte the 3rd high byte
     *  @param {Number} lowByte the low byte
     *  @returns highByte concat secondHighByte concat thirdHighByte concat lowByte
     */
    exporter.fromBytesBigEndian = function (highByte, secondHighByte, thirdHighByte, lowByte) {
        return ((highByte << 24) | (secondHighByte << 16) | (thirdHighByte << 8) | lowByte) >>> 0;
    };

    /**
     *  Returns the byte.
     *  e.g. when byteNo is 0, the high byte is returned, when byteNo = 3 the low byte is returned.     
     *  @param {Number} uint32value the source to be extracted
     *  @param {Number} byteNo 0-3 the byte number, 0 is the high byte, 3 the low byte
     *  @returns {Number} the 0-255 byte according byteNo
     */
    exporter.getByteBigEndian = function (uint32value, byteNo) {
        return (uint32value >>> (8 * (3 - byteNo))) & 0xff;
    };

    /**
     *  Converts a given uin32 to a hex string including leading zeros.
     *  @param {Number} uint32value the uint32 to be stringified
     *  @param {Number} optionalMinLength the optional (default 8) 
     */
    exporter.toHex = function (uint32value, optionalMinLength) {
        optionalMinLength = optionalMinLength || 8;
        var result = uint32value.toString(16);
        if (result.length < optionalMinLength) {
            result = new Array(optionalMinLength - result.length + 1).join('0') + result;
        }
        return result;
    };

    /**
     *  Converts a number to an uint32.
     *  @param {Number} the number to be converted.
     *  @returns {Number} an uint32 value
     */     
    exporter.toUint32 = function (number) {
        // the shift operator forces js to perform the internal ToUint32 (see ecmascript spec 9.6)
        return number >>> 0;
    };
    
    /**
     *  Returns the part above the uint32 border.
     *  Depending to the javascript engine, that are the 54-32 = 22 high bits
     *  @param {Number} the number to extract the high part
     *  @returns the high part of the number
     */
    exporter.highPart = function (number) {
        return exporter.toUint32(number / 0x0100000000);
    };

    //
    //  Bitwise Logical Operators
    //
    
    /**
     *  Returns a bitwise OR operation on two or more values.
     *  @param {Number} uint32val0 first uint32 value
     *  @param {Number} argv one or more uint32 values
     *  @return {Number} the bitwise OR uint32 value
     */
    exporter.or = function (uint32val0, argv) {
        var result = uint32val0;
        for (var index = 1; index < arguments.length; index += 1) {
            result = (result | arguments[index]);
        }
        return result >>> 0;
    };
    
    /**
     *  Returns a bitwise AND operation on two or more values.
     *  @param {Number} uint32val0 first uint32 value
     *  @param {Number} argv one or more uint32 values
     *  @return {Number} the bitwise AND uint32 value
     */
    exporter.and = function (uint32val0, argv) {
        var result = uint32val0;
        for (var index = 1; index < arguments.length; index += 1) {
            result = (result & arguments[index]);
        }
        return result >>> 0;
    };
    
    /**
     *  Returns a bitwise XOR operation on two or more values.
     *  @param {Number} uint32val0 first uint32 value
     *  @param {Number} argv one or more uint32 values
     *  @return {Number} the bitwise XOR uint32 value
     */
    exporter.xor = function (uint32val0, argv) {
        var result = uint32val0;
        for (var index = 1; index < arguments.length; index += 1) {
            result = (result ^ arguments[index]);
        }
        return result >>> 0;
    };

    exporter.not = function (uint32val) {
        return (~uint32val) >>> 0;
    };    
    
    //
    // Shifting and Rotating
    //
    
    /**
     *  Returns the uint32 representation of a << operation.
     *  @param {Number} uint32val the word to be shifted
     *  @param {Number} numBits the number of bits to be shifted (0-31)
     *  @returns {Number} the uint32 value of the shifted word
     */
    exporter.shiftLeft = function (uint32val, numBits) {
        return (uint32val << numBits) >>> 0;
    };
    
    /**
     *  Returns the uint32 representation of a >>> operation.
     *  @param {Number} uint32val the word to be shifted
     *  @param {Number} numBits the number of bits to be shifted (0-31)
     *  @returns {Number} the uint32 value of the shifted word
     */
    exporter.shiftRight = function (uint32val, numBits) {
        return uint32val >>> numBits;
    };
    
    exporter.rotateLeft = function (uint32val, numBits) {
        return (((uint32val << numBits) >>> 0) | (uint32val >>> (32 - numBits))) >>> 0;
    };

    exporter.rotateRight = function (uint32val, numBits) {
        return (((uint32val) >>> (numBits)) | ((uint32val) << (32 - numBits)) >>> 0) >>> 0; 
    };
    
    //
    // Logical Gates
    //
    
    /**
     *  Bitwise choose bits from y or z, as a bitwise x ? y : z
     */
    exporter.choose = function (x, y, z) {
        return ((x & (y ^ z)) ^ z) >>> 0;
    };
    
    /**
     * Majority gate for three parameters. Takes bitwise the majority of x, y and z,
     * @see https://en.wikipedia.org/wiki/Majority_function
     */
    exporter.majority = function (x, y, z) {
        return ((x & (y | z)) | (y & z)) >>> 0;
    };
    
}) ((typeof module !== 'undefined') ? module.exports = {} : window.uint32 = {});
    
