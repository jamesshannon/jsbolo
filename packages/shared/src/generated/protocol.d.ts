import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace jsbolo. */
export namespace jsbolo {

    /** RangeAdjustment enum. */
    enum RangeAdjustment {
        RANGE_ADJUSTMENT_NONE = 0,
        RANGE_ADJUSTMENT_INCREASE = 1,
        RANGE_ADJUSTMENT_DECREASE = 2
    }

    /** BuildAction enum. */
    enum BuildAction {
        BUILD_ACTION_NONE = 0,
        BUILD_ACTION_FOREST = 1,
        BUILD_ACTION_ROAD = 2,
        BUILD_ACTION_REPAIR = 3,
        BUILD_ACTION_BOAT = 4,
        BUILD_ACTION_BUILDING = 5,
        BUILD_ACTION_PILLBOX = 6,
        BUILD_ACTION_MINE = 7
    }

    /** BuilderOrder enum. */
    enum BuilderOrder {
        BUILDER_ORDER_IN_TANK = 0,
        BUILDER_ORDER_WAITING = 1,
        BUILDER_ORDER_RETURNING = 2,
        BUILDER_ORDER_PARACHUTING = 3,
        BUILDER_ORDER_HARVESTING = 10,
        BUILDER_ORDER_BUILDING_ROAD = 11,
        BUILDER_ORDER_REPAIRING = 12,
        BUILDER_ORDER_BUILDING_BOAT = 13,
        BUILDER_ORDER_BUILDING_WALL = 14,
        BUILDER_ORDER_PLACING_PILLBOX = 15,
        BUILDER_ORDER_LAYING_MINE = 16
    }

    /** Properties of a BuildOrder. */
    interface IBuildOrder {

        /** BuildOrder action */
        action?: (jsbolo.BuildAction|null);

        /** BuildOrder targetX */
        targetX?: (number|null);

        /** BuildOrder targetY */
        targetY?: (number|null);
    }

    /** Represents a BuildOrder. */
    class BuildOrder implements IBuildOrder {

        /**
         * Constructs a new BuildOrder.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IBuildOrder);

        /** BuildOrder action. */
        public action: jsbolo.BuildAction;

        /** BuildOrder targetX. */
        public targetX: number;

        /** BuildOrder targetY. */
        public targetY: number;

        /**
         * Creates a new BuildOrder instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BuildOrder instance
         */
        public static create(properties?: jsbolo.IBuildOrder): jsbolo.BuildOrder;

        /**
         * Encodes the specified BuildOrder message. Does not implicitly {@link jsbolo.BuildOrder.verify|verify} messages.
         * @param message BuildOrder message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IBuildOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BuildOrder message, length delimited. Does not implicitly {@link jsbolo.BuildOrder.verify|verify} messages.
         * @param message BuildOrder message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IBuildOrder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BuildOrder message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BuildOrder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.BuildOrder;

        /**
         * Decodes a BuildOrder message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BuildOrder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.BuildOrder;

        /**
         * Verifies a BuildOrder message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BuildOrder message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BuildOrder
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.BuildOrder;

        /**
         * Creates a plain object from a BuildOrder message. Also converts values to other types if specified.
         * @param message BuildOrder
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.BuildOrder, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BuildOrder to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BuildOrder
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerInput. */
    interface IPlayerInput {

        /** PlayerInput sequence */
        sequence?: (number|null);

        /** PlayerInput tick */
        tick?: (number|null);

        /** PlayerInput accelerating */
        accelerating?: (boolean|null);

        /** PlayerInput braking */
        braking?: (boolean|null);

        /** PlayerInput turningClockwise */
        turningClockwise?: (boolean|null);

        /** PlayerInput turningCounterClockwise */
        turningCounterClockwise?: (boolean|null);

        /** PlayerInput shooting */
        shooting?: (boolean|null);

        /** PlayerInput buildOrder */
        buildOrder?: (jsbolo.IBuildOrder|null);

        /** PlayerInput rangeAdjustment */
        rangeAdjustment?: (jsbolo.RangeAdjustment|null);
    }

