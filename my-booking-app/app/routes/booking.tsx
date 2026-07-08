import {data,Route} from 'react-router'
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { fetch as undiciFetch } from "undici"; // Only for Node.js <18

/*const adapter = new PrismaPlanetScale({
  url: process.env.DATABASE_URL,
  fetch: undiciFetch,
});
const prisma = new PrismaClient({ adapter });

export async function loader({ params }: Route.LoaderArgs) {
  const { date } = params;
  const booking=await prisma.booking.findFirst({
    where: {
     AND:{startDate:{gte:date},endDate:{lte:date}}}
    },
  );
  if (!booking) throw data(null, { status: 404 });

  return booking;
}*/