import { IRequest } from "@fluidframework/core-interfaces";
import { DriverHeader } from "@fluidframework/driver-definitions";

export const createNostrCreateNewRequest = (documentId?: string): IRequest => ({
	url: documentId ?? "",
	headers: {
		[DriverHeader.createNew]: true,
	},
});
