import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace jsbolo. */
export namespace jsbolo {

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

    /** Properties of a BuildOrder. */
    interface IBuildOrder {

        /** BuildOrder action */
        action?: (jsbolo.BuildOrder.Action|null);

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
        public action: jsbolo.BuildOrder.Action;

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

    namespace BuildOrder {

        /** Action enum. */
        enum Action {
            NONE = 0,
            FOREST = 1,
            ROAD = 2,
            REPAIR = 3,
            BOAT = 4,
            BUILDING = 5,
            PILLBOX = 6,
            MINE = 7
        }
    }

    /** RangeAdjustment enum. */
    enum RangeAdjustment {
        NONE = 0,
        INCREASE = 1,
        DECREASE = 2
    }

    /** Properties of a ServerUpdate. */
    interface IServerUpdate {

        /** ServerUpdate tick */
        tick?: (number|null);

        /** ServerUpdate tanks */
        tanks?: (jsbolo.ITankState[]|null);

        /** ServerUpdate builders */
        builders?: (jsbolo.IBuilderState[]|null);

        /** ServerUpdate shells */
        shells?: (jsbolo.IShellState[]|null);

        /** ServerUpdate explosions */
        explosions?: (jsbolo.IExplosionState[]|null);

        /** ServerUpdate terrainChanges */
        terrainChanges?: (jsbolo.ITerrainChange[]|null);

        /** ServerUpdate pillboxes */
        pillboxes?: (jsbolo.IPillboxState[]|null);

        /** ServerUpdate bases */
        bases?: (jsbolo.IBaseState[]|null);
    }

    /** Represents a ServerUpdate. */
    class ServerUpdate implements IServerUpdate {

        /**
         * Constructs a new ServerUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IServerUpdate);

        /** ServerUpdate tick. */
        public tick: number;

        /** ServerUpdate tanks. */
        public tanks: jsbolo.ITankState[];

        /** ServerUpdate builders. */
        public builders: jsbolo.IBuilderState[];

        /** ServerUpdate shells. */
        public shells: jsbolo.IShellState[];

        /** ServerUpdate explosions. */
        public explosions: jsbolo.IExplosionState[];

        /** ServerUpdate terrainChanges. */
        public terrainChanges: jsbolo.ITerrainChange[];

        /** ServerUpdate pillboxes. */
        public pillboxes: jsbolo.IPillboxState[];

        /** ServerUpdate bases. */
        public bases: jsbolo.IBaseState[];

        /**
         * Creates a new ServerUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerUpdate instance
         */
        public static create(properties?: jsbolo.IServerUpdate): jsbolo.ServerUpdate;

        /**
         * Encodes the specified ServerUpdate message. Does not implicitly {@link jsbolo.ServerUpdate.verify|verify} messages.
         * @param message ServerUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IServerUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerUpdate message, length delimited. Does not implicitly {@link jsbolo.ServerUpdate.verify|verify} messages.
         * @param message ServerUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IServerUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.ServerUpdate;

        /**
         * Decodes a ServerUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.ServerUpdate;

        /**
         * Verifies a ServerUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerUpdate
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.ServerUpdate;

        /**
         * Creates a plain object from a ServerUpdate message. Also converts values to other types if specified.
         * @param message ServerUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.ServerUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ServerUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TankState. */
    interface ITankState {

        /** TankState id */
        id?: (number|null);

        /** TankState x */
        x?: (number|null);

        /** TankState y */
        y?: (number|null);

        /** TankState direction */
        direction?: (number|null);

        /** TankState speed */
        speed?: (number|null);

        /** TankState armor */
        armor?: (number|null);

        /** TankState shells */
        shells?: (number|null);

        /** TankState mines */
        mines?: (number|null);

        /** TankState trees */
        trees?: (number|null);

        /** TankState team */
        team?: (number|null);

        /** TankState onBoat */
        onBoat?: (boolean|null);

        /** TankState reload */
        reload?: (number|null);

        /** TankState firingRange */
        firingRange?: (number|null);
    }

    /** Represents a TankState. */
    class TankState implements ITankState {

