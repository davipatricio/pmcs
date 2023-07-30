// import { DATA_LENGTH } from "../../utils/constants/dataLength";
// import { Packet } from "../../utils/parsePacket";
// import byteToBoolean from "../../utils/encoding/byteToBoolean";
// import bytesToString from "../../utils/encoding/bytesToString";

// export const handleLoginStart = (packet: Packet) => {
//   const data = [...packet.data];

//   const nameLength = data.shift();
//   const name = bytesToString(data.splice(0, nameLength));

//   const playerHasUUID = byteToBoolean(data.shift() as number);

//   let uuid: string | undefined;
//   if (playerHasUUID) {
//     uuid = bytesToString(data.splice(0, DATA_LENGTH.uuid));
//   }

//   return {
//     name,
//     uuid,
//   }
// };
