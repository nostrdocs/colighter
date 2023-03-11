import { ISnapshotTree } from "@fluidframework/protocol-definitions";

export interface ISnapshotTreeVersion {
	id: string;
	snapshotTree: ISnapshotTree;
}
