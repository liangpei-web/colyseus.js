import './legacy';
import './weChatAdaptation/weChatAdaptation';

export { Auth, type AuthSettings, type PopupSettings } from "./Auth";
export { Client, JoinOptions, MatchMakeError, type ClientOptions, type EndpointSettings } from './Client';
export { ServerError } from './errors/Errors';
export { ErrorCode, Protocol, SeatReservation } from './Protocol';
export { Room, RoomAvailable } from './Room';

/*
 * Serializers
 */
import { NoneSerializer } from "./serializer/NoneSerializer";
import { SchemaSerializer, getStateCallbacks } from "./serializer/SchemaSerializer";
import { registerSerializer } from './serializer/Serializer';

export { SchemaSerializer, getStateCallbacks, registerSerializer };
registerSerializer('schema', SchemaSerializer);
registerSerializer('none', NoneSerializer);