    /** Represents a PlayerInput. */
    class PlayerInput implements IPlayerInput {

        /**
         * Constructs a new PlayerInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IPlayerInput);

        /** PlayerInput sequence. */
        public sequence: number;

        /** PlayerInput tick. */
        public tick: number;

        /** PlayerInput accelerating. */
        public accelerating: boolean;

        /** PlayerInput braking. */
        public braking: boolean;

        /** PlayerInput turningClockwise. */
        public turningClockwise: boolean;

        /** PlayerInput turningCounterClockwise. */
        public turningCounterClockwise: boolean;

        /** PlayerInput shooting. */
        public shooting: boolean;

        /** PlayerInput buildOrder. */
        public buildOrder?: (jsbolo.IBuildOrder|null);

        /** PlayerInput rangeAdjustment. */
        public rangeAdjustment: jsbolo.RangeAdjustment;

        /**
         * Creates a new PlayerInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerInput instance
         */
        public static create(properties?: jsbolo.IPlayerInput): jsbolo.PlayerInput;

        /**
         * Encodes the specified PlayerInput message. Does not implicitly {@link jsbolo.PlayerInput.verify|verify} messages.
         * @param message PlayerInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IPlayerInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerInput message, length delimited. Does not implicitly {@link jsbolo.PlayerInput.verify|verify} messages.
         * @param message PlayerInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IPlayerInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.PlayerInput;

        /**
         * Decodes a PlayerInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.PlayerInput;

        /**
         * Verifies a PlayerInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerInput
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.PlayerInput;

        /**
         * Creates a plain object from a PlayerInput message. Also converts values to other types if specified.
         * @param message PlayerInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.PlayerInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PlayerInput
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Tank. */
    interface ITank {

        /** Tank id */
        id?: (number|null);

        /** Tank x */
        x?: (number|null);

        /** Tank y */
        y?: (number|null);

        /** Tank direction */
        direction?: (number|null);

        /** Tank speed */
        speed?: (number|null);

        /** Tank armor */
        armor?: (number|null);

        /** Tank shells */
        shells?: (number|null);

        /** Tank mines */
        mines?: (number|null);

        /** Tank trees */
        trees?: (number|null);

        /** Tank team */
        team?: (number|null);

        /** Tank onBoat */
        onBoat?: (boolean|null);

        /** Tank reload */
        reload?: (number|null);

        /** Tank firingRange */
        firingRange?: (number|null);

        /** Tank carriedPillbox */
        carriedPillbox?: (number|null);
    }

    /** Represents a Tank. */
    class Tank implements ITank {

        /**
         * Constructs a new Tank.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.ITank);

        /** Tank id. */
        public id: number;

        /** Tank x. */
        public x: number;

        /** Tank y. */
        public y: number;

        /** Tank direction. */
        public direction: number;

        /** Tank speed. */
        public speed: number;

        /** Tank armor. */
        public armor: number;

        /** Tank shells. */
        public shells: number;

        /** Tank mines. */
        public mines: number;

        /** Tank trees. */
        public trees: number;

        /** Tank team. */
        public team: number;

        /** Tank onBoat. */
        public onBoat: boolean;

        /** Tank reload. */
        public reload: number;

        /** Tank firingRange. */
        public firingRange: number;

        /** Tank carriedPillbox. */
        public carriedPillbox?: (number|null);

        /**
         * Creates a new Tank instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Tank instance
         */
        public static create(properties?: jsbolo.ITank): jsbolo.Tank;

        /**
         * Encodes the specified Tank message. Does not implicitly {@link jsbolo.Tank.verify|verify} messages.
         * @param message Tank message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.ITank, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Tank message, length delimited. Does not implicitly {@link jsbolo.Tank.verify|verify} messages.
         * @param message Tank message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.ITank, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Tank message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Tank
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.Tank;

        /**
         * Decodes a Tank message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Tank
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.Tank;

        /**
         * Verifies a Tank message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Tank message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Tank
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.Tank;

        /**
         * Creates a plain object from a Tank message. Also converts values to other types if specified.
         * @param message Tank
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.Tank, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Tank to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Tank
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Builder. */
    interface IBuilder {

