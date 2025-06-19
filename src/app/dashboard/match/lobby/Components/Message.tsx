import { useState } from "react";
import { CaretDoubleRight } from "@phosphor-icons/react"; // Assuming you're using Phosphor icons
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const playername = useAuth()?.user?.username || "Guest";
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "System",
      message: "Welcome to the Call of Duty Tournament Lobby!",
      time: "14:35",
    },
    {
      id: 2,
      sender: playername,
      message: "Hey everyone, let's warm up before the match",
      time: "14:36",
    },
    {
      id: 3,
      sender: "GhostShadow",
      message: "I'll be using sniper loadout for Search & Destroy",
      time: "14:37",
    },
    {
      id: 4,
      sender: "VipeR_X",
      message: "Sounds good, I'll cover mid",
      time: "14:37",
    },
  ]);

  // State to track input value
  const [inputMessage, setInputMessage] = useState("");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: playername,
      message: inputMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setInputMessage("");
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-5">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`${msg.sender === "System" ? "text-orange-400" : ""}`}
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
      </div>

      <div className="p-4 border-t border-gray-800 sm:p-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage} // Bind input value to state
            onChange={handleInputChange} // Update state on input change
            onKeyPress={handleKeyPress} // Handle Enter key
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleSendMessage} // Handle button click
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
