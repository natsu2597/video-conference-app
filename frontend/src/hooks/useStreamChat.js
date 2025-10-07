import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query"
import { getStreamToken } from "../lib/api";
import { useEffect } from "react";
import {StreamChat} from "stream-chat";




const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
    const { user } = useUser();
    const [chatClient, setChatClient ] = useState(null);

    const {data: tokenData, isLoading : tokenLoading, error : tokenError} = useQuery({
        queryKey : ["streamToken"],
        queryFn : getStreamToken,
        enabled : !!user?.id, 
    });

    useEffect(() => {
        
        if(!tokenData.token || !user?.id || !STREAM_API_KEY) return;

        const client = StreamChat.getInstance(STREAM_API_KEY);
        let cancelled = false;
        const initChat = async () => {
            
            
            

            try {
                
                await client.connectUser({
                    id : user.id,
                    name : user.fullName,
                    image : user.imageUrl
                },
            tokenData.token);

            if(!cancelled){
                setChatClient(client);
            }
                  
            } catch (error) {
                console.error("Error Connecting to Stream");
                Sentry.captureException(error, {
                    text : {comment : "useStreamChat"},
                    extra : {
                        context : "stream_chat_connection",
                        userId : user?.id,
                        streamApiKey : STREAM_API_KEY ? "present" : "missing"
                    },

                }); 
            }
        }
        initChat();

        return () => {
            cancelled = true;
            if(chatClient) client.disconnectUser();
        }
    },[tokenData, user, chatClient])

    return {chatClient, isLoading:tokenLoading,error:tokenError}
}