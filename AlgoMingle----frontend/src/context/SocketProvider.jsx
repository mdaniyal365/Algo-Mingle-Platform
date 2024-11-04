import React,{createContext , useMemo , useContext} from "react"
import { io } from "socket.io-client"

const SocketContext = createContext(null);
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}
// https://aws.hayatsoftwares.com
export const SocketProvider = (props) => {
    const socket = useMemo(() => io("https://aws.hayatsoftwares.com"),[])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    ) 
}
