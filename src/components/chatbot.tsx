"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Languages, MessageCircle, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  language?: "en" | "hi" | "kn";
}

export const Chatbot = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | "kn">("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with your anemia-related questions today?",
      sender: "bot",
      language: "en",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (lang: "en" | "hi" | "kn") => {
    setSelectedLanguage(lang);
    setMessages([
      {
        id: "lang_change",
        text: `Language changed to ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada"}.`,
        sender: "bot",
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    setIsLoading(true);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      language: selectedLanguage,
    };
    // Add user message immediately for better UX
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    const currentInputValue = inputValue; // Store inputValue as it will be cleared
    setInputValue("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInputValue, language: selectedLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const data = await response.json();
      const botResponse: Message = {
        id: Date.now().toString() + "_bot",
        text: data.reply || "Sorry, I couldn't get a response.",
        sender: "bot",
        language: selectedLanguage,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        text: error instanceof Error ? error.message : "An error occurred. Please try again.",
        sender: "bot", // Display error as a bot message
        language: selectedLanguage,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl flex flex-col h-[600px] shadow-xl">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
                <MessageCircle className="mr-2 h-6 w-6 text-primary" /> Anemia Support AI
            </CardTitle>
            <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
                <Button 
                    variant={selectedLanguage === "en" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => handleLanguageChange("en")}
                    className="text-xs px-2 py-1 h-auto"
                >
                    EN
                </Button>
                <Button 
                    variant={selectedLanguage === "hi" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => handleLanguageChange("hi")}
                    className="text-xs px-2 py-1 h-auto"
                >
                    HI
                </Button>
                <Button 
                    variant={selectedLanguage === "kn" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => handleLanguageChange("kn")}
                    className="text-xs px-2 py-1 h-auto"
                >
                    KN
                </Button>
            </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          Ask your questions about anemia. Powered by Gemini AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-3 ${ msg.sender === "user" ? "justify-end" : "justify-start" }`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${ 
                    msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder={isLoading ? "AI is thinking..." : `Type your message in ${selectedLanguage === "en" ? "English" : selectedLanguage === "hi" ? "Hindi" : "Kannada"}...`}
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && !isLoading && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 