        /**
         * Constructs a new TankState.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.ITankState);

        /** TankState id. */
        public id: number;

        /** TankState x. */
        public x: number;

        /** TankState y. */
        public y: number;

        /** TankState direction. */
        public direction: number;

        /** TankState speed. */
        public speed: number;

        /** TankState armor. */
        public armor: number;

        /** TankState shells. */
        public shells: number;

        /** TankState mines. */
        public mines: number;

        /** TankState trees. */
        public trees: number;

        /** TankState team. */
        public team: number;

        /** TankState onBoat. */
        public onBoat: boolean;

        /** TankState reload. */
        public reload: number;

        /** TankState firingRange. */
        public firingRange: number;

        /**
         * Creates a new TankState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TankState instance
         */
        public static create(properties?: jsbolo.ITankState): jsbolo.TankState;

        /**
         * Encodes the specified TankState message. Does not implicitly {@link jsbolo.TankState.verify|verify} messages.
         * @param message TankState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.ITankState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TankState message, length delimited. Does not implicitly {@link jsbolo.TankState.verify|verify} messages.
         * @param message TankState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.ITankState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TankState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.TankState;

        /**
         * Decodes a TankState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TankState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.TankState;

        /**
         * Verifies a TankState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TankState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TankState
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.TankState;

        /**
         * Creates a plain object from a TankState message. Also converts values to other types if specified.
         * @param message TankState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.TankState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TankState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TankState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BuilderState. */
    interface IBuilderState {

        /** BuilderState id */
        id?: (number|null);

        /** BuilderState ownerTankId */
        ownerTankId?: (number|null);

        /** BuilderState x */
        x?: (number|null);

        /** BuilderState y */
        y?: (number|null);

        /** BuilderState targetX */
        targetX?: (number|null);

        /** BuilderState targetY */
        targetY?: (number|null);

        /** BuilderState order */
        order?: (jsbolo.BuilderOrder|null);

        /** BuilderState trees */
        trees?: (number|null);

        /** BuilderState hasMine */
        hasMine?: (boolean|null);

        /** BuilderState team */
        team?: (number|null);
    }

    /** Represents a BuilderState. */
    class BuilderState implements IBuilderState {

        /**
         * Constructs a new BuilderState.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IBuilderState);

        /** BuilderState id. */
        public id: number;

        /** BuilderState ownerTankId. */
        public ownerTankId: number;

        /** BuilderState x. */
        public x: number;

        /** BuilderState y. */
        public y: number;

        /** BuilderState targetX. */
        public targetX: number;

        /** BuilderState targetY. */
        public targetY: number;

        /** BuilderState order. */
        public order: jsbolo.BuilderOrder;

        /** BuilderState trees. */
        public trees: number;

        /** BuilderState hasMine. */
        public hasMine: boolean;

        /** BuilderState team. */
        public team: number;

        /**
         * Creates a new BuilderState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BuilderState instance
         */
        public static create(properties?: jsbolo.IBuilderState): jsbolo.BuilderState;

        /**
         * Encodes the specified BuilderState message. Does not implicitly {@link jsbolo.BuilderState.verify|verify} messages.
         * @param message BuilderState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IBuilderState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BuilderState message, length delimited. Does not implicitly {@link jsbolo.BuilderState.verify|verify} messages.
         * @param message BuilderState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IBuilderState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BuilderState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BuilderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.BuilderState;

        /**
         * Decodes a BuilderState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BuilderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.BuilderState;

        /**
         * Verifies a BuilderState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BuilderState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BuilderState
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.BuilderState;

        /**
         * Creates a plain object from a BuilderState message. Also converts values to other types if specified.
         * @param message BuilderState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.BuilderState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BuilderState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BuilderState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** BuilderOrder enum. */
    enum BuilderOrder {
        IN_TANK = 0,
        WAITING = 1,
        RETURNING = 2,
        PARACHUTING = 3,
        HARVESTING = 10,
        BUILDING_ROAD = 11,
        REPAIRING = 12,
        BUILDING_BOAT = 13,
        BUILDING_WALL = 14,
        PLACING_PILLBOX = 15,
        LAYING_MINE = 16
    }

