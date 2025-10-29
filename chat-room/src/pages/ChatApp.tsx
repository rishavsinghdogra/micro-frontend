import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Users, LogOut, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
const DEFAULT_ROOM = 'general';

interface User {
  id?: string;
  username: string;
}

interface Message {
  id?: string;
  content: string;
  user?: User;
  createdAt?: string;
  timestamp?: Date;
  type?: 'system' | 'user';
}

interface UserJoinedData {
  username: string;
  message: string;
}

interface TypingData {
  username: string;
  isTyping: boolean;
}

interface ServerToClientEvents {
  connect: () => void;
  receive_message: (message: Message) => void;
  user_joined: (data: UserJoinedData) => void;
  user_left: (data: UserJoinedData) => void;
  user_typing: (data: TypingData) => void;
  online_users: (users: string[]) => void;
}

interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  send_message: (data: { roomId: string; content: string }) => void;
  typing_start: (roomId: string) => void;
  typing_stop: (roomId: string) => void;
}



type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export default function ChatApp() {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectSocket = () => {
    const guestName = username || `Guest${Math.floor(Math.random() * 1000)}`;
    setUsername(guestName);

    const newSocket: SocketType = io(SOCKET_URL, {
      auth: { username: guestName }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join_room', DEFAULT_ROOM);
      setIsJoined(true);
    });

    newSocket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_joined', (data: UserJoinedData) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: data.message,
        timestamp: new Date()
      }]);
    });

    newSocket.on('user_left', (data: UserJoinedData) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: data.message,
        timestamp: new Date()
      }]);
    });

    newSocket.on('user_typing', (data: TypingData) => {
      if (data.isTyping) {
        setTypingUsers(prev => new Set([...prev, data.username]));
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.username);
          return newSet;
        });
      }
    });

    newSocket.on('online_users', (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  };

  const handleJoin = () => {
    connectSocket();
  };

  const handleSendMessage = () => {
    console.log('Sending message:', messageInput)
    if (!messageInput.trim() || !socket) return;

    socket.emit('send_message', {
      roomId: DEFAULT_ROOM,
      content: messageInput
    });

    setMessageInput('');
    socket.emit('typing_stop', DEFAULT_ROOM);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (!socket) return;

    socket.emit('typing_start', DEFAULT_ROOM);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', DEFAULT_ROOM);
    }, 1000);
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave_room', DEFAULT_ROOM);
      socket.disconnect();
    }
    setIsJoined(false);
    setMessages([]);
    setUsername('');
    setSocket(null);
  };

  const getInitials = (name: string): string => {
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Join Chatroom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Enter your name (optional)
                </label>
                <Input
                  type="text"
                  placeholder="Leave empty for guest name..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                  className="w-full"
                />
              </div>
              <Button onClick={handleJoin} className="w-full">
                Join Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-2rem)]">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Online Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-neutral-100 rounded-lg">
                <Avatar className={`${getAvatarColor(username)} w-8 h-8`}>
                  <AvatarFallback className="text-white text-xs">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{username}</div>
                  <Badge variant="outline" className="text-xs">You</Badge>
                </div>
              </div>
              {onlineUsers.filter(u => u !== username).map((user, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2">
                  <Avatar className={`${getAvatarColor(user)} w-8 h-8`}>
                    <AvatarFallback className="text-white text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium truncate">{user}</div>
                </div>
              ))}
            </div>
            <Button
              onClick={handleLeave}
              variant="outline"
              className="w-full mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Room
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">General Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  if (msg.type === 'system') {
                    return (
                      <div key={idx} className="text-center">
                        <span className="text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  const isOwnMessage = msg.user?.username === username;

                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className={`${getAvatarColor(msg.user?.username || 'Unknown')} w-8 h-8 flex-shrink-0`}>
                        <AvatarFallback className="text-white text-xs">
                          {getInitials(msg.user?.username || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-neutral-700">
                            {msg.user?.username || 'Unknown'}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString()}
                          </span>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg max-w-md ${
                            isOwnMessage
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-900'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              {typingUsers.size > 0 && (
                <div className="flex items-center gap-2 mt-4 text-sm text-neutral-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
