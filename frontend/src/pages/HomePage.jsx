import { UserButton } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useStreamChat } from '../hooks/useStreamChat'
import { PageLoader } from '../components/PageLoader'
import { Chat, ChannelList, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window } from "stream-chat-react"
import "../styles/stream-chat-styles.css"
import { PlusIcon } from 'lucide-react'
import CreateChatModal from '../components/CreateChatModal'

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModal] = useState(false);
  const[activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading} = useStreamChat();

  useEffect(() => {
    if(chatClient){
      const channelId = searchParams.get("channel");
      if(channelId){
        const channel = chatClient.channel("messaging",channelId);
        setActiveChannel(channel);
      }
    }
  },[chatClient,searchParams])
  if(error) return <div>{error.message}</div>
  if(isLoading || !chatClient) return <PageLoader />
  return (

    <div className='chat-wrapper'>
      <Chat client={chatClient}>
          <div className="chat-container">
            {/* Left Sidebar */}
            <div className="str-chat__channel-list">
              <div className="team-channel-list">
                {/* HEADER */}
                <div className="team-channel-list__header gap-4">
                  <div className="brand-container">
                    <img src="/logo.png" alt="" className='brand-logo'/>
                    <span className='brand-name'>Hiver</span>
                  </div>
                  <div className="user-button-wrapper">
                    <UserButton />
                  </div>
                </div>
                {/* CHANNEL LIST */}
                <div className="team-channel-list__content">
                  <div className="create-channel-section">
                    <button className="create-channel-btn" onClick={() => setIsCreateModal(true)}>
                      <PlusIcon className="size-4"/>
                      <span>Create Channel</span>
                    </button>
                  </div>
                </div>
              </div>  
            </div>
            {/* Right Section */}
            <div className="chat-main">
              <Channel channel={activeChannel}>
                <Window>
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </div>
          </div>
          {isCreateModalOpen && (
            <CreateChatModal onClose={() => setIsCreateModal(false)} />
          )}
      </Chat>
    </div>
  )
}

export default HomePage