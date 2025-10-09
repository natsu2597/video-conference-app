import { XIcon } from 'lucide-react'
import React from 'react'

function MemberModal({ members, onClose}){
    return (
        <div className="create-channel-modal-overlay">
            <div className="create-channel-modal">
                {/* Header */}
                <div className="create-channel-modal__header">
                    <h2 className="">
                        Channel Members
                    </h2>
                    <button onClick={onClose} className='create-channel-modal__close'>
                        <XIcon className='size-5' />
                    </button>
                </div>
                {/* Members List */}
                <div className="px-6 max-h-96 overflow-y-auto">
                    {members.map((member) => (
                        <div className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0" key={member.user.id}>
                            {member.user?.image ? (
                                <div className="user-button-wrapper">
                                    <img src={member.user.image} alt={member.user.name} className='size-9 rounded-full object-cover' />
                                </div>
                                
                            ) : (
                                <div className="size-9 rounded-full bg-gray-400 flex items-center justify-center">
                                    <span className="text-white">
                                    {(member.user.name || member.user.id).charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="text-sm font-medium text-gray-700 mb-1 text-white">
                                {member.user.name || member.user.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
export default MemberModal