        /** Builder id */
        id?: (number|null);

        /** Builder ownerTankId */
        ownerTankId?: (number|null);

        /** Builder x */
        x?: (number|null);

        /** Builder y */
        y?: (number|null);

        /** Builder targetX */
        targetX?: (number|null);

        /** Builder targetY */
        targetY?: (number|null);

        /** Builder order */
        order?: (jsbolo.BuilderOrder|null);

        /** Builder trees */
        trees?: (number|null);

        /** Builder hasMine */
        hasMine?: (boolean|null);

        /** Builder hasPillbox */
        hasPillbox?: (boolean|null);

        /** Builder team */
        team?: (number|null);

        /** Builder respawnCounter */
        respawnCounter?: (number|null);
    }

    /** Represents a Builder. */
    class Builder implements IBuilder {

        /**
         * Constructs a new Builder.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IBuilder);

        /** Builder id. */
        public id: number;

        /** Builder ownerTankId. */
        public ownerTankId: number;

        /** Builder x. */
        public x: number;

        /** Builder y. */
        public y: number;

        /** Builder targetX. */
        public targetX: number;

        /** Builder targetY. */
        public targetY: number;

        /** Builder order. */
        public order: jsbolo.BuilderOrder;

        /** Builder trees. */
        public trees: number;

        /** Builder hasMine. */
        public hasMine: boolean;

        /** Builder hasPillbox. */
        public hasPillbox: boolean;

        /** Builder team. */
        public team: number;

        /** Builder respawnCounter. */
        public respawnCounter: number;

        /**
         * Creates a new Builder instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Builder instance
         */
        public static create(properties?: jsbolo.IBuilder): jsbolo.Builder;

        /**
         * Encodes the specified Builder message. Does not implicitly {@link jsbolo.Builder.verify|verify} messages.
         * @param message Builder message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IBuilder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Builder message, length delimited. Does not implicitly {@link jsbolo.Builder.verify|verify} messages.
         * @param message Builder message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IBuilder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Builder message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Builder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.Builder;

        /**
         * Decodes a Builder message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Builder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.Builder;

        /**
         * Verifies a Builder message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Builder message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Builder
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.Builder;

        /**
         * Creates a plain object from a Builder message. Also converts values to other types if specified.
         * @param message Builder
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.Builder, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Builder to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Builder
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Shell. */
    interface IShell {

        /** Shell id */
        id?: (number|null);

        /** Shell x */
        x?: (number|null);

        /** Shell y */
        y?: (number|null);

        /** Shell direction */
        direction?: (number|null);

        /** Shell ownerTankId */
        ownerTankId?: (number|null);
    }

    /** Represents a Shell. */
    class Shell implements IShell {

        /**
         * Constructs a new Shell.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IShell);

        /** Shell id. */
        public id: number;

        /** Shell x. */
        public x: number;

        /** Shell y. */
        public y: number;

        /** Shell direction. */
        public direction: number;

        /** Shell ownerTankId. */
        public ownerTankId: number;

        /**
         * Creates a new Shell instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Shell instance
         */
        public static create(properties?: jsbolo.IShell): jsbolo.Shell;

        /**
         * Encodes the specified Shell message. Does not implicitly {@link jsbolo.Shell.verify|verify} messages.
         * @param message Shell message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IShell, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Shell message, length delimited. Does not implicitly {@link jsbolo.Shell.verify|verify} messages.
         * @param message Shell message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IShell, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Shell message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Shell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.Shell;

        /**
         * Decodes a Shell message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Shell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.Shell;

        /**
         * Verifies a Shell message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Shell message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Shell
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.Shell;

        /**
         * Creates a plain object from a Shell message. Also converts values to other types if specified.
         * @param message Shell
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.Shell, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Shell to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Shell
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Pillbox. */
    interface IPillbox {

        /** Pillbox id */
        id?: (number|null);

        /** Pillbox tileX */
        tileX?: (number|null);

        /** Pillbox tileY */
        tileY?: (number|null);

        /** Pillbox armor */
        armor?: (number|null);

