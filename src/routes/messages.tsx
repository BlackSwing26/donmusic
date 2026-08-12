import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/messages")({
  component: MessagesRoute,
});

type Profile = {
  id: string;
  full_name: string;
  role: string;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read?: boolean;
};

function MessagesRoute() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [contacts, setContacts] = useState<Profile[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthAndLoadContacts();
  }, [navigate]);

  useEffect(() => {
    if (selectedContactId) {
      loadMessages(selectedContactId);
    }
  }, [selectedContactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkAuthAndLoadContacts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: "/login" });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setCurrentUser(profile);
    }

    // Fetch all profiles for now (since it's a small school)
    // Filter out the current user so they don't chat with themselves
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .neq('id', session.user.id)
      .order('full_name', { ascending: true });

    if (profilesData) {
      setContacts(profilesData);
    }
    
    setLoading(false);
  };

  const loadMessages = async (contactId: string) => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });

    if (data && !error) {
      setMessages(data as Message[]);
      
      // Mark incoming messages as read
      const unreadIncoming = data.filter(m => m.receiver_id === currentUser.id && m.is_read === false);
      if (unreadIncoming.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadIncoming.map(m => m.id));
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedContactId || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUser.id,
          receiver_id: selectedContactId,
          content: newMessage.trim()
        }]);

      if (error) throw error;
      
      setNewMessage("");
      // Refresh messages
      loadMessages(selectedContactId);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading communications...</div>;
  }

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  // Group contacts by role for the sidebar
  const adminContacts = contacts.filter(c => c.role === 'admin');
  const teacherContacts = contacts.filter(c => c.role === 'teacher');
  const studentContacts = contacts.filter(c => c.role === 'student');

  return (
    <AppLayout role={currentUser?.role as any} title="Communications">
      <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex gap-6">
        
        {/* Contacts Sidebar */}
        <div className="w-1/3 bg-slate-custom/30 border border-white/5 rounded-sm flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-serif text-2xl">Contacts</h2>
          </div>
          <div className="overflow-y-auto flex-grow">
            
            {/* Admins */}
            {adminContacts.length > 0 && (
              <div className="mb-4">
                <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-black/20">Administration</div>
                {adminContacts.map(contact => (
                  <button 
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full text-left px-6 py-3 transition-colors ${
                      selectedContactId === contact.id ? 'bg-gold/10 border-l-2 border-gold text-gold' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {contact.full_name}
                  </button>
                ))}
              </div>
            )}

            {/* Teachers */}
            {teacherContacts.length > 0 && (
              <div className="mb-4">
                <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-black/20">Faculty</div>
                {teacherContacts.map(contact => (
                  <button 
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full text-left px-6 py-3 transition-colors ${
                      selectedContactId === contact.id ? 'bg-gold/10 border-l-2 border-gold text-gold' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {contact.full_name}
                  </button>
                ))}
              </div>
            )}

            {/* Students */}
            {studentContacts.length > 0 && (
              <div className="mb-4">
                <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-black/20">Students</div>
                {studentContacts.map(contact => (
                  <button 
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full text-left px-6 py-3 transition-colors ${
                      selectedContactId === contact.id ? 'bg-gold/10 border-l-2 border-gold text-gold' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {contact.full_name}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-slate-custom/30 border border-white/5 rounded-sm flex flex-col h-full">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                <h3 className="font-serif text-2xl text-gold">{selectedContact.full_name}</h3>
                <button 
                  onClick={() => loadMessages(selectedContact.id)}
                  className="text-[10px] uppercase tracking-widest px-3 py-1 border border-white/10 hover:bg-white/10 rounded-sm"
                >
                  Refresh
                </button>
              </div>
              
              {/* Messages Area */}
              <div className="flex-grow p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                    No messages yet. Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender_id === currentUser?.id;
                    const date = new Date(msg.created_at);
                    
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-sm ${
                          isMine 
                            ? 'bg-gold text-onyx' 
                            : 'bg-black/40 border border-white/10 text-foreground'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <span className={`text-[10px] block mt-2 ${isMine ? 'text-onyx/70' : 'text-muted-foreground'}`}>
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <div className="p-4 border-t border-white/5 bg-black/20">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-gold text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gold text-onyx text-[10px] font-bold uppercase tracking-widest hover:bg-gold/90 transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col text-center p-8">
              <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <span className="text-gold text-2xl font-serif">💬</span>
              </div>
              <h3 className="font-serif text-2xl text-gold mb-2">Select a Contact</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Choose a person from the sidebar to view your conversation history and send new messages.
              </p>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