    /** Properties of a ShellState. */
    interface IShellState {

        /** ShellState id */
        id?: (number|null);

        /** ShellState x */
        x?: (number|null);

        /** ShellState y */
        y?: (number|null);

        /** ShellState direction */
        direction?: (number|null);

        /** ShellState ownerTankId */
        ownerTankId?: (number|null);
    }

    /** Represents a ShellState. */
    class ShellState implements IShellState {

        /**
         * Constructs a new ShellState.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IShellState);

        /** ShellState id. */
        public id: number;

        /** ShellState x. */
        public x: number;

        /** ShellState y. */
        public y: number;

        /** ShellState direction. */
        public direction: number;

        /** ShellState ownerTankId. */
        public ownerTankId: number;

        /**
         * Creates a new ShellState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShellState instance
         */
        public static create(properties?: jsbolo.IShellState): jsbolo.ShellState;

        /**
         * Encodes the specified ShellState message. Does not implicitly {@link jsbolo.ShellState.verify|verify} messages.
         * @param message ShellState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IShellState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ShellState message, length delimited. Does not implicitly {@link jsbolo.ShellState.verify|verify} messages.
         * @param message ShellState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IShellState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShellState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShellState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.ShellState;

        /**
         * Decodes a ShellState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ShellState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.ShellState;

        /**
         * Verifies a ShellState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ShellState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ShellState
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.ShellState;

        /**
         * Creates a plain object from a ShellState message. Also converts values to other types if specified.
         * @param message ShellState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.ShellState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ShellState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ShellState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExplosionState. */
    interface IExplosionState {

        /** ExplosionState id */
        id?: (number|null);

        /** ExplosionState x */
        x?: (number|null);

        /** ExplosionState y */
        y?: (number|null);

        /** ExplosionState type */
        type?: (jsbolo.ExplosionType|null);

        /** ExplosionState frame */
        frame?: (number|null);
    }

    /** Represents an ExplosionState. */
    class ExplosionState implements IExplosionState {

        /**
         * Constructs a new ExplosionState.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IExplosionState);

        /** ExplosionState id. */
        public id: number;

        /** ExplosionState x. */
        public x: number;

        /** ExplosionState y. */
        public y: number;

        /** ExplosionState type. */
        public type: jsbolo.ExplosionType;

        /** ExplosionState frame. */
        public frame: number;

        /**
         * Creates a new ExplosionState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExplosionState instance
         */
        public static create(properties?: jsbolo.IExplosionState): jsbolo.ExplosionState;

        /**
         * Encodes the specified ExplosionState message. Does not implicitly {@link jsbolo.ExplosionState.verify|verify} messages.
         * @param message ExplosionState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IExplosionState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExplosionState message, length delimited. Does not implicitly {@link jsbolo.ExplosionState.verify|verify} messages.
         * @param message ExplosionState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IExplosionState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExplosionState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExplosionState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.ExplosionState;

        /**
         * Decodes an ExplosionState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExplosionState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.ExplosionState;

        /**
         * Verifies an ExplosionState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExplosionState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExplosionState
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.ExplosionState;

        /**
         * Creates a plain object from an ExplosionState message. Also converts values to other types if specified.
         * @param message ExplosionState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.ExplosionState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExplosionState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExplosionState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ExplosionType enum. */
    enum ExplosionType {
        SMALL = 0,
        LARGE = 1,
        MINE = 2
    }

    /** Properties of a TerrainChange. */
    interface ITerrainChange {

        /** TerrainChange tileX */
        tileX?: (number|null);

        /** TerrainChange tileY */
        tileY?: (number|null);

        /** TerrainChange terrainType */
        terrainType?: (number|null);

        /** TerrainChange hasMine */
        hasMine?: (boolean|null);
    }

    /** Represents a TerrainChange. */
    class TerrainChange implements ITerrainChange {

        /**
         * Constructs a new TerrainChange.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.ITerrainChange);

        /** TerrainChange tileX. */
        public tileX: number;

