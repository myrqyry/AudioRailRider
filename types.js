// Represents the application's current state in its lifecycle
export var AppStatus;
(function (AppStatus) {
    AppStatus["Idle"] = "IDLE";
    AppStatus["Analyzing"] = "ANALYZING";
    AppStatus["Generating"] = "GENERATING";
    AppStatus["Ready"] = "READY";
    AppStatus["Riding"] = "RIDING";
    AppStatus["Finished"] = "FINISHED";
    AppStatus["Error"] = "ERROR";
})(AppStatus || (AppStatus = {}));
