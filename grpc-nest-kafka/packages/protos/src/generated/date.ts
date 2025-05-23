// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.20.3
// source: date.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";

export const protobufPackage = "date";

/** The date service simply returns "now" in a structured form. */
export interface DateRequest {
}

export interface DateResponse {
  year: number;
  month: number;
  day: number;
  iso: string;
  hour: number;
  minute: number;
}

function createBaseDateRequest(): DateRequest {
  return {};
}

export const DateRequest: MessageFns<DateRequest> = {
  encode(_: DateRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DateRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DateRequest {
    return {};
  },

  toJSON(_: DateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DateRequest>, I>>(base?: I): DateRequest {
    return DateRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DateRequest>, I>>(_: I): DateRequest {
    const message = createBaseDateRequest();
    return message;
  },
};

function createBaseDateResponse(): DateResponse {
  return { year: 0, month: 0, day: 0, iso: "", hour: 0, minute: 0 };
}

export const DateResponse: MessageFns<DateResponse> = {
  encode(message: DateResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.year !== 0) {
      writer.uint32(8).int32(message.year);
    }
    if (message.month !== 0) {
      writer.uint32(16).int32(message.month);
    }
    if (message.day !== 0) {
      writer.uint32(24).int32(message.day);
    }
    if (message.iso !== "") {
      writer.uint32(34).string(message.iso);
    }
    if (message.hour !== 0) {
      writer.uint32(40).int32(message.hour);
    }
    if (message.minute !== 0) {
      writer.uint32(48).int32(message.minute);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DateResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.year = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.month = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.day = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.iso = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.hour = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.minute = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DateResponse {
    return {
      year: isSet(object.year) ? globalThis.Number(object.year) : 0,
      month: isSet(object.month) ? globalThis.Number(object.month) : 0,
      day: isSet(object.day) ? globalThis.Number(object.day) : 0,
      iso: isSet(object.iso) ? globalThis.String(object.iso) : "",
      hour: isSet(object.hour) ? globalThis.Number(object.hour) : 0,
      minute: isSet(object.minute) ? globalThis.Number(object.minute) : 0,
    };
  },

  toJSON(message: DateResponse): unknown {
    const obj: any = {};
    if (message.year !== 0) {
      obj.year = Math.round(message.year);
    }
    if (message.month !== 0) {
      obj.month = Math.round(message.month);
    }
    if (message.day !== 0) {
      obj.day = Math.round(message.day);
    }
    if (message.iso !== "") {
      obj.iso = message.iso;
    }
    if (message.hour !== 0) {
      obj.hour = Math.round(message.hour);
    }
    if (message.minute !== 0) {
      obj.minute = Math.round(message.minute);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DateResponse>, I>>(base?: I): DateResponse {
    return DateResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DateResponse>, I>>(object: I): DateResponse {
    const message = createBaseDateResponse();
    message.year = object.year ?? 0;
    message.month = object.month ?? 0;
    message.day = object.day ?? 0;
    message.iso = object.iso ?? "";
    message.hour = object.hour ?? 0;
    message.minute = object.minute ?? 0;
    return message;
  },
};

export type DateServiceService = typeof DateServiceService;
export const DateServiceService = {
  /** Gets the current date according to the server’s clock. */
  getCurrentDate: {
    path: "/date.DateService/GetCurrentDate",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DateRequest) => Buffer.from(DateRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DateRequest.decode(value),
    responseSerialize: (value: DateResponse) => Buffer.from(DateResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => DateResponse.decode(value),
  },
} as const;

export interface DateServiceServer extends UntypedServiceImplementation {
  /** Gets the current date according to the server’s clock. */
  getCurrentDate: handleUnaryCall<DateRequest, DateResponse>;
}

export interface DateServiceClient extends Client {
  /** Gets the current date according to the server’s clock. */
  getCurrentDate(
    request: DateRequest,
    callback: (error: ServiceError | null, response: DateResponse) => void,
  ): ClientUnaryCall;
  getCurrentDate(
    request: DateRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: DateResponse) => void,
  ): ClientUnaryCall;
  getCurrentDate(
    request: DateRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: DateResponse) => void,
  ): ClientUnaryCall;
}

export const DateServiceClient = makeGenericClientConstructor(DateServiceService, "date.DateService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): DateServiceClient;
  service: typeof DateServiceService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