        /** TerrainChange tileY. */
        public tileY: number;

        /** TerrainChange terrainType. */
        public terrainType: number;

        /** TerrainChange hasMine. */
        public hasMine: boolean;

        /**
         * Creates a new TerrainChange instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TerrainChange instance
         */
        public static create(properties?: jsbolo.ITerrainChange): jsbolo.TerrainChange;

        /**
         * Encodes the specified TerrainChange message. Does not implicitly {@link jsbolo.TerrainChange.verify|verify} messages.
         * @param message TerrainChange message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.ITerrainChange, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TerrainChange message, length delimited. Does not implicitly {@link jsbolo.TerrainChange.verify|verify} messages.
         * @param message TerrainChange message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.ITerrainChange, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TerrainChange message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TerrainChange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.TerrainChange;

        /**
         * Decodes a TerrainChange message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TerrainChange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.TerrainChange;

        /**
         * Verifies a TerrainChange message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TerrainChange message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TerrainChange
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.TerrainChange;

        /**
         * Creates a plain object from a TerrainChange message. Also converts values to other types if specified.
         * @param message TerrainChange
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.TerrainChange, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TerrainChange to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TerrainChange
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PillboxState. */
    interface IPillboxState {

        /** PillboxState id */
        id?: (number|null);

        /** PillboxState tileX */
        tileX?: (number|null);

        /** PillboxState tileY */
        tileY?: (number|null);

        /** PillboxState armor */
        armor?: (number|null);

        /** PillboxState ownerTeam */
        ownerTeam?: (number|null);

        /** PillboxState inTank */
        inTank?: (boolean|null);
    }

    /** Represents a PillboxState. */
    class PillboxState implements IPillboxState {

        /**
         * Constructs a new PillboxState.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IPillboxState);

        /** PillboxState id. */
        public id: number;

        /** PillboxState tileX. */
        public tileX: number;

        /** PillboxState tileY. */
        public tileY: number;

        /** PillboxState armor. */
        public armor: number;

        /** PillboxState ownerTeam. */
        public ownerTeam: number;

        /** PillboxState inTank. */
        public inTank: boolean;

        /**
         * Creates a new PillboxState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PillboxState instance
         */
        public static create(properties?: jsbolo.IPillboxState): jsbolo.PillboxState;

        /**
         * Encodes the specified PillboxState message. Does not implicitly {@link jsbolo.PillboxState.verify|verify} messages.
         * @param message PillboxState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IPillboxState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PillboxState message, length delimited. Does not implicitly {@link jsbolo.PillboxState.verify|verify} messages.
         * @param message PillboxState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IPillboxState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PillboxState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PillboxState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.PillboxState;

        /**
         * Decodes a PillboxState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PillboxState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.PillboxState;

        /**
         * Verifies a PillboxState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PillboxState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PillboxState
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.PillboxState;

        /**
         * Creates a plain object from a PillboxState message. Also converts values to other types if specified.
         * @param message PillboxState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.PillboxState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PillboxState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PillboxState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BaseState. */
    interface IBaseState {

        /** BaseState id */
        id?: (number|null);

        /** BaseState tileX */
        tileX?: (number|null);

        /** BaseState tileY */
        tileY?: (number|null);

        /** BaseState armor */
        armor?: (number|null);

        /** BaseState shells */
        shells?: (number|null);

        /** BaseState mines */
        mines?: (number|null);

        /** BaseState ownerTeam */
        ownerTeam?: (number|null);
    }

    /** Represents a BaseState. */
    class BaseState implements IBaseState {

        /**
         * Constructs a new BaseState.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IBaseState);

        /** BaseState id. */
        public id: number;

        /** BaseState tileX. */
        public tileX: number;

        /** BaseState tileY. */
        public tileY: number;

        /** BaseState armor. */
        public armor: number;

        /** BaseState shells. */
        public shells: number;

        /** BaseState mines. */
        public mines: number;

        /** BaseState ownerTeam. */
        public ownerTeam: number;

        /**
         * Creates a new BaseState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BaseState instance
         */
        public static create(properties?: jsbolo.IBaseState): jsbolo.BaseState;

