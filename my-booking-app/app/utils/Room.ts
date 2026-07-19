import type { room_type } from "../../generated/prisma/enums";


export default interface Room {
  id: number;
  capacity: number;
  type: room_type;
}
