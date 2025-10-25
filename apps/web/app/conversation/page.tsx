"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface Message {
  id: number;
  sender: 'ai' | 'tenant';
  text: string;
  timestamp: string;
}

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTenantTyping, setIsTenantTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [conversationComplete, setConversationComplete] = useState(false);

  const conversationData: Message[] = [
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your AI Property Manager. I'm here to help with any maintenance issues or questions you have. What can I assist you with today?",
      timestamp: "2:34 PM"
    },
    {
      id: 2,
      sender: 'tenant',
      text: "Hi, my kitchen faucet is leaking really badly. It's been dripping for hours.",
      timestamp: "2:35 PM"
    },
    {
      id: 3,
      sender: 'ai',
      text: "I understand this is urgent. Let me help you right away. Can you turn off the water supply under the sink to stop the leak?",
      timestamp: "2:35 PM"
    },
    {
      id: 4,
      sender: 'tenant',
      text: "Yes, I found the valve and turned it off. The dripping has stopped.",
      timestamp: "2:36 PM"
    },
    {
      id: 5,
      sender: 'ai',
      text: "Great! I'm contacting a licensed plumber from our approved vendor network. Let me check availability...",
      timestamp: "2:36 PM"
    },
    {
      id: 6,
      sender: 'ai',
      text: "Perfect! I've found a licensed plumber who can come today. They have availability at 4:00 PM today. Should I book this appointment?",
      timestamp: "2:37 PM"
    },
    {
      id: 7,
      sender: 'tenant',
      text: "Yes, please book it! 4 PM works perfectly.",
      timestamp: "2:37 PM"
    },
    {
      id: 8,
      sender: 'ai',
      text: "Excellent! Your appointment is confirmed for today at 4:00 PM. I'll send you a text confirmation with the technician's name and contact info. Is there anything else I can help you with?",
      timestamp: "2:38 PM"
    },
    {
      id: 9,
      sender: 'tenant',
      text: "No, that's perfect! Thank you so much. This was so much easier than trying to call the property manager directly.",
      timestamp: "2:38 PM"
    },
    {
      id: 10,
      sender: 'ai',
      text: "You're very welcome! I'm here 24/7 whenever you need assistance. You'll receive a text with appointment details shortly. Have a great day!",
      timestamp: "2:38 PM"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentMessageIndex < conversationData.length) {
        const nextMessage = conversationData[currentMessageIndex];
        
        // Show typing indicator for the sender
        if (nextMessage.sender === 'ai') {
          setIsTyping(true);
          setIsTenantTyping(false);
        } else {
          setIsTenantTyping(true);
          setIsTyping(false);
        }
        
        setTimeout(() => {
          setMessages(prev => [...prev, nextMessage]);
          setCurrentMessageIndex(prev => prev + 1);
          setIsTyping(false);
          setIsTenantTyping(false);
          
          // Check if conversation is complete
          if (currentMessageIndex + 1 >= conversationData.length) {
            setConversationComplete(true);
          }
        }, 1500);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentMessageIndex]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, isTyping, isTenantTyping]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHomeLink={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Conversation Demo</h1>
            <p className="text-gray-600 mt-2">
              Watch our AI Property Manager handle tenant calls in real-time
            </p>
          </div>

          {/* Conversation Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Phone Header */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">AI Property Manager</div>
                <div className="text-xs text-gray-300">Call in progress</div>
              </div>
              <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">AI</span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div id="messages-container" className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.sender === 'tenant' ? 'justify-end' : ''}`}>
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-lg max-w-xs ${
                    message.sender === 'ai' 
                      ? 'bg-blue-50' 
                      : 'bg-green-50'
                  }`}>
                    <p className="text-gray-800 text-sm">
                      {message.text}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp}
                    </div>
                  </div>
                  
                  {message.sender === 'tenant' && (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                  )}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tenant Typing Indicator */}
              {isTenantTyping && (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                </div>
              )}
            </div>

            {/* Call Summary - Only show when conversation is complete */}
            {conversationComplete && (
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">Call Duration:</span> 4 minutes
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Issue:</span> Urgent - Water leak
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Status:</span> 
                    <span className="text-green-600 font-medium ml-1">Appointment Booked</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Features Highlight - Only show when conversation is complete */}
          {conversationComplete && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Just Happened?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Immediate Response</h4>
                      <p className="text-sm text-gray-600">AI understood urgency and provided immediate guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Smart Triage</h4>
                      <p className="text-sm text-gray-600">Classified as urgent water leak requiring immediate attention</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Automatic Booking</h4>
                      <p className="text-sm text-gray-600">Found and booked same-day appointment with licensed plumber</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">End-to-End Service</h4>
                      <p className="text-sm text-gray-600">Complete resolution from call to appointment confirmation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}