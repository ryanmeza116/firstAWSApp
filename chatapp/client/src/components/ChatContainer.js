import React, {useState, useEffect} from 'react'
import socketIOClient from 'socket.io-client';
import ChatBoxReceiver, { ChatBoxSender } from './ChatBox';
import InputText from './InputText';
import UserLogin from './UserLogin';

import {
    doc,
    setDoc,
    collection,
    serverTimestamp,
    query,
    onSnapshot,
    orderBy, 
} from 'firebase/firestore';
import db from './firebaseConfig/firebaseConfig'



export default function ChatContainer() {
    let socketio = socketIOClient('http://localhost:5001')
    const [chats, setChats] = useState([])
    const [user, setUser] = useState(localStorage.getItem('user'))
    const avatar = localStorage.getItem('avatar')
    const chatsRef = collection(db, "Messages")
    

    useEffect (() => {
        socketio.on('chat', senderChats => {
            setChats(senderChats)
        })
    })

    useEffect(() => {
        const q = query(chatsRef , orderBy('createdAt', 'asc'))

        const unsub = onSnapshot(q, (querySnapshot) => {
            const fireChats = []
            querySnapshot.forEach(doc => {
                fireChats.push(doc.data())
            });
            setChats([...fireChats])
        })
        return () => {
            unsub()
        }
    }, [])

    function addtoFirebase(chat){
        const newChat = {
            avatar,
            createdAt: serverTimestamp(),
            user, 
            message: chat.message
        }
        const chatRef = doc(chatsRef)
        setDoc(chatRef , newChat)
        .then (() => console.log('Chat sucessfully added'))
        .catch(console.log)
    }

    function sendChatToSocket(chat) {
        socketio.emit('chat', chat)

    }

    function addMessage(chat) {
        const newChat = {...chat, user:localStorage.getItem('user'), avatar}
        addtoFirebase(chat)
        setChats([...chats, newChat])
        sendChatToSocket([...chats, newChat])
    }

    function logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('avatar')
        setUser('')
    }

    function ChatsList( ) {

        return chats.map((chat, index) => {
            console.log(chat.avatar);
            if(chat.user === user) return <ChatBoxSender key = {index} message = {chat.message} avatar = {chat.avatar} user = {chat.user} />
            return <ChatBoxReceiver key = {index} message = {chat.message} avatar = {chat.avatar} user = {chat.user}/>
        })
    }
return (
<div>
    {
    user? 
    <div>
        <div style = {{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <h4>UserName : {user} </h4>
            <p onClick = {() => logout()} style = {{color:'blue', cursor:'pointer'}}> Log Out </p>
        </div>

        <ChatsList/>
        <InputText addMessage={addMessage} />
    </div> 
    : 
    <UserLogin setUser = {setUser} /> 
    }
</div>
)
}