        /**
         * Encodes the specified BaseState message. Does not implicitly {@link jsbolo.BaseState.verify|verify} messages.
         * @param message BaseState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IBaseState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BaseState message, length delimited. Does not implicitly {@link jsbolo.BaseState.verify|verify} messages.
         * @param message BaseState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IBaseState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BaseState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.BaseState;

        /**
         * Decodes a BaseState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BaseState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.BaseState;

        /**
         * Verifies a BaseState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BaseState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BaseState
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.BaseState;

        /**
         * Creates a plain object from a BaseState message. Also converts values to other types if specified.
         * @param message BaseState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.BaseState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BaseState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BaseState
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateEntity. */
    interface ICreateEntity {

        /** CreateEntity tank */
        tank?: (jsbolo.ITankState|null);

        /** CreateEntity builder */
        builder?: (jsbolo.IBuilderState|null);

        /** CreateEntity shell */
        shell?: (jsbolo.IShellState|null);

        /** CreateEntity explosion */
        explosion?: (jsbolo.IExplosionState|null);

        /** CreateEntity pillbox */
        pillbox?: (jsbolo.IPillboxState|null);

        /** CreateEntity base */
        base?: (jsbolo.IBaseState|null);
    }

    /** Represents a CreateEntity. */
    class CreateEntity implements ICreateEntity {

        /**
         * Constructs a new CreateEntity.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.ICreateEntity);

        /** CreateEntity tank. */
        public tank?: (jsbolo.ITankState|null);

        /** CreateEntity builder. */
        public builder?: (jsbolo.IBuilderState|null);

        /** CreateEntity shell. */
        public shell?: (jsbolo.IShellState|null);

        /** CreateEntity explosion. */
        public explosion?: (jsbolo.IExplosionState|null);

        /** CreateEntity pillbox. */
        public pillbox?: (jsbolo.IPillboxState|null);

        /** CreateEntity base. */
        public base?: (jsbolo.IBaseState|null);

        /** CreateEntity entity. */
        public entity?: ("tank"|"builder"|"shell"|"explosion"|"pillbox"|"base");

        /**
         * Creates a new CreateEntity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateEntity instance
         */
        public static create(properties?: jsbolo.ICreateEntity): jsbolo.CreateEntity;

        /**
         * Encodes the specified CreateEntity message. Does not implicitly {@link jsbolo.CreateEntity.verify|verify} messages.
         * @param message CreateEntity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.ICreateEntity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateEntity message, length delimited. Does not implicitly {@link jsbolo.CreateEntity.verify|verify} messages.
         * @param message CreateEntity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.ICreateEntity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateEntity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.CreateEntity;

        /**
         * Decodes a CreateEntity message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.CreateEntity;

        /**
         * Verifies a CreateEntity message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateEntity message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateEntity
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.CreateEntity;

        /**
         * Creates a plain object from a CreateEntity message. Also converts values to other types if specified.
         * @param message CreateEntity
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.CreateEntity, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateEntity to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CreateEntity
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DestroyEntity. */
    interface IDestroyEntity {

        /** DestroyEntity type */
        type?: (jsbolo.DestroyEntity.EntityType|null);

        /** DestroyEntity id */
        id?: (number|null);
    }

    /** Represents a DestroyEntity. */
    class DestroyEntity implements IDestroyEntity {

        /**
         * Constructs a new DestroyEntity.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IDestroyEntity);

        /** DestroyEntity type. */
        public type: jsbolo.DestroyEntity.EntityType;

        /** DestroyEntity id. */
        public id: number;

        /**
         * Creates a new DestroyEntity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DestroyEntity instance
         */
        public static create(properties?: jsbolo.IDestroyEntity): jsbolo.DestroyEntity;

