import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useChatContext } from "stream-chat-react";
import * as Sentry from "@sentry/react";
import toast from "react-hot-toast";
import { AlertCircleIcon, HashIcon, XIcon } from "lucide-react";

const CreateChatModal = ({ onClose}) => {
    const [channelName, setChannelName] = useState("");
    const [channelType, setChannelType] = useState("public");
    const [channelDescription, setChannelDescription] = useState("");
    const [isChannelCreating,setIsChannelCreating] = useState(false);
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers ] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [_, setSearchParams] = useSearchParams();

    const {client, setActiveChannel} = useChatContext();

    useEffect(() => {
        const fetchUsers = async () => {
            if(!client?.user) return;
            setIsUserLoading(true)

            try {
                const response = await client.queryUsers(
                    {id : {$ne : client.user.id}},  
                    {name : 1},
                    {limit : 100}
                )

                const usersOnly = response.users.filter((user) => !user.id.startsWith("recording-"));
                setUsers(usersOnly || []);

            } catch (error) {
                console.log("Error fetching users");
                Sentry.captureException(error, {
                tags: { component: "CreateChannelModal" },
                extra: { context: "fetch_users_for_channel" },
        });
        setUsers([]);
            }
            finally{
                setIsUserLoading(false);
            }
        }

        fetchUsers();
    },[client])

     // auto-select all users for public channels
    useEffect(() => {
        if (channelType === "public") setSelectedUsers(users.map((u) => u.id));
        else setSelectedUsers([]);
         }, [channelType, users]);

    // fetch users for member section
    useEffect(() => {
        const fetchUser = async () => {
            if(!client?.user) return;
            setIsUserLoading(true);

            try {
                const response = await client.queryUsers({id : {$ne : client.user.id}},
                    {name : 1},
                    {limit : 100}


                )
                setUsers(response.users || []);
            } catch (error) {
                    console.log("Error fetching users");
                    Sentry.captureException(error,{
                        tag : {components : "CreateChatModal"},
                        extra : {context : "fetch_users_for_channel"}
                    });
                    setUsers([]);
            }
            finally{
                setIsUserLoading(false);
            }
        }
    },[client]);

    // reset the form on open
    useEffect(() => {
        setChannelName("");
        setChannelDescription("");
        setChannelType("public");
        setError("");
        setSelectedUsers([]);
    },[])

    const validateChannelName = (name) => {
        if(!name.trim()) return "Channel Name is required"
        if(name.length < 3) return "Channel name must be atleast 3 characters"
        if(name.length > 23) return "Channel must no exceed 23 characters"
        return ""
    }

    const handleChangeChannelName = (e) => {
        const value = e.target.value;
        setChannelName(value);
        setError(validateChannelName(value));
    };

    const handleMemberToggle = (id) => {
        if (selectedUsers.includes(id)){
            setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
             }
            else{
                setSelectedUsers([...selectedUsers, id]);
            }
       
    };

    const handleSubmit =  async (e) => {
        e.preventDefault();
        const validateError = validateChannelName(channelName);
        if(validateError) return setError(validateError);

        if(isChannelCreating || !client?.user) return;
        setIsChannelCreating(true);
        setError("");

        try {
            const channelId = channelName.toLowerCase().trim().replace(/\s/g, "-").slice(0,23);

            const channelData = {
                name : channelName.trim(),
                created_by_id : client.user.id,
                members : [client.user.id, ...selectedUsers],
            }
            if(channelDescription) channelData.description = channelDescription;
            
            if(channelType === "private") {
                channelData.is_private = true;
                channelData.visibility = "private";   
            }
             else{
                    channelData.visibility = "public";
                    channelData.discoverable = true;
                }
                const channel = client.channel("messaging",channelId, channelData);
                await channel.watch();

                setActiveChannel(channel);
                setSearchParams({channel : channelId})
                toast.success(`Channel "${channelName}" created successfully`);
                onClose();
            }

            

        catch (error) {
            console.log("Error creating channel", error);
            Sentry.captureException(error, {
                tag : {components : "CreateChatModal"},
                extra : {context : "create_channel"}
            })
        }
        finally{
            setIsChannelCreating(false);
        }

    };
    return (
        <div className="create-channel-modal-overlay">
            <div className="create-channel-modal">
                <div className="create-channel-modal__header">
                    <h2>Create Channel</h2>
                    <button onClick={onClose} className="create-channel-modal__close">
                        <XIcon className="size-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="create-channel-modal__form">

                    {/* Error */}
                    {error && (
                    <div className="create-channel-modal__error">
                        <AlertCircleIcon />
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-group">
                    <div className="input-with-icon">
                         <HashIcon className="size-4 input-icon" />
                        <input
                       id="channelName"
                       type="text"
                       placeholder="e.g music"
                       value={channelName}
                       onChange={handleChangeChannelName}
                       className={`form-input ${error ? "form-input--error" : ""}`}
                       maxLength={23}
                       autoFocus
                        />
                    </div>

                    {/* Channel name Preview */}
                    {channelName && (
                        <div className="form-hint">
                            Channel Id Will be : #
                        {channelName.toLowerCase().replace(/\s/g, "-").replace(/[^a-zA-Z0-9]/g, "")}
                        </div>
                        
                    )}

                    
                    
                   
                </div>

                {/* Channel Type */}
                <div className="form-group">
                    <label>Channel Type</label>
                    <div className="radio-group">
                        <label htmlFor="" className="radio-option">
                            <input type="radio" value="public" checked={channelType === "public"} onChange={(e) => setChannelType(e.target.value)} />
                            <div className="radio-content">
                                <HashIcon className="size-4" />
                                <div>
                                    <div className="radio-title">Public</div>
                                    <div className="radio-description">Anyone Can join this channel</div>
                                </div>
                            </div>
                        </label>

                         <label htmlFor="" className="radio-option">
                            <input type="radio" value="private" checked={channelType === "private"} onChange={(e) => setChannelType(e.target.value)} />
                            <div className="radio-content">
                                <HashIcon className="size-4" />
                                <div>
                                    <div className="radio-title">Private</div>
                                    <div className="radio-description">Needs permission to join</div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* add members */}
                {channelType === "private" && (
                        <div className="form-group">
                            <label htmlFor="">Add Members</label>
                            <div className="member-selection-header">
                                <button className="btn btn-secondary btn-small"
                                onClick={() => setSelectedUsers(users.map((u) => 
                                u.id)
                                )}
                                disabled={isUserLoading || users.length === 0}
                                >
                                Select All
                                </button>
                            </div>
                            <div className="members-list">
                                { isUserLoading ? (
                                    <p>Loading Users ...</p>
                                ) : (
                                    users.length === 0 ? (
                                         <p className="text-white">No Users Found</p>
                                    ) : (
                                        users.map((user) => (
                                            <label key={user.id} className="member-item">
                                                <input type="checkbox"
                                                checked={selectedUsers.includes(user.id)
                                                }
                                                onChange={() => handleMemberToggle(user.id)}
                                                className="member-checkbox"
                                                />
                                                {user.image ? (
                                                  <img src={user.image} alt={user.name || user.id}  className="member-avatar"/>
                                                ) : (
                                                    <div className="member-avatar member-avatar-placeholder">
                                                        <span>{(user.name || user.id).charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <span className="member-name">{user.name || user.id}</span>
                                            </label>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                )}

                {/* Description (Optional) */}

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea id="description" rows={3} value={channelDescription} onChange={(e) => setChannelDescription(e.target.value)}
                    placeholder="What's the channel about?"
                    className="form-textarea"
                    /> 
                </div>
                {/* Actions */}
                <div className="create-channel-modal__actions">
                    <button onClick={onClose} type="button" className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!channelName.trim() || isChannelCreating}>
                        {isChannelCreating ? "Creating..." : "Create Channel"}
                    </button>
                </div>
                </form>
                
            </div>
        </div>
    )

}

export default CreateChatModal;