        /** Pillbox ownerTeam */
        ownerTeam?: (number|null);

        /** Pillbox inTank */
        inTank?: (boolean|null);
    }

    /** Represents a Pillbox. */
    class Pillbox implements IPillbox {

        /**
         * Constructs a new Pillbox.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IPillbox);

        /** Pillbox id. */
        public id: number;

        /** Pillbox tileX. */
        public tileX: number;

        /** Pillbox tileY. */
        public tileY: number;

        /** Pillbox armor. */
        public armor: number;

        /** Pillbox ownerTeam. */
        public ownerTeam: number;

        /** Pillbox inTank. */
        public inTank: boolean;

        /**
         * Creates a new Pillbox instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Pillbox instance
         */
        public static create(properties?: jsbolo.IPillbox): jsbolo.Pillbox;

        /**
         * Encodes the specified Pillbox message. Does not implicitly {@link jsbolo.Pillbox.verify|verify} messages.
         * @param message Pillbox message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IPillbox, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Pillbox message, length delimited. Does not implicitly {@link jsbolo.Pillbox.verify|verify} messages.
         * @param message Pillbox message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IPillbox, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Pillbox message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Pillbox
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.Pillbox;

        /**
         * Decodes a Pillbox message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Pillbox
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.Pillbox;

        /**
         * Verifies a Pillbox message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Pillbox message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Pillbox
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.Pillbox;

        /**
         * Creates a plain object from a Pillbox message. Also converts values to other types if specified.
         * @param message Pillbox
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.Pillbox, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Pillbox to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Pillbox
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Base. */
    interface IBase {

        /** Base id */
        id?: (number|null);

        /** Base tileX */
        tileX?: (number|null);

        /** Base tileY */
        tileY?: (number|null);

        /** Base armor */
        armor?: (number|null);

        /** Base shells */
        shells?: (number|null);

        /** Base mines */
        mines?: (number|null);

        /** Base ownerTeam */
        ownerTeam?: (number|null);
    }

    /** Represents a Base. */
    class Base implements IBase {

        /**
         * Constructs a new Base.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IBase);

        /** Base id. */
        public id: number;

        /** Base tileX. */
        public tileX: number;

        /** Base tileY. */
        public tileY: number;

        /** Base armor. */
        public armor: number;

        /** Base shells. */
        public shells: number;

        /** Base mines. */
        public mines: number;

        /** Base ownerTeam. */
        public ownerTeam: number;

        /**
         * Creates a new Base instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Base instance
         */
        public static create(properties?: jsbolo.IBase): jsbolo.Base;

        /**
         * Encodes the specified Base message. Does not implicitly {@link jsbolo.Base.verify|verify} messages.
         * @param message Base message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IBase, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Base message, length delimited. Does not implicitly {@link jsbolo.Base.verify|verify} messages.
         * @param message Base message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IBase, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Base message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Base
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.Base;

        /**
         * Decodes a Base message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Base
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.Base;

        /**
         * Verifies a Base message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Base message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Base
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.Base;

        /**
         * Creates a plain object from a Base message. Also converts values to other types if specified.
         * @param message Base
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.Base, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Base to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Base
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TerrainUpdate. */
    interface ITerrainUpdate {

        /** TerrainUpdate x */
        x?: (number|null);

        /** TerrainUpdate y */
        y?: (number|null);

        /** TerrainUpdate terrain */
        terrain?: (number|null);

        /** TerrainUpdate terrainLife */
        terrainLife?: (number|null);

        /** TerrainUpdate direction */
        direction?: (number|null);
    }

    /** Represents a TerrainUpdate. */
    class TerrainUpdate implements ITerrainUpdate {

        /**
         * Constructs a new TerrainUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.ITerrainUpdate);

        /** TerrainUpdate x. */
        public x: number;

        /** TerrainUpdate y. */
        public y: number;

        /** TerrainUpdate terrain. */
        public terrain: number;

        /** TerrainUpdate terrainLife. */
        public terrainLife: number;

        /** TerrainUpdate direction. */
        public direction?: (number|null);

