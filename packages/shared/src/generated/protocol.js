/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

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

    /**
     * RangeAdjustment enum.
     * @name jsbolo.RangeAdjustment
     * @enum {number}
     * @property {number} RANGE_ADJUSTMENT_NONE=0 RANGE_ADJUSTMENT_NONE value
     * @property {number} RANGE_ADJUSTMENT_INCREASE=1 RANGE_ADJUSTMENT_INCREASE value
     * @property {number} RANGE_ADJUSTMENT_DECREASE=2 RANGE_ADJUSTMENT_DECREASE value
     */
    jsbolo.RangeAdjustment = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "RANGE_ADJUSTMENT_NONE"] = 0;
        values[valuesById[1] = "RANGE_ADJUSTMENT_INCREASE"] = 1;
        values[valuesById[2] = "RANGE_ADJUSTMENT_DECREASE"] = 2;
        return values;
    })();

    /**
     * BuildAction enum.
     * @name jsbolo.BuildAction
     * @enum {number}
     * @property {number} BUILD_ACTION_NONE=0 BUILD_ACTION_NONE value
     * @property {number} BUILD_ACTION_FOREST=1 BUILD_ACTION_FOREST value
     * @property {number} BUILD_ACTION_ROAD=2 BUILD_ACTION_ROAD value
     * @property {number} BUILD_ACTION_REPAIR=3 BUILD_ACTION_REPAIR value
     * @property {number} BUILD_ACTION_BOAT=4 BUILD_ACTION_BOAT value
     * @property {number} BUILD_ACTION_BUILDING=5 BUILD_ACTION_BUILDING value
     * @property {number} BUILD_ACTION_PILLBOX=6 BUILD_ACTION_PILLBOX value
     * @property {number} BUILD_ACTION_MINE=7 BUILD_ACTION_MINE value
     */
    jsbolo.BuildAction = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BUILD_ACTION_NONE"] = 0;
        values[valuesById[1] = "BUILD_ACTION_FOREST"] = 1;
        values[valuesById[2] = "BUILD_ACTION_ROAD"] = 2;
        values[valuesById[3] = "BUILD_ACTION_REPAIR"] = 3;
        values[valuesById[4] = "BUILD_ACTION_BOAT"] = 4;
        values[valuesById[5] = "BUILD_ACTION_BUILDING"] = 5;
        values[valuesById[6] = "BUILD_ACTION_PILLBOX"] = 6;
        values[valuesById[7] = "BUILD_ACTION_MINE"] = 7;
        return values;
    })();

    /**
     * BuilderOrder enum.
     * @name jsbolo.BuilderOrder
     * @enum {number}
     * @property {number} BUILDER_ORDER_IN_TANK=0 BUILDER_ORDER_IN_TANK value
     * @property {number} BUILDER_ORDER_WAITING=1 BUILDER_ORDER_WAITING value
     * @property {number} BUILDER_ORDER_RETURNING=2 BUILDER_ORDER_RETURNING value
     * @property {number} BUILDER_ORDER_PARACHUTING=3 BUILDER_ORDER_PARACHUTING value
     * @property {number} BUILDER_ORDER_HARVESTING=10 BUILDER_ORDER_HARVESTING value
     * @property {number} BUILDER_ORDER_BUILDING_ROAD=11 BUILDER_ORDER_BUILDING_ROAD value
     * @property {number} BUILDER_ORDER_REPAIRING=12 BUILDER_ORDER_REPAIRING value
     * @property {number} BUILDER_ORDER_BUILDING_BOAT=13 BUILDER_ORDER_BUILDING_BOAT value
     * @property {number} BUILDER_ORDER_BUILDING_WALL=14 BUILDER_ORDER_BUILDING_WALL value
     * @property {number} BUILDER_ORDER_PLACING_PILLBOX=15 BUILDER_ORDER_PLACING_PILLBOX value
     * @property {number} BUILDER_ORDER_LAYING_MINE=16 BUILDER_ORDER_LAYING_MINE value
     */
    jsbolo.BuilderOrder = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BUILDER_ORDER_IN_TANK"] = 0;
        values[valuesById[1] = "BUILDER_ORDER_WAITING"] = 1;
        values[valuesById[2] = "BUILDER_ORDER_RETURNING"] = 2;
        values[valuesById[3] = "BUILDER_ORDER_PARACHUTING"] = 3;
        values[valuesById[10] = "BUILDER_ORDER_HARVESTING"] = 10;
        values[valuesById[11] = "BUILDER_ORDER_BUILDING_ROAD"] = 11;
        values[valuesById[12] = "BUILDER_ORDER_REPAIRING"] = 12;
        values[valuesById[13] = "BUILDER_ORDER_BUILDING_BOAT"] = 13;
        values[valuesById[14] = "BUILDER_ORDER_BUILDING_WALL"] = 14;
        values[valuesById[15] = "BUILDER_ORDER_PLACING_PILLBOX"] = 15;
        values[valuesById[16] = "BUILDER_ORDER_LAYING_MINE"] = 16;
        return values;
    })();

    jsbolo.BuildOrder = (function() {

        /**
         * Properties of a BuildOrder.
         * @memberof jsbolo
         * @interface IBuildOrder
         * @property {jsbolo.BuildAction|null} [action] BuildOrder action
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
         * @member {jsbolo.BuildAction} action
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
            case "BUILD_ACTION_NONE":
            case 0:
                message.action = 0;
                break;
            case "BUILD_ACTION_FOREST":
            case 1:
                message.action = 1;
                break;
            case "BUILD_ACTION_ROAD":
            case 2:
                message.action = 2;
                break;
            case "BUILD_ACTION_REPAIR":
            case 3:
                message.action = 3;
                break;
            case "BUILD_ACTION_BOAT":
            case 4:
                message.action = 4;
                break;
            case "BUILD_ACTION_BUILDING":
            case 5:
                message.action = 5;
                break;
            case "BUILD_ACTION_PILLBOX":
            case 6:
                message.action = 6;
                break;
            case "BUILD_ACTION_MINE":
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
                object.action = options.enums === String ? "BUILD_ACTION_NONE" : 0;
                object.targetX = 0;
                object.targetY = 0;
            }
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.jsbolo.BuildAction[message.action] === undefined ? message.action : $root.jsbolo.BuildAction[message.action] : message.action;
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

        return BuildOrder;
    })();

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
            case "RANGE_ADJUSTMENT_NONE":
            case 0:
                message.rangeAdjustment = 0;
                break;
            case "RANGE_ADJUSTMENT_INCREASE":
            case 1:
                message.rangeAdjustment = 1;
                break;
            case "RANGE_ADJUSTMENT_DECREASE":
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
                object.rangeAdjustment = options.enums === String ? "RANGE_ADJUSTMENT_NONE" : 0;
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

    jsbolo.Tank = (function() {

        /**
         * Properties of a Tank.
         * @memberof jsbolo
         * @interface ITank
         * @property {number|null} [id] Tank id
         * @property {number|null} [x] Tank x
         * @property {number|null} [y] Tank y
         * @property {number|null} [direction] Tank direction
         * @property {number|null} [speed] Tank speed
         * @property {number|null} [armor] Tank armor
         * @property {number|null} [shells] Tank shells
         * @property {number|null} [mines] Tank mines
         * @property {number|null} [trees] Tank trees
         * @property {number|null} [team] Tank team
         * @property {boolean|null} [onBoat] Tank onBoat
         * @property {number|null} [reload] Tank reload
         * @property {number|null} [firingRange] Tank firingRange
         * @property {number|null} [carriedPillbox] Tank carriedPillbox
         */

        /**
         * Constructs a new Tank.
         * @memberof jsbolo
         * @classdesc Represents a Tank.
         * @implements ITank
         * @constructor
         * @param {jsbolo.ITank=} [properties] Properties to set
         */
        function Tank(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Tank id.
         * @member {number} id
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.id = 0;

        /**
         * Tank x.
         * @member {number} x
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.x = 0;

        /**
         * Tank y.
         * @member {number} y
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.y = 0;

        /**
         * Tank direction.
         * @member {number} direction
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.direction = 0;

        /**
         * Tank speed.
         * @member {number} speed
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.speed = 0;

        /**
         * Tank armor.
         * @member {number} armor
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.armor = 0;

        /**
         * Tank shells.
         * @member {number} shells
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.shells = 0;

        /**
         * Tank mines.
         * @member {number} mines
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.mines = 0;

        /**
         * Tank trees.
         * @member {number} trees
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.trees = 0;

        /**
         * Tank team.
         * @member {number} team
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.team = 0;

        /**
         * Tank onBoat.
         * @member {boolean} onBoat
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.onBoat = false;

        /**
         * Tank reload.
         * @member {number} reload
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.reload = 0;

        /**
         * Tank firingRange.
         * @member {number} firingRange
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.firingRange = 0;

        /**
         * Tank carriedPillbox.
         * @member {number|null|undefined} carriedPillbox
         * @memberof jsbolo.Tank
         * @instance
         */
        Tank.prototype.carriedPillbox = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(Tank.prototype, "_carriedPillbox", {
            get: $util.oneOfGetter($oneOfFields = ["carriedPillbox"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Tank instance using the specified properties.
         * @function create
         * @memberof jsbolo.Tank
         * @static
         * @param {jsbolo.ITank=} [properties] Properties to set
         * @returns {jsbolo.Tank} Tank instance
         */
        Tank.create = function create(properties) {
            return new Tank(properties);
        };

        /**
         * Encodes the specified Tank message. Does not implicitly {@link jsbolo.Tank.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.Tank
         * @static
         * @param {jsbolo.ITank} message Tank message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Tank.encode = function encode(message, writer) {
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
            if (message.carriedPillbox != null && Object.hasOwnProperty.call(message, "carriedPillbox"))
                writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.carriedPillbox);
            return writer;
        };

        /**
         * Encodes the specified Tank message, length delimited. Does not implicitly {@link jsbolo.Tank.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.Tank
         * @static
         * @param {jsbolo.ITank} message Tank message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Tank.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Tank message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.Tank
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.Tank} Tank
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Tank.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.Tank();
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
                case 14: {
                        message.carriedPillbox = reader.uint32();
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
         * Decodes a Tank message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.Tank
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.Tank} Tank
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Tank.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Tank message.
         * @function verify
         * @memberof jsbolo.Tank
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Tank.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
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
            if (message.carriedPillbox != null && message.hasOwnProperty("carriedPillbox")) {
                properties._carriedPillbox = 1;
                if (!$util.isInteger(message.carriedPillbox))
                    return "carriedPillbox: integer expected";
            }
            return null;
        };

        /**
         * Creates a Tank message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.Tank
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.Tank} Tank
         */
        Tank.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.Tank)
                return object;
            let message = new $root.jsbolo.Tank();
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
            if (object.carriedPillbox != null)
                message.carriedPillbox = object.carriedPillbox >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Tank message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.Tank
         * @static
         * @param {jsbolo.Tank} message Tank
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Tank.toObject = function toObject(message, options) {
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
            if (message.carriedPillbox != null && message.hasOwnProperty("carriedPillbox")) {
                object.carriedPillbox = message.carriedPillbox;
                if (options.oneofs)
                    object._carriedPillbox = "carriedPillbox";
            }
            return object;
        };

        /**
         * Converts this Tank to JSON.
         * @function toJSON
         * @memberof jsbolo.Tank
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Tank.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Tank
         * @function getTypeUrl
         * @memberof jsbolo.Tank
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Tank.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.Tank";
        };

        return Tank;
    })();

    jsbolo.Builder = (function() {

        /**
         * Properties of a Builder.
         * @memberof jsbolo
         * @interface IBuilder
         * @property {number|null} [id] Builder id
         * @property {number|null} [ownerTankId] Builder ownerTankId
         * @property {number|null} [x] Builder x
         * @property {number|null} [y] Builder y
         * @property {number|null} [targetX] Builder targetX
         * @property {number|null} [targetY] Builder targetY
         * @property {jsbolo.BuilderOrder|null} [order] Builder order
         * @property {number|null} [trees] Builder trees
         * @property {boolean|null} [hasMine] Builder hasMine
         * @property {boolean|null} [hasPillbox] Builder hasPillbox
         * @property {number|null} [team] Builder team
         * @property {number|null} [respawnCounter] Builder respawnCounter
         */

        /**
         * Constructs a new Builder.
         * @memberof jsbolo
         * @classdesc Represents a Builder.
         * @implements IBuilder
         * @constructor
         * @param {jsbolo.IBuilder=} [properties] Properties to set
         */
        function Builder(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Builder id.
         * @member {number} id
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.id = 0;

        /**
         * Builder ownerTankId.
         * @member {number} ownerTankId
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.ownerTankId = 0;

        /**
         * Builder x.
         * @member {number} x
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.x = 0;

        /**
         * Builder y.
         * @member {number} y
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.y = 0;

        /**
         * Builder targetX.
         * @member {number} targetX
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.targetX = 0;

        /**
         * Builder targetY.
         * @member {number} targetY
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.targetY = 0;

        /**
         * Builder order.
         * @member {jsbolo.BuilderOrder} order
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.order = 0;

        /**
         * Builder trees.
         * @member {number} trees
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.trees = 0;

        /**
         * Builder hasMine.
         * @member {boolean} hasMine
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.hasMine = false;

        /**
         * Builder hasPillbox.
         * @member {boolean} hasPillbox
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.hasPillbox = false;

        /**
         * Builder team.
         * @member {number} team
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.team = 0;

        /**
         * Builder respawnCounter.
         * @member {number} respawnCounter
         * @memberof jsbolo.Builder
         * @instance
         */
        Builder.prototype.respawnCounter = 0;

        /**
         * Creates a new Builder instance using the specified properties.
         * @function create
         * @memberof jsbolo.Builder
         * @static
         * @param {jsbolo.IBuilder=} [properties] Properties to set
         * @returns {jsbolo.Builder} Builder instance
         */
        Builder.create = function create(properties) {
            return new Builder(properties);
        };

        /**
         * Encodes the specified Builder message. Does not implicitly {@link jsbolo.Builder.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.Builder
         * @static
         * @param {jsbolo.IBuilder} message Builder message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Builder.encode = function encode(message, writer) {
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
            if (message.hasPillbox != null && Object.hasOwnProperty.call(message, "hasPillbox"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.hasPillbox);
            if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.team);
            if (message.respawnCounter != null && Object.hasOwnProperty.call(message, "respawnCounter"))
                writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.respawnCounter);
            return writer;
        };

        /**
         * Encodes the specified Builder message, length delimited. Does not implicitly {@link jsbolo.Builder.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.Builder
         * @static
         * @param {jsbolo.IBuilder} message Builder message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Builder.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Builder message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.Builder
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.Builder} Builder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Builder.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.Builder();
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
                        message.hasPillbox = reader.bool();
                        break;
                    }
                case 11: {
                        message.team = reader.uint32();
                        break;
                    }
                case 12: {
                        message.respawnCounter = reader.uint32();
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
         * Decodes a Builder message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.Builder
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.Builder} Builder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Builder.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Builder message.
         * @function verify
         * @memberof jsbolo.Builder
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Builder.verify = function verify(message) {
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
            if (message.hasPillbox != null && message.hasOwnProperty("hasPillbox"))
                if (typeof message.hasPillbox !== "boolean")
                    return "hasPillbox: boolean expected";
            if (message.team != null && message.hasOwnProperty("team"))
                if (!$util.isInteger(message.team))
                    return "team: integer expected";
            if (message.respawnCounter != null && message.hasOwnProperty("respawnCounter"))
                if (!$util.isInteger(message.respawnCounter))
                    return "respawnCounter: integer expected";
            return null;
        };

        /**
         * Creates a Builder message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.Builder
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.Builder} Builder
         */
        Builder.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.Builder)
                return object;
            let message = new $root.jsbolo.Builder();
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
            case "BUILDER_ORDER_IN_TANK":
            case 0:
                message.order = 0;
                break;
            case "BUILDER_ORDER_WAITING":
            case 1:
                message.order = 1;
                break;
            case "BUILDER_ORDER_RETURNING":
            case 2:
                message.order = 2;
                break;
            case "BUILDER_ORDER_PARACHUTING":
            case 3:
                message.order = 3;
                break;
            case "BUILDER_ORDER_HARVESTING":
            case 10:
                message.order = 10;
                break;
            case "BUILDER_ORDER_BUILDING_ROAD":
            case 11:
                message.order = 11;
                break;
            case "BUILDER_ORDER_REPAIRING":
            case 12:
                message.order = 12;
                break;
            case "BUILDER_ORDER_BUILDING_BOAT":
            case 13:
                message.order = 13;
                break;
            case "BUILDER_ORDER_BUILDING_WALL":
            case 14:
                message.order = 14;
                break;
            case "BUILDER_ORDER_PLACING_PILLBOX":
            case 15:
                message.order = 15;
                break;
            case "BUILDER_ORDER_LAYING_MINE":
            case 16:
                message.order = 16;
                break;
            }
            if (object.trees != null)
                message.trees = object.trees >>> 0;
            if (object.hasMine != null)
                message.hasMine = Boolean(object.hasMine);
            if (object.hasPillbox != null)
                message.hasPillbox = Boolean(object.hasPillbox);
            if (object.team != null)
                message.team = object.team >>> 0;
            if (object.respawnCounter != null)
                message.respawnCounter = object.respawnCounter >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Builder message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.Builder
         * @static
         * @param {jsbolo.Builder} message Builder
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Builder.toObject = function toObject(message, options) {
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
                object.order = options.enums === String ? "BUILDER_ORDER_IN_TANK" : 0;
                object.trees = 0;
                object.hasMine = false;
                object.hasPillbox = false;
                object.team = 0;
                object.respawnCounter = 0;
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
            if (message.hasPillbox != null && message.hasOwnProperty("hasPillbox"))
                object.hasPillbox = message.hasPillbox;
            if (message.team != null && message.hasOwnProperty("team"))
                object.team = message.team;
            if (message.respawnCounter != null && message.hasOwnProperty("respawnCounter"))
                object.respawnCounter = message.respawnCounter;
            return object;
        };

        /**
         * Converts this Builder to JSON.
         * @function toJSON
         * @memberof jsbolo.Builder
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Builder.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Builder
         * @function getTypeUrl
         * @memberof jsbolo.Builder
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Builder.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.Builder";
        };

        return Builder;
    })();

    jsbolo.Shell = (function() {

        /**
         * Properties of a Shell.
         * @memberof jsbolo
         * @interface IShell
         * @property {number|null} [id] Shell id
         * @property {number|null} [x] Shell x
         * @property {number|null} [y] Shell y
         * @property {number|null} [direction] Shell direction
         * @property {number|null} [ownerTankId] Shell ownerTankId
         */

        /**
         * Constructs a new Shell.
         * @memberof jsbolo
         * @classdesc Represents a Shell.
         * @implements IShell
         * @constructor
         * @param {jsbolo.IShell=} [properties] Properties to set
         */
        function Shell(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Shell id.
         * @member {number} id
         * @memberof jsbolo.Shell
         * @instance
         */
        Shell.prototype.id = 0;

        /**
         * Shell x.
         * @member {number} x
         * @memberof jsbolo.Shell
         * @instance
         */
        Shell.prototype.x = 0;

        /**
         * Shell y.
         * @member {number} y
         * @memberof jsbolo.Shell
         * @instance
         */
        Shell.prototype.y = 0;

        /**
         * Shell direction.
         * @member {number} direction
         * @memberof jsbolo.Shell
         * @instance
         */
        Shell.prototype.direction = 0;

        /**
         * Shell ownerTankId.
         * @member {number} ownerTankId
         * @memberof jsbolo.Shell
         * @instance
         */
        Shell.prototype.ownerTankId = 0;

        /**
         * Creates a new Shell instance using the specified properties.
         * @function create
         * @memberof jsbolo.Shell
         * @static
         * @param {jsbolo.IShell=} [properties] Properties to set
         * @returns {jsbolo.Shell} Shell instance
         */
        Shell.create = function create(properties) {
            return new Shell(properties);
        };

        /**
         * Encodes the specified Shell message. Does not implicitly {@link jsbolo.Shell.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.Shell
         * @static
         * @param {jsbolo.IShell} message Shell message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Shell.encode = function encode(message, writer) {
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
                writer.uint32(/* id 5, wireType 0 =*/40).sint32(message.ownerTankId);
            return writer;
        };

        /**
         * Encodes the specified Shell message, length delimited. Does not implicitly {@link jsbolo.Shell.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.Shell
         * @static
         * @param {jsbolo.IShell} message Shell message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Shell.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Shell message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.Shell
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.Shell} Shell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Shell.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.Shell();
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
                        message.ownerTankId = reader.sint32();
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
         * Decodes a Shell message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.Shell
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.Shell} Shell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Shell.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Shell message.
         * @function verify
         * @memberof jsbolo.Shell
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Shell.verify = function verify(message) {
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
         * Creates a Shell message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.Shell
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.Shell} Shell
         */
        Shell.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.Shell)
                return object;
            let message = new $root.jsbolo.Shell();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            if (object.direction != null)
                message.direction = object.direction >>> 0;
            if (object.ownerTankId != null)
                message.ownerTankId = object.ownerTankId | 0;
            return message;
        };

        /**
         * Creates a plain object from a Shell message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.Shell
         * @static
         * @param {jsbolo.Shell} message Shell
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Shell.toObject = function toObject(message, options) {
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
         * Converts this Shell to JSON.
         * @function toJSON
         * @memberof jsbolo.Shell
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Shell.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Shell
         * @function getTypeUrl
         * @memberof jsbolo.Shell
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Shell.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.Shell";
        };

        return Shell;
    })();

    jsbolo.Pillbox = (function() {

        /**
         * Properties of a Pillbox.
         * @memberof jsbolo
         * @interface IPillbox
         * @property {number|null} [id] Pillbox id
         * @property {number|null} [tileX] Pillbox tileX
         * @property {number|null} [tileY] Pillbox tileY
         * @property {number|null} [armor] Pillbox armor
         * @property {number|null} [ownerTeam] Pillbox ownerTeam
         * @property {boolean|null} [inTank] Pillbox inTank
         */

        /**
         * Constructs a new Pillbox.
         * @memberof jsbolo
         * @classdesc Represents a Pillbox.
         * @implements IPillbox
         * @constructor
         * @param {jsbolo.IPillbox=} [properties] Properties to set
         */
        function Pillbox(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Pillbox id.
         * @member {number} id
         * @memberof jsbolo.Pillbox
         * @instance
         */
        Pillbox.prototype.id = 0;

        /**
         * Pillbox tileX.
         * @member {number} tileX
         * @memberof jsbolo.Pillbox
         * @instance
         */
        Pillbox.prototype.tileX = 0;

        /**
         * Pillbox tileY.
         * @member {number} tileY
         * @memberof jsbolo.Pillbox
         * @instance
         */
        Pillbox.prototype.tileY = 0;

        /**
         * Pillbox armor.
         * @member {number} armor
         * @memberof jsbolo.Pillbox
         * @instance
         */
        Pillbox.prototype.armor = 0;

        /**
         * Pillbox ownerTeam.
         * @member {number} ownerTeam
         * @memberof jsbolo.Pillbox
         * @instance
         */
        Pillbox.prototype.ownerTeam = 0;

        /**
         * Pillbox inTank.
         * @member {boolean} inTank
         * @memberof jsbolo.Pillbox
         * @instance
         */
        Pillbox.prototype.inTank = false;

        /**
         * Creates a new Pillbox instance using the specified properties.
         * @function create
         * @memberof jsbolo.Pillbox
         * @static
         * @param {jsbolo.IPillbox=} [properties] Properties to set
         * @returns {jsbolo.Pillbox} Pillbox instance
         */
        Pillbox.create = function create(properties) {
            return new Pillbox(properties);
        };

        /**
         * Encodes the specified Pillbox message. Does not implicitly {@link jsbolo.Pillbox.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.Pillbox
         * @static
         * @param {jsbolo.IPillbox} message Pillbox message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pillbox.encode = function encode(message, writer) {
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
         * Encodes the specified Pillbox message, length delimited. Does not implicitly {@link jsbolo.Pillbox.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.Pillbox
         * @static
         * @param {jsbolo.IPillbox} message Pillbox message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pillbox.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Pillbox message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.Pillbox
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.Pillbox} Pillbox
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pillbox.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.Pillbox();
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
         * Decodes a Pillbox message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.Pillbox
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.Pillbox} Pillbox
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pillbox.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Pillbox message.
         * @function verify
         * @memberof jsbolo.Pillbox
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Pillbox.verify = function verify(message) {
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
         * Creates a Pillbox message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.Pillbox
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.Pillbox} Pillbox
         */
        Pillbox.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.Pillbox)
                return object;
            let message = new $root.jsbolo.Pillbox();
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
         * Creates a plain object from a Pillbox message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.Pillbox
         * @static
         * @param {jsbolo.Pillbox} message Pillbox
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Pillbox.toObject = function toObject(message, options) {
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
         * Converts this Pillbox to JSON.
         * @function toJSON
         * @memberof jsbolo.Pillbox
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Pillbox.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Pillbox
         * @function getTypeUrl
         * @memberof jsbolo.Pillbox
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Pillbox.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.Pillbox";
        };

        return Pillbox;
    })();

    jsbolo.Base = (function() {

        /**
         * Properties of a Base.
         * @memberof jsbolo
         * @interface IBase
         * @property {number|null} [id] Base id
         * @property {number|null} [tileX] Base tileX
         * @property {number|null} [tileY] Base tileY
         * @property {number|null} [armor] Base armor
         * @property {number|null} [shells] Base shells
         * @property {number|null} [mines] Base mines
         * @property {number|null} [ownerTeam] Base ownerTeam
         */

        /**
         * Constructs a new Base.
         * @memberof jsbolo
         * @classdesc Represents a Base.
         * @implements IBase
         * @constructor
         * @param {jsbolo.IBase=} [properties] Properties to set
         */
        function Base(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Base id.
         * @member {number} id
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.id = 0;

        /**
         * Base tileX.
         * @member {number} tileX
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.tileX = 0;

        /**
         * Base tileY.
         * @member {number} tileY
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.tileY = 0;

        /**
         * Base armor.
         * @member {number} armor
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.armor = 0;

        /**
         * Base shells.
         * @member {number} shells
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.shells = 0;

        /**
         * Base mines.
         * @member {number} mines
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.mines = 0;

        /**
         * Base ownerTeam.
         * @member {number} ownerTeam
         * @memberof jsbolo.Base
         * @instance
         */
        Base.prototype.ownerTeam = 0;

        /**
         * Creates a new Base instance using the specified properties.
         * @function create
         * @memberof jsbolo.Base
         * @static
         * @param {jsbolo.IBase=} [properties] Properties to set
         * @returns {jsbolo.Base} Base instance
         */
        Base.create = function create(properties) {
            return new Base(properties);
        };

        /**
         * Encodes the specified Base message. Does not implicitly {@link jsbolo.Base.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.Base
         * @static
         * @param {jsbolo.IBase} message Base message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Base.encode = function encode(message, writer) {
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
         * Encodes the specified Base message, length delimited. Does not implicitly {@link jsbolo.Base.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.Base
         * @static
         * @param {jsbolo.IBase} message Base message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Base.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Base message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.Base
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.Base} Base
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Base.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.Base();
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
         * Decodes a Base message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.Base
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.Base} Base
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Base.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Base message.
         * @function verify
         * @memberof jsbolo.Base
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Base.verify = function verify(message) {
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
         * Creates a Base message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.Base
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.Base} Base
         */
        Base.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.Base)
                return object;
            let message = new $root.jsbolo.Base();
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
         * Creates a plain object from a Base message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.Base
         * @static
         * @param {jsbolo.Base} message Base
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Base.toObject = function toObject(message, options) {
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
         * Converts this Base to JSON.
         * @function toJSON
         * @memberof jsbolo.Base
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Base.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Base
         * @function getTypeUrl
         * @memberof jsbolo.Base
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Base.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.Base";
        };

        return Base;
    })();

    jsbolo.TerrainUpdate = (function() {

        /**
         * Properties of a TerrainUpdate.
         * @memberof jsbolo
         * @interface ITerrainUpdate
         * @property {number|null} [x] TerrainUpdate x
         * @property {number|null} [y] TerrainUpdate y
         * @property {number|null} [terrain] TerrainUpdate terrain
         * @property {number|null} [terrainLife] TerrainUpdate terrainLife
         * @property {number|null} [direction] TerrainUpdate direction
         */

        /**
         * Constructs a new TerrainUpdate.
         * @memberof jsbolo
         * @classdesc Represents a TerrainUpdate.
         * @implements ITerrainUpdate
         * @constructor
         * @param {jsbolo.ITerrainUpdate=} [properties] Properties to set
         */
        function TerrainUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TerrainUpdate x.
         * @member {number} x
         * @memberof jsbolo.TerrainUpdate
         * @instance
         */
        TerrainUpdate.prototype.x = 0;

        /**
         * TerrainUpdate y.
         * @member {number} y
         * @memberof jsbolo.TerrainUpdate
         * @instance
         */
        TerrainUpdate.prototype.y = 0;

        /**
         * TerrainUpdate terrain.
         * @member {number} terrain
         * @memberof jsbolo.TerrainUpdate
         * @instance
         */
        TerrainUpdate.prototype.terrain = 0;

        /**
         * TerrainUpdate terrainLife.
         * @member {number} terrainLife
         * @memberof jsbolo.TerrainUpdate
         * @instance
         */
        TerrainUpdate.prototype.terrainLife = 0;

        /**
         * TerrainUpdate direction.
         * @member {number|null|undefined} direction
         * @memberof jsbolo.TerrainUpdate
         * @instance
         */
        TerrainUpdate.prototype.direction = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(TerrainUpdate.prototype, "_direction", {
            get: $util.oneOfGetter($oneOfFields = ["direction"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new TerrainUpdate instance using the specified properties.
         * @function create
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {jsbolo.ITerrainUpdate=} [properties] Properties to set
         * @returns {jsbolo.TerrainUpdate} TerrainUpdate instance
         */
        TerrainUpdate.create = function create(properties) {
            return new TerrainUpdate(properties);
        };

        /**
         * Encodes the specified TerrainUpdate message. Does not implicitly {@link jsbolo.TerrainUpdate.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {jsbolo.ITerrainUpdate} message TerrainUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TerrainUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.y);
            if (message.terrain != null && Object.hasOwnProperty.call(message, "terrain"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.terrain);
            if (message.terrainLife != null && Object.hasOwnProperty.call(message, "terrainLife"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.terrainLife);
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.direction);
            return writer;
        };

        /**
         * Encodes the specified TerrainUpdate message, length delimited. Does not implicitly {@link jsbolo.TerrainUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {jsbolo.ITerrainUpdate} message TerrainUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TerrainUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TerrainUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.TerrainUpdate} TerrainUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TerrainUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.TerrainUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.uint32();
                        break;
                    }
                case 2: {
                        message.y = reader.uint32();
                        break;
                    }
                case 3: {
                        message.terrain = reader.uint32();
                        break;
                    }
                case 4: {
                        message.terrainLife = reader.uint32();
                        break;
                    }
                case 5: {
                        message.direction = reader.uint32();
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
         * Decodes a TerrainUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.TerrainUpdate} TerrainUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TerrainUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TerrainUpdate message.
         * @function verify
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TerrainUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.terrain != null && message.hasOwnProperty("terrain"))
                if (!$util.isInteger(message.terrain))
                    return "terrain: integer expected";
            if (message.terrainLife != null && message.hasOwnProperty("terrainLife"))
                if (!$util.isInteger(message.terrainLife))
                    return "terrainLife: integer expected";
            if (message.direction != null && message.hasOwnProperty("direction")) {
                properties._direction = 1;
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            }
            return null;
        };

        /**
         * Creates a TerrainUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.TerrainUpdate} TerrainUpdate
         */
        TerrainUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.TerrainUpdate)
                return object;
            let message = new $root.jsbolo.TerrainUpdate();
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            if (object.terrain != null)
                message.terrain = object.terrain >>> 0;
            if (object.terrainLife != null)
                message.terrainLife = object.terrainLife >>> 0;
            if (object.direction != null)
                message.direction = object.direction >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a TerrainUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {jsbolo.TerrainUpdate} message TerrainUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TerrainUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.terrain = 0;
                object.terrainLife = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.terrain != null && message.hasOwnProperty("terrain"))
                object.terrain = message.terrain;
            if (message.terrainLife != null && message.hasOwnProperty("terrainLife"))
                object.terrainLife = message.terrainLife;
            if (message.direction != null && message.hasOwnProperty("direction")) {
                object.direction = message.direction;
                if (options.oneofs)
                    object._direction = "direction";
            }
            return object;
        };

        /**
         * Converts this TerrainUpdate to JSON.
         * @function toJSON
         * @memberof jsbolo.TerrainUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TerrainUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TerrainUpdate
         * @function getTypeUrl
         * @memberof jsbolo.TerrainUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TerrainUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.TerrainUpdate";
        };

        return TerrainUpdate;
    })();

    jsbolo.SoundEvent = (function() {

        /**
         * Properties of a SoundEvent.
         * @memberof jsbolo
         * @interface ISoundEvent
         * @property {number|null} [soundId] SoundEvent soundId
         * @property {number|null} [x] SoundEvent x
         * @property {number|null} [y] SoundEvent y
         */

        /**
         * Constructs a new SoundEvent.
         * @memberof jsbolo
         * @classdesc Represents a SoundEvent.
         * @implements ISoundEvent
         * @constructor
         * @param {jsbolo.ISoundEvent=} [properties] Properties to set
         */
        function SoundEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SoundEvent soundId.
         * @member {number} soundId
         * @memberof jsbolo.SoundEvent
         * @instance
         */
        SoundEvent.prototype.soundId = 0;

        /**
         * SoundEvent x.
         * @member {number} x
         * @memberof jsbolo.SoundEvent
         * @instance
         */
        SoundEvent.prototype.x = 0;

        /**
         * SoundEvent y.
         * @member {number} y
         * @memberof jsbolo.SoundEvent
         * @instance
         */
        SoundEvent.prototype.y = 0;

        /**
         * Creates a new SoundEvent instance using the specified properties.
         * @function create
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {jsbolo.ISoundEvent=} [properties] Properties to set
         * @returns {jsbolo.SoundEvent} SoundEvent instance
         */
        SoundEvent.create = function create(properties) {
            return new SoundEvent(properties);
        };

        /**
         * Encodes the specified SoundEvent message. Does not implicitly {@link jsbolo.SoundEvent.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {jsbolo.ISoundEvent} message SoundEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SoundEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.soundId != null && Object.hasOwnProperty.call(message, "soundId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.soundId);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
            return writer;
        };

        /**
         * Encodes the specified SoundEvent message, length delimited. Does not implicitly {@link jsbolo.SoundEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {jsbolo.ISoundEvent} message SoundEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SoundEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SoundEvent message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.SoundEvent} SoundEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SoundEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.SoundEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.soundId = reader.uint32();
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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SoundEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.SoundEvent} SoundEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SoundEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SoundEvent message.
         * @function verify
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SoundEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.soundId != null && message.hasOwnProperty("soundId"))
                if (!$util.isInteger(message.soundId))
                    return "soundId: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            return null;
        };

        /**
         * Creates a SoundEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.SoundEvent} SoundEvent
         */
        SoundEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.SoundEvent)
                return object;
            let message = new $root.jsbolo.SoundEvent();
            if (object.soundId != null)
                message.soundId = object.soundId >>> 0;
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a SoundEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {jsbolo.SoundEvent} message SoundEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SoundEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.soundId = 0;
                object.x = 0;
                object.y = 0;
            }
            if (message.soundId != null && message.hasOwnProperty("soundId"))
                object.soundId = message.soundId;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            return object;
        };

        /**
         * Converts this SoundEvent to JSON.
         * @function toJSON
         * @memberof jsbolo.SoundEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SoundEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SoundEvent
         * @function getTypeUrl
         * @memberof jsbolo.SoundEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SoundEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.SoundEvent";
        };

        return SoundEvent;
    })();

    /**
     * HudMessageClass enum.
     * @name jsbolo.HudMessageClass
     * @enum {number}
     * @property {number} HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION=0 HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION value
     * @property {number} HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION=1 HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION value
     * @property {number} HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION=2 HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION value
     * @property {number} HUD_MESSAGE_CLASS_CHAT_GLOBAL=3 HUD_MESSAGE_CLASS_CHAT_GLOBAL value
     * @property {number} HUD_MESSAGE_CLASS_CHAT_ALLIANCE=4 HUD_MESSAGE_CLASS_CHAT_ALLIANCE value
     * @property {number} HUD_MESSAGE_CLASS_SYSTEM_STATUS=5 HUD_MESSAGE_CLASS_SYSTEM_STATUS value
     */
    jsbolo.HudMessageClass = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION"] = 0;
        values[valuesById[1] = "HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION"] = 1;
        values[valuesById[2] = "HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION"] = 2;
        values[valuesById[3] = "HUD_MESSAGE_CLASS_CHAT_GLOBAL"] = 3;
        values[valuesById[4] = "HUD_MESSAGE_CLASS_CHAT_ALLIANCE"] = 4;
        values[valuesById[5] = "HUD_MESSAGE_CLASS_SYSTEM_STATUS"] = 5;
        return values;
    })();

    jsbolo.HudMessage = (function() {

        /**
         * Properties of a HudMessage.
         * @memberof jsbolo
         * @interface IHudMessage
         * @property {number|Long|null} [id] HudMessage id
         * @property {number|null} [tick] HudMessage tick
         * @property {jsbolo.HudMessageClass|null} ["class"] HudMessage class
         * @property {string|null} [text] HudMessage text
         */

        /**
         * Constructs a new HudMessage.
         * @memberof jsbolo
         * @classdesc Represents a HudMessage.
         * @implements IHudMessage
         * @constructor
         * @param {jsbolo.IHudMessage=} [properties] Properties to set
         */
        function HudMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HudMessage id.
         * @member {number|Long} id
         * @memberof jsbolo.HudMessage
         * @instance
         */
        HudMessage.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * HudMessage tick.
         * @member {number} tick
         * @memberof jsbolo.HudMessage
         * @instance
         */
        HudMessage.prototype.tick = 0;

        /**
         * HudMessage class.
         * @member {jsbolo.HudMessageClass} class
         * @memberof jsbolo.HudMessage
         * @instance
         */
        HudMessage.prototype["class"] = 0;

        /**
         * HudMessage text.
         * @member {string} text
         * @memberof jsbolo.HudMessage
         * @instance
         */
        HudMessage.prototype.text = "";

        /**
         * Creates a new HudMessage instance using the specified properties.
         * @function create
         * @memberof jsbolo.HudMessage
         * @static
         * @param {jsbolo.IHudMessage=} [properties] Properties to set
         * @returns {jsbolo.HudMessage} HudMessage instance
         */
        HudMessage.create = function create(properties) {
            return new HudMessage(properties);
        };

        /**
         * Encodes the specified HudMessage message. Does not implicitly {@link jsbolo.HudMessage.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.HudMessage
         * @static
         * @param {jsbolo.IHudMessage} message HudMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HudMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
            if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tick);
            if (message["class"] != null && Object.hasOwnProperty.call(message, "class"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message["class"]);
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.text);
            return writer;
        };

        /**
         * Encodes the specified HudMessage message, length delimited. Does not implicitly {@link jsbolo.HudMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.HudMessage
         * @static
         * @param {jsbolo.IHudMessage} message HudMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HudMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HudMessage message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.HudMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.HudMessage} HudMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HudMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.HudMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint64();
                        break;
                    }
                case 2: {
                        message.tick = reader.uint32();
                        break;
                    }
                case 3: {
                        message["class"] = reader.int32();
                        break;
                    }
                case 4: {
                        message.text = reader.string();
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
         * Decodes a HudMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.HudMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.HudMessage} HudMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HudMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HudMessage message.
         * @function verify
         * @memberof jsbolo.HudMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HudMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                    return "id: integer|Long expected";
            if (message.tick != null && message.hasOwnProperty("tick"))
                if (!$util.isInteger(message.tick))
                    return "tick: integer expected";
            if (message["class"] != null && message.hasOwnProperty("class"))
                switch (message["class"]) {
                default:
                    return "class: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            return null;
        };

        /**
         * Creates a HudMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.HudMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.HudMessage} HudMessage
         */
        HudMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.HudMessage)
                return object;
            let message = new $root.jsbolo.HudMessage();
            if (object.id != null)
                if ($util.Long)
                    (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                else if (typeof object.id === "string")
                    message.id = parseInt(object.id, 10);
                else if (typeof object.id === "number")
                    message.id = object.id;
                else if (typeof object.id === "object")
                    message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
            if (object.tick != null)
                message.tick = object.tick >>> 0;
            switch (object["class"]) {
            default:
                if (typeof object["class"] === "number") {
                    message["class"] = object["class"];
                    break;
                }
                break;
            case "HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION":
            case 0:
                message["class"] = 0;
                break;
            case "HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION":
            case 1:
                message["class"] = 1;
                break;
            case "HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION":
            case 2:
                message["class"] = 2;
                break;
            case "HUD_MESSAGE_CLASS_CHAT_GLOBAL":
            case 3:
                message["class"] = 3;
                break;
            case "HUD_MESSAGE_CLASS_CHAT_ALLIANCE":
            case 4:
                message["class"] = 4;
                break;
            case "HUD_MESSAGE_CLASS_SYSTEM_STATUS":
            case 5:
                message["class"] = 5;
                break;
            }
            if (object.text != null)
                message.text = String(object.text);
            return message;
        };

        /**
         * Creates a plain object from a HudMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.HudMessage
         * @static
         * @param {jsbolo.HudMessage} message HudMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HudMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.id = options.longs === String ? "0" : 0;
                object.tick = 0;
                object["class"] = options.enums === String ? "HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION" : 0;
                object.text = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                if (typeof message.id === "number")
                    object.id = options.longs === String ? String(message.id) : message.id;
                else
                    object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
            if (message.tick != null && message.hasOwnProperty("tick"))
                object.tick = message.tick;
            if (message["class"] != null && message.hasOwnProperty("class"))
                object["class"] = options.enums === String ? $root.jsbolo.HudMessageClass[message["class"]] === undefined ? message["class"] : $root.jsbolo.HudMessageClass[message["class"]] : message["class"];
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            return object;
        };

        /**
         * Converts this HudMessage to JSON.
         * @function toJSON
         * @memberof jsbolo.HudMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HudMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HudMessage
         * @function getTypeUrl
         * @memberof jsbolo.HudMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HudMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.HudMessage";
        };

        return HudMessage;
    })();

    jsbolo.WelcomeMap = (function() {

        /**
         * Properties of a WelcomeMap.
         * @memberof jsbolo
         * @interface IWelcomeMap
         * @property {number|null} [width] WelcomeMap width
         * @property {number|null} [height] WelcomeMap height
         * @property {Array.<number>|null} [terrain] WelcomeMap terrain
         * @property {Array.<number>|null} [terrainLife] WelcomeMap terrainLife
         */

        /**
         * Constructs a new WelcomeMap.
         * @memberof jsbolo
         * @classdesc Represents a WelcomeMap.
         * @implements IWelcomeMap
         * @constructor
         * @param {jsbolo.IWelcomeMap=} [properties] Properties to set
         */
        function WelcomeMap(properties) {
            this.terrain = [];
            this.terrainLife = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WelcomeMap width.
         * @member {number} width
         * @memberof jsbolo.WelcomeMap
         * @instance
         */
        WelcomeMap.prototype.width = 0;

        /**
         * WelcomeMap height.
         * @member {number} height
         * @memberof jsbolo.WelcomeMap
         * @instance
         */
        WelcomeMap.prototype.height = 0;

        /**
         * WelcomeMap terrain.
         * @member {Array.<number>} terrain
         * @memberof jsbolo.WelcomeMap
         * @instance
         */
        WelcomeMap.prototype.terrain = $util.emptyArray;

        /**
         * WelcomeMap terrainLife.
         * @member {Array.<number>} terrainLife
         * @memberof jsbolo.WelcomeMap
         * @instance
         */
        WelcomeMap.prototype.terrainLife = $util.emptyArray;

        /**
         * Creates a new WelcomeMap instance using the specified properties.
         * @function create
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {jsbolo.IWelcomeMap=} [properties] Properties to set
         * @returns {jsbolo.WelcomeMap} WelcomeMap instance
         */
        WelcomeMap.create = function create(properties) {
            return new WelcomeMap(properties);
        };

        /**
         * Encodes the specified WelcomeMap message. Does not implicitly {@link jsbolo.WelcomeMap.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {jsbolo.IWelcomeMap} message WelcomeMap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WelcomeMap.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
            if (message.terrain != null && message.terrain.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (let i = 0; i < message.terrain.length; ++i)
                    writer.uint32(message.terrain[i]);
                writer.ldelim();
            }
            if (message.terrainLife != null && message.terrainLife.length) {
                writer.uint32(/* id 4, wireType 2 =*/34).fork();
                for (let i = 0; i < message.terrainLife.length; ++i)
                    writer.uint32(message.terrainLife[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified WelcomeMap message, length delimited. Does not implicitly {@link jsbolo.WelcomeMap.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {jsbolo.IWelcomeMap} message WelcomeMap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WelcomeMap.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WelcomeMap message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.WelcomeMap} WelcomeMap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WelcomeMap.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.WelcomeMap();
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
                        if (!(message.terrain && message.terrain.length))
                            message.terrain = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.terrain.push(reader.uint32());
                        } else
                            message.terrain.push(reader.uint32());
                        break;
                    }
                case 4: {
                        if (!(message.terrainLife && message.terrainLife.length))
                            message.terrainLife = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.terrainLife.push(reader.uint32());
                        } else
                            message.terrainLife.push(reader.uint32());
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
         * Decodes a WelcomeMap message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.WelcomeMap} WelcomeMap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WelcomeMap.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WelcomeMap message.
         * @function verify
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WelcomeMap.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.terrain != null && message.hasOwnProperty("terrain")) {
                if (!Array.isArray(message.terrain))
                    return "terrain: array expected";
                for (let i = 0; i < message.terrain.length; ++i)
                    if (!$util.isInteger(message.terrain[i]))
                        return "terrain: integer[] expected";
            }
            if (message.terrainLife != null && message.hasOwnProperty("terrainLife")) {
                if (!Array.isArray(message.terrainLife))
                    return "terrainLife: array expected";
                for (let i = 0; i < message.terrainLife.length; ++i)
                    if (!$util.isInteger(message.terrainLife[i]))
                        return "terrainLife: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a WelcomeMap message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.WelcomeMap} WelcomeMap
         */
        WelcomeMap.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.WelcomeMap)
                return object;
            let message = new $root.jsbolo.WelcomeMap();
            if (object.width != null)
                message.width = object.width >>> 0;
            if (object.height != null)
                message.height = object.height >>> 0;
            if (object.terrain) {
                if (!Array.isArray(object.terrain))
                    throw TypeError(".jsbolo.WelcomeMap.terrain: array expected");
                message.terrain = [];
                for (let i = 0; i < object.terrain.length; ++i)
                    message.terrain[i] = object.terrain[i] >>> 0;
            }
            if (object.terrainLife) {
                if (!Array.isArray(object.terrainLife))
                    throw TypeError(".jsbolo.WelcomeMap.terrainLife: array expected");
                message.terrainLife = [];
                for (let i = 0; i < object.terrainLife.length; ++i)
                    message.terrainLife[i] = object.terrainLife[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a WelcomeMap message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {jsbolo.WelcomeMap} message WelcomeMap
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WelcomeMap.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.terrain = [];
                object.terrainLife = [];
            }
            if (options.defaults) {
                object.width = 0;
                object.height = 0;
            }
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.terrain && message.terrain.length) {
                object.terrain = [];
                for (let j = 0; j < message.terrain.length; ++j)
                    object.terrain[j] = message.terrain[j];
            }
            if (message.terrainLife && message.terrainLife.length) {
                object.terrainLife = [];
                for (let j = 0; j < message.terrainLife.length; ++j)
                    object.terrainLife[j] = message.terrainLife[j];
            }
            return object;
        };

        /**
         * Converts this WelcomeMap to JSON.
         * @function toJSON
         * @memberof jsbolo.WelcomeMap
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WelcomeMap.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WelcomeMap
         * @function getTypeUrl
         * @memberof jsbolo.WelcomeMap
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WelcomeMap.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.WelcomeMap";
        };

        return WelcomeMap;
    })();

    jsbolo.WelcomeMessage = (function() {

        /**
         * Properties of a WelcomeMessage.
         * @memberof jsbolo
         * @interface IWelcomeMessage
         * @property {number|null} [playerId] WelcomeMessage playerId
         * @property {number|null} [assignedTeam] WelcomeMessage assignedTeam
         * @property {number|null} [currentTick] WelcomeMessage currentTick
         * @property {string|null} [mapName] WelcomeMessage mapName
         * @property {jsbolo.IWelcomeMap|null} [map] WelcomeMessage map
         * @property {Array.<jsbolo.ITank>|null} [tanks] WelcomeMessage tanks
         * @property {Array.<jsbolo.IPillbox>|null} [pillboxes] WelcomeMessage pillboxes
         * @property {Array.<jsbolo.IBase>|null} [bases] WelcomeMessage bases
         * @property {boolean|null} [matchEnded] WelcomeMessage matchEnded
         * @property {Array.<number>|null} [winningTeams] WelcomeMessage winningTeams
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
            this.tanks = [];
            this.pillboxes = [];
            this.bases = [];
            this.winningTeams = [];
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
         * WelcomeMessage mapName.
         * @member {string} mapName
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.mapName = "";

        /**
         * WelcomeMessage map.
         * @member {jsbolo.IWelcomeMap|null|undefined} map
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.map = null;

        /**
         * WelcomeMessage tanks.
         * @member {Array.<jsbolo.ITank>} tanks
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.tanks = $util.emptyArray;

        /**
         * WelcomeMessage pillboxes.
         * @member {Array.<jsbolo.IPillbox>} pillboxes
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.pillboxes = $util.emptyArray;

        /**
         * WelcomeMessage bases.
         * @member {Array.<jsbolo.IBase>} bases
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.bases = $util.emptyArray;

        /**
         * WelcomeMessage matchEnded.
         * @member {boolean|null|undefined} matchEnded
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.matchEnded = null;

        /**
         * WelcomeMessage winningTeams.
         * @member {Array.<number>} winningTeams
         * @memberof jsbolo.WelcomeMessage
         * @instance
         */
        WelcomeMessage.prototype.winningTeams = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(WelcomeMessage.prototype, "_matchEnded", {
            get: $util.oneOfGetter($oneOfFields = ["matchEnded"]),
            set: $util.oneOfSetter($oneOfFields)
        });

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
            if (message.mapName != null && Object.hasOwnProperty.call(message, "mapName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.mapName);
            if (message.map != null && Object.hasOwnProperty.call(message, "map"))
                $root.jsbolo.WelcomeMap.encode(message.map, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.tanks != null && message.tanks.length)
                for (let i = 0; i < message.tanks.length; ++i)
                    $root.jsbolo.Tank.encode(message.tanks[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.pillboxes != null && message.pillboxes.length)
                for (let i = 0; i < message.pillboxes.length; ++i)
                    $root.jsbolo.Pillbox.encode(message.pillboxes[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.bases != null && message.bases.length)
                for (let i = 0; i < message.bases.length; ++i)
                    $root.jsbolo.Base.encode(message.bases[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.matchEnded != null && Object.hasOwnProperty.call(message, "matchEnded"))
                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.matchEnded);
            if (message.winningTeams != null && message.winningTeams.length) {
                writer.uint32(/* id 10, wireType 2 =*/82).fork();
                for (let i = 0; i < message.winningTeams.length; ++i)
                    writer.uint32(message.winningTeams[i]);
                writer.ldelim();
            }
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
                        message.mapName = reader.string();
                        break;
                    }
                case 5: {
                        message.map = $root.jsbolo.WelcomeMap.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        if (!(message.tanks && message.tanks.length))
                            message.tanks = [];
                        message.tanks.push($root.jsbolo.Tank.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        if (!(message.pillboxes && message.pillboxes.length))
                            message.pillboxes = [];
                        message.pillboxes.push($root.jsbolo.Pillbox.decode(reader, reader.uint32()));
                        break;
                    }
                case 8: {
                        if (!(message.bases && message.bases.length))
                            message.bases = [];
                        message.bases.push($root.jsbolo.Base.decode(reader, reader.uint32()));
                        break;
                    }
                case 9: {
                        message.matchEnded = reader.bool();
                        break;
                    }
                case 10: {
                        if (!(message.winningTeams && message.winningTeams.length))
                            message.winningTeams = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.winningTeams.push(reader.uint32());
                        } else
                            message.winningTeams.push(reader.uint32());
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
            let properties = {};
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                if (!$util.isInteger(message.playerId))
                    return "playerId: integer expected";
            if (message.assignedTeam != null && message.hasOwnProperty("assignedTeam"))
                if (!$util.isInteger(message.assignedTeam))
                    return "assignedTeam: integer expected";
            if (message.currentTick != null && message.hasOwnProperty("currentTick"))
                if (!$util.isInteger(message.currentTick))
                    return "currentTick: integer expected";
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                if (!$util.isString(message.mapName))
                    return "mapName: string expected";
            if (message.map != null && message.hasOwnProperty("map")) {
                let error = $root.jsbolo.WelcomeMap.verify(message.map);
                if (error)
                    return "map." + error;
            }
            if (message.tanks != null && message.hasOwnProperty("tanks")) {
                if (!Array.isArray(message.tanks))
                    return "tanks: array expected";
                for (let i = 0; i < message.tanks.length; ++i) {
                    let error = $root.jsbolo.Tank.verify(message.tanks[i]);
                    if (error)
                        return "tanks." + error;
                }
            }
            if (message.pillboxes != null && message.hasOwnProperty("pillboxes")) {
                if (!Array.isArray(message.pillboxes))
                    return "pillboxes: array expected";
                for (let i = 0; i < message.pillboxes.length; ++i) {
                    let error = $root.jsbolo.Pillbox.verify(message.pillboxes[i]);
                    if (error)
                        return "pillboxes." + error;
                }
            }
            if (message.bases != null && message.hasOwnProperty("bases")) {
                if (!Array.isArray(message.bases))
                    return "bases: array expected";
                for (let i = 0; i < message.bases.length; ++i) {
                    let error = $root.jsbolo.Base.verify(message.bases[i]);
                    if (error)
                        return "bases." + error;
                }
            }
            if (message.matchEnded != null && message.hasOwnProperty("matchEnded")) {
                properties._matchEnded = 1;
                if (typeof message.matchEnded !== "boolean")
                    return "matchEnded: boolean expected";
            }
            if (message.winningTeams != null && message.hasOwnProperty("winningTeams")) {
                if (!Array.isArray(message.winningTeams))
                    return "winningTeams: array expected";
                for (let i = 0; i < message.winningTeams.length; ++i)
                    if (!$util.isInteger(message.winningTeams[i]))
                        return "winningTeams: integer[] expected";
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
            if (object.mapName != null)
                message.mapName = String(object.mapName);
            if (object.map != null) {
                if (typeof object.map !== "object")
                    throw TypeError(".jsbolo.WelcomeMessage.map: object expected");
                message.map = $root.jsbolo.WelcomeMap.fromObject(object.map);
            }
            if (object.tanks) {
                if (!Array.isArray(object.tanks))
                    throw TypeError(".jsbolo.WelcomeMessage.tanks: array expected");
                message.tanks = [];
                for (let i = 0; i < object.tanks.length; ++i) {
                    if (typeof object.tanks[i] !== "object")
                        throw TypeError(".jsbolo.WelcomeMessage.tanks: object expected");
                    message.tanks[i] = $root.jsbolo.Tank.fromObject(object.tanks[i]);
                }
            }
            if (object.pillboxes) {
                if (!Array.isArray(object.pillboxes))
                    throw TypeError(".jsbolo.WelcomeMessage.pillboxes: array expected");
                message.pillboxes = [];
                for (let i = 0; i < object.pillboxes.length; ++i) {
                    if (typeof object.pillboxes[i] !== "object")
                        throw TypeError(".jsbolo.WelcomeMessage.pillboxes: object expected");
                    message.pillboxes[i] = $root.jsbolo.Pillbox.fromObject(object.pillboxes[i]);
                }
            }
            if (object.bases) {
                if (!Array.isArray(object.bases))
                    throw TypeError(".jsbolo.WelcomeMessage.bases: array expected");
                message.bases = [];
                for (let i = 0; i < object.bases.length; ++i) {
                    if (typeof object.bases[i] !== "object")
                        throw TypeError(".jsbolo.WelcomeMessage.bases: object expected");
                    message.bases[i] = $root.jsbolo.Base.fromObject(object.bases[i]);
                }
            }
            if (object.matchEnded != null)
                message.matchEnded = Boolean(object.matchEnded);
            if (object.winningTeams) {
                if (!Array.isArray(object.winningTeams))
                    throw TypeError(".jsbolo.WelcomeMessage.winningTeams: array expected");
                message.winningTeams = [];
                for (let i = 0; i < object.winningTeams.length; ++i)
                    message.winningTeams[i] = object.winningTeams[i] >>> 0;
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
            if (options.arrays || options.defaults) {
                object.tanks = [];
                object.pillboxes = [];
                object.bases = [];
                object.winningTeams = [];
            }
            if (options.defaults) {
                object.playerId = 0;
                object.assignedTeam = 0;
                object.currentTick = 0;
                object.mapName = "";
                object.map = null;
            }
            if (message.playerId != null && message.hasOwnProperty("playerId"))
                object.playerId = message.playerId;
            if (message.assignedTeam != null && message.hasOwnProperty("assignedTeam"))
                object.assignedTeam = message.assignedTeam;
            if (message.currentTick != null && message.hasOwnProperty("currentTick"))
                object.currentTick = message.currentTick;
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                object.mapName = message.mapName;
            if (message.map != null && message.hasOwnProperty("map"))
                object.map = $root.jsbolo.WelcomeMap.toObject(message.map, options);
            if (message.tanks && message.tanks.length) {
                object.tanks = [];
                for (let j = 0; j < message.tanks.length; ++j)
                    object.tanks[j] = $root.jsbolo.Tank.toObject(message.tanks[j], options);
            }
            if (message.pillboxes && message.pillboxes.length) {
                object.pillboxes = [];
                for (let j = 0; j < message.pillboxes.length; ++j)
                    object.pillboxes[j] = $root.jsbolo.Pillbox.toObject(message.pillboxes[j], options);
            }
            if (message.bases && message.bases.length) {
                object.bases = [];
                for (let j = 0; j < message.bases.length; ++j)
                    object.bases[j] = $root.jsbolo.Base.toObject(message.bases[j], options);
            }
            if (message.matchEnded != null && message.hasOwnProperty("matchEnded")) {
                object.matchEnded = message.matchEnded;
                if (options.oneofs)
                    object._matchEnded = "matchEnded";
            }
            if (message.winningTeams && message.winningTeams.length) {
                object.winningTeams = [];
                for (let j = 0; j < message.winningTeams.length; ++j)
                    object.winningTeams[j] = message.winningTeams[j];
            }
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

    jsbolo.UpdateMessage = (function() {

        /**
         * Properties of an UpdateMessage.
         * @memberof jsbolo
         * @interface IUpdateMessage
         * @property {number|null} [tick] UpdateMessage tick
         * @property {Array.<jsbolo.ITank>|null} [tanks] UpdateMessage tanks
         * @property {Array.<jsbolo.IShell>|null} [shells] UpdateMessage shells
         * @property {Array.<jsbolo.IBuilder>|null} [builders] UpdateMessage builders
         * @property {Array.<jsbolo.IPillbox>|null} [pillboxes] UpdateMessage pillboxes
         * @property {Array.<jsbolo.IBase>|null} [bases] UpdateMessage bases
         * @property {Array.<number>|null} [removedTankIds] UpdateMessage removedTankIds
         * @property {Array.<number>|null} [removedBuilderIds] UpdateMessage removedBuilderIds
         * @property {Array.<number>|null} [removedPillboxIds] UpdateMessage removedPillboxIds
         * @property {Array.<number>|null} [removedBaseIds] UpdateMessage removedBaseIds
         * @property {Array.<jsbolo.ITerrainUpdate>|null} [terrainUpdates] UpdateMessage terrainUpdates
         * @property {Array.<jsbolo.ISoundEvent>|null} [soundEvents] UpdateMessage soundEvents
         * @property {boolean|null} [matchEnded] UpdateMessage matchEnded
         * @property {Array.<number>|null} [winningTeams] UpdateMessage winningTeams
         * @property {Array.<jsbolo.IHudMessage>|null} [hudMessages] UpdateMessage hudMessages
         */

        /**
         * Constructs a new UpdateMessage.
         * @memberof jsbolo
         * @classdesc Represents an UpdateMessage.
         * @implements IUpdateMessage
         * @constructor
         * @param {jsbolo.IUpdateMessage=} [properties] Properties to set
         */
        function UpdateMessage(properties) {
            this.tanks = [];
            this.shells = [];
            this.builders = [];
            this.pillboxes = [];
            this.bases = [];
            this.removedTankIds = [];
            this.removedBuilderIds = [];
            this.removedPillboxIds = [];
            this.removedBaseIds = [];
            this.terrainUpdates = [];
            this.soundEvents = [];
            this.winningTeams = [];
            this.hudMessages = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateMessage tick.
         * @member {number} tick
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.tick = 0;

        /**
         * UpdateMessage tanks.
         * @member {Array.<jsbolo.ITank>} tanks
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.tanks = $util.emptyArray;

        /**
         * UpdateMessage shells.
         * @member {Array.<jsbolo.IShell>} shells
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.shells = $util.emptyArray;

        /**
         * UpdateMessage builders.
         * @member {Array.<jsbolo.IBuilder>} builders
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.builders = $util.emptyArray;

        /**
         * UpdateMessage pillboxes.
         * @member {Array.<jsbolo.IPillbox>} pillboxes
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.pillboxes = $util.emptyArray;

        /**
         * UpdateMessage bases.
         * @member {Array.<jsbolo.IBase>} bases
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.bases = $util.emptyArray;

        /**
         * UpdateMessage removedTankIds.
         * @member {Array.<number>} removedTankIds
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.removedTankIds = $util.emptyArray;

        /**
         * UpdateMessage removedBuilderIds.
         * @member {Array.<number>} removedBuilderIds
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.removedBuilderIds = $util.emptyArray;

        /**
         * UpdateMessage removedPillboxIds.
         * @member {Array.<number>} removedPillboxIds
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.removedPillboxIds = $util.emptyArray;

        /**
         * UpdateMessage removedBaseIds.
         * @member {Array.<number>} removedBaseIds
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.removedBaseIds = $util.emptyArray;

        /**
         * UpdateMessage terrainUpdates.
         * @member {Array.<jsbolo.ITerrainUpdate>} terrainUpdates
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.terrainUpdates = $util.emptyArray;

        /**
         * UpdateMessage soundEvents.
         * @member {Array.<jsbolo.ISoundEvent>} soundEvents
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.soundEvents = $util.emptyArray;

        /**
         * UpdateMessage matchEnded.
         * @member {boolean|null|undefined} matchEnded
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.matchEnded = null;

        /**
         * UpdateMessage winningTeams.
         * @member {Array.<number>} winningTeams
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.winningTeams = $util.emptyArray;

        /**
         * UpdateMessage hudMessages.
         * @member {Array.<jsbolo.IHudMessage>} hudMessages
         * @memberof jsbolo.UpdateMessage
         * @instance
         */
        UpdateMessage.prototype.hudMessages = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(UpdateMessage.prototype, "_matchEnded", {
            get: $util.oneOfGetter($oneOfFields = ["matchEnded"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new UpdateMessage instance using the specified properties.
         * @function create
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {jsbolo.IUpdateMessage=} [properties] Properties to set
         * @returns {jsbolo.UpdateMessage} UpdateMessage instance
         */
        UpdateMessage.create = function create(properties) {
            return new UpdateMessage(properties);
        };

        /**
         * Encodes the specified UpdateMessage message. Does not implicitly {@link jsbolo.UpdateMessage.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {jsbolo.IUpdateMessage} message UpdateMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.tick);
            if (message.tanks != null && message.tanks.length)
                for (let i = 0; i < message.tanks.length; ++i)
                    $root.jsbolo.Tank.encode(message.tanks[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.shells != null && message.shells.length)
                for (let i = 0; i < message.shells.length; ++i)
                    $root.jsbolo.Shell.encode(message.shells[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.builders != null && message.builders.length)
                for (let i = 0; i < message.builders.length; ++i)
                    $root.jsbolo.Builder.encode(message.builders[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.pillboxes != null && message.pillboxes.length)
                for (let i = 0; i < message.pillboxes.length; ++i)
                    $root.jsbolo.Pillbox.encode(message.pillboxes[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.bases != null && message.bases.length)
                for (let i = 0; i < message.bases.length; ++i)
                    $root.jsbolo.Base.encode(message.bases[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.removedTankIds != null && message.removedTankIds.length) {
                writer.uint32(/* id 7, wireType 2 =*/58).fork();
                for (let i = 0; i < message.removedTankIds.length; ++i)
                    writer.uint32(message.removedTankIds[i]);
                writer.ldelim();
            }
            if (message.removedBuilderIds != null && message.removedBuilderIds.length) {
                writer.uint32(/* id 8, wireType 2 =*/66).fork();
                for (let i = 0; i < message.removedBuilderIds.length; ++i)
                    writer.uint32(message.removedBuilderIds[i]);
                writer.ldelim();
            }
            if (message.removedPillboxIds != null && message.removedPillboxIds.length) {
                writer.uint32(/* id 9, wireType 2 =*/74).fork();
                for (let i = 0; i < message.removedPillboxIds.length; ++i)
                    writer.uint32(message.removedPillboxIds[i]);
                writer.ldelim();
            }
            if (message.removedBaseIds != null && message.removedBaseIds.length) {
                writer.uint32(/* id 10, wireType 2 =*/82).fork();
                for (let i = 0; i < message.removedBaseIds.length; ++i)
                    writer.uint32(message.removedBaseIds[i]);
                writer.ldelim();
            }
            if (message.terrainUpdates != null && message.terrainUpdates.length)
                for (let i = 0; i < message.terrainUpdates.length; ++i)
                    $root.jsbolo.TerrainUpdate.encode(message.terrainUpdates[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.soundEvents != null && message.soundEvents.length)
                for (let i = 0; i < message.soundEvents.length; ++i)
                    $root.jsbolo.SoundEvent.encode(message.soundEvents[i], writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.matchEnded != null && Object.hasOwnProperty.call(message, "matchEnded"))
                writer.uint32(/* id 13, wireType 0 =*/104).bool(message.matchEnded);
            if (message.winningTeams != null && message.winningTeams.length) {
                writer.uint32(/* id 14, wireType 2 =*/114).fork();
                for (let i = 0; i < message.winningTeams.length; ++i)
                    writer.uint32(message.winningTeams[i]);
                writer.ldelim();
            }
            if (message.hudMessages != null && message.hudMessages.length)
                for (let i = 0; i < message.hudMessages.length; ++i)
                    $root.jsbolo.HudMessage.encode(message.hudMessages[i], writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UpdateMessage message, length delimited. Does not implicitly {@link jsbolo.UpdateMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {jsbolo.IUpdateMessage} message UpdateMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateMessage message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.UpdateMessage} UpdateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.UpdateMessage();
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
                        message.tanks.push($root.jsbolo.Tank.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.shells && message.shells.length))
                            message.shells = [];
                        message.shells.push($root.jsbolo.Shell.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.builders && message.builders.length))
                            message.builders = [];
                        message.builders.push($root.jsbolo.Builder.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        if (!(message.pillboxes && message.pillboxes.length))
                            message.pillboxes = [];
                        message.pillboxes.push($root.jsbolo.Pillbox.decode(reader, reader.uint32()));
                        break;
                    }
                case 6: {
                        if (!(message.bases && message.bases.length))
                            message.bases = [];
                        message.bases.push($root.jsbolo.Base.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        if (!(message.removedTankIds && message.removedTankIds.length))
                            message.removedTankIds = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.removedTankIds.push(reader.uint32());
                        } else
                            message.removedTankIds.push(reader.uint32());
                        break;
                    }
                case 8: {
                        if (!(message.removedBuilderIds && message.removedBuilderIds.length))
                            message.removedBuilderIds = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.removedBuilderIds.push(reader.uint32());
                        } else
                            message.removedBuilderIds.push(reader.uint32());
                        break;
                    }
                case 9: {
                        if (!(message.removedPillboxIds && message.removedPillboxIds.length))
                            message.removedPillboxIds = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.removedPillboxIds.push(reader.uint32());
                        } else
                            message.removedPillboxIds.push(reader.uint32());
                        break;
                    }
                case 10: {
                        if (!(message.removedBaseIds && message.removedBaseIds.length))
                            message.removedBaseIds = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.removedBaseIds.push(reader.uint32());
                        } else
                            message.removedBaseIds.push(reader.uint32());
                        break;
                    }
                case 11: {
                        if (!(message.terrainUpdates && message.terrainUpdates.length))
                            message.terrainUpdates = [];
                        message.terrainUpdates.push($root.jsbolo.TerrainUpdate.decode(reader, reader.uint32()));
                        break;
                    }
                case 12: {
                        if (!(message.soundEvents && message.soundEvents.length))
                            message.soundEvents = [];
                        message.soundEvents.push($root.jsbolo.SoundEvent.decode(reader, reader.uint32()));
                        break;
                    }
                case 13: {
                        message.matchEnded = reader.bool();
                        break;
                    }
                case 14: {
                        if (!(message.winningTeams && message.winningTeams.length))
                            message.winningTeams = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.winningTeams.push(reader.uint32());
                        } else
                            message.winningTeams.push(reader.uint32());
                        break;
                    }
                case 15: {
                        if (!(message.hudMessages && message.hudMessages.length))
                            message.hudMessages = [];
                        message.hudMessages.push($root.jsbolo.HudMessage.decode(reader, reader.uint32()));
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
         * Decodes an UpdateMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.UpdateMessage} UpdateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateMessage message.
         * @function verify
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.tick != null && message.hasOwnProperty("tick"))
                if (!$util.isInteger(message.tick))
                    return "tick: integer expected";
            if (message.tanks != null && message.hasOwnProperty("tanks")) {
                if (!Array.isArray(message.tanks))
                    return "tanks: array expected";
                for (let i = 0; i < message.tanks.length; ++i) {
                    let error = $root.jsbolo.Tank.verify(message.tanks[i]);
                    if (error)
                        return "tanks." + error;
                }
            }
            if (message.shells != null && message.hasOwnProperty("shells")) {
                if (!Array.isArray(message.shells))
                    return "shells: array expected";
                for (let i = 0; i < message.shells.length; ++i) {
                    let error = $root.jsbolo.Shell.verify(message.shells[i]);
                    if (error)
                        return "shells." + error;
                }
            }
            if (message.builders != null && message.hasOwnProperty("builders")) {
                if (!Array.isArray(message.builders))
                    return "builders: array expected";
                for (let i = 0; i < message.builders.length; ++i) {
                    let error = $root.jsbolo.Builder.verify(message.builders[i]);
                    if (error)
                        return "builders." + error;
                }
            }
            if (message.pillboxes != null && message.hasOwnProperty("pillboxes")) {
                if (!Array.isArray(message.pillboxes))
                    return "pillboxes: array expected";
                for (let i = 0; i < message.pillboxes.length; ++i) {
                    let error = $root.jsbolo.Pillbox.verify(message.pillboxes[i]);
                    if (error)
                        return "pillboxes." + error;
                }
            }
            if (message.bases != null && message.hasOwnProperty("bases")) {
                if (!Array.isArray(message.bases))
                    return "bases: array expected";
                for (let i = 0; i < message.bases.length; ++i) {
                    let error = $root.jsbolo.Base.verify(message.bases[i]);
                    if (error)
                        return "bases." + error;
                }
            }
            if (message.removedTankIds != null && message.hasOwnProperty("removedTankIds")) {
                if (!Array.isArray(message.removedTankIds))
                    return "removedTankIds: array expected";
                for (let i = 0; i < message.removedTankIds.length; ++i)
                    if (!$util.isInteger(message.removedTankIds[i]))
                        return "removedTankIds: integer[] expected";
            }
            if (message.removedBuilderIds != null && message.hasOwnProperty("removedBuilderIds")) {
                if (!Array.isArray(message.removedBuilderIds))
                    return "removedBuilderIds: array expected";
                for (let i = 0; i < message.removedBuilderIds.length; ++i)
                    if (!$util.isInteger(message.removedBuilderIds[i]))
                        return "removedBuilderIds: integer[] expected";
            }
            if (message.removedPillboxIds != null && message.hasOwnProperty("removedPillboxIds")) {
                if (!Array.isArray(message.removedPillboxIds))
                    return "removedPillboxIds: array expected";
                for (let i = 0; i < message.removedPillboxIds.length; ++i)
                    if (!$util.isInteger(message.removedPillboxIds[i]))
                        return "removedPillboxIds: integer[] expected";
            }
            if (message.removedBaseIds != null && message.hasOwnProperty("removedBaseIds")) {
                if (!Array.isArray(message.removedBaseIds))
                    return "removedBaseIds: array expected";
                for (let i = 0; i < message.removedBaseIds.length; ++i)
                    if (!$util.isInteger(message.removedBaseIds[i]))
                        return "removedBaseIds: integer[] expected";
            }
            if (message.terrainUpdates != null && message.hasOwnProperty("terrainUpdates")) {
                if (!Array.isArray(message.terrainUpdates))
                    return "terrainUpdates: array expected";
                for (let i = 0; i < message.terrainUpdates.length; ++i) {
                    let error = $root.jsbolo.TerrainUpdate.verify(message.terrainUpdates[i]);
                    if (error)
                        return "terrainUpdates." + error;
                }
            }
            if (message.soundEvents != null && message.hasOwnProperty("soundEvents")) {
                if (!Array.isArray(message.soundEvents))
                    return "soundEvents: array expected";
                for (let i = 0; i < message.soundEvents.length; ++i) {
                    let error = $root.jsbolo.SoundEvent.verify(message.soundEvents[i]);
                    if (error)
                        return "soundEvents." + error;
                }
            }
            if (message.matchEnded != null && message.hasOwnProperty("matchEnded")) {
                properties._matchEnded = 1;
                if (typeof message.matchEnded !== "boolean")
                    return "matchEnded: boolean expected";
            }
            if (message.winningTeams != null && message.hasOwnProperty("winningTeams")) {
                if (!Array.isArray(message.winningTeams))
                    return "winningTeams: array expected";
                for (let i = 0; i < message.winningTeams.length; ++i)
                    if (!$util.isInteger(message.winningTeams[i]))
                        return "winningTeams: integer[] expected";
            }
            if (message.hudMessages != null && message.hasOwnProperty("hudMessages")) {
                if (!Array.isArray(message.hudMessages))
                    return "hudMessages: array expected";
                for (let i = 0; i < message.hudMessages.length; ++i) {
                    let error = $root.jsbolo.HudMessage.verify(message.hudMessages[i]);
                    if (error)
                        return "hudMessages." + error;
                }
            }
            return null;
        };

        /**
         * Creates an UpdateMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.UpdateMessage} UpdateMessage
         */
        UpdateMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.UpdateMessage)
                return object;
            let message = new $root.jsbolo.UpdateMessage();
            if (object.tick != null)
                message.tick = object.tick >>> 0;
            if (object.tanks) {
                if (!Array.isArray(object.tanks))
                    throw TypeError(".jsbolo.UpdateMessage.tanks: array expected");
                message.tanks = [];
                for (let i = 0; i < object.tanks.length; ++i) {
                    if (typeof object.tanks[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.tanks: object expected");
                    message.tanks[i] = $root.jsbolo.Tank.fromObject(object.tanks[i]);
                }
            }
            if (object.shells) {
                if (!Array.isArray(object.shells))
                    throw TypeError(".jsbolo.UpdateMessage.shells: array expected");
                message.shells = [];
                for (let i = 0; i < object.shells.length; ++i) {
                    if (typeof object.shells[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.shells: object expected");
                    message.shells[i] = $root.jsbolo.Shell.fromObject(object.shells[i]);
                }
            }
            if (object.builders) {
                if (!Array.isArray(object.builders))
                    throw TypeError(".jsbolo.UpdateMessage.builders: array expected");
                message.builders = [];
                for (let i = 0; i < object.builders.length; ++i) {
                    if (typeof object.builders[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.builders: object expected");
                    message.builders[i] = $root.jsbolo.Builder.fromObject(object.builders[i]);
                }
            }
            if (object.pillboxes) {
                if (!Array.isArray(object.pillboxes))
                    throw TypeError(".jsbolo.UpdateMessage.pillboxes: array expected");
                message.pillboxes = [];
                for (let i = 0; i < object.pillboxes.length; ++i) {
                    if (typeof object.pillboxes[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.pillboxes: object expected");
                    message.pillboxes[i] = $root.jsbolo.Pillbox.fromObject(object.pillboxes[i]);
                }
            }
            if (object.bases) {
                if (!Array.isArray(object.bases))
                    throw TypeError(".jsbolo.UpdateMessage.bases: array expected");
                message.bases = [];
                for (let i = 0; i < object.bases.length; ++i) {
                    if (typeof object.bases[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.bases: object expected");
                    message.bases[i] = $root.jsbolo.Base.fromObject(object.bases[i]);
                }
            }
            if (object.removedTankIds) {
                if (!Array.isArray(object.removedTankIds))
                    throw TypeError(".jsbolo.UpdateMessage.removedTankIds: array expected");
                message.removedTankIds = [];
                for (let i = 0; i < object.removedTankIds.length; ++i)
                    message.removedTankIds[i] = object.removedTankIds[i] >>> 0;
            }
            if (object.removedBuilderIds) {
                if (!Array.isArray(object.removedBuilderIds))
                    throw TypeError(".jsbolo.UpdateMessage.removedBuilderIds: array expected");
                message.removedBuilderIds = [];
                for (let i = 0; i < object.removedBuilderIds.length; ++i)
                    message.removedBuilderIds[i] = object.removedBuilderIds[i] >>> 0;
            }
            if (object.removedPillboxIds) {
                if (!Array.isArray(object.removedPillboxIds))
                    throw TypeError(".jsbolo.UpdateMessage.removedPillboxIds: array expected");
                message.removedPillboxIds = [];
                for (let i = 0; i < object.removedPillboxIds.length; ++i)
                    message.removedPillboxIds[i] = object.removedPillboxIds[i] >>> 0;
            }
            if (object.removedBaseIds) {
                if (!Array.isArray(object.removedBaseIds))
                    throw TypeError(".jsbolo.UpdateMessage.removedBaseIds: array expected");
                message.removedBaseIds = [];
                for (let i = 0; i < object.removedBaseIds.length; ++i)
                    message.removedBaseIds[i] = object.removedBaseIds[i] >>> 0;
            }
            if (object.terrainUpdates) {
                if (!Array.isArray(object.terrainUpdates))
                    throw TypeError(".jsbolo.UpdateMessage.terrainUpdates: array expected");
                message.terrainUpdates = [];
                for (let i = 0; i < object.terrainUpdates.length; ++i) {
                    if (typeof object.terrainUpdates[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.terrainUpdates: object expected");
                    message.terrainUpdates[i] = $root.jsbolo.TerrainUpdate.fromObject(object.terrainUpdates[i]);
                }
            }
            if (object.soundEvents) {
                if (!Array.isArray(object.soundEvents))
                    throw TypeError(".jsbolo.UpdateMessage.soundEvents: array expected");
                message.soundEvents = [];
                for (let i = 0; i < object.soundEvents.length; ++i) {
                    if (typeof object.soundEvents[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.soundEvents: object expected");
                    message.soundEvents[i] = $root.jsbolo.SoundEvent.fromObject(object.soundEvents[i]);
                }
            }
            if (object.matchEnded != null)
                message.matchEnded = Boolean(object.matchEnded);
            if (object.winningTeams) {
                if (!Array.isArray(object.winningTeams))
                    throw TypeError(".jsbolo.UpdateMessage.winningTeams: array expected");
                message.winningTeams = [];
                for (let i = 0; i < object.winningTeams.length; ++i)
                    message.winningTeams[i] = object.winningTeams[i] >>> 0;
            }
            if (object.hudMessages) {
                if (!Array.isArray(object.hudMessages))
                    throw TypeError(".jsbolo.UpdateMessage.hudMessages: array expected");
                message.hudMessages = [];
                for (let i = 0; i < object.hudMessages.length; ++i) {
                    if (typeof object.hudMessages[i] !== "object")
                        throw TypeError(".jsbolo.UpdateMessage.hudMessages: object expected");
                    message.hudMessages[i] = $root.jsbolo.HudMessage.fromObject(object.hudMessages[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {jsbolo.UpdateMessage} message UpdateMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.tanks = [];
                object.shells = [];
                object.builders = [];
                object.pillboxes = [];
                object.bases = [];
                object.removedTankIds = [];
                object.removedBuilderIds = [];
                object.removedPillboxIds = [];
                object.removedBaseIds = [];
                object.terrainUpdates = [];
                object.soundEvents = [];
                object.winningTeams = [];
                object.hudMessages = [];
            }
            if (options.defaults)
                object.tick = 0;
            if (message.tick != null && message.hasOwnProperty("tick"))
                object.tick = message.tick;
            if (message.tanks && message.tanks.length) {
                object.tanks = [];
                for (let j = 0; j < message.tanks.length; ++j)
                    object.tanks[j] = $root.jsbolo.Tank.toObject(message.tanks[j], options);
            }
            if (message.shells && message.shells.length) {
                object.shells = [];
                for (let j = 0; j < message.shells.length; ++j)
                    object.shells[j] = $root.jsbolo.Shell.toObject(message.shells[j], options);
            }
            if (message.builders && message.builders.length) {
                object.builders = [];
                for (let j = 0; j < message.builders.length; ++j)
                    object.builders[j] = $root.jsbolo.Builder.toObject(message.builders[j], options);
            }
            if (message.pillboxes && message.pillboxes.length) {
                object.pillboxes = [];
                for (let j = 0; j < message.pillboxes.length; ++j)
                    object.pillboxes[j] = $root.jsbolo.Pillbox.toObject(message.pillboxes[j], options);
            }
            if (message.bases && message.bases.length) {
                object.bases = [];
                for (let j = 0; j < message.bases.length; ++j)
                    object.bases[j] = $root.jsbolo.Base.toObject(message.bases[j], options);
            }
            if (message.removedTankIds && message.removedTankIds.length) {
                object.removedTankIds = [];
                for (let j = 0; j < message.removedTankIds.length; ++j)
                    object.removedTankIds[j] = message.removedTankIds[j];
            }
            if (message.removedBuilderIds && message.removedBuilderIds.length) {
                object.removedBuilderIds = [];
                for (let j = 0; j < message.removedBuilderIds.length; ++j)
                    object.removedBuilderIds[j] = message.removedBuilderIds[j];
            }
            if (message.removedPillboxIds && message.removedPillboxIds.length) {
                object.removedPillboxIds = [];
                for (let j = 0; j < message.removedPillboxIds.length; ++j)
                    object.removedPillboxIds[j] = message.removedPillboxIds[j];
            }
            if (message.removedBaseIds && message.removedBaseIds.length) {
                object.removedBaseIds = [];
                for (let j = 0; j < message.removedBaseIds.length; ++j)
                    object.removedBaseIds[j] = message.removedBaseIds[j];
            }
            if (message.terrainUpdates && message.terrainUpdates.length) {
                object.terrainUpdates = [];
                for (let j = 0; j < message.terrainUpdates.length; ++j)
                    object.terrainUpdates[j] = $root.jsbolo.TerrainUpdate.toObject(message.terrainUpdates[j], options);
            }
            if (message.soundEvents && message.soundEvents.length) {
                object.soundEvents = [];
                for (let j = 0; j < message.soundEvents.length; ++j)
                    object.soundEvents[j] = $root.jsbolo.SoundEvent.toObject(message.soundEvents[j], options);
            }
            if (message.matchEnded != null && message.hasOwnProperty("matchEnded")) {
                object.matchEnded = message.matchEnded;
                if (options.oneofs)
                    object._matchEnded = "matchEnded";
            }
            if (message.winningTeams && message.winningTeams.length) {
                object.winningTeams = [];
                for (let j = 0; j < message.winningTeams.length; ++j)
                    object.winningTeams[j] = message.winningTeams[j];
            }
            if (message.hudMessages && message.hudMessages.length) {
                object.hudMessages = [];
                for (let j = 0; j < message.hudMessages.length; ++j)
                    object.hudMessages[j] = $root.jsbolo.HudMessage.toObject(message.hudMessages[j], options);
            }
            return object;
        };

        /**
         * Converts this UpdateMessage to JSON.
         * @function toJSON
         * @memberof jsbolo.UpdateMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UpdateMessage
         * @function getTypeUrl
         * @memberof jsbolo.UpdateMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UpdateMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.UpdateMessage";
        };

        return UpdateMessage;
    })();

    jsbolo.ClientMessage = (function() {

        /**
         * Properties of a ClientMessage.
         * @memberof jsbolo
         * @interface IClientMessage
         * @property {jsbolo.IPlayerInput|null} [input] ClientMessage input
         * @property {jsbolo.IChatMessage|null} [chat] ClientMessage chat
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

        /**
         * ClientMessage chat.
         * @member {jsbolo.IChatMessage|null|undefined} chat
         * @memberof jsbolo.ClientMessage
         * @instance
         */
        ClientMessage.prototype.chat = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ClientMessage payload.
         * @member {"input"|"chat"|undefined} payload
         * @memberof jsbolo.ClientMessage
         * @instance
         */
        Object.defineProperty(ClientMessage.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["input", "chat"]),
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
            if (message.chat != null && Object.hasOwnProperty.call(message, "chat"))
                $root.jsbolo.ChatMessage.encode(message.chat, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                case 2: {
                        message.chat = $root.jsbolo.ChatMessage.decode(reader, reader.uint32());
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
                properties.payload = 1;
                {
                    let error = $root.jsbolo.PlayerInput.verify(message.input);
                    if (error)
                        return "input." + error;
                }
            }
            if (message.chat != null && message.hasOwnProperty("chat")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.jsbolo.ChatMessage.verify(message.chat);
                    if (error)
                        return "chat." + error;
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
            if (object.chat != null) {
                if (typeof object.chat !== "object")
                    throw TypeError(".jsbolo.ClientMessage.chat: object expected");
                message.chat = $root.jsbolo.ChatMessage.fromObject(object.chat);
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
                    object.payload = "input";
            }
            if (message.chat != null && message.hasOwnProperty("chat")) {
                object.chat = $root.jsbolo.ChatMessage.toObject(message.chat, options);
                if (options.oneofs)
                    object.payload = "chat";
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

    jsbolo.ChatMessage = (function() {

        /**
         * Properties of a ChatMessage.
         * @memberof jsbolo
         * @interface IChatMessage
         * @property {string|null} [text] ChatMessage text
         * @property {boolean|null} [allianceOnly] ChatMessage allianceOnly
         */

        /**
         * Constructs a new ChatMessage.
         * @memberof jsbolo
         * @classdesc Represents a ChatMessage.
         * @implements IChatMessage
         * @constructor
         * @param {jsbolo.IChatMessage=} [properties] Properties to set
         */
        function ChatMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatMessage text.
         * @member {string} text
         * @memberof jsbolo.ChatMessage
         * @instance
         */
        ChatMessage.prototype.text = "";

        /**
         * ChatMessage allianceOnly.
         * @member {boolean} allianceOnly
         * @memberof jsbolo.ChatMessage
         * @instance
         */
        ChatMessage.prototype.allianceOnly = false;

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @function create
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {jsbolo.IChatMessage=} [properties] Properties to set
         * @returns {jsbolo.ChatMessage} ChatMessage instance
         */
        ChatMessage.create = function create(properties) {
            return new ChatMessage(properties);
        };

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link jsbolo.ChatMessage.verify|verify} messages.
         * @function encode
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {jsbolo.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            if (message.allianceOnly != null && Object.hasOwnProperty.call(message, "allianceOnly"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.allianceOnly);
            return writer;
        };

        /**
         * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link jsbolo.ChatMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {jsbolo.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @function decode
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {jsbolo.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.jsbolo.ChatMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.text = reader.string();
                        break;
                    }
                case 2: {
                        message.allianceOnly = reader.bool();
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
         * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {jsbolo.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatMessage message.
         * @function verify
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            if (message.allianceOnly != null && message.hasOwnProperty("allianceOnly"))
                if (typeof message.allianceOnly !== "boolean")
                    return "allianceOnly: boolean expected";
            return null;
        };

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {jsbolo.ChatMessage} ChatMessage
         */
        ChatMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.jsbolo.ChatMessage)
                return object;
            let message = new $root.jsbolo.ChatMessage();
            if (object.text != null)
                message.text = String(object.text);
            if (object.allianceOnly != null)
                message.allianceOnly = Boolean(object.allianceOnly);
            return message;
        };

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {jsbolo.ChatMessage} message ChatMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.text = "";
                object.allianceOnly = false;
            }
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            if (message.allianceOnly != null && message.hasOwnProperty("allianceOnly"))
                object.allianceOnly = message.allianceOnly;
            return object;
        };

        /**
         * Converts this ChatMessage to JSON.
         * @function toJSON
         * @memberof jsbolo.ChatMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ChatMessage
         * @function getTypeUrl
         * @memberof jsbolo.ChatMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/jsbolo.ChatMessage";
        };

        return ChatMessage;
    })();

    jsbolo.ServerMessage = (function() {

        /**
         * Properties of a ServerMessage.
         * @memberof jsbolo
         * @interface IServerMessage
         * @property {jsbolo.IWelcomeMessage|null} [welcome] ServerMessage welcome
         * @property {jsbolo.IUpdateMessage|null} [update] ServerMessage update
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
         * @member {jsbolo.IUpdateMessage|null|undefined} update
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        ServerMessage.prototype.update = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ServerMessage message.
         * @member {"welcome"|"update"|undefined} message
         * @memberof jsbolo.ServerMessage
         * @instance
         */
        Object.defineProperty(ServerMessage.prototype, "message", {
            get: $util.oneOfGetter($oneOfFields = ["welcome", "update"]),
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
                $root.jsbolo.UpdateMessage.encode(message.update, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                        message.update = $root.jsbolo.UpdateMessage.decode(reader, reader.uint32());
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
                    let error = $root.jsbolo.UpdateMessage.verify(message.update);
                    if (error)
                        return "update." + error;
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
                message.update = $root.jsbolo.UpdateMessage.fromObject(object.update);
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
                object.update = $root.jsbolo.UpdateMessage.toObject(message.update, options);
                if (options.oneofs)
                    object.message = "update";
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
