import React from "react";

function ChatRoom({ user, typing, message, onSendMessage, onTextChange, onLogout }) {
    return <Chat user={user} typing={typing} message={message} onSendMessage={onSendMessage} onTextChange={onTextChange} onLogout={onLogout} />;
}
export default ChatRoom;