import { Link } from "react-router";
import type Room from "~/utils/Room";


interface RoomType {
  value:Room;
}
 function openModal() {
    
  }

export default function Room({ value}:{value:Room}){
    return ( <li className="p-4 bg-white rounded shadow">
            <button  className="block text-pink-600" onClick={openModal}>
              <span className="font-semibold text-xl">{value.id}</span>
              <p className="text-gray-700">{value.type}</p>
            </button>
          </li>)
}