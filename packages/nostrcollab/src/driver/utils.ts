import { IRequest } from "@fluidframework/core-interfaces";
import { DriverHeader } from "@fluidframework/driver-definitions";
import {
  CollabHeader,
  CollabRequest,
  CreateCollabRequest,
  LoadCollabRequest,
  ShareCollabRequest,
} from "../types";

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
        [CollabHeader.Create]: true,
      },
      url: request.url,
    };
  }

  return {
    header: {
      [CollabHeader.Load]: true,
    },
    url: request.url,
  };
};

export const isNostrCreateCollabRequest = (
  request: CollabRequest
): request is CreateCollabRequest => {
  return request.header[CollabHeader.Create] && request.url !== undefined;
};

export const isNostrLoadCollabRequest = (
  request: CollabRequest
): request is LoadCollabRequest => {
  return request.header[CollabHeader.Load] && request.url !== undefined;
};

export const isNostrShareCollabRequest = (
  request: CollabRequest
): request is ShareCollabRequest => {
  return (
    request.header[CollabHeader.Share] &&
    request.resolvedUrl !== undefined &&
    request.relativeUrl !== undefined
  );
};