        /**
         * Creates a new TerrainUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TerrainUpdate instance
         */
        public static create(properties?: jsbolo.ITerrainUpdate): jsbolo.TerrainUpdate;

        /**
         * Encodes the specified TerrainUpdate message. Does not implicitly {@link jsbolo.TerrainUpdate.verify|verify} messages.
         * @param message TerrainUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.ITerrainUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TerrainUpdate message, length delimited. Does not implicitly {@link jsbolo.TerrainUpdate.verify|verify} messages.
         * @param message TerrainUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.ITerrainUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TerrainUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TerrainUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.TerrainUpdate;

        /**
         * Decodes a TerrainUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TerrainUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.TerrainUpdate;

        /**
         * Verifies a TerrainUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TerrainUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TerrainUpdate
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.TerrainUpdate;

        /**
         * Creates a plain object from a TerrainUpdate message. Also converts values to other types if specified.
         * @param message TerrainUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.TerrainUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TerrainUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TerrainUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SoundEvent. */
    interface ISoundEvent {

        /** SoundEvent soundId */
        soundId?: (number|null);

        /** SoundEvent x */
        x?: (number|null);

        /** SoundEvent y */
        y?: (number|null);
    }

    /** Represents a SoundEvent. */
    class SoundEvent implements ISoundEvent {

        /**
         * Constructs a new SoundEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.ISoundEvent);

        /** SoundEvent soundId. */
        public soundId: number;

        /** SoundEvent x. */
        public x: number;

        /** SoundEvent y. */
        public y: number;

        /**
         * Creates a new SoundEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SoundEvent instance
         */
        public static create(properties?: jsbolo.ISoundEvent): jsbolo.SoundEvent;

        /**
         * Encodes the specified SoundEvent message. Does not implicitly {@link jsbolo.SoundEvent.verify|verify} messages.
         * @param message SoundEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.ISoundEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SoundEvent message, length delimited. Does not implicitly {@link jsbolo.SoundEvent.verify|verify} messages.
         * @param message SoundEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.ISoundEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SoundEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SoundEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.SoundEvent;

        /**
         * Decodes a SoundEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SoundEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.SoundEvent;

        /**
         * Verifies a SoundEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SoundEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SoundEvent
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.SoundEvent;

        /**
         * Creates a plain object from a SoundEvent message. Also converts values to other types if specified.
         * @param message SoundEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.SoundEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SoundEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SoundEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** HudMessageClass enum. */
    enum HudMessageClass {
        HUD_MESSAGE_CLASS_GLOBAL_NOTIFICATION = 0,
        HUD_MESSAGE_CLASS_ALLIANCE_NOTIFICATION = 1,
        HUD_MESSAGE_CLASS_PERSONAL_NOTIFICATION = 2,
        HUD_MESSAGE_CLASS_CHAT_GLOBAL = 3,
        HUD_MESSAGE_CLASS_CHAT_ALLIANCE = 4,
        HUD_MESSAGE_CLASS_SYSTEM_STATUS = 5
    }

    /** Properties of a HudMessage. */
    interface IHudMessage {

        /** HudMessage id */
        id?: (number|Long|null);

        /** HudMessage tick */
        tick?: (number|null);

        /** HudMessage class */
        "class"?: (jsbolo.HudMessageClass|null);

        /** HudMessage text */
        text?: (string|null);
    }

    /** Represents a HudMessage. */
    class HudMessage implements IHudMessage {

        /**
         * Constructs a new HudMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IHudMessage);

        /** HudMessage id. */
        public id: (number|Long);

        /** HudMessage tick. */
        public tick: number;

        /** HudMessage class. */
        public class: jsbolo.HudMessageClass;

        /** HudMessage text. */
        public text: string;

        /**
         * Creates a new HudMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HudMessage instance
         */
        public static create(properties?: jsbolo.IHudMessage): jsbolo.HudMessage;

