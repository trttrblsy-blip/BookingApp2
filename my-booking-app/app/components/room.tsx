import { Link } from "react-router";
import type Room from "~/utils/Room";


interface RoomType {
  value:Room;
}

export default function Room({ value}:{value:Room}){
    return ( <li className="p-4 bg-white rounded shadow">
            <Link to={`/items/${item.id}`} className="block text-indigo-600">
              <span className="font-semibold text-xl">{value.id}</span>
              <p className="text-gray-700">{value.type}</p>
            </Link>
          </li>)
}