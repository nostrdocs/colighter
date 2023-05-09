import { IRequest } from "@fluidframework/core-interfaces";
import { DriverHeader } from "@fluidframework/driver-definitions";
import {
  NostrCollabHeader,
  NostrCollabRequest,
  CreateCollabRequest,
  LoadCollabRequest,
  ShareCollabRequest,
} from "./types";

export const createNostrCreateNewRequest = (documentId?: string): IRequest => ({
  url: documentId ?? "",
  headers: {
    [DriverHeader.createNew]: true,
  },
});

export const mapFluidRequestToNostrCollab = (
  request: IRequest
): CreateCollabRequest | LoadCollabRequest => {
  if (request.headers?.[DriverHeader.createNew]) {
    return {
      header: {
        [NostrCollabHeader.Create]: true,
      },
      url: request.url,
    };
  }

  return {
    header: {
      [NostrCollabHeader.Load]: true,
    },
    url: request.url,
  };
};

export const isNostrCreateCollabRequest = (
  request: NostrCollabRequest
): request is CreateCollabRequest => {
  return request.header[NostrCollabHeader.Create] && request.url !== undefined;
};

export const isNostrLoadCollabRequest = (
  request: NostrCollabRequest
): request is LoadCollabRequest => {
  return request.header[NostrCollabHeader.Load] && request.url !== undefined;
};

export const isNostrShareCollabRequest = (
  request: NostrCollabRequest
): request is ShareCollabRequest => {
  return (
    request.header[NostrCollabHeader.Share] &&
    request.resolvedUrl !== undefined &&
    request.relativeUrl !== undefined
  );
};