        /**
         * Encodes the specified HudMessage message. Does not implicitly {@link jsbolo.HudMessage.verify|verify} messages.
         * @param message HudMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IHudMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HudMessage message, length delimited. Does not implicitly {@link jsbolo.HudMessage.verify|verify} messages.
         * @param message HudMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IHudMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HudMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HudMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.HudMessage;

        /**
         * Decodes a HudMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HudMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.HudMessage;

        /**
         * Verifies a HudMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HudMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HudMessage
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.HudMessage;

        /**
         * Creates a plain object from a HudMessage message. Also converts values to other types if specified.
         * @param message HudMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.HudMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HudMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HudMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WelcomeMap. */
    interface IWelcomeMap {

        /** WelcomeMap width */
        width?: (number|null);

        /** WelcomeMap height */
        height?: (number|null);

        /** WelcomeMap terrain */
        terrain?: (number[]|null);

        /** WelcomeMap terrainLife */
        terrainLife?: (number[]|null);
    }

    /** Represents a WelcomeMap. */
    class WelcomeMap implements IWelcomeMap {

        /**
         * Constructs a new WelcomeMap.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IWelcomeMap);

        /** WelcomeMap width. */
        public width: number;

        /** WelcomeMap height. */
        public height: number;

        /** WelcomeMap terrain. */
        public terrain: number[];

        /** WelcomeMap terrainLife. */
        public terrainLife: number[];

        /**
         * Creates a new WelcomeMap instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WelcomeMap instance
         */
        public static create(properties?: jsbolo.IWelcomeMap): jsbolo.WelcomeMap;

        /**
         * Encodes the specified WelcomeMap message. Does not implicitly {@link jsbolo.WelcomeMap.verify|verify} messages.
         * @param message WelcomeMap message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IWelcomeMap, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WelcomeMap message, length delimited. Does not implicitly {@link jsbolo.WelcomeMap.verify|verify} messages.
         * @param message WelcomeMap message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IWelcomeMap, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WelcomeMap message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WelcomeMap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.WelcomeMap;

        /**
         * Decodes a WelcomeMap message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WelcomeMap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.WelcomeMap;

        /**
         * Verifies a WelcomeMap message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WelcomeMap message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WelcomeMap
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.WelcomeMap;

        /**
         * Creates a plain object from a WelcomeMap message. Also converts values to other types if specified.
         * @param message WelcomeMap
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.WelcomeMap, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WelcomeMap to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WelcomeMap
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WelcomeMessage. */
    interface IWelcomeMessage {

        /** WelcomeMessage playerId */
        playerId?: (number|null);

        /** WelcomeMessage assignedTeam */
        assignedTeam?: (number|null);

        /** WelcomeMessage currentTick */
        currentTick?: (number|null);

        /** WelcomeMessage mapName */
        mapName?: (string|null);

        /** WelcomeMessage map */
        map?: (jsbolo.IWelcomeMap|null);

        /** WelcomeMessage tanks */
        tanks?: (jsbolo.ITank[]|null);

        /** WelcomeMessage pillboxes */
        pillboxes?: (jsbolo.IPillbox[]|null);

        /** WelcomeMessage bases */
        bases?: (jsbolo.IBase[]|null);

        /** WelcomeMessage matchEnded */
        matchEnded?: (boolean|null);

        /** WelcomeMessage winningTeams */
        winningTeams?: (number[]|null);
    }

    /** Represents a WelcomeMessage. */
    class WelcomeMessage implements IWelcomeMessage {

        /**
         * Constructs a new WelcomeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IWelcomeMessage);

        /** WelcomeMessage playerId. */
        public playerId: number;

        /** WelcomeMessage assignedTeam. */
        public assignedTeam: number;

        /** WelcomeMessage currentTick. */
        public currentTick: number;

        /** WelcomeMessage mapName. */
        public mapName: string;

        /** WelcomeMessage map. */
        public map?: (jsbolo.IWelcomeMap|null);

        /** WelcomeMessage tanks. */
        public tanks: jsbolo.ITank[];

        /** WelcomeMessage pillboxes. */
        public pillboxes: jsbolo.IPillbox[];

        /** WelcomeMessage bases. */
        public bases: jsbolo.IBase[];

        /** WelcomeMessage matchEnded. */
        public matchEnded?: (boolean|null);

        /** WelcomeMessage winningTeams. */
        public winningTeams: number[];

