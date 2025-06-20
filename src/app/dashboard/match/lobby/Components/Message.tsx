import { useState, useEffect, useRef } from "react";
import { CaretDoubleRight } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  type: "system" | "user";
}

interface ChatProps {
  sendChatMessage?: (message: string) => void;
  messages?: ChatMessage[];
}

const Chat = ({ sendChatMessage, messages = [] }: ChatProps) => {
  const { user } = useAuth();
  const playername = user?.username || "Guest";
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (inputMessage.trim() === "" || !sendChatMessage) return;

    sendChatMessage(inputMessage.trim());
    setInputMessage("");
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col justify_auto overflow-hidden">
      <div className="chatContainer flex-1 overflow-y-auto p-4 space-y-4 sm:p-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`transIn ${
              msg.type === "system" ? "text-orange-400" : ""
            }`}
          >
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span
                className={`font-medium ${
                  msg.sender === playername ? "text-orange-400" : ""
                }`}
              >
                {msg.sender}
              </span>
              <span>{msg.time}</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-sm sm:p-3">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 !h-max !flex-none max-h-max border-t border-gray-800 sm:p-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-8"
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-2 top-2 text-orange-400 hover:text-orange-500"
          >
            <CaretDoubleRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
