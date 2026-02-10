/**
 * Core game types
 */
export var BuilderOrder;
(function (BuilderOrder) {
    BuilderOrder[BuilderOrder["IN_TANK"] = 0] = "IN_TANK";
    BuilderOrder[BuilderOrder["WAITING"] = 1] = "WAITING";
    BuilderOrder[BuilderOrder["RETURNING"] = 2] = "RETURNING";
    BuilderOrder[BuilderOrder["PARACHUTING"] = 3] = "PARACHUTING";
    BuilderOrder[BuilderOrder["HARVESTING"] = 10] = "HARVESTING";
    BuilderOrder[BuilderOrder["BUILDING_ROAD"] = 11] = "BUILDING_ROAD";
    BuilderOrder[BuilderOrder["REPAIRING"] = 12] = "REPAIRING";
    BuilderOrder[BuilderOrder["BUILDING_BOAT"] = 13] = "BUILDING_BOAT";
    BuilderOrder[BuilderOrder["BUILDING_WALL"] = 14] = "BUILDING_WALL";
    BuilderOrder[BuilderOrder["PLACING_PILLBOX"] = 15] = "PLACING_PILLBOX";
    BuilderOrder[BuilderOrder["LAYING_MINE"] = 16] = "LAYING_MINE";
})(BuilderOrder || (BuilderOrder = {}));
export var ExplosionType;
(function (ExplosionType) {
    ExplosionType[ExplosionType["SMALL"] = 0] = "SMALL";
    ExplosionType[ExplosionType["LARGE"] = 1] = "LARGE";
    ExplosionType[ExplosionType["MINE"] = 2] = "MINE";
})(ExplosionType || (ExplosionType = {}));
export var BuildAction;
(function (BuildAction) {
    BuildAction[BuildAction["NONE"] = 0] = "NONE";
    BuildAction[BuildAction["FOREST"] = 1] = "FOREST";
    BuildAction[BuildAction["ROAD"] = 2] = "ROAD";
    BuildAction[BuildAction["REPAIR"] = 3] = "REPAIR";
    BuildAction[BuildAction["BOAT"] = 4] = "BOAT";
    BuildAction[BuildAction["BUILDING"] = 5] = "BUILDING";
    BuildAction[BuildAction["PILLBOX"] = 6] = "PILLBOX";
    BuildAction[BuildAction["MINE"] = 7] = "MINE";
})(BuildAction || (BuildAction = {}));
export var RangeAdjustment;
(function (RangeAdjustment) {
    RangeAdjustment[RangeAdjustment["NONE"] = 0] = "NONE";
    RangeAdjustment[RangeAdjustment["INCREASE"] = 1] = "INCREASE";
    RangeAdjustment[RangeAdjustment["DECREASE"] = 2] = "DECREASE";
})(RangeAdjustment || (RangeAdjustment = {}));
//# sourceMappingURL=types.js.map