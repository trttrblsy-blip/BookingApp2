import * as z from "zod";
import { room_type } from "../../generated/prisma/enums";

export const roomDTO = z.object({
  startDate: z.date(),
  endDate: z.date(),
  amount: z.number(),
  type: z.nativeEnum(room_type).or(z.literal("")),
});
