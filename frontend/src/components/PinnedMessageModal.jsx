import { XIcon } from "lucide-react"

function PinnedMessageModal({ pinnedMessages, onClose }) {
  return (
    <div className='create-channel-modal-overlay'>
        <div className="create-channel-modal">
          {/* Header */}
            <div className="create-channel-modal__header">
                <h2 className="text-2xl font-semibold">
                    Pinned Message
                </h2>
                 <button onClick={onClose} className="create-channel-modal__close">
                        <XIcon className="w-5 h-5" />
                    </button>
            </div>
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {pinnedMessages.map((pinnedMessage) => (
                <div key={pinnedMessage.id} className="flex items-center gap-3 py-4 border-b last:border-b-0">
                  <img src={pinnedMessage.user.image} alt={pinnedMessage.user.name} className="size-9 rounded-full object-cover mt-1" />
                  <div className="text-sm text-white font-medium mb-1">{pinnedMessage.user.name}</div>
                  <div className="text-base text-yellow-500 whitespace-pre-line">{pinnedMessage.text}</div>
                </div>
              ))}

              {pinnedMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">No pinned messages</div>
              )}

            </div>
        </div>
    </div>
  )
}

export default PinnedMessageModal