        /**
         * Creates a new WelcomeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WelcomeMessage instance
         */
        public static create(properties?: jsbolo.IWelcomeMessage): jsbolo.WelcomeMessage;

        /**
         * Encodes the specified WelcomeMessage message. Does not implicitly {@link jsbolo.WelcomeMessage.verify|verify} messages.
         * @param message WelcomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IWelcomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WelcomeMessage message, length delimited. Does not implicitly {@link jsbolo.WelcomeMessage.verify|verify} messages.
         * @param message WelcomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IWelcomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WelcomeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WelcomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.WelcomeMessage;

        /**
         * Decodes a WelcomeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WelcomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.WelcomeMessage;

        /**
         * Verifies a WelcomeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WelcomeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WelcomeMessage
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.WelcomeMessage;

        /**
         * Creates a plain object from a WelcomeMessage message. Also converts values to other types if specified.
         * @param message WelcomeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.WelcomeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WelcomeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WelcomeMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateMessage. */
    interface IUpdateMessage {

        /** UpdateMessage tick */
        tick?: (number|null);

        /** UpdateMessage tanks */
        tanks?: (jsbolo.ITank[]|null);

        /** UpdateMessage shells */
        shells?: (jsbolo.IShell[]|null);

        /** UpdateMessage builders */
        builders?: (jsbolo.IBuilder[]|null);

        /** UpdateMessage pillboxes */
        pillboxes?: (jsbolo.IPillbox[]|null);

        /** UpdateMessage bases */
        bases?: (jsbolo.IBase[]|null);

        /** UpdateMessage removedTankIds */
        removedTankIds?: (number[]|null);

        /** UpdateMessage removedBuilderIds */
        removedBuilderIds?: (number[]|null);

        /** UpdateMessage removedPillboxIds */
        removedPillboxIds?: (number[]|null);

        /** UpdateMessage removedBaseIds */
        removedBaseIds?: (number[]|null);

        /** UpdateMessage terrainUpdates */
        terrainUpdates?: (jsbolo.ITerrainUpdate[]|null);

        /** UpdateMessage soundEvents */
        soundEvents?: (jsbolo.ISoundEvent[]|null);

        /** UpdateMessage matchEnded */
        matchEnded?: (boolean|null);

        /** UpdateMessage winningTeams */
        winningTeams?: (number[]|null);

        /** UpdateMessage hudMessages */
        hudMessages?: (jsbolo.IHudMessage[]|null);
    }

    /** Represents an UpdateMessage. */
    class UpdateMessage implements IUpdateMessage {

        /**
         * Constructs a new UpdateMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IUpdateMessage);

        /** UpdateMessage tick. */
        public tick: number;

        /** UpdateMessage tanks. */
        public tanks: jsbolo.ITank[];

        /** UpdateMessage shells. */
        public shells: jsbolo.IShell[];

        /** UpdateMessage builders. */
        public builders: jsbolo.IBuilder[];

        /** UpdateMessage pillboxes. */
        public pillboxes: jsbolo.IPillbox[];

        /** UpdateMessage bases. */
        public bases: jsbolo.IBase[];

        /** UpdateMessage removedTankIds. */
        public removedTankIds: number[];

        /** UpdateMessage removedBuilderIds. */
        public removedBuilderIds: number[];

        /** UpdateMessage removedPillboxIds. */
        public removedPillboxIds: number[];

        /** UpdateMessage removedBaseIds. */
        public removedBaseIds: number[];

        /** UpdateMessage terrainUpdates. */
        public terrainUpdates: jsbolo.ITerrainUpdate[];

        /** UpdateMessage soundEvents. */
        public soundEvents: jsbolo.ISoundEvent[];

        /** UpdateMessage matchEnded. */
        public matchEnded?: (boolean|null);

        /** UpdateMessage winningTeams. */
        public winningTeams: number[];

        /** UpdateMessage hudMessages. */
        public hudMessages: jsbolo.IHudMessage[];

        /**
         * Creates a new UpdateMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateMessage instance
         */
        public static create(properties?: jsbolo.IUpdateMessage): jsbolo.UpdateMessage;

