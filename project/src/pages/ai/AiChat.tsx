import { useState, useRef, useEffect } from 'react';
import { Send, Info, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toaster';

// Typing for messages
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Typing for missing information items
interface MissingInfoItem {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Typing for to-do prompts
interface TodoPrompt {
  id: string;
  description: string;
  completed: boolean;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for requirements engineering. Tell me about your project needs or upload documents, and I\'ll help you extract and organize detailed requirements.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [missingInfo, setMissingInfo] = useState<MissingInfoItem[]>([]);
  const [todoPrompts, setTodoPrompts] = useState<TodoPrompt[]>([]);
  
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Sample AI responses for demo
  const demoResponses: Record<string, string> = {
    default: "I'm analyzing your input. Can you provide more specific details about functional requirements for this feature?",
    
    requirement: `Based on your description, I've identified these requirements:

1. Functional Requirement: User authentication system
   - Users must be able to register with email and password
   - System should support SSO options (Google, Microsoft)
   - Password reset functionality is required

2. Non-Functional Requirement: Performance
   - System should load within 2 seconds on standard connections
   - Authentication process should complete within 1 second

Would you like me to add these to your requirements list?`,
    
    question: "To better understand the scope, could you clarify the following:\n\n1. What user roles need to be supported in the system?\n2. Are there any specific security compliance requirements (e.g., GDPR, HIPAA)?\n3. What is the expected user volume for this system?",
    
    analysis: "After analyzing your project description, I've identified potential gaps in your requirements. The performance criteria aren't fully specified, and there's no mention of data retention policies. Would you like me to suggest some standard requirements for these areas?",
  };

  // Function to simulate AI response
  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Determine which response to use based on user input
    let responseType = 'default';
    
    if (userMessage.toLowerCase().includes('requirement')) {
      responseType = 'requirement';
      
      // Add missing info items for requirements
      setTimeout(() => {
        setMissingInfo(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            description: 'Missing authentication timeout specifications',
            severity: 'medium',
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            description: 'No security requirements defined for password complexity',
            severity: 'high',
          },
        ]);
        
        // Add todo prompts
        setTodoPrompts(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            description: 'Define password complexity rules',
            completed: false,
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            description: 'Specify authentication timeout period',
            completed: false,
          },
        ]);
      }, 1500);
    } else if (userMessage.toLowerCase().includes('question') || userMessage.endsWith('?')) {
      responseType = 'question';
    } else if (userMessage.toLowerCase().includes('analyze')) {
      responseType = 'analysis';
    }
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        {
          id: Date.now().toString(),
          content: demoResponses[responseType],
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  // Send a message
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate AI response
    simulateAIResponse(inputValue);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle todo item toggle
  const toggleTodoItem = (id: string) => {
    setTodoPrompts(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    
    toast({
      title: 'Todo Updated',
      message: 'Your todo item has been updated',
      type: 'success',
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex-none mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          AI Chat Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Extract and refine requirements through conversation
        </p>
      </div>
      
      <div className="flex-1 flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        {/* Main chat window */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Message container */}
          <div 
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-3xl rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary-100 text-gray-900 dark:bg-primary-900 dark:text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {message.content}
                  </pre>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-gray-500 dark:text-gray-400 text-right'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="flex-none p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 resize-none"
                  rows={3}
                />
              </div>
              <Button
                onClick={sendMessage}
                className="h-10 w-10 p-0"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={18} />
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Info size={12} className="inline mr-1" />
              Press Enter to send, Shift+Enter for a new line
            </div>
          </div>
        </div>
        
        {/* Sidebar with flags and prompts */}
        <div className="w-72 border-l border-gray-200 dark:border-gray-700 flex-none hidden md:block overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <AlertCircle size={14} className="mr-1 text-warning-500" />
              Missing Information
            </h3>
            
            {missingInfo.length > 0 ? (
              <div className="mt-2 space-y-2">
                {missingInfo.map((item) => (
                  <div
                    key={item.id}
                    className={`text-xs p-2 rounded-md ${
                      item.severity === 'high'
                        ? 'bg-error-50 text-error-800 dark:bg-error-900/20 dark:text-error-300'
                        : item.severity === 'medium'
                        ? 'bg-warning-50 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                        : 'bg-info-50 text-info-800 dark:bg-info-900/20 dark:text-info-300'
                    }`}
                  >
                    {item.description}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                No missing information detected yet
              </div>
            )}
            
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-6 flex items-center">
              <CheckCircle size={14} className="mr-1 text-success-500" />
              To-Do Prompts
            </h3>
            
            {todoPrompts.length > 0 ? (
              <div className="mt-2 space-y-2">
                {todoPrompts.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-start p-2 rounded-md ${
                      todo.completed
                        ? 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                        : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodoItem(todo.id)}
                      className="mr-2 mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <div className="text-xs">
                      <span className={todo.completed ? 'line-through' : ''}>
                        {todo.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                No to-do prompts yet
              </div>
            )}
            
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
              Suggested Questions
            </h3>
            
            <div className="mt-2 space-y-2">
              {[
                'What authentication methods should be supported?',
                'What are the response time requirements?',
                'Are there specific regulatory requirements?',
                'What user roles need to be defined?',
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(question);
                    // Focus the textarea
                    const textarea = document.querySelector('textarea');
                    if (textarea) textarea.focus();
                  }}
                  className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 rounded-md text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <ChevronRight size={14} className="mr-1 text-primary-500" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;