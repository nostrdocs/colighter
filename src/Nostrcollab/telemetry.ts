import {
	ITelemetryBaseEvent,
	ITelemetryErrorEvent,
	ITelemetryGenericEvent,
	ITelemetryLogger,
	ITelemetryPerformanceEvent,
} from "@fluidframework/common-definitions";

export class TelemetryNullLogger implements ITelemetryLogger {
	public send(event: ITelemetryBaseEvent): void {}
	public sendTelemetryEvent(event: ITelemetryGenericEvent, error?: any): void {}
	public sendErrorEvent(event: ITelemetryErrorEvent, error?: any): void {}
	public sendPerformanceEvent(event: ITelemetryPerformanceEvent, error?: any): void {}
}
