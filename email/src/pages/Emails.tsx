import  { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Send, Paperclip, X, Inbox, Mail, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  attachments?: string[];
}

interface EmailsResponse {
  emails: Email[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  attachments: File[];
}

const fetchEmails = async (page: number, pageSize: number, search: string): Promise<EmailsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockEmails: Email[] = Array.from({ length: 50 }, (_, i) => ({
    id: `email-${i + 1}`,
    from: `sender${i + 1}@example.com`,
    to: 'you@example.com',
    subject: `Email Subject ${i + 1}`,
    body: `This is the body of email ${i + 1}. It contains some interesting information about various topics.`,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    read: i % 3 === 0,
    attachments: i % 5 === 0 ? [`file${i}.pdf`, `doc${i}.docx`] : undefined,
  }));

  const filtered = search 
    ? mockEmails.filter(e => 
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.from.toLowerCase().includes(search.toLowerCase()) ||
        e.body.toLowerCase().includes(search.toLowerCase())
      )
    : mockEmails;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    emails: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
};

const fetchEmailById = async (id: string): Promise<Email> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id,
    from: 'sender@example.com',
    to: 'you@example.com',
    subject: `Email Subject for ${id}`,
    body: `This is the detailed body of email ${id}. It contains comprehensive information and details that you need to read carefully.`,
    date: new Date().toISOString(),
    read: true,
    attachments: ['document.pdf', 'image.png'],
  };
};

const sendEmail = async (payload: SendEmailPayload): Promise<void> => {
  await axios.post('localhost:3000/api/email/send', payload);
};


const EmailList: React.FC<{
  onSelectEmail: (id: string) => void;
  selectedEmailId: string | null;
}> = ({ onSelectEmail, selectedEmailId }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const pageSize = 20;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['emails', page, pageSize, debouncedSearch],
    queryFn: () => fetchEmails(page, pageSize, debouncedSearch),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Error loading emails
          </div>
        ) : (
          <div className="divide-y">
            {data?.emails.map((email) => (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                  selectedEmailId === email.id ? 'bg-neutral-100' : ''
                } ${!email.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`font-medium text-sm ${!email.read ? 'font-semibold' : ''}`}>
                    {email.from}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(email.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={`text-sm mb-1 ${!email.read ? 'font-semibold' : ''}`}>
                  {email.subject}
                </div>
                <div className="text-xs text-neutral-600 truncate">
                  {email.body}
                </div>
                {email.attachments && (
                  <div className="flex items-center gap-1 mt-2">
                    <Paperclip className="h-3 w-3 text-neutral-400" />
                    <span className="text-xs text-neutral-500">
                      {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {data && (
        <div className="p-4 border-t flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, data.total)} of {data.total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const EmailView: React.FC<{ emailId: string }> = ({ emailId }) => {
  const { data: email, isLoading } = useQuery({
    queryKey: ['email', emailId],
    queryFn: () => fetchEmailById(emailId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!email) return null;

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{email.subject}</h1>
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <div className="font-medium">{email.from}</div>
          <div className="text-sm text-neutral-500">to {email.to}</div>
        </div>
        <div className="text-sm text-neutral-500">
          {new Date(email.date).toLocaleString()}
        </div>
      </div>

      <div className="whitespace-pre-wrap mb-6">{email.body}</div>

      {email.attachments && email.attachments.length > 0 && (
        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">Attachments</div>
          <div className="flex flex-wrap gap-2">
            {email.attachments.map((attachment, i) => (
              <Badge key={i} variant="secondary" className="px-3 py-2">
                <Paperclip className="h-3 w-3 mr-2" />
                {attachment}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ComposeDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setOpen(false);
      setTo('');
      setSubject('');
      setBody('');
      setAttachments([]);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    mutation.mutate({ to, subject, body, attachments });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="Message body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
          />
          
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-2">
                  <Paperclip className="h-3 w-3 mr-2" />
                  {file.name}
                  <button
                    onClick={() => removeAttachment(i)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="outline" type="button" asChild>
                <span>
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Files
                </span>
              </Button>
            </label>
            
            <Button onClick={handleSend} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Emails: React.FC = () => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  return (
    <div className="h-screen flex bg-neutral-50">
      {/* Email List */}
      <div className="w-96 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Inbox</h1>
          </div>
          <ComposeDialog />
        </div>
        <EmailList 
          onSelectEmail={setSelectedEmailId} 
          selectedEmailId={selectedEmailId}
        />
      </div>

      {/* Email View */}
      <div className="flex-1 bg-white">
        {selectedEmailId ? (
          <EmailView emailId={selectedEmailId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <Mail className="h-16 w-16 mb-4" />
            <p>Select an email to view</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Emails

