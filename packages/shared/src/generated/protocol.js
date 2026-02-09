/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const jsbolo = $root.jsbolo = (() => {

    /**
     * Namespace jsbolo.
     * @exports jsbolo
     * @namespace
     */
    const jsbolo = {};

    jsbolo.PlayerInput = (function() {

        /**
         * Properties of a PlayerInput.
         * @memberof jsbolo
         * @interface IPlayerInput
         * @property {number|null} [sequence] PlayerInput sequence
         * @property {number|null} [tick] PlayerInput tick
         * @property {boolean|null} [accelerating] PlayerInput accelerating
         * @property {boolean|null} [braking] PlayerInput braking
         * @property {boolean|null} [turningClockwise] PlayerInput turningClockwise
         * @property {boolean|null} [turningCounterClockwise] PlayerInput turningCounterClockwise
         * @property {boolean|null} [shooting] PlayerInput shooting
         * @property {jsbolo.IBuildOrder|null} [buildOrder] PlayerInput buildOrder
         * @property {jsbolo.RangeAdjustment|null} [rangeAdjustment] PlayerInput rangeAdjustment
         */

        /**
         * Constructs a new PlayerInput.
         * @memberof jsbolo
         * @classdesc Represents a PlayerInput.
         * @implements IPlayerInput
         * @constructor
         * @param {jsbolo.IPlayerInput=} [properties] Properties to set
         */
        function PlayerInput(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerInput sequence.
         * @member {number} sequence
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.sequence = 0;

        /**
         * PlayerInput tick.
         * @member {number} tick
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.tick = 0;

        /**
         * PlayerInput accelerating.
         * @member {boolean} accelerating
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.accelerating = false;

        /**
         * PlayerInput braking.
         * @member {boolean} braking
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.braking = false;

        /**
         * PlayerInput turningClockwise.
         * @member {boolean} turningClockwise
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.turningClockwise = false;

        /**
         * PlayerInput turningCounterClockwise.
         * @member {boolean} turningCounterClockwise
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.turningCounterClockwise = false;

        /**
         * PlayerInput shooting.
         * @member {boolean} shooting
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.shooting = false;

        /**
         * PlayerInput buildOrder.
         * @member {jsbolo.IBuildOrder|null|undefined} buildOrder
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.buildOrder = null;

        /**
         * PlayerInput rangeAdjustment.
         * @member {jsbolo.RangeAdjustment} rangeAdjustment
         * @memberof jsbolo.PlayerInput
         * @instance
         */
        PlayerInput.prototype.rangeAdjustment = 0;

        /**
         * Creates a new PlayerInput instance using the specified properties.
         * @function create
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {jsbolo.IPlayerInput=} [properties] Properties to set
         * @returns {jsbolo.PlayerInput} PlayerInput instance
         */
        PlayerInput.create = function create(properties) {
            return new PlayerInput(properties);
        };

        /**
         * Encodes the specified PlayerInput message. Does not implicitly {@link jsbolo.PlayerInput.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {jsbolo.IPlayerInput} message PlayerInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sequence);
            if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tick);
            if (message.accelerating != null && Object.hasOwnProperty.call(message, "accelerating"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.accelerating);
            if (message.braking != null && Object.hasOwnProperty.call(message, "braking"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.braking);
            if (message.turningClockwise != null && Object.hasOwnProperty.call(message, "turningClockwise"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.turningClockwise);
            if (message.turningCounterClockwise != null && Object.hasOwnProperty.call(message, "turningCounterClockwise"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.turningCounterClockwise);
            if (message.shooting != null && Object.hasOwnProperty.call(message, "shooting"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.shooting);
            if (message.buildOrder != null && Object.hasOwnProperty.call(message, "buildOrder"))
                $root.jsbolo.BuildOrder.encode(message.buildOrder, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.rangeAdjustment != null && Object.hasOwnProperty.call(message, "rangeAdjustment"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.rangeAdjustment);
            return writer;
        };

        /**
         * Encodes the specified PlayerInput message, length delimited. Does not implicitly {@link jsbolo.PlayerInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {jsbolo.IPlayerInput} message PlayerInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerInput message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.PlayerInput} PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInput.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.PlayerInput();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.sequence = reader.uint32();
                        break;
                    }
                case 2: {
                        message.tick = reader.uint32();
                        break;
                    }
                case 3: {
                        message.accelerating = reader.bool();
                        break;
                    }
                case 4: {
                        message.braking = reader.bool();
                        break;
                    }
                case 5: {
                        message.turningClockwise = reader.bool();
                        break;
                    }
                case 6: {
                        message.turningCounterClockwise = reader.bool();
                        break;
                    }
                case 7: {
                        message.shooting = reader.bool();
                        break;
                    }
                case 8: {
                        message.buildOrder = $root.jsbolo.BuildOrder.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.rangeAdjustment = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.PlayerInput} PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerInput message.
         * @function verify
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isInteger(message.sequence))
                    return "sequence: integer expected";
            if (message.tick != null && message.hasOwnProperty("tick"))
                if (!$util.isInteger(message.tick))
                    return "tick: integer expected";
            if (message.accelerating != null && message.hasOwnProperty("accelerating"))
                if (typeof message.accelerating !== "boolean")
                    return "accelerating: boolean expected";
            if (message.braking != null && message.hasOwnProperty("braking"))
                if (typeof message.braking !== "boolean")
                    return "braking: boolean expected";
            if (message.turningClockwise != null && message.hasOwnProperty("turningClockwise"))
                if (typeof message.turningClockwise !== "boolean")
                    return "turningClockwise: boolean expected";
            if (message.turningCounterClockwise != null && message.hasOwnProperty("turningCounterClockwise"))
                if (typeof message.turningCounterClockwise !== "boolean")
                    return "turningCounterClockwise: boolean expected";
            if (message.shooting != null && message.hasOwnProperty("shooting"))
                if (typeof message.shooting !== "boolean")
                    return "shooting: boolean expected";
            if (message.buildOrder != null && message.hasOwnProperty("buildOrder")) {
                let error = $root.jsbolo.BuildOrder.verify(message.buildOrder);
                if (error)
                    return "buildOrder." + error;
            }
            if (message.rangeAdjustment != null && message.hasOwnProperty("rangeAdjustment"))
                switch (message.rangeAdjustment) {
                default:
                    return "rangeAdjustment: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a PlayerInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.PlayerInput} PlayerInput
         */
        PlayerInput.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.PlayerInput)
                return object;
            let message = new $root.jsbolo.PlayerInput();
            if (object.sequence != null)
                message.sequence = object.sequence >>> 0;
            if (object.tick != null)
                message.tick = object.tick >>> 0;
            if (object.accelerating != null)
                message.accelerating = Boolean(object.accelerating);
            if (object.braking != null)
                message.braking = Boolean(object.braking);
            if (object.turningClockwise != null)
                message.turningClockwise = Boolean(object.turningClockwise);
            if (object.turningCounterClockwise != null)
                message.turningCounterClockwise = Boolean(object.turningCounterClockwise);
            if (object.shooting != null)
                message.shooting = Boolean(object.shooting);
            if (object.buildOrder != null) {
                if (typeof object.buildOrder !== "object")
                    throw TypeError(".jsbolo.PlayerInput.buildOrder: object expected");
                message.buildOrder = $root.jsbolo.BuildOrder.fromObject(object.buildOrder);
            }
            switch (object.rangeAdjustment) {
            default:
                if (typeof object.rangeAdjustment === "number") {
                    message.rangeAdjustment = object.rangeAdjustment;
                    break;
                }
                break;
            case "NONE":
            case 0:
                message.rangeAdjustment = 0;
                break;
            case "INCREASE":
            case 1:
                message.rangeAdjustment = 1;
                break;
            case "DECREASE":
            case 2:
                message.rangeAdjustment = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a PlayerInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {jsbolo.PlayerInput} message PlayerInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.sequence = 0;
                object.tick = 0;
                object.accelerating = false;
                object.braking = false;
                object.turningClockwise = false;
                object.turningCounterClockwise = false;
                object.shooting = false;
                object.buildOrder = null;
                object.rangeAdjustment = options.enums === String ? "NONE" : 0;
            }
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                object.sequence = message.sequence;
            if (message.tick != null && message.hasOwnProperty("tick"))
                object.tick = message.tick;
            if (message.accelerating != null && message.hasOwnProperty("accelerating"))
                object.accelerating = message.accelerating;
            if (message.braking != null && message.hasOwnProperty("braking"))
                object.braking = message.braking;
            if (message.turningClockwise != null && message.hasOwnProperty("turningClockwise"))
                object.turningClockwise = message.turningClockwise;
            if (message.turningCounterClockwise != null && message.hasOwnProperty("turningCounterClockwise"))
                object.turningCounterClockwise = message.turningCounterClockwise;
            if (message.shooting != null && message.hasOwnProperty("shooting"))
                object.shooting = message.shooting;
            if (message.buildOrder != null && message.hasOwnProperty("buildOrder"))
                object.buildOrder = $root.jsbolo.BuildOrder.toObject(message.buildOrder, options);
            if (message.rangeAdjustment != null && message.hasOwnProperty("rangeAdjustment"))
                object.rangeAdjustment = options.enums === String ? $root.jsbolo.RangeAdjustment[message.rangeAdjustment] === undefined ? message.rangeAdjustment : $root.jsbolo.RangeAdjustment[message.rangeAdjustment] : message.rangeAdjustment;
            return object;
        };

        /**
         * Converts this PlayerInput to JSON.
         * @function toJSON
         * @memberof jsbolo.PlayerInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PlayerInput
         * @function getTypeUrl
         * @memberof jsbolo.PlayerInput
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerInput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.PlayerInput";
        };

        return PlayerInput;
    })();

    jsbolo.BuildOrder = (function() {

        /**
         * Properties of a BuildOrder.
         * @memberof jsbolo
         * @interface IBuildOrder
         * @property {jsbolo.BuildOrder.Action|null} [action] BuildOrder action
         * @property {number|null} [targetX] BuildOrder targetX
         * @property {number|null} [targetY] BuildOrder targetY
         */

        /**
         * Constructs a new BuildOrder.
         * @memberof jsbolo
         * @classdesc Represents a BuildOrder.
         * @implements IBuildOrder
         * @constructor
         * @param {jsbolo.IBuildOrder=} [properties] Properties to set
         */
        function BuildOrder(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BuildOrder action.
         * @member {jsbolo.BuildOrder.Action} action
         * @memberof jsbolo.BuildOrder
         * @instance
         */
        BuildOrder.prototype.action = 0;

        /**
         * BuildOrder targetX.
         * @member {number} targetX
         * @memberof jsbolo.BuildOrder
         * @instance
         */
        BuildOrder.prototype.targetX = 0;

        /**
         * BuildOrder targetY.
         * @member {number} targetY
         * @memberof jsbolo.BuildOrder
         * @instance
         */
        BuildOrder.prototype.targetY = 0;

        /**
         * Creates a new BuildOrder instance using the specified properties.
         * @function create
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {jsbolo.IBuildOrder=} [properties] Properties to set
         * @returns {jsbolo.BuildOrder} BuildOrder instance
         */
        BuildOrder.create = function create(properties) {
            return new BuildOrder(properties);
        };

        /**
         * Encodes the specified BuildOrder message. Does not implicitly {@link jsbolo.BuildOrder.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {jsbolo.IBuildOrder} message BuildOrder message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuildOrder.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.targetX != null && Object.hasOwnProperty.call(message, "targetX"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.targetX);
            if (message.targetY != null && Object.hasOwnProperty.call(message, "targetY"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.targetY);
            return writer;
        };

        /**
         * Encodes the specified BuildOrder message, length delimited. Does not implicitly {@link jsbolo.BuildOrder.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {jsbolo.IBuildOrder} message BuildOrder message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuildOrder.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BuildOrder message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.BuildOrder} BuildOrder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuildOrder.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.BuildOrder();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.action = reader.int32();
                        break;
                    }
                case 2: {
                        message.targetX = reader.uint32();
                        break;
                    }
                case 3: {
                        message.targetY = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BuildOrder message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.BuildOrder} BuildOrder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuildOrder.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BuildOrder message.
         * @function verify
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BuildOrder.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.targetX != null && message.hasOwnProperty("targetX"))
                if (!$util.isInteger(message.targetX))
                    return "targetX: integer expected";
            if (message.targetY != null && message.hasOwnProperty("targetY"))
                if (!$util.isInteger(message.targetY))
                    return "targetY: integer expected";
            return null;
        };

        /**
         * Creates a BuildOrder message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.BuildOrder} BuildOrder
         */
        BuildOrder.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.BuildOrder)
                return object;
            let message = new $root.jsbolo.BuildOrder();
            switch (object.action) {
            default:
                if (typeof object.action === "number") {
                    message.action = object.action;
                    break;
                }
                break;
            case "NONE":
            case 0:
                message.action = 0;
                break;
            case "FOREST":
            case 1:
                message.action = 1;
                break;
            case "ROAD":
            case 2:
                message.action = 2;
                break;
            case "REPAIR":
            case 3:
                message.action = 3;
                break;
            case "BOAT":
            case 4:
                message.action = 4;
                break;
            case "BUILDING":
            case 5:
                message.action = 5;
                break;
            case "PILLBOX":
            case 6:
                message.action = 6;
                break;
            case "MINE":
            case 7:
                message.action = 7;
                break;
            }
            if (object.targetX != null)
                message.targetX = object.targetX >>> 0;
            if (object.targetY != null)
                message.targetY = object.targetY >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BuildOrder message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {jsbolo.BuildOrder} message BuildOrder
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BuildOrder.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.action = options.enums === String ? "NONE" : 0;
                object.targetX = 0;
                object.targetY = 0;
            }
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.jsbolo.BuildOrder.Action[message.action] === undefined ? message.action : $root.jsbolo.BuildOrder.Action[message.action] : message.action;
            if (message.targetX != null && message.hasOwnProperty("targetX"))
                object.targetX = message.targetX;
            if (message.targetY != null && message.hasOwnProperty("targetY"))
                object.targetY = message.targetY;
            return object;
        };

        /**
         * Converts this BuildOrder to JSON.
         * @function toJSON
         * @memberof jsbolo.BuildOrder
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BuildOrder.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BuildOrder
         * @function getTypeUrl
         * @memberof jsbolo.BuildOrder
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BuildOrder.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.BuildOrder";
        };

        /**
         * Action enum.
         * @name jsbolo.BuildOrder.Action
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} FOREST=1 FOREST value
         * @property {number} ROAD=2 ROAD value
         * @property {number} REPAIR=3 REPAIR value
         * @property {number} BOAT=4 BOAT value
         * @property {number} BUILDING=5 BUILDING value
         * @property {number} PILLBOX=6 PILLBOX value
         * @property {number} MINE=7 MINE value
         */
        BuildOrder.Action = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "FOREST"] = 1;
            values[valuesById[2] = "ROAD"] = 2;
            values[valuesById[3] = "REPAIR"] = 3;
            values[valuesById[4] = "BOAT"] = 4;
            values[valuesById[5] = "BUILDING"] = 5;
            values[valuesById[6] = "PILLBOX"] = 6;
            values[valuesById[7] = "MINE"] = 7;
            return values;
        })();

        return BuildOrder;
    })();

    /**
     * RangeAdjustment enum.
     * @name jsbolo.RangeAdjustment
     * @enum {number}
     * @property {number} NONE=0 NONE value
     * @property {number} INCREASE=1 INCREASE value
     * @property {number} DECREASE=2 DECREASE value
     */
    jsbolo.RangeAdjustment = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[1] = "INCREASE"] = 1;
        values[valuesById[2] = "DECREASE"] = 2;
        return values;
    })();

    jsbolo.ServerUpdate = (function() {

        /**
         * Properties of a ServerUpdate.
         * @memberof jsbolo
         * @interface IServerUpdate
         * @property {number|null} [tick] ServerUpdate tick
         * @property {Array.<jsbolo.ITankState>|null} [tanks] ServerUpdate tanks
         * @property {Array.<jsbolo.IBuilderState>|null} [builders] ServerUpdate builders
         * @property {Array.<jsbolo.IShellState>|null} [shells] ServerUpdate shells
         * @property {Array.<jsbolo.IExplosionState>|null} [explosions] ServerUpdate explosions
         * @property {Array.<jsbolo.ITerrainChange>|null} [terrainChanges] ServerUpdate terrainChanges
         * @property {Array.<jsbolo.IPillboxState>|null} [pillboxes] ServerUpdate pillboxes
         * @property {Array.<jsbolo.IBaseState>|null} [bases] ServerUpdate bases
         */

        /**
         * Constructs a new ServerUpdate.
         * @memberof jsbolo
         * @classdesc Represents a ServerUpdate.
         * @implements IServerUpdate
         * @constructor
         * @param {jsbolo.IServerUpdate=} [properties] Properties to set
         */
        function ServerUpdate(properties) {
            this.tanks = [];
            this.builders = [];
            this.shells = [];
            this.explosions = [];
            this.terrainChanges = [];
            this.pillboxes = [];
            this.bases = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerUpdate tick.
         * @member {number} tick
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.tick = 0;

        /**
         * ServerUpdate tanks.
         * @member {Array.<jsbolo.ITankState>} tanks
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.tanks = $util.emptyArray;

        /**
         * ServerUpdate builders.
         * @member {Array.<jsbolo.IBuilderState>} builders
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.builders = $util.emptyArray;

        /**
         * ServerUpdate shells.
         * @member {Array.<jsbolo.IShellState>} shells
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.shells = $util.emptyArray;

        /**
         * ServerUpdate explosions.
         * @member {Array.<jsbolo.IExplosionState>} explosions
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.explosions = $util.emptyArray;

        /**
         * ServerUpdate terrainChanges.
         * @member {Array.<jsbolo.ITerrainChange>} terrainChanges
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.terrainChanges = $util.emptyArray;

        /**
         * ServerUpdate pillboxes.
         * @member {Array.<jsbolo.IPillboxState>} pillboxes
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.pillboxes = $util.emptyArray;

        /**
         * ServerUpdate bases.
         * @member {Array.<jsbolo.IBaseState>} bases
         * @memberof jsbolo.ServerUpdate
         * @instance
         */
        ServerUpdate.prototype.bases = $util.emptyArray;

        /**
         * Creates a new ServerUpdate instance using the specified properties.
         * @function create
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {jsbolo.IServerUpdate=} [properties] Properties to set
         * @returns {jsbolo.ServerUpdate} ServerUpdate instance
         */
        ServerUpdate.create = function create(properties) {
            return new ServerUpdate(properties);
        };

        /**
         * Encodes the specified ServerUpdate message. Does not implicitly {@link jsbolo.ServerUpdate.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {jsbolo.IServerUpdate} message ServerUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.tick);
            if (message.tanks != null && message.tanks.length)
                for (let i = 0; i < message.tanks.length; ++i)
                    $root.jsbolo.TankState.encode(message.tanks[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.builders != null && message.builders.length)
                for (let i = 0; i < message.builders.length; ++i)
                    $root.jsbolo.BuilderState.encode(message.builders[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.shells != null && message.shells.length)
                for (let i = 0; i < message.shells.length; ++i)
                    $root.jsbolo.ShellState.encode(message.shells[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.explosions != null && message.explosions.length)
                for (let i = 0; i < message.explosions.length; ++i)
                    $root.jsbolo.ExplosionState.encode(message.explosions[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.terrainChanges != null && message.terrainChanges.length)
                for (let i = 0; i < message.terrainChanges.length; ++i)
                    $root.jsbolo.TerrainChange.encode(message.terrainChanges[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.pillboxes != null && message.pillboxes.length)
                for (let i = 0; i < message.pillboxes.length; ++i)
                    $root.jsbolo.PillboxState.encode(message.pillboxes[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.bases != null && message.bases.length)
                for (let i = 0; i < message.bases.length; ++i)
                    $root.jsbolo.BaseState.encode(message.bases[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ServerUpdate message, length delimited. Does not implicitly {@link jsbolo.ServerUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {jsbolo.IServerUpdate} message ServerUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.ServerUpdate} ServerUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.ServerUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.tick = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.tanks && message.tanks.length))
                            message.tanks = [];
                        message.tanks.push($root.jsbolo.TankState.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.builders && message.builders.length))
                            message.builders = [];
                        message.builders.push($root.jsbolo.BuilderState.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.shells && message.shells.length))
                            message.shells = [];
                        message.shells.push($root.jsbolo.ShellState.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        if (!(message.explosions && message.explosions.length))
                            message.explosions = [];
                        message.explosions.push($root.jsbolo.ExplosionState.decode(reader, reader.uint32()));
                        break;
                    }
                case 6: {
                        if (!(message.terrainChanges && message.terrainChanges.length))
                            message.terrainChanges = [];
                        message.terrainChanges.push($root.jsbolo.TerrainChange.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        if (!(message.pillboxes && message.pillboxes.length))
                            message.pillboxes = [];
                        message.pillboxes.push($root.jsbolo.PillboxState.decode(reader, reader.uint32()));
                        break;
                    }
                case 8: {
                        if (!(message.bases && message.bases.length))
                            message.bases = [];
                        message.bases.push($root.jsbolo.BaseState.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ServerUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.ServerUpdate} ServerUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerUpdate message.
         * @function verify
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tick != null && message.hasOwnProperty("tick"))
                if (!$util.isInteger(message.tick))
                    return "tick: integer expected";
            if (message.tanks != null && message.hasOwnProperty("tanks")) {
                if (!Array.isArray(message.tanks))
                    return "tanks: array expected";
                for (let i = 0; i < message.tanks.length; ++i) {
                    let error = $root.jsbolo.TankState.verify(message.tanks[i]);
                    if (error)
                        return "tanks." + error;
                }
            }
            if (message.builders != null && message.hasOwnProperty("builders")) {
                if (!Array.isArray(message.builders))
                    return "builders: array expected";
                for (let i = 0; i < message.builders.length; ++i) {
                    let error = $root.jsbolo.BuilderState.verify(message.builders[i]);
                    if (error)
                        return "builders." + error;
                }
            }
            if (message.shells != null && message.hasOwnProperty("shells")) {
                if (!Array.isArray(message.shells))
                    return "shells: array expected";
                for (let i = 0; i < message.shells.length; ++i) {
                    let error = $root.jsbolo.ShellState.verify(message.shells[i]);
                    if (error)
                        return "shells." + error;
                }
            }
            if (message.explosions != null && message.hasOwnProperty("explosions")) {
                if (!Array.isArray(message.explosions))
                    return "explosions: array expected";
                for (let i = 0; i < message.explosions.length; ++i) {
                    let error = $root.jsbolo.ExplosionState.verify(message.explosions[i]);
                    if (error)
                        return "explosions." + error;
                }
            }
            if (message.terrainChanges != null && message.hasOwnProperty("terrainChanges")) {
                if (!Array.isArray(message.terrainChanges))
                    return "terrainChanges: array expected";
                for (let i = 0; i < message.terrainChanges.length; ++i) {
                    let error = $root.jsbolo.TerrainChange.verify(message.terrainChanges[i]);
                    if (error)
                        return "terrainChanges." + error;
                }
            }
            if (message.pillboxes != null && message.hasOwnProperty("pillboxes")) {
                if (!Array.isArray(message.pillboxes))
                    return "pillboxes: array expected";
                for (let i = 0; i < message.pillboxes.length; ++i) {
                    let error = $root.jsbolo.PillboxState.verify(message.pillboxes[i]);
                    if (error)
                        return "pillboxes." + error;
                }
            }
            if (message.bases != null && message.hasOwnProperty("bases")) {
                if (!Array.isArray(message.bases))
                    return "bases: array expected";
                for (let i = 0; i < message.bases.length; ++i) {
                    let error = $root.jsbolo.BaseState.verify(message.bases[i]);
                    if (error)
                        return "bases." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ServerUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.ServerUpdate} ServerUpdate
         */
        ServerUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.ServerUpdate)
                return object;
            let message = new $root.jsbolo.ServerUpdate();
            if (object.tick != null)
                message.tick = object.tick >>> 0;
            if (object.tanks) {
                if (!Array.isArray(object.tanks))
                    throw TypeError(".jsbolo.ServerUpdate.tanks: array expected");
                message.tanks = [];
                for (let i = 0; i < object.tanks.length; ++i) {
                    if (typeof object.tanks[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.tanks: object expected");
                    message.tanks[i] = $root.jsbolo.TankState.fromObject(object.tanks[i]);
                }
            }
            if (object.builders) {
                if (!Array.isArray(object.builders))
                    throw TypeError(".jsbolo.ServerUpdate.builders: array expected");
                message.builders = [];
                for (let i = 0; i < object.builders.length; ++i) {
                    if (typeof object.builders[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.builders: object expected");
                    message.builders[i] = $root.jsbolo.BuilderState.fromObject(object.builders[i]);
                }
            }
            if (object.shells) {
                if (!Array.isArray(object.shells))
                    throw TypeError(".jsbolo.ServerUpdate.shells: array expected");
                message.shells = [];
                for (let i = 0; i < object.shells.length; ++i) {
                    if (typeof object.shells[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.shells: object expected");
                    message.shells[i] = $root.jsbolo.ShellState.fromObject(object.shells[i]);
                }
            }
            if (object.explosions) {
                if (!Array.isArray(object.explosions))
                    throw TypeError(".jsbolo.ServerUpdate.explosions: array expected");
                message.explosions = [];
                for (let i = 0; i < object.explosions.length; ++i) {
                    if (typeof object.explosions[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.explosions: object expected");
                    message.explosions[i] = $root.jsbolo.ExplosionState.fromObject(object.explosions[i]);
                }
            }
            if (object.terrainChanges) {
                if (!Array.isArray(object.terrainChanges))
                    throw TypeError(".jsbolo.ServerUpdate.terrainChanges: array expected");
                message.terrainChanges = [];
                for (let i = 0; i < object.terrainChanges.length; ++i) {
                    if (typeof object.terrainChanges[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.terrainChanges: object expected");
                    message.terrainChanges[i] = $root.jsbolo.TerrainChange.fromObject(object.terrainChanges[i]);
                }
            }
            if (object.pillboxes) {
                if (!Array.isArray(object.pillboxes))
                    throw TypeError(".jsbolo.ServerUpdate.pillboxes: array expected");
                message.pillboxes = [];
                for (let i = 0; i < object.pillboxes.length; ++i) {
                    if (typeof object.pillboxes[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.pillboxes: object expected");
                    message.pillboxes[i] = $root.jsbolo.PillboxState.fromObject(object.pillboxes[i]);
                }
            }
            if (object.bases) {
                if (!Array.isArray(object.bases))
                    throw TypeError(".jsbolo.ServerUpdate.bases: array expected");
                message.bases = [];
                for (let i = 0; i < object.bases.length; ++i) {
                    if (typeof object.bases[i] !== "object")
                        throw TypeError(".jsbolo.ServerUpdate.bases: object expected");
                    message.bases[i] = $root.jsbolo.BaseState.fromObject(object.bases[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {jsbolo.ServerUpdate} message ServerUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.tanks = [];
                object.builders = [];
                object.shells = [];
                object.explosions = [];
                object.terrainChanges = [];
                object.pillboxes = [];
                object.bases = [];
            }
            if (options.defaults)
                object.tick = 0;
            if (message.tick != null && message.hasOwnProperty("tick"))
                object.tick = message.tick;
            if (message.tanks && message.tanks.length) {
                object.tanks = [];
                for (let j = 0; j < message.tanks.length; ++j)
                    object.tanks[j] = $root.jsbolo.TankState.toObject(message.tanks[j], options);
            }
            if (message.builders && message.builders.length) {
                object.builders = [];
                for (let j = 0; j < message.builders.length; ++j)
                    object.builders[j] = $root.jsbolo.BuilderState.toObject(message.builders[j], options);
            }
            if (message.shells && message.shells.length) {
                object.shells = [];
                for (let j = 0; j < message.shells.length; ++j)
                    object.shells[j] = $root.jsbolo.ShellState.toObject(message.shells[j], options);
            }
            if (message.explosions && message.explosions.length) {
                object.explosions = [];
                for (let j = 0; j < message.explosions.length; ++j)
                    object.explosions[j] = $root.jsbolo.ExplosionState.toObject(message.explosions[j], options);
            }
            if (message.terrainChanges && message.terrainChanges.length) {
                object.terrainChanges = [];
                for (let j = 0; j < message.terrainChanges.length; ++j)
                    object.terrainChanges[j] = $root.jsbolo.TerrainChange.toObject(message.terrainChanges[j], options);
            }
            if (message.pillboxes && message.pillboxes.length) {
                object.pillboxes = [];
                for (let j = 0; j < message.pillboxes.length; ++j)
                    object.pillboxes[j] = $root.jsbolo.PillboxState.toObject(message.pillboxes[j], options);
            }
            if (message.bases && message.bases.length) {
                object.bases = [];
                for (let j = 0; j < message.bases.length; ++j)
                    object.bases[j] = $root.jsbolo.BaseState.toObject(message.bases[j], options);
            }
            return object;
        };

        /**
         * Converts this ServerUpdate to JSON.
         * @function toJSON
         * @memberof jsbolo.ServerUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ServerUpdate
         * @function getTypeUrl
         * @memberof jsbolo.ServerUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ServerUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.ServerUpdate";
        };

        return ServerUpdate;
    })();

    jsbolo.TankState = (function() {

        /**
         * Properties of a TankState.
         * @memberof jsbolo
         * @interface ITankState
         * @property {number|null} [id] TankState id
         * @property {number|null} [x] TankState x
         * @property {number|null} [y] TankState y
         * @property {number|null} [direction] TankState direction
         * @property {number|null} [speed] TankState speed
         * @property {number|null} [armor] TankState armor
         * @property {number|null} [shells] TankState shells
         * @property {number|null} [mines] TankState mines
         * @property {number|null} [trees] TankState trees
         * @property {number|null} [team] TankState team
         * @property {boolean|null} [onBoat] TankState onBoat
         * @property {number|null} [reload] TankState reload
         * @property {number|null} [firingRange] TankState firingRange
         */

        /**
         * Constructs a new TankState.
         * @memberof jsbolo
         * @classdesc Represents a TankState.
         * @implements ITankState
         * @constructor
         * @param {jsbolo.ITankState=} [properties] Properties to set
         */
        function TankState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TankState id.
         * @member {number} id
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.id = 0;

        /**
         * TankState x.
         * @member {number} x
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.x = 0;

        /**
         * TankState y.
         * @member {number} y
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.y = 0;

        /**
         * TankState direction.
         * @member {number} direction
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.direction = 0;

        /**
         * TankState speed.
         * @member {number} speed
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.speed = 0;

        /**
         * TankState armor.
         * @member {number} armor
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.armor = 0;

        /**
         * TankState shells.
         * @member {number} shells
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.shells = 0;

        /**
         * TankState mines.
         * @member {number} mines
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.mines = 0;

        /**
         * TankState trees.
         * @member {number} trees
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.trees = 0;

        /**
         * TankState team.
         * @member {number} team
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.team = 0;

        /**
         * TankState onBoat.
         * @member {boolean} onBoat
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.onBoat = false;

        /**
         * TankState reload.
         * @member {number} reload
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.reload = 0;

        /**
         * TankState firingRange.
         * @member {number} firingRange
         * @memberof jsbolo.TankState
         * @instance
         */
        TankState.prototype.firingRange = 0;

        /**
         * Creates a new TankState instance using the specified properties.
         * @function create
         * @memberof jsbolo.TankState
         * @static
         * @param {jsbolo.ITankState=} [properties] Properties to set
         * @returns {jsbolo.TankState} TankState instance
         */
        TankState.create = function create(properties) {
            return new TankState(properties);
        };

        /**
         * Encodes the specified TankState message. Does not implicitly {@link jsbolo.TankState.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.TankState
         * @static
         * @param {jsbolo.ITankState} message TankState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TankState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.direction);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.speed);
            if (message.armor != null && Object.hasOwnProperty.call(message, "armor"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.armor);
            if (message.shells != null && Object.hasOwnProperty.call(message, "shells"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.shells);
            if (message.mines != null && Object.hasOwnProperty.call(message, "mines"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.mines);
            if (message.trees != null && Object.hasOwnProperty.call(message, "trees"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.trees);
            if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.team);
            if (message.onBoat != null && Object.hasOwnProperty.call(message, "onBoat"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.onBoat);
            if (message.reload != null && Object.hasOwnProperty.call(message, "reload"))
                writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.reload);
            if (message.firingRange != null && Object.hasOwnProperty.call(message, "firingRange"))
                writer.uint32(/* id 13, wireType 5 =*/109).float(message.firingRange);
            return writer;
        };

        /**
         * Encodes the specified TankState message, length delimited. Does not implicitly {@link jsbolo.TankState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.TankState
         * @static
         * @param {jsbolo.ITankState} message TankState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TankState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TankState message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.TankState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.TankState} TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TankState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.TankState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.x = reader.uint32();
                        break;
                    }
                case 3: {
                        message.y = reader.uint32();
                        break;
                    }
                case 4: {
                        message.direction = reader.uint32();
                        break;
                    }
                case 5: {
                        message.speed = reader.float();
                        break;
                    }
                case 6: {
                        message.armor = reader.uint32();
                        break;
                    }
                case 7: {
                        message.shells = reader.uint32();
                        break;
                    }
                case 8: {
                        message.mines = reader.uint32();
                        break;
                    }
                case 9: {
                        message.trees = reader.uint32();
                        break;
                    }
                case 10: {
                        message.team = reader.uint32();
                        break;
                    }
                case 11: {
                        message.onBoat = reader.bool();
                        break;
                    }
                case 12: {
                        message.reload = reader.uint32();
                        break;
                    }
                case 13: {
                        message.firingRange = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TankState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.TankState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.TankState} TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TankState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TankState message.
         * @function verify
         * @memberof jsbolo.TankState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TankState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (typeof message.speed !== "number")
                    return "speed: number expected";
            if (message.armor != null && message.hasOwnProperty("armor"))
                if (!$util.isInteger(message.armor))
                    return "armor: integer expected";
            if (message.shells != null && message.hasOwnProperty("shells"))
                if (!$util.isInteger(message.shells))
                    return "shells: integer expected";
            if (message.mines != null && message.hasOwnProperty("mines"))
                if (!$util.isInteger(message.mines))
                    return "mines: integer expected";
            if (message.trees != null && message.hasOwnProperty("trees"))
                if (!$util.isInteger(message.trees))
                    return "trees: integer expected";
            if (message.team != null && message.hasOwnProperty("team"))
                if (!$util.isInteger(message.team))
                    return "team: integer expected";
            if (message.onBoat != null && message.hasOwnProperty("onBoat"))
                if (typeof message.onBoat !== "boolean")
                    return "onBoat: boolean expected";
            if (message.reload != null && message.hasOwnProperty("reload"))
                if (!$util.isInteger(message.reload))
                    return "reload: integer expected";
            if (message.firingRange != null && message.hasOwnProperty("firingRange"))
                if (typeof message.firingRange !== "number")
                    return "firingRange: number expected";
            return null;
        };

        /**
         * Creates a TankState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.TankState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.TankState} TankState
         */
        TankState.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.TankState)
                return object;
            let message = new $root.jsbolo.TankState();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            if (object.direction != null)
                message.direction = object.direction >>> 0;
            if (object.speed != null)
                message.speed = Number(object.speed);
            if (object.armor != null)
                message.armor = object.armor >>> 0;
            if (object.shells != null)
                message.shells = object.shells >>> 0;
            if (object.mines != null)
                message.mines = object.mines >>> 0;
            if (object.trees != null)
                message.trees = object.trees >>> 0;
            if (object.team != null)
                message.team = object.team >>> 0;
            if (object.onBoat != null)
                message.onBoat = Boolean(object.onBoat);
            if (object.reload != null)
                message.reload = object.reload >>> 0;
            if (object.firingRange != null)
                message.firingRange = Number(object.firingRange);
            return message;
        };

        /**
         * Creates a plain object from a TankState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.TankState
         * @static
         * @param {jsbolo.TankState} message TankState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TankState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.x = 0;
                object.y = 0;
                object.direction = 0;
                object.speed = 0;
                object.armor = 0;
                object.shells = 0;
                object.mines = 0;
                object.trees = 0;
                object.team = 0;
                object.onBoat = false;
                object.reload = 0;
                object.firingRange = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
            if (message.armor != null && message.hasOwnProperty("armor"))
                object.armor = message.armor;
            if (message.shells != null && message.hasOwnProperty("shells"))
                object.shells = message.shells;
            if (message.mines != null && message.hasOwnProperty("mines"))
                object.mines = message.mines;
            if (message.trees != null && message.hasOwnProperty("trees"))
                object.trees = message.trees;
            if (message.team != null && message.hasOwnProperty("team"))
                object.team = message.team;
            if (message.onBoat != null && message.hasOwnProperty("onBoat"))
                object.onBoat = message.onBoat;
            if (message.reload != null && message.hasOwnProperty("reload"))
                object.reload = message.reload;
            if (message.firingRange != null && message.hasOwnProperty("firingRange"))
                object.firingRange = options.json && !isFinite(message.firingRange) ? String(message.firingRange) : message.firingRange;
            return object;
        };

        /**
         * Converts this TankState to JSON.
         * @function toJSON
         * @memberof jsbolo.TankState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TankState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TankState
         * @function getTypeUrl
         * @memberof jsbolo.TankState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TankState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.TankState";
        };

        return TankState;
    })();

    jsbolo.BuilderState = (function() {

        /**
         * Properties of a BuilderState.
         * @memberof jsbolo
         * @interface IBuilderState
         * @property {number|null} [id] BuilderState id
         * @property {number|null} [ownerTankId] BuilderState ownerTankId
         * @property {number|null} [x] BuilderState x
         * @property {number|null} [y] BuilderState y
         * @property {number|null} [targetX] BuilderState targetX
         * @property {number|null} [targetY] BuilderState targetY
         * @property {jsbolo.BuilderOrder|null} [order] BuilderState order
         * @property {number|null} [trees] BuilderState trees
         * @property {boolean|null} [hasMine] BuilderState hasMine
         * @property {number|null} [team] BuilderState team
         */

        /**
         * Constructs a new BuilderState.
         * @memberof jsbolo
         * @classdesc Represents a BuilderState.
         * @implements IBuilderState
         * @constructor
         * @param {jsbolo.IBuilderState=} [properties] Properties to set
         */
        function BuilderState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BuilderState id.
         * @member {number} id
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.id = 0;

        /**
         * BuilderState ownerTankId.
         * @member {number} ownerTankId
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.ownerTankId = 0;

        /**
         * BuilderState x.
         * @member {number} x
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.x = 0;

        /**
         * BuilderState y.
         * @member {number} y
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.y = 0;

        /**
         * BuilderState targetX.
         * @member {number} targetX
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.targetX = 0;

        /**
         * BuilderState targetY.
         * @member {number} targetY
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.targetY = 0;

        /**
         * BuilderState order.
         * @member {jsbolo.BuilderOrder} order
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.order = 0;

        /**
         * BuilderState trees.
         * @member {number} trees
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.trees = 0;

        /**
         * BuilderState hasMine.
         * @member {boolean} hasMine
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.hasMine = false;

        /**
         * BuilderState team.
         * @member {number} team
         * @memberof jsbolo.BuilderState
         * @instance
         */
        BuilderState.prototype.team = 0;

        /**
         * Creates a new BuilderState instance using the specified properties.
         * @function create
         * @memberof jsbolo.BuilderState
         * @static
         * @param {jsbolo.IBuilderState=} [properties] Properties to set
         * @returns {jsbolo.BuilderState} BuilderState instance
         */
        BuilderState.create = function create(properties) {
            return new BuilderState(properties);
        };

        /**
         * Encodes the specified BuilderState message. Does not implicitly {@link jsbolo.BuilderState.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.BuilderState
         * @static
         * @param {jsbolo.IBuilderState} message BuilderState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuilderState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.ownerTankId != null && Object.hasOwnProperty.call(message, "ownerTankId"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.ownerTankId);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.y);
            if (message.targetX != null && Object.hasOwnProperty.call(message, "targetX"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.targetX);
            if (message.targetY != null && Object.hasOwnProperty.call(message, "targetY"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.targetY);
            if (message.order != null && Object.hasOwnProperty.call(message, "order"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.order);
            if (message.trees != null && Object.hasOwnProperty.call(message, "trees"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.trees);
            if (message.hasMine != null && Object.hasOwnProperty.call(message, "hasMine"))
                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.hasMine);
            if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.team);
            return writer;
        };

        /**
         * Encodes the specified BuilderState message, length delimited. Does not implicitly {@link jsbolo.BuilderState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.BuilderState
         * @static
         * @param {jsbolo.IBuilderState} message BuilderState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuilderState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BuilderState message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.BuilderState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.BuilderState} BuilderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuilderState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.BuilderState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.ownerTankId = reader.uint32();
                        break;
                    }
                case 3: {
                        message.x = reader.uint32();
                        break;
                    }
                case 4: {
                        message.y = reader.uint32();
                        break;
                    }
                case 5: {
                        message.targetX = reader.uint32();
                        break;
                    }
                case 6: {
                        message.targetY = reader.uint32();
                        break;
                    }
                case 7: {
                        message.order = reader.int32();
                        break;
                    }
                case 8: {
                        message.trees = reader.uint32();
                        break;
                    }
                case 9: {
                        message.hasMine = reader.bool();
                        break;
                    }
                case 10: {
                        message.team = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BuilderState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.BuilderState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.BuilderState} BuilderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuilderState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BuilderState message.
         * @function verify
         * @memberof jsbolo.BuilderState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BuilderState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.ownerTankId != null && message.hasOwnProperty("ownerTankId"))
                if (!$util.isInteger(message.ownerTankId))
                    return "ownerTankId: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.targetX != null && message.hasOwnProperty("targetX"))
                if (!$util.isInteger(message.targetX))
                    return "targetX: integer expected";
            if (message.targetY != null && message.hasOwnProperty("targetY"))
                if (!$util.isInteger(message.targetY))
                    return "targetY: integer expected";
            if (message.order != null && message.hasOwnProperty("order"))
                switch (message.order) {
                default:
                    return "order: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                    break;
                }
            if (message.trees != null && message.hasOwnProperty("trees"))
                if (!$util.isInteger(message.trees))
                    return "trees: integer expected";
            if (message.hasMine != null && message.hasOwnProperty("hasMine"))
                if (typeof message.hasMine !== "boolean")
                    return "hasMine: boolean expected";
            if (message.team != null && message.hasOwnProperty("team"))
                if (!$util.isInteger(message.team))
                    return "team: integer expected";
            return null;
        };

        /**
         * Creates a BuilderState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.BuilderState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.BuilderState} BuilderState
         */
        BuilderState.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.BuilderState)
                return object;
            let message = new $root.jsbolo.BuilderState();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.ownerTankId != null)
                message.ownerTankId = object.ownerTankId >>> 0;
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            if (object.targetX != null)
                message.targetX = object.targetX >>> 0;
            if (object.targetY != null)
                message.targetY = object.targetY >>> 0;
            switch (object.order) {
            default:
                if (typeof object.order === "number") {
                    message.order = object.order;
                    break;
                }
                break;
            case "IN_TANK":
            case 0:
                message.order = 0;
                break;
            case "WAITING":
            case 1:
                message.order = 1;
                break;
            case "RETURNING":
            case 2:
                message.order = 2;
                break;
            case "PARACHUTING":
            case 3:
                message.order = 3;
                break;
            case "HARVESTING":
            case 10:
                message.order = 10;
                break;
            case "BUILDING_ROAD":
            case 11:
                message.order = 11;
                break;
            case "REPAIRING":
            case 12:
                message.order = 12;
                break;
            case "BUILDING_BOAT":
            case 13:
                message.order = 13;
                break;
            case "BUILDING_WALL":
            case 14:
                message.order = 14;
                break;
            case "PLACING_PILLBOX":
            case 15:
                message.order = 15;
                break;
            case "LAYING_MINE":
            case 16:
                message.order = 16;
                break;
            }
            if (object.trees != null)
                message.trees = object.trees >>> 0;
            if (object.hasMine != null)
                message.hasMine = Boolean(object.hasMine);
            if (object.team != null)
                message.team = object.team >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BuilderState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.BuilderState
         * @static
         * @param {jsbolo.BuilderState} message BuilderState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BuilderState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.ownerTankId = 0;
                object.x = 0;
                object.y = 0;
                object.targetX = 0;
                object.targetY = 0;
                object.order = options.enums === String ? "IN_TANK" : 0;
                object.trees = 0;
                object.hasMine = false;
                object.team = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.ownerTankId != null && message.hasOwnProperty("ownerTankId"))
                object.ownerTankId = message.ownerTankId;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.targetX != null && message.hasOwnProperty("targetX"))
                object.targetX = message.targetX;
            if (message.targetY != null && message.hasOwnProperty("targetY"))
                object.targetY = message.targetY;
            if (message.order != null && message.hasOwnProperty("order"))
                object.order = options.enums === String ? $root.jsbolo.BuilderOrder[message.order] === undefined ? message.order : $root.jsbolo.BuilderOrder[message.order] : message.order;
            if (message.trees != null && message.hasOwnProperty("trees"))
                object.trees = message.trees;
            if (message.hasMine != null && message.hasOwnProperty("hasMine"))
                object.hasMine = message.hasMine;
            if (message.team != null && message.hasOwnProperty("team"))
                object.team = message.team;
            return object;
        };

        /**
         * Converts this BuilderState to JSON.
         * @function toJSON
         * @memberof jsbolo.BuilderState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BuilderState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BuilderState
         * @function getTypeUrl
         * @memberof jsbolo.BuilderState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BuilderState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.BuilderState";
        };

        return BuilderState;
    })();

    /**
     * BuilderOrder enum.
     * @name jsbolo.BuilderOrder
     * @enum {number}
     * @property {number} IN_TANK=0 IN_TANK value
     * @property {number} WAITING=1 WAITING value
     * @property {number} RETURNING=2 RETURNING value
     * @property {number} PARACHUTING=3 PARACHUTING value
     * @property {number} HARVESTING=10 HARVESTING value
     * @property {number} BUILDING_ROAD=11 BUILDING_ROAD value
     * @property {number} REPAIRING=12 REPAIRING value
     * @property {number} BUILDING_BOAT=13 BUILDING_BOAT value
     * @property {number} BUILDING_WALL=14 BUILDING_WALL value
     * @property {number} PLACING_PILLBOX=15 PLACING_PILLBOX value
     * @property {number} LAYING_MINE=16 LAYING_MINE value
     */
    jsbolo.BuilderOrder = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "IN_TANK"] = 0;
        values[valuesById[1] = "WAITING"] = 1;
        values[valuesById[2] = "RETURNING"] = 2;
        values[valuesById[3] = "PARACHUTING"] = 3;
        values[valuesById[10] = "HARVESTING"] = 10;
        values[valuesById[11] = "BUILDING_ROAD"] = 11;
        values[valuesById[12] = "REPAIRING"] = 12;
        values[valuesById[13] = "BUILDING_BOAT"] = 13;
        values[valuesById[14] = "BUILDING_WALL"] = 14;
        values[valuesById[15] = "PLACING_PILLBOX"] = 15;
        values[valuesById[16] = "LAYING_MINE"] = 16;
        return values;
    })();

    jsbolo.ShellState = (function() {

        /**
         * Properties of a ShellState.
         * @memberof jsbolo
         * @interface IShellState
         * @property {number|null} [id] ShellState id
         * @property {number|null} [x] ShellState x
         * @property {number|null} [y] ShellState y
         * @property {number|null} [direction] ShellState direction
         * @property {number|null} [ownerTankId] ShellState ownerTankId
         */

        /**
         * Constructs a new ShellState.
         * @memberof jsbolo
         * @classdesc Represents a ShellState.
         * @implements IShellState
         * @constructor
         * @param {jsbolo.IShellState=} [properties] Properties to set
         */
        function ShellState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShellState id.
         * @member {number} id
         * @memberof jsbolo.ShellState
         * @instance
         */
        ShellState.prototype.id = 0;

        /**
         * ShellState x.
         * @member {number} x
         * @memberof jsbolo.ShellState
         * @instance
         */
        ShellState.prototype.x = 0;

        /**
         * ShellState y.
         * @member {number} y
         * @memberof jsbolo.ShellState
         * @instance
         */
        ShellState.prototype.y = 0;

        /**
         * ShellState direction.
         * @member {number} direction
         * @memberof jsbolo.ShellState
         * @instance
         */
        ShellState.prototype.direction = 0;

        /**
         * ShellState ownerTankId.
         * @member {number} ownerTankId
         * @memberof jsbolo.ShellState
         * @instance
         */
        ShellState.prototype.ownerTankId = 0;

        /**
         * Creates a new ShellState instance using the specified properties.
         * @function create
         * @memberof jsbolo.ShellState
         * @static
         * @param {jsbolo.IShellState=} [properties] Properties to set
         * @returns {jsbolo.ShellState} ShellState instance
         */
        ShellState.create = function create(properties) {
            return new ShellState(properties);
        };

        /**
         * Encodes the specified ShellState message. Does not implicitly {@link jsbolo.ShellState.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.ShellState
         * @static
         * @param {jsbolo.IShellState} message ShellState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShellState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.direction);
            if (message.ownerTankId != null && Object.hasOwnProperty.call(message, "ownerTankId"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.ownerTankId);
            return writer;
        };

        /**
         * Encodes the specified ShellState message, length delimited. Does not implicitly {@link jsbolo.ShellState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.ShellState
         * @static
         * @param {jsbolo.IShellState} message ShellState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShellState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ShellState message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.ShellState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.ShellState} ShellState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShellState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.ShellState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.x = reader.uint32();
                        break;
                    }
                case 3: {
                        message.y = reader.uint32();
                        break;
                    }
                case 4: {
                        message.direction = reader.uint32();
                        break;
                    }
                case 5: {
                        message.ownerTankId = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ShellState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.ShellState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.ShellState} ShellState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShellState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ShellState message.
         * @function verify
         * @memberof jsbolo.ShellState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ShellState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.ownerTankId != null && message.hasOwnProperty("ownerTankId"))
                if (!$util.isInteger(message.ownerTankId))
                    return "ownerTankId: integer expected";
            return null;
        };

        /**
         * Creates a ShellState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.ShellState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.ShellState} ShellState
         */
        ShellState.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.ShellState)
                return object;
            let message = new $root.jsbolo.ShellState();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            if (object.direction != null)
                message.direction = object.direction >>> 0;
            if (object.ownerTankId != null)
                message.ownerTankId = object.ownerTankId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ShellState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.ShellState
         * @static
         * @param {jsbolo.ShellState} message ShellState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ShellState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.x = 0;
                object.y = 0;
                object.direction = 0;
                object.ownerTankId = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.ownerTankId != null && message.hasOwnProperty("ownerTankId"))
                object.ownerTankId = message.ownerTankId;
            return object;
        };

        /**
         * Converts this ShellState to JSON.
         * @function toJSON
         * @memberof jsbolo.ShellState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ShellState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ShellState
         * @function getTypeUrl
         * @memberof jsbolo.ShellState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ShellState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.ShellState";
        };

        return ShellState;
    })();

    jsbolo.ExplosionState = (function() {

        /**
         * Properties of an ExplosionState.
         * @memberof jsbolo
         * @interface IExplosionState
         * @property {number|null} [id] ExplosionState id
         * @property {number|null} [x] ExplosionState x
         * @property {number|null} [y] ExplosionState y
         * @property {jsbolo.ExplosionType|null} [type] ExplosionState type
         * @property {number|null} [frame] ExplosionState frame
         */

        /**
         * Constructs a new ExplosionState.
         * @memberof jsbolo
         * @classdesc Represents an ExplosionState.
         * @implements IExplosionState
         * @constructor
         * @param {jsbolo.IExplosionState=} [properties] Properties to set
         */
        function ExplosionState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExplosionState id.
         * @member {number} id
         * @memberof jsbolo.ExplosionState
         * @instance
         */
        ExplosionState.prototype.id = 0;

        /**
         * ExplosionState x.
         * @member {number} x
         * @memberof jsbolo.ExplosionState
         * @instance
         */
        ExplosionState.prototype.x = 0;

        /**
         * ExplosionState y.
         * @member {number} y
         * @memberof jsbolo.ExplosionState
         * @instance
         */
        ExplosionState.prototype.y = 0;

        /**
         * ExplosionState type.
         * @member {jsbolo.ExplosionType} type
         * @memberof jsbolo.ExplosionState
         * @instance
         */
        ExplosionState.prototype.type = 0;

        /**
         * ExplosionState frame.
         * @member {number} frame
         * @memberof jsbolo.ExplosionState
         * @instance
         */
        ExplosionState.prototype.frame = 0;

        /**
         * Creates a new ExplosionState instance using the specified properties.
         * @function create
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {jsbolo.IExplosionState=} [properties] Properties to set
         * @returns {jsbolo.ExplosionState} ExplosionState instance
         */
        ExplosionState.create = function create(properties) {
            return new ExplosionState(properties);
        };

        /**
         * Encodes the specified ExplosionState message. Does not implicitly {@link jsbolo.ExplosionState.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {jsbolo.IExplosionState} message ExplosionState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExplosionState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
            if (message.frame != null && Object.hasOwnProperty.call(message, "frame"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.frame);
            return writer;
        };

        /**
         * Encodes the specified ExplosionState message, length delimited. Does not implicitly {@link jsbolo.ExplosionState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {jsbolo.IExplosionState} message ExplosionState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExplosionState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExplosionState message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.ExplosionState} ExplosionState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExplosionState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.ExplosionState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.x = reader.uint32();
                        break;
                    }
                case 3: {
                        message.y = reader.uint32();
                        break;
                    }
                case 4: {
                        message.type = reader.int32();
                        break;
                    }
                case 5: {
                        message.frame = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExplosionState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.ExplosionState} ExplosionState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExplosionState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExplosionState message.
         * @function verify
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExplosionState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.frame != null && message.hasOwnProperty("frame"))
                if (!$util.isInteger(message.frame))
                    return "frame: integer expected";
            return null;
        };

        /**
         * Creates an ExplosionState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.ExplosionState} ExplosionState
         */
        ExplosionState.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.ExplosionState)
                return object;
            let message = new $root.jsbolo.ExplosionState();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "SMALL":
            case 0:
                message.type = 0;
                break;
            case "LARGE":
            case 1:
                message.type = 1;
                break;
            case "MINE":
            case 2:
                message.type = 2;
                break;
            }
            if (object.frame != null)
                message.frame = object.frame >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an ExplosionState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {jsbolo.ExplosionState} message ExplosionState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExplosionState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.x = 0;
                object.y = 0;
                object.type = options.enums === String ? "SMALL" : 0;
                object.frame = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.jsbolo.ExplosionType[message.type] === undefined ? message.type : $root.jsbolo.ExplosionType[message.type] : message.type;
            if (message.frame != null && message.hasOwnProperty("frame"))
                object.frame = message.frame;
            return object;
        };

        /**
         * Converts this ExplosionState to JSON.
         * @function toJSON
         * @memberof jsbolo.ExplosionState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExplosionState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExplosionState
         * @function getTypeUrl
         * @memberof jsbolo.ExplosionState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExplosionState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.ExplosionState";
        };

        return ExplosionState;
    })();

    /**
     * ExplosionType enum.
     * @name jsbolo.ExplosionType
     * @enum {number}
     * @property {number} SMALL=0 SMALL value
     * @property {number} LARGE=1 LARGE value
     * @property {number} MINE=2 MINE value
     */
    jsbolo.ExplosionType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SMALL"] = 0;
        values[valuesById[1] = "LARGE"] = 1;
        values[valuesById[2] = "MINE"] = 2;
        return values;
    })();

    jsbolo.TerrainChange = (function() {

        /**
         * Properties of a TerrainChange.
         * @memberof jsbolo
         * @interface ITerrainChange
         * @property {number|null} [tileX] TerrainChange tileX
         * @property {number|null} [tileY] TerrainChange tileY
         * @property {number|null} [terrainType] TerrainChange terrainType
         * @property {boolean|null} [hasMine] TerrainChange hasMine
         */

        /**
         * Constructs a new TerrainChange.
         * @memberof jsbolo
         * @classdesc Represents a TerrainChange.
         * @implements ITerrainChange
         * @constructor
         * @param {jsbolo.ITerrainChange=} [properties] Properties to set
         */
        function TerrainChange(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TerrainChange tileX.
         * @member {number} tileX
         * @memberof jsbolo.TerrainChange
         * @instance
         */
        TerrainChange.prototype.tileX = 0;

        /**
         * TerrainChange tileY.
         * @member {number} tileY
         * @memberof jsbolo.TerrainChange
         * @instance
         */
        TerrainChange.prototype.tileY = 0;

        /**
         * TerrainChange terrainType.
         * @member {number} terrainType
         * @memberof jsbolo.TerrainChange
         * @instance
         */
        TerrainChange.prototype.terrainType = 0;

        /**
         * TerrainChange hasMine.
         * @member {boolean} hasMine
         * @memberof jsbolo.TerrainChange
         * @instance
         */
        TerrainChange.prototype.hasMine = false;

        /**
         * Creates a new TerrainChange instance using the specified properties.
         * @function create
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {jsbolo.ITerrainChange=} [properties] Properties to set
         * @returns {jsbolo.TerrainChange} TerrainChange instance
         */
        TerrainChange.create = function create(properties) {
            return new TerrainChange(properties);
        };

        /**
         * Encodes the specified TerrainChange message. Does not implicitly {@link jsbolo.TerrainChange.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {jsbolo.ITerrainChange} message TerrainChange message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TerrainChange.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tileX != null && Object.hasOwnProperty.call(message, "tileX"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.tileX);
            if (message.tileY != null && Object.hasOwnProperty.call(message, "tileY"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tileY);
            if (message.terrainType != null && Object.hasOwnProperty.call(message, "terrainType"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.terrainType);
            if (message.hasMine != null && Object.hasOwnProperty.call(message, "hasMine"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.hasMine);
            return writer;
        };

        /**
         * Encodes the specified TerrainChange message, length delimited. Does not implicitly {@link jsbolo.TerrainChange.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {jsbolo.ITerrainChange} message TerrainChange message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TerrainChange.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TerrainChange message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.TerrainChange} TerrainChange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TerrainChange.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.TerrainChange();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.tileX = reader.uint32();
                        break;
                    }
                case 2: {
                        message.tileY = reader.uint32();
                        break;
                    }
                case 3: {
                        message.terrainType = reader.uint32();
                        break;
                    }
                case 4: {
                        message.hasMine = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TerrainChange message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.TerrainChange} TerrainChange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TerrainChange.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TerrainChange message.
         * @function verify
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TerrainChange.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tileX != null && message.hasOwnProperty("tileX"))
                if (!$util.isInteger(message.tileX))
                    return "tileX: integer expected";
            if (message.tileY != null && message.hasOwnProperty("tileY"))
                if (!$util.isInteger(message.tileY))
                    return "tileY: integer expected";
            if (message.terrainType != null && message.hasOwnProperty("terrainType"))
                if (!$util.isInteger(message.terrainType))
                    return "terrainType: integer expected";
            if (message.hasMine != null && message.hasOwnProperty("hasMine"))
                if (typeof message.hasMine !== "boolean")
                    return "hasMine: boolean expected";
            return null;
        };

        /**
         * Creates a TerrainChange message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.TerrainChange} TerrainChange
         */
        TerrainChange.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.TerrainChange)
                return object;
            let message = new $root.jsbolo.TerrainChange();
            if (object.tileX != null)
                message.tileX = object.tileX >>> 0;
            if (object.tileY != null)
                message.tileY = object.tileY >>> 0;
            if (object.terrainType != null)
                message.terrainType = object.terrainType >>> 0;
            if (object.hasMine != null)
                message.hasMine = Boolean(object.hasMine);
            return message;
        };

        /**
         * Creates a plain object from a TerrainChange message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {jsbolo.TerrainChange} message TerrainChange
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TerrainChange.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.tileX = 0;
                object.tileY = 0;
                object.terrainType = 0;
                object.hasMine = false;
            }
            if (message.tileX != null && message.hasOwnProperty("tileX"))
                object.tileX = message.tileX;
            if (message.tileY != null && message.hasOwnProperty("tileY"))
                object.tileY = message.tileY;
            if (message.terrainType != null && message.hasOwnProperty("terrainType"))
                object.terrainType = message.terrainType;
            if (message.hasMine != null && message.hasOwnProperty("hasMine"))
                object.hasMine = message.hasMine;
            return object;
        };

        /**
         * Converts this TerrainChange to JSON.
         * @function toJSON
         * @memberof jsbolo.TerrainChange
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TerrainChange.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TerrainChange
         * @function getTypeUrl
         * @memberof jsbolo.TerrainChange
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TerrainChange.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.TerrainChange";
        };

        return TerrainChange;
    })();

    jsbolo.PillboxState = (function() {

        /**
         * Properties of a PillboxState.
         * @memberof jsbolo
         * @interface IPillboxState
         * @property {number|null} [id] PillboxState id
         * @property {number|null} [tileX] PillboxState tileX
         * @property {number|null} [tileY] PillboxState tileY
         * @property {number|null} [armor] PillboxState armor
         * @property {number|null} [ownerTeam] PillboxState ownerTeam
         * @property {boolean|null} [inTank] PillboxState inTank
         */

        /**
         * Constructs a new PillboxState.
         * @memberof jsbolo
         * @classdesc Represents a PillboxState.
         * @implements IPillboxState
         * @constructor
         * @param {jsbolo.IPillboxState=} [properties] Properties to set
         */
        function PillboxState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PillboxState id.
         * @member {number} id
         * @memberof jsbolo.PillboxState
         * @instance
         */
        PillboxState.prototype.id = 0;

        /**
         * PillboxState tileX.
         * @member {number} tileX
         * @memberof jsbolo.PillboxState
         * @instance
         */
        PillboxState.prototype.tileX = 0;

        /**
         * PillboxState tileY.
         * @member {number} tileY
         * @memberof jsbolo.PillboxState
         * @instance
         */
        PillboxState.prototype.tileY = 0;

        /**
         * PillboxState armor.
         * @member {number} armor
         * @memberof jsbolo.PillboxState
         * @instance
         */
        PillboxState.prototype.armor = 0;

        /**
         * PillboxState ownerTeam.
         * @member {number} ownerTeam
         * @memberof jsbolo.PillboxState
         * @instance
         */
        PillboxState.prototype.ownerTeam = 0;

        /**
         * PillboxState inTank.
         * @member {boolean} inTank
         * @memberof jsbolo.PillboxState
         * @instance
         */
        PillboxState.prototype.inTank = false;

        /**
         * Creates a new PillboxState instance using the specified properties.
         * @function create
         * @memberof jsbolo.PillboxState
         * @static
         * @param {jsbolo.IPillboxState=} [properties] Properties to set
         * @returns {jsbolo.PillboxState} PillboxState instance
         */
        PillboxState.create = function create(properties) {
            return new PillboxState(properties);
        };

        /**
         * Encodes the specified PillboxState message. Does not implicitly {@link jsbolo.PillboxState.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.PillboxState
         * @static
         * @param {jsbolo.IPillboxState} message PillboxState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PillboxState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.tileX != null && Object.hasOwnProperty.call(message, "tileX"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tileX);
            if (message.tileY != null && Object.hasOwnProperty.call(message, "tileY"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.tileY);
            if (message.armor != null && Object.hasOwnProperty.call(message, "armor"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.armor);
            if (message.ownerTeam != null && Object.hasOwnProperty.call(message, "ownerTeam"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.ownerTeam);
            if (message.inTank != null && Object.hasOwnProperty.call(message, "inTank"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.inTank);
            return writer;
        };

        /**
         * Encodes the specified PillboxState message, length delimited. Does not implicitly {@link jsbolo.PillboxState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.PillboxState
         * @static
         * @param {jsbolo.IPillboxState} message PillboxState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PillboxState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PillboxState message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.PillboxState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.PillboxState} PillboxState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PillboxState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.PillboxState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.tileX = reader.uint32();
                        break;
                    }
                case 3: {
                        message.tileY = reader.uint32();
                        break;
                    }
                case 4: {
                        message.armor = reader.uint32();
                        break;
                    }
                case 5: {
                        message.ownerTeam = reader.uint32();
                        break;
                    }
                case 6: {
                        message.inTank = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PillboxState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.PillboxState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.PillboxState} PillboxState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PillboxState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PillboxState message.
         * @function verify
         * @memberof jsbolo.PillboxState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PillboxState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.tileX != null && message.hasOwnProperty("tileX"))
                if (!$util.isInteger(message.tileX))
                    return "tileX: integer expected";
            if (message.tileY != null && message.hasOwnProperty("tileY"))
                if (!$util.isInteger(message.tileY))
                    return "tileY: integer expected";
            if (message.armor != null && message.hasOwnProperty("armor"))
                if (!$util.isInteger(message.armor))
                    return "armor: integer expected";
            if (message.ownerTeam != null && message.hasOwnProperty("ownerTeam"))
                if (!$util.isInteger(message.ownerTeam))
                    return "ownerTeam: integer expected";
            if (message.inTank != null && message.hasOwnProperty("inTank"))
                if (typeof message.inTank !== "boolean")
                    return "inTank: boolean expected";
            return null;
        };

        /**
         * Creates a PillboxState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.PillboxState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.PillboxState} PillboxState
         */
        PillboxState.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.PillboxState)
                return object;
            let message = new $root.jsbolo.PillboxState();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.tileX != null)
                message.tileX = object.tileX >>> 0;
            if (object.tileY != null)
                message.tileY = object.tileY >>> 0;
            if (object.armor != null)
                message.armor = object.armor >>> 0;
            if (object.ownerTeam != null)
                message.ownerTeam = object.ownerTeam >>> 0;
            if (object.inTank != null)
                message.inTank = Boolean(object.inTank);
            return message;
        };

        /**
         * Creates a plain object from a PillboxState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.PillboxState
         * @static
         * @param {jsbolo.PillboxState} message PillboxState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PillboxState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.tileX = 0;
                object.tileY = 0;
                object.armor = 0;
                object.ownerTeam = 0;
                object.inTank = false;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.tileX != null && message.hasOwnProperty("tileX"))
                object.tileX = message.tileX;
            if (message.tileY != null && message.hasOwnProperty("tileY"))
                object.tileY = message.tileY;
            if (message.armor != null && message.hasOwnProperty("armor"))
                object.armor = message.armor;
            if (message.ownerTeam != null && message.hasOwnProperty("ownerTeam"))
                object.ownerTeam = message.ownerTeam;
            if (message.inTank != null && message.hasOwnProperty("inTank"))
                object.inTank = message.inTank;
            return object;
        };

        /**
         * Converts this PillboxState to JSON.
         * @function toJSON
         * @memberof jsbolo.PillboxState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PillboxState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PillboxState
         * @function getTypeUrl
         * @memberof jsbolo.PillboxState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PillboxState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.PillboxState";
        };

        return PillboxState;
    })();

    jsbolo.BaseState = (function() {

        /**
         * Properties of a BaseState.
         * @memberof jsbolo
         * @interface IBaseState
         * @property {number|null} [id] BaseState id
         * @property {number|null} [tileX] BaseState tileX
         * @property {number|null} [tileY] BaseState tileY
         * @property {number|null} [armor] BaseState armor
         * @property {number|null} [shells] BaseState shells
         * @property {number|null} [mines] BaseState mines
         * @property {number|null} [ownerTeam] BaseState ownerTeam
         */

        /**
         * Constructs a new BaseState.
         * @memberof jsbolo
         * @classdesc Represents a BaseState.
         * @implements IBaseState
         * @constructor
         * @param {jsbolo.IBaseState=} [properties] Properties to set
         */
        function BaseState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BaseState id.
         * @member {number} id
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.id = 0;

        /**
         * BaseState tileX.
         * @member {number} tileX
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.tileX = 0;

        /**
         * BaseState tileY.
         * @member {number} tileY
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.tileY = 0;

        /**
         * BaseState armor.
         * @member {number} armor
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.armor = 0;

        /**
         * BaseState shells.
         * @member {number} shells
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.shells = 0;

        /**
         * BaseState mines.
         * @member {number} mines
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.mines = 0;

        /**
         * BaseState ownerTeam.
         * @member {number} ownerTeam
         * @memberof jsbolo.BaseState
         * @instance
         */
        BaseState.prototype.ownerTeam = 0;

        /**
         * Creates a new BaseState instance using the specified properties.
         * @function create
         * @memberof jsbolo.BaseState
         * @static
         * @param {jsbolo.IBaseState=} [properties] Properties to set
         * @returns {jsbolo.BaseState} BaseState instance
         */
        BaseState.create = function create(properties) {
            return new BaseState(properties);
        };

        /**
         * Encodes the specified BaseState message. Does not implicitly {@link jsbolo.BaseState.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.BaseState
         * @static
         * @param {jsbolo.IBaseState} message BaseState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaseState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.tileX != null && Object.hasOwnProperty.call(message, "tileX"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tileX);
            if (message.tileY != null && Object.hasOwnProperty.call(message, "tileY"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.tileY);
            if (message.armor != null && Object.hasOwnProperty.call(message, "armor"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.armor);
            if (message.shells != null && Object.hasOwnProperty.call(message, "shells"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.shells);
            if (message.mines != null && Object.hasOwnProperty.call(message, "mines"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.mines);
            if (message.ownerTeam != null && Object.hasOwnProperty.call(message, "ownerTeam"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.ownerTeam);
            return writer;
        };

        /**
         * Encodes the specified BaseState message, length delimited. Does not implicitly {@link jsbolo.BaseState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.BaseState
         * @static
         * @param {jsbolo.IBaseState} message BaseState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaseState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BaseState message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.BaseState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.BaseState} BaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaseState.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.BaseState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.tileX = reader.uint32();
                        break;
                    }
                case 3: {
                        message.tileY = reader.uint32();
                        break;
                    }
                case 4: {
                        message.armor = reader.uint32();
                        break;
                    }
                case 5: {
                        message.shells = reader.uint32();
                        break;
                    }
                case 6: {
                        message.mines = reader.uint32();
                        break;
                    }
                case 7: {
                        message.ownerTeam = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BaseState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.BaseState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.BaseState} BaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaseState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BaseState message.
         * @function verify
         * @memberof jsbolo.BaseState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BaseState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.tileX != null && message.hasOwnProperty("tileX"))
                if (!$util.isInteger(message.tileX))
                    return "tileX: integer expected";
            if (message.tileY != null && message.hasOwnProperty("tileY"))
                if (!$util.isInteger(message.tileY))
                    return "tileY: integer expected";
            if (message.armor != null && message.hasOwnProperty("armor"))
                if (!$util.isInteger(message.armor))
                    return "armor: integer expected";
            if (message.shells != null && message.hasOwnProperty("shells"))
                if (!$util.isInteger(message.shells))
                    return "shells: integer expected";
            if (message.mines != null && message.hasOwnProperty("mines"))
                if (!$util.isInteger(message.mines))
                    return "mines: integer expected";
            if (message.ownerTeam != null && message.hasOwnProperty("ownerTeam"))
                if (!$util.isInteger(message.ownerTeam))
                    return "ownerTeam: integer expected";
            return null;
        };

        /**
         * Creates a BaseState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.BaseState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.BaseState} BaseState
         */
        BaseState.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.BaseState)
                return object;
            let message = new $root.jsbolo.BaseState();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.tileX != null)
                message.tileX = object.tileX >>> 0;
            if (object.tileY != null)
                message.tileY = object.tileY >>> 0;
            if (object.armor != null)
                message.armor = object.armor >>> 0;
            if (object.shells != null)
                message.shells = object.shells >>> 0;
            if (object.mines != null)
                message.mines = object.mines >>> 0;
            if (object.ownerTeam != null)
                message.ownerTeam = object.ownerTeam >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BaseState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.BaseState
         * @static
         * @param {jsbolo.BaseState} message BaseState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BaseState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.tileX = 0;
                object.tileY = 0;
                object.armor = 0;
                object.shells = 0;
                object.mines = 0;
                object.ownerTeam = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.tileX != null && message.hasOwnProperty("tileX"))
                object.tileX = message.tileX;
            if (message.tileY != null && message.hasOwnProperty("tileY"))
                object.tileY = message.tileY;
            if (message.armor != null && message.hasOwnProperty("armor"))
                object.armor = message.armor;
            if (message.shells != null && message.hasOwnProperty("shells"))
                object.shells = message.shells;
            if (message.mines != null && message.hasOwnProperty("mines"))
                object.mines = message.mines;
            if (message.ownerTeam != null && message.hasOwnProperty("ownerTeam"))
                object.ownerTeam = message.ownerTeam;
            return object;
        };

        /**
         * Converts this BaseState to JSON.
         * @function toJSON
         * @memberof jsbolo.BaseState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BaseState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BaseState
         * @function getTypeUrl
         * @memberof jsbolo.BaseState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BaseState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.BaseState";
        };

        return BaseState;
    })();

    jsbolo.CreateEntity = (function() {

        /**
         * Properties of a CreateEntity.
         * @memberof jsbolo
         * @interface ICreateEntity
         * @property {jsbolo.ITankState|null} [tank] CreateEntity tank
         * @property {jsbolo.IBuilderState|null} [builder] CreateEntity builder
         * @property {jsbolo.IShellState|null} [shell] CreateEntity shell
         * @property {jsbolo.IExplosionState|null} [explosion] CreateEntity explosion
         * @property {jsbolo.IPillboxState|null} [pillbox] CreateEntity pillbox
         * @property {jsbolo.IBaseState|null} [base] CreateEntity base
         */

        /**
         * Constructs a new CreateEntity.
         * @memberof jsbolo
         * @classdesc Represents a CreateEntity.
         * @implements ICreateEntity
         * @constructor
         * @param {jsbolo.ICreateEntity=} [properties] Properties to set
         */
        function CreateEntity(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateEntity tank.
         * @member {jsbolo.ITankState|null|undefined} tank
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        CreateEntity.prototype.tank = null;

        /**
         * CreateEntity builder.
         * @member {jsbolo.IBuilderState|null|undefined} builder
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        CreateEntity.prototype.builder = null;

        /**
         * CreateEntity shell.
         * @member {jsbolo.IShellState|null|undefined} shell
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        CreateEntity.prototype.shell = null;

        /**
         * CreateEntity explosion.
         * @member {jsbolo.IExplosionState|null|undefined} explosion
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        CreateEntity.prototype.explosion = null;

        /**
         * CreateEntity pillbox.
         * @member {jsbolo.IPillboxState|null|undefined} pillbox
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        CreateEntity.prototype.pillbox = null;

        /**
         * CreateEntity base.
         * @member {jsbolo.IBaseState|null|undefined} base
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        CreateEntity.prototype.base = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * CreateEntity entity.
         * @member {"tank"|"builder"|"shell"|"explosion"|"pillbox"|"base"|undefined} entity
         * @memberof jsbolo.CreateEntity
         * @instance
         */
        Object.defineProperty(CreateEntity.prototype, "entity", {
            get: $util.oneOfGetter($oneOfFields = ["tank", "builder", "shell", "explosion", "pillbox", "base"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new CreateEntity instance using the specified properties.
         * @function create
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {jsbolo.ICreateEntity=} [properties] Properties to set
         * @returns {jsbolo.CreateEntity} CreateEntity instance
         */
        CreateEntity.create = function create(properties) {
            return new CreateEntity(properties);
        };

        /**
         * Encodes the specified CreateEntity message. Does not implicitly {@link jsbolo.CreateEntity.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {jsbolo.ICreateEntity} message CreateEntity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateEntity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tank != null && Object.hasOwnProperty.call(message, "tank"))
                $root.jsbolo.TankState.encode(message.tank, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.builder != null && Object.hasOwnProperty.call(message, "builder"))
                $root.jsbolo.BuilderState.encode(message.builder, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.shell != null && Object.hasOwnProperty.call(message, "shell"))
                $root.jsbolo.ShellState.encode(message.shell, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.explosion != null && Object.hasOwnProperty.call(message, "explosion"))
                $root.jsbolo.ExplosionState.encode(message.explosion, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.pillbox != null && Object.hasOwnProperty.call(message, "pillbox"))
                $root.jsbolo.PillboxState.encode(message.pillbox, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.base != null && Object.hasOwnProperty.call(message, "base"))
                $root.jsbolo.BaseState.encode(message.base, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CreateEntity message, length delimited. Does not implicitly {@link jsbolo.CreateEntity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {jsbolo.ICreateEntity} message CreateEntity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateEntity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateEntity message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.CreateEntity} CreateEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateEntity.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.CreateEntity();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.tank = $root.jsbolo.TankState.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.builder = $root.jsbolo.BuilderState.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.shell = $root.jsbolo.ShellState.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.explosion = $root.jsbolo.ExplosionState.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.pillbox = $root.jsbolo.PillboxState.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.base = $root.jsbolo.BaseState.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateEntity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.CreateEntity} CreateEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateEntity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateEntity message.
         * @function verify
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateEntity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.tank != null && message.hasOwnProperty("tank")) {
                properties.entity = 1;
                {
                    let error = $root.jsbolo.TankState.verify(message.tank);
                    if (error)
                        return "tank." + error;
                }
            }
            if (message.builder != null && message.hasOwnProperty("builder")) {
                if (properties.entity === 1)
                    return "entity: multiple values";
                properties.entity = 1;
                {
                    let error = $root.jsbolo.BuilderState.verify(message.builder);
                    if (error)
                        return "builder." + error;
                }
            }
            if (message.shell != null && message.hasOwnProperty("shell")) {
                if (properties.entity === 1)
                    return "entity: multiple values";
                properties.entity = 1;
                {
                    let error = $root.jsbolo.ShellState.verify(message.shell);
                    if (error)
                        return "shell." + error;
                }
            }
            if (message.explosion != null && message.hasOwnProperty("explosion")) {
                if (properties.entity === 1)
                    return "entity: multiple values";
                properties.entity = 1;
                {
                    let error = $root.jsbolo.ExplosionState.verify(message.explosion);
                    if (error)
                        return "explosion." + error;
                }
            }
            if (message.pillbox != null && message.hasOwnProperty("pillbox")) {
                if (properties.entity === 1)
                    return "entity: multiple values";
                properties.entity = 1;
                {
                    let error = $root.jsbolo.PillboxState.verify(message.pillbox);
                    if (error)
                        return "pillbox." + error;
                }
            }
            if (message.base != null && message.hasOwnProperty("base")) {
                if (properties.entity === 1)
                    return "entity: multiple values";
                properties.entity = 1;
                {
                    let error = $root.jsbolo.BaseState.verify(message.base);
                    if (error)
                        return "base." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CreateEntity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.CreateEntity} CreateEntity
         */
        CreateEntity.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.CreateEntity)
                return object;
            let message = new $root.jsbolo.CreateEntity();
            if (object.tank != null) {
                if (typeof object.tank !== "object")
                    throw TypeError(".jsbolo.CreateEntity.tank: object expected");
                message.tank = $root.jsbolo.TankState.fromObject(object.tank);
            }
            if (object.builder != null) {
                if (typeof object.builder !== "object")
                    throw TypeError(".jsbolo.CreateEntity.builder: object expected");
                message.builder = $root.jsbolo.BuilderState.fromObject(object.builder);
            }
            if (object.shell != null) {
                if (typeof object.shell !== "object")
                    throw TypeError(".jsbolo.CreateEntity.shell: object expected");
                message.shell = $root.jsbolo.ShellState.fromObject(object.shell);
            }
            if (object.explosion != null) {
                if (typeof object.explosion !== "object")
                    throw TypeError(".jsbolo.CreateEntity.explosion: object expected");
                message.explosion = $root.jsbolo.ExplosionState.fromObject(object.explosion);
            }
            if (object.pillbox != null) {
                if (typeof object.pillbox !== "object")
                    throw TypeError(".jsbolo.CreateEntity.pillbox: object expected");
                message.pillbox = $root.jsbolo.PillboxState.fromObject(object.pillbox);
            }
            if (object.base != null) {
                if (typeof object.base !== "object")
                    throw TypeError(".jsbolo.CreateEntity.base: object expected");
                message.base = $root.jsbolo.BaseState.fromObject(object.base);
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateEntity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {jsbolo.CreateEntity} message CreateEntity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateEntity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.tank != null && message.hasOwnProperty("tank")) {
                object.tank = $root.jsbolo.TankState.toObject(message.tank, options);
                if (options.oneofs)
                    object.entity = "tank";
            }
            if (message.builder != null && message.hasOwnProperty("builder")) {
                object.builder = $root.jsbolo.BuilderState.toObject(message.builder, options);
                if (options.oneofs)
                    object.entity = "builder";
            }
            if (message.shell != null && message.hasOwnProperty("shell")) {
                object.shell = $root.jsbolo.ShellState.toObject(message.shell, options);
                if (options.oneofs)
                    object.entity = "shell";
            }
            if (message.explosion != null && message.hasOwnProperty("explosion")) {
                object.explosion = $root.jsbolo.ExplosionState.toObject(message.explosion, options);
                if (options.oneofs)
                    object.entity = "explosion";
            }
            if (message.pillbox != null && message.hasOwnProperty("pillbox")) {
                object.pillbox = $root.jsbolo.PillboxState.toObject(message.pillbox, options);
                if (options.oneofs)
                    object.entity = "pillbox";
            }
            if (message.base != null && message.hasOwnProperty("base")) {
                object.base = $root.jsbolo.BaseState.toObject(message.base, options);
                if (options.oneofs)
                    object.entity = "base";
            }
            return object;
        };

        /**
         * Converts this CreateEntity to JSON.
         * @function toJSON
         * @memberof jsbolo.CreateEntity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateEntity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateEntity
         * @function getTypeUrl
         * @memberof jsbolo.CreateEntity
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateEntity.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.CreateEntity";
        };

        return CreateEntity;
    })();

    jsbolo.DestroyEntity = (function() {

        /**
         * Properties of a DestroyEntity.
         * @memberof jsbolo
         * @interface IDestroyEntity
         * @property {jsbolo.DestroyEntity.EntityType|null} [type] DestroyEntity type
         * @property {number|null} [id] DestroyEntity id
         */

        /**
         * Constructs a new DestroyEntity.
         * @memberof jsbolo
         * @classdesc Represents a DestroyEntity.
         * @implements IDestroyEntity
         * @constructor
         * @param {jsbolo.IDestroyEntity=} [properties] Properties to set
         */
        function DestroyEntity(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DestroyEntity type.
         * @member {jsbolo.DestroyEntity.EntityType} type
         * @memberof jsbolo.DestroyEntity
         * @instance
         */
        DestroyEntity.prototype.type = 0;

        /**
         * DestroyEntity id.
         * @member {number} id
         * @memberof jsbolo.DestroyEntity
         * @instance
         */
        DestroyEntity.prototype.id = 0;

        /**
         * Creates a new DestroyEntity instance using the specified properties.
         * @function create
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {jsbolo.IDestroyEntity=} [properties] Properties to set
         * @returns {jsbolo.DestroyEntity} DestroyEntity instance
         */
        DestroyEntity.create = function create(properties) {
            return new DestroyEntity(properties);
        };

        /**
         * Encodes the specified DestroyEntity message. Does not implicitly {@link jsbolo.DestroyEntity.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {jsbolo.IDestroyEntity} message DestroyEntity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DestroyEntity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.id);
            return writer;
        };

        /**
         * Encodes the specified DestroyEntity message, length delimited. Does not implicitly {@link jsbolo.DestroyEntity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {jsbolo.IDestroyEntity} message DestroyEntity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DestroyEntity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DestroyEntity message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.DestroyEntity} DestroyEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DestroyEntity.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.DestroyEntity();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.id = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DestroyEntity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.DestroyEntity} DestroyEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DestroyEntity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DestroyEntity message.
         * @function verify
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DestroyEntity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            return null;
        };

        /**
         * Creates a DestroyEntity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.DestroyEntity} DestroyEntity
         */
        DestroyEntity.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.DestroyEntity)
                return object;
            let message = new $root.jsbolo.DestroyEntity();
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "TANK":
            case 0:
                message.type = 0;
                break;
            case "BUILDER":
            case 1:
                message.type = 1;
                break;
            case "SHELL":
            case 2:
                message.type = 2;
                break;
            case "EXPLOSION":
            case 3:
                message.type = 3;
                break;
            case "PILLBOX":
            case 4:
                message.type = 4;
                break;
            case "BASE":
            case 5:
                message.type = 5;
                break;
            }
            if (object.id != null)
                message.id = object.id >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a DestroyEntity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {jsbolo.DestroyEntity} message DestroyEntity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DestroyEntity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "TANK" : 0;
                object.id = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.jsbolo.DestroyEntity.EntityType[message.type] === undefined ? message.type : $root.jsbolo.DestroyEntity.EntityType[message.type] : message.type;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this DestroyEntity to JSON.
         * @function toJSON
         * @memberof jsbolo.DestroyEntity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DestroyEntity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DestroyEntity
         * @function getTypeUrl
         * @memberof jsbolo.DestroyEntity
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DestroyEntity.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.DestroyEntity";
        };

        /**
         * EntityType enum.
         * @name jsbolo.DestroyEntity.EntityType
         * @enum {number}
         * @property {number} TANK=0 TANK value
         * @property {number} BUILDER=1 BUILDER value
         * @property {number} SHELL=2 SHELL value
         * @property {number} EXPLOSION=3 EXPLOSION value
         * @property {number} PILLBOX=4 PILLBOX value
         * @property {number} BASE=5 BASE value
         */
        DestroyEntity.EntityType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "TANK"] = 0;
            values[valuesById[1] = "BUILDER"] = 1;
            values[valuesById[2] = "SHELL"] = 2;
            values[valuesById[3] = "EXPLOSION"] = 3;
            values[valuesById[4] = "PILLBOX"] = 4;
            values[valuesById[5] = "BASE"] = 5;
            return values;
        })();

        return DestroyEntity;
    })();

    jsbolo.WelcomeMessage = (function() {

        /**
         * Properties of a WelcomeMessage.
         * @memberof jsbolo
         * @interface IWelcomeMessage
         * @property {number|null} [playerId] WelcomeMessage playerId
         * @property {number|null} [assignedTeam] WelcomeMessage assignedTeam
         * @property {number|null} [currentTick] WelcomeMessage currentTick
         * @property {jsbolo.IMapData|null} [map] WelcomeMessage map
         */

        /**
         * Constructs a new WelcomeMessage.
         * @memberof jsbolo
         * @classdesc Represents a WelcomeMessage.
         * @implements IWelcomeMessage
         * @constructor
         * @param {jsbolo.IWelcomeMessage=} [properties] Properties to set
         */
        function WelcomeMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WelcomeMessage playerId.
         * @member {number} playerId
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.playerId = 0;

        /**
         * WelcomeMessage assignedTeam.
         * @member {number} assignedTeam
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.assignedTeam = 0;

        /**
         * WelcomeMessage currentTick.
         * @member {number} currentTick
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.currentTick = 0;

        /**
         * WelcomeMessage map.
         * @member {jsbolo.IMapData|null|undefined} map
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.map = null;

        /**
         * Creates a new WelcomeMessage instance using the specified properties.
         * @function create
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {jsbolo.IWelcomeMessage=} [properties] Properties to set
         * @returns {jsbolo.WelcomeMessage} WelcomeMessage instance
         */
        WelcomeMessage.create = function create(properties) {
            return new WelcomeMessage(properties);
        };

        /**
         * Encodes the specified WelcomeMessage message. Does not implicitly {@link jsbolo.WelcomeMessage.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {jsbolo.IWelcomeMessage} message WelcomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WelcomeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.playerId);
            if (message.assignedTeam != null && Object.hasOwnProperty.call(message, "assignedTeam"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.assignedTeam);
            if (message.currentTick != null && Object.hasOwnProperty.call(message, "currentTick"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.currentTick);
            if (message.map != null && Object.hasOwnProperty.call(message, "map"))
                $root.jsbolo.MapData.encode(message.map, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified WelcomeMessage message, length delimited. Does not implicitly {@link jsbolo.WelcomeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {jsbolo.IWelcomeMessage} message WelcomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WelcomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WelcomeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.WelcomeMessage} WelcomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WelcomeMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.WelcomeMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.playerId = reader.uint32();
                        break;
                    }
                case 2: {
                        message.assignedTeam = reader.uint32();
                        break;
                    }
                case 3: {
                        message.currentTick = reader.uint32();
                        break;
                    }
                case 4: {
                        message.map = $root.jsbolo.MapData.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WelcomeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.WelcomeMessage} WelcomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WelcomeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WelcomeMessage message.
         * @function verify
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WelcomeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isInteger(message.playerId))
                    return "playerId: integer expected";
            if (message.assignedTeam != null && message.hasOwnProperty("assignedTeam"))
                if (!$util.isInteger(message.assignedTeam))
                    return "assignedTeam: integer expected";
            if (message.currentTick != null && message.hasOwnProperty("currentTick"))
                if (!$util.isInteger(message.currentTick))
                    return "currentTick: integer expected";
            if (message.map != null && message.hasOwnProperty("map")) {
                let error = $root.jsbolo.MapData.verify(message.map);
                if (error)
                    return "map." + error;
            }
            return null;
        };

        /**
         * Creates a WelcomeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.WelcomeMessage} WelcomeMessage
         */
        WelcomeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.WelcomeMessage)
                return object;
            let message = new $root.jsbolo.WelcomeMessage();
            if (object.playerId != null)
                message.playerId = object.playerId >>> 0;
            if (object.assignedTeam != null)
                message.assignedTeam = object.assignedTeam >>> 0;
            if (object.currentTick != null)
                message.currentTick = object.currentTick >>> 0;
            if (object.map != null) {
                if (typeof object.map !== "object")
                    throw TypeError(".jsbolo.WelcomeMessage.map: object expected");
                message.map = $root.jsbolo.MapData.fromObject(object.map);
            }
            return message;
        };

        /**
         * Creates a plain object from a WelcomeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {jsbolo.WelcomeMessage} message WelcomeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WelcomeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.playerId = 0;
                object.assignedTeam = 0;
                object.currentTick = 0;
                object.map = null;
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.assignedTeam != null && message.hasOwnProperty("assignedTeam"))
                object.assignedTeam = message.assignedTeam;
            if (message.currentTick != null && message.hasOwnProperty("currentTick"))
                object.currentTick = message.currentTick;
            if (message.map != null && message.hasOwnProperty("map"))
                object.map = $root.jsbolo.MapData.toObject(message.map, options);
            return object;
        };

        /**
         * Converts this WelcomeMessage to JSON.
         * @function toJSON
         * @memberof jsbolo.WelcomeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WelcomeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WelcomeMessage
         * @function getTypeUrl
         * @memberof jsbolo.WelcomeMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WelcomeMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.WelcomeMessage";
        };

        return WelcomeMessage;
    })();

    jsbolo.MapData = (function() {

        /**
         * Properties of a MapData.
         * @memberof jsbolo
         * @interface IMapData
         * @property {number|null} [width] MapData width
         * @property {number|null} [height] MapData height
         * @property {Uint8Array|null} [terrain] MapData terrain
         * @property {Array.<jsbolo.IPillboxState>|null} [pillboxes] MapData pillboxes
         * @property {Array.<jsbolo.IBaseState>|null} [bases] MapData bases
         */

        /**
         * Constructs a new MapData.
         * @memberof jsbolo
         * @classdesc Represents a MapData.
         * @implements IMapData
         * @constructor
         * @param {jsbolo.IMapData=} [properties] Properties to set
         */
        function MapData(properties) {
            this.pillboxes = [];
            this.bases = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MapData width.
         * @member {number} width
         * @memberof jsbolo.MapData
         * @instance
         */
        MapData.prototype.width = 0;

        /**
         * MapData height.
         * @member {number} height
         * @memberof jsbolo.MapData
         * @instance
         */
        MapData.prototype.height = 0;

        /**
         * MapData terrain.
         * @member {Uint8Array} terrain
         * @memberof jsbolo.MapData
         * @instance
         */
        MapData.prototype.terrain = $util.newBuffer([]);

        /**
         * MapData pillboxes.
         * @member {Array.<jsbolo.IPillboxState>} pillboxes
         * @memberof jsbolo.MapData
         * @instance
         */
        MapData.prototype.pillboxes = $util.emptyArray;

        /**
         * MapData bases.
         * @member {Array.<jsbolo.IBaseState>} bases
         * @memberof jsbolo.MapData
         * @instance
         */
        MapData.prototype.bases = $util.emptyArray;

        /**
         * Creates a new MapData instance using the specified properties.
         * @function create
         * @memberof jsbolo.MapData
         * @static
         * @param {jsbolo.IMapData=} [properties] Properties to set
         * @returns {jsbolo.MapData} MapData instance
         */
        MapData.create = function create(properties) {
            return new MapData(properties);
        };

        /**
         * Encodes the specified MapData message. Does not implicitly {@link jsbolo.MapData.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.MapData
         * @static
         * @param {jsbolo.IMapData} message MapData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
            if (message.terrain != null && Object.hasOwnProperty.call(message, "terrain"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.terrain);
            if (message.pillboxes != null && message.pillboxes.length)
                for (let i = 0; i < message.pillboxes.length; ++i)
                    $root.jsbolo.PillboxState.encode(message.pillboxes[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.bases != null && message.bases.length)
                for (let i = 0; i < message.bases.length; ++i)
                    $root.jsbolo.BaseState.encode(message.bases[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MapData message, length delimited. Does not implicitly {@link jsbolo.MapData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.MapData
         * @static
         * @param {jsbolo.IMapData} message MapData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MapData message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.MapData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.MapData} MapData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.MapData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.width = reader.uint32();
                        break;
                    }
                case 2: {
                        message.height = reader.uint32();
                        break;
                    }
                case 3: {
                        message.terrain = reader.bytes();
                        break;
                    }
                case 4: {
                        if (!(message.pillboxes && message.pillboxes.length))
                            message.pillboxes = [];
                        message.pillboxes.push($root.jsbolo.PillboxState.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        if (!(message.bases && message.bases.length))
                            message.bases = [];
                        message.bases.push($root.jsbolo.BaseState.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MapData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.MapData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.MapData} MapData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MapData message.
         * @function verify
         * @memberof jsbolo.MapData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MapData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.terrain != null && message.hasOwnProperty("terrain"))
                if (!(message.terrain && typeof message.terrain.length === "number" || $util.isString(message.terrain)))
                    return "terrain: buffer expected";
            if (message.pillboxes != null && message.hasOwnProperty("pillboxes")) {
                if (!Array.isArray(message.pillboxes))
                    return "pillboxes: array expected";
                for (let i = 0; i < message.pillboxes.length; ++i) {
                    let error = $root.jsbolo.PillboxState.verify(message.pillboxes[i]);
                    if (error)
                        return "pillboxes." + error;
                }
            }
            if (message.bases != null && message.hasOwnProperty("bases")) {
                if (!Array.isArray(message.bases))
                    return "bases: array expected";
                for (let i = 0; i < message.bases.length; ++i) {
                    let error = $root.jsbolo.BaseState.verify(message.bases[i]);
                    if (error)
                        return "bases." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MapData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.MapData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.MapData} MapData
         */
        MapData.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.MapData)
                return object;
            let message = new $root.jsbolo.MapData();
            if (object.width != null)
                message.width = object.width >>> 0;
            if (object.height != null)
                message.height = object.height >>> 0;
            if (object.terrain != null)
                if (typeof object.terrain === "string")
                    $util.base64.decode(object.terrain, message.terrain = $util.newBuffer($util.base64.length(object.terrain)), 0);
                else if (object.terrain.length >= 0)
                    message.terrain = object.terrain;
            if (object.pillboxes) {
                if (!Array.isArray(object.pillboxes))
                    throw TypeError(".jsbolo.MapData.pillboxes: array expected");
                message.pillboxes = [];
                for (let i = 0; i < object.pillboxes.length; ++i) {
                    if (typeof object.pillboxes[i] !== "object")
                        throw TypeError(".jsbolo.MapData.pillboxes: object expected");
                    message.pillboxes[i] = $root.jsbolo.PillboxState.fromObject(object.pillboxes[i]);
                }
            }
            if (object.bases) {
                if (!Array.isArray(object.bases))
                    throw TypeError(".jsbolo.MapData.bases: array expected");
                message.bases = [];
                for (let i = 0; i < object.bases.length; ++i) {
                    if (typeof object.bases[i] !== "object")
                        throw TypeError(".jsbolo.MapData.bases: object expected");
                    message.bases[i] = $root.jsbolo.BaseState.fromObject(object.bases[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MapData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.MapData
         * @static
         * @param {jsbolo.MapData} message MapData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MapData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.pillboxes = [];
                object.bases = [];
            }
            if (options.defaults) {
                object.width = 0;
                object.height = 0;
                if (options.bytes === String)
                    object.terrain = "";
                else {
                    object.terrain = [];
                    if (options.bytes !== Array)
                        object.terrain = $util.newBuffer(object.terrain);
                }
            }
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.terrain != null && message.hasOwnProperty("terrain"))
                object.terrain = options.bytes === String ? $util.base64.encode(message.terrain, 0, message.terrain.length) : options.bytes === Array ? Array.prototype.slice.call(message.terrain) : message.terrain;
            if (message.pillboxes && message.pillboxes.length) {
                object.pillboxes = [];
                for (let j = 0; j < message.pillboxes.length; ++j)
                    object.pillboxes[j] = $root.jsbolo.PillboxState.toObject(message.pillboxes[j], options);
            }
            if (message.bases && message.bases.length) {
                object.bases = [];
                for (let j = 0; j < message.bases.length; ++j)
                    object.bases[j] = $root.jsbolo.BaseState.toObject(message.bases[j], options);
            }
            return object;
        };

        /**
         * Converts this MapData to JSON.
         * @function toJSON
         * @memberof jsbolo.MapData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MapData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MapData
         * @function getTypeUrl
         * @memberof jsbolo.MapData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MapData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.MapData";
        };

        return MapData;
    })();

    jsbolo.ClientMessage = (function() {

        /**
         * Properties of a ClientMessage.
         * @memberof jsbolo
         * @interface IClientMessage
         * @property {jsbolo.IPlayerInput|null} [input] ClientMessage input
         */

        /**
         * Constructs a new ClientMessage.
         * @memberof jsbolo
         * @classdesc Represents a ClientMessage.
         * @implements IClientMessage
         * @constructor
         * @param {jsbolo.IClientMessage=} [properties] Properties to set
         */
        function ClientMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClientMessage input.
         * @member {jsbolo.IPlayerInput|null|undefined} input
         * @memberof jsbolo.ClientMessage
         * @instance
         */
        ClientMessage.prototype.input = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ClientMessage message.
         * @member {"input"|undefined} message
         * @memberof jsbolo.ClientMessage
         * @instance
         */
        Object.defineProperty(ClientMessage.prototype, "message", {
            get: $util.oneOfGetter($oneOfFields = ["input"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @function create
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {jsbolo.IClientMessage=} [properties] Properties to set
         * @returns {jsbolo.ClientMessage} ClientMessage instance
         */
        ClientMessage.create = function create(properties) {
            return new ClientMessage(properties);
        };

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link jsbolo.ClientMessage.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {jsbolo.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.input != null && Object.hasOwnProperty.call(message, "input"))
                $root.jsbolo.PlayerInput.encode(message.input, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link jsbolo.ClientMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {jsbolo.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.ClientMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.input = $root.jsbolo.PlayerInput.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClientMessage message.
         * @function verify
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.input != null && message.hasOwnProperty("input")) {
                properties.message = 1;
                {
                    let error = $root.jsbolo.PlayerInput.verify(message.input);
                    if (error)
                        return "input." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.ClientMessage} ClientMessage
         */
        ClientMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.ClientMessage)
                return object;
            let message = new $root.jsbolo.ClientMessage();
            if (object.input != null) {
                if (typeof object.input !== "object")
                    throw TypeError(".jsbolo.ClientMessage.input: object expected");
                message.input = $root.jsbolo.PlayerInput.fromObject(object.input);
            }
            return message;
        };

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {jsbolo.ClientMessage} message ClientMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.input != null && message.hasOwnProperty("input")) {
                object.input = $root.jsbolo.PlayerInput.toObject(message.input, options);
                if (options.oneofs)
                    object.message = "input";
            }
            return object;
        };

        /**
         * Converts this ClientMessage to JSON.
         * @function toJSON
         * @memberof jsbolo.ClientMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ClientMessage
         * @function getTypeUrl
         * @memberof jsbolo.ClientMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ClientMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.ClientMessage";
        };

        return ClientMessage;
    })();

    jsbolo.ServerMessage = (function() {

        /**
         * Properties of a ServerMessage.
         * @memberof jsbolo
         * @interface IServerMessage
         * @property {jsbolo.IWelcomeMessage|null} [welcome] ServerMessage welcome
         * @property {jsbolo.IServerUpdate|null} [update] ServerMessage update
         * @property {jsbolo.ICreateEntity|null} [create] ServerMessage create
         * @property {jsbolo.IDestroyEntity|null} [destroy] ServerMessage destroy
         */

        /**
         * Constructs a new ServerMessage.
         * @memberof jsbolo
         * @classdesc Represents a ServerMessage.
         * @implements IServerMessage
         * @constructor
         * @param {jsbolo.IServerMessage=} [properties] Properties to set
         */
        function ServerMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerMessage welcome.
         * @member {jsbolo.IWelcomeMessage|null|undefined} welcome
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        ServerMessage.prototype.welcome = null;

        /**
         * ServerMessage update.
         * @member {jsbolo.IServerUpdate|null|undefined} update
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        ServerMessage.prototype.update = null;

        /**
         * ServerMessage create.
         * @member {jsbolo.ICreateEntity|null|undefined} create
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        ServerMessage.prototype.create = null;

        /**
         * ServerMessage destroy.
         * @member {jsbolo.IDestroyEntity|null|undefined} destroy
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        ServerMessage.prototype.destroy = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ServerMessage message.
         * @member {"welcome"|"update"|"create"|"destroy"|undefined} message
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        Object.defineProperty(ServerMessage.prototype, "message", {
            get: $util.oneOfGetter($oneOfFields = ["welcome", "update", "create", "destroy"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @function create
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {jsbolo.IServerMessage=} [properties] Properties to set
         * @returns {jsbolo.ServerMessage} ServerMessage instance
         */
        ServerMessage.create = function create(properties) {
            return new ServerMessage(properties);
        };

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link jsbolo.ServerMessage.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {jsbolo.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.welcome != null && Object.hasOwnProperty.call(message, "welcome"))
                $root.jsbolo.WelcomeMessage.encode(message.welcome, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.update != null && Object.hasOwnProperty.call(message, "update"))
                $root.jsbolo.ServerUpdate.encode(message.update, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.create != null && Object.hasOwnProperty.call(message, "create"))
                $root.jsbolo.CreateEntity.encode(message.create, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.destroy != null && Object.hasOwnProperty.call(message, "destroy"))
                $root.jsbolo.DestroyEntity.encode(message.destroy, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link jsbolo.ServerMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {jsbolo.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.ServerMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.welcome = $root.jsbolo.WelcomeMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.update = $root.jsbolo.ServerUpdate.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.create = $root.jsbolo.CreateEntity.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.destroy = $root.jsbolo.DestroyEntity.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerMessage message.
         * @function verify
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.welcome != null && message.hasOwnProperty("welcome")) {
                properties.message = 1;
                {
                    let error = $root.jsbolo.WelcomeMessage.verify(message.welcome);
                    if (error)
                        return "welcome." + error;
                }
            }
            if (message.update != null && message.hasOwnProperty("update")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    let error = $root.jsbolo.ServerUpdate.verify(message.update);
                    if (error)
                        return "update." + error;
                }
            }
            if (message.create != null && message.hasOwnProperty("create")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    let error = $root.jsbolo.CreateEntity.verify(message.create);
                    if (error)
                        return "create." + error;
                }
            }
            if (message.destroy != null && message.hasOwnProperty("destroy")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    let error = $root.jsbolo.DestroyEntity.verify(message.destroy);
                    if (error)
                        return "destroy." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.ServerMessage} ServerMessage
         */
        ServerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.ServerMessage)
                return object;
            let message = new $root.jsbolo.ServerMessage();
            if (object.welcome != null) {
                if (typeof object.welcome !== "object")
                    throw TypeError(".jsbolo.ServerMessage.welcome: object expected");
                message.welcome = $root.jsbolo.WelcomeMessage.fromObject(object.welcome);
            }
            if (object.update != null) {
                if (typeof object.update !== "object")
                    throw TypeError(".jsbolo.ServerMessage.update: object expected");
                message.update = $root.jsbolo.ServerUpdate.fromObject(object.update);
            }
            if (object.create != null) {
                if (typeof object.create !== "object")
                    throw TypeError(".jsbolo.ServerMessage.create: object expected");
                message.create = $root.jsbolo.CreateEntity.fromObject(object.create);
            }
            if (object.destroy != null) {
                if (typeof object.destroy !== "object")
                    throw TypeError(".jsbolo.ServerMessage.destroy: object expected");
                message.destroy = $root.jsbolo.DestroyEntity.fromObject(object.destroy);
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {jsbolo.ServerMessage} message ServerMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.welcome != null && message.hasOwnProperty("welcome")) {
                object.welcome = $root.jsbolo.WelcomeMessage.toObject(message.welcome, options);
                if (options.oneofs)
                    object.message = "welcome";
            }
            if (message.update != null && message.hasOwnProperty("update")) {
                object.update = $root.jsbolo.ServerUpdate.toObject(message.update, options);
                if (options.oneofs)
                    object.message = "update";
            }
            if (message.create != null && message.hasOwnProperty("create")) {
                object.create = $root.jsbolo.CreateEntity.toObject(message.create, options);
                if (options.oneofs)
                    object.message = "create";
            }
            if (message.destroy != null && message.hasOwnProperty("destroy")) {
                object.destroy = $root.jsbolo.DestroyEntity.toObject(message.destroy, options);
                if (options.oneofs)
                    object.message = "destroy";
            }
            return object;
        };

        /**
         * Converts this ServerMessage to JSON.
         * @function toJSON
         * @memberof jsbolo.ServerMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ServerMessage
         * @function getTypeUrl
         * @memberof jsbolo.ServerMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ServerMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.ServerMessage";
        };

        return ServerMessage;
    })();

    return jsbolo;
})();

export { $root as default };