        /**
         * Encodes the specified DestroyEntity message. Does not implicitly {@link jsbolo.DestroyEntity.verify|verify} messages.
         * @param message DestroyEntity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IDestroyEntity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DestroyEntity message, length delimited. Does not implicitly {@link jsbolo.DestroyEntity.verify|verify} messages.
         * @param message DestroyEntity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IDestroyEntity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DestroyEntity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DestroyEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.DestroyEntity;

        /**
         * Decodes a DestroyEntity message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DestroyEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.DestroyEntity;

        /**
         * Verifies a DestroyEntity message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DestroyEntity message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DestroyEntity
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.DestroyEntity;

        /**
         * Creates a plain object from a DestroyEntity message. Also converts values to other types if specified.
         * @param message DestroyEntity
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.DestroyEntity, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DestroyEntity to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DestroyEntity
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace DestroyEntity {

        /** EntityType enum. */
        enum EntityType {
            TANK = 0,
            BUILDER = 1,
            SHELL = 2,
            EXPLOSION = 3,
            PILLBOX = 4,
            BASE = 5
        }
    }

    /** Properties of a WelcomeMessage. */
    interface IWelcomeMessage {

        /** WelcomeMessage playerId */
        playerId?: (number|null);

        /** WelcomeMessage assignedTeam */
        assignedTeam?: (number|null);

        /** WelcomeMessage currentTick */
        currentTick?: (number|null);

        /** WelcomeMessage map */
        map?: (jsbolo.IMapData|null);
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

        /** WelcomeMessage map. */
        public map?: (jsbolo.IMapData|null);

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

    /** Properties of a MapData. */
    interface IMapData {

        /** MapData width */
        width?: (number|null);

        /** MapData height */
        height?: (number|null);

        /** MapData terrain */
        terrain?: (Uint8Array|null);

        /** MapData pillboxes */
        pillboxes?: (jsbolo.IPillboxState[]|null);

        /** MapData bases */
        bases?: (jsbolo.IBaseState[]|null);
    }

    /** Represents a MapData. */
    class MapData implements IMapData {

        /**
         * Constructs a new MapData.
         * @param [properties] Properties to set
         */
        constructor(properties?: jsbolo.IMapData);

        /** MapData width. */
        public width: number;

        /** MapData height. */
        public height: number;

        /** MapData terrain. */
        public terrain: Uint8Array;

        /** MapData pillboxes. */
        public pillboxes: jsbolo.IPillboxState[];

        /** MapData bases. */
        public bases: jsbolo.IBaseState[];

        /**
         * Creates a new MapData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MapData instance
         */
        public static create(properties?: jsbolo.IMapData): jsbolo.MapData;

        /**
         * Encodes the specified MapData message. Does not implicitly {@link jsbolo.MapData.verify|verify} messages.
         * @param message MapData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: jsbolo.IMapData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MapData message, length delimited. Does not implicitly {@link jsbolo.MapData.verify|verify} messages.
         * @param message MapData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: jsbolo.IMapData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MapData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MapData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): jsbolo.MapData;

        /**
         * Decodes a MapData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MapData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): jsbolo.MapData;

        /**
         * Verifies a MapData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MapData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MapData
         */
        public static fromObject(object: { [k: string]: any }): jsbolo.MapData;

        /**
         * Creates a plain object from a MapData message. Also converts values to other types if specified.
         * @param message MapData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: jsbolo.MapData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MapData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MapData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ClientMessage. */
    interface IClientMessage {

        /** ClientMessage input */
        input?: (jsbolo.IPlayerInput|null);
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

        /** ClientMessage message. */
        public message?: "input";

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

    /** Properties of a ServerMessage. */
    interface IServerMessage {

        /** ServerMessage welcome */
        welcome?: (jsbolo.IWelcomeMessage|null);

        /** ServerMessage update */
        update?: (jsbolo.IServerUpdate|null);

        /** ServerMessage create */
        create?: (jsbolo.ICreateEntity|null);

        /** ServerMessage destroy */
        destroy?: (jsbolo.IDestroyEntity|null);
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
        public update?: (jsbolo.IServerUpdate|null);

        /** ServerMessage create. */
        public create?: (jsbolo.ICreateEntity|null);

        /** ServerMessage destroy. */
        public destroy?: (jsbolo.IDestroyEntity|null);

        /** ServerMessage message. */
        public message?: ("welcome"|"update"|"create"|"destroy");

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