        /**
         * Encodes the specified UpdateMessage message. Does not implicitly {@link jsbolo.UpdateMessage.verify|verify} messages.
         * @param message UpdateMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IUpdateMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateMessage message, length delimited. Does not implicitly {@link jsbolo.UpdateMessage.verify|verify} messages.
         * @param message UpdateMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IUpdateMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.UpdateMessage;

        /**
         * Decodes an UpdateMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.UpdateMessage;

        /**
         * Verifies an UpdateMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateMessage
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.UpdateMessage;

        /**
         * Creates a plain object from an UpdateMessage message. Also converts values to other types if specified.
         * @param message UpdateMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.UpdateMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UpdateMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ClientMessage. */
    interface IClientMessage {

        /** ClientMessage input */
        input?: (jsbolo.IPlayerInput|null);

        /** ClientMessage chat */
        chat?: (jsbolo.IChatMessage|null);
    }

    /** Represents a ClientMessage. */
    class ClientMessage implements IClientMessage {

        /**
         * Constructs a new ClientMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IClientMessage);

        /** ClientMessage input. */
        public input?: (jsbolo.IPlayerInput|null);

        /** ClientMessage chat. */
        public chat?: (jsbolo.IChatMessage|null);

        /** ClientMessage payload. */
        public payload?: ("input"|"chat");

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientMessage instance
         */
        public static create(properties?: jsbolo.IClientMessage): jsbolo.ClientMessage;

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link jsbolo.ClientMessage.verify|verify} messages.
         * @param message ClientMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IClientMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link jsbolo.ClientMessage.verify|verify} messages.
         * @param message ClientMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IClientMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.ClientMessage;

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.ClientMessage;

        /**
         * Verifies a ClientMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientMessage
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.ClientMessage;

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @param message ClientMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.ClientMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClientMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatMessage. */
    interface IChatMessage {

        /** ChatMessage text */
        text?: (string|null);

        /** ChatMessage allianceOnly */
        allianceOnly?: (boolean|null);

        /** ChatMessage recipientPlayerIds */
        recipientPlayerIds?: (number[]|null);
    }

    /** Represents a ChatMessage. */
    class ChatMessage implements IChatMessage {

        /**
         * Constructs a new ChatMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IChatMessage);

        /** ChatMessage text. */
        public text: string;

        /** ChatMessage allianceOnly. */
        public allianceOnly: boolean;

        /** ChatMessage recipientPlayerIds. */
        public recipientPlayerIds: number[];

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatMessage instance
         */
        public static create(properties?: jsbolo.IChatMessage): jsbolo.ChatMessage;

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link jsbolo.ChatMessage.verify|verify} messages.
         * @param message ChatMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link jsbolo.ChatMessage.verify|verify} messages.
         * @param message ChatMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.ChatMessage;

        /**
         * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.ChatMessage;

        /**
         * Verifies a ChatMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatMessage
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.ChatMessage;

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @param message ChatMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.ChatMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ServerMessage. */
    interface IServerMessage {

        /** ServerMessage welcome */
        welcome?: (jsbolo.IWelcomeMessage|null);

        /** ServerMessage update */
        update?: (jsbolo.IUpdateMessage|null);
    }

    /** Represents a ServerMessage. */
    class ServerMessage implements IServerMessage {

        /**
         * Constructs a new ServerMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IServerMessage);

        /** ServerMessage welcome. */
        public welcome?: (jsbolo.IWelcomeMessage|null);

        /** ServerMessage update. */
        public update?: (jsbolo.IUpdateMessage|null);

        /** ServerMessage message. */
        public message?: ("welcome"|"update");

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerMessage instance
         */
        public static create(properties?: jsbolo.IServerMessage): jsbolo.ServerMessage;

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link jsbolo.ServerMessage.verify|verify} messages.
         * @param message ServerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IServerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link jsbolo.ServerMessage.verify|verify} messages.
         * @param message ServerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IServerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.ServerMessage;

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.ServerMessage;

        /**
         * Verifies a ServerMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerMessage
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.ServerMessage;

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @param message ServerMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.ServerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ServerMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
