import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Code2, Heart } from 'lucide-react';
import { Chatbot } from "@/components/chatbot";
import { ReportUploader } from "@/components/report-uploader";
import { ElevenLabsWidget } from "@/components/elevenlabs-widget";

export default function HomePage() {
  const elevenLabsAgentId = "NCWfAuaPEeKMlselVnSk";

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-800 font-sans">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-neutral-950"><div className="fixed bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF22,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#0077ff22,transparent)]"></div></div>
      
      <header className="my-10 md:my-16 text-center w-full max-w-4xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          Anemia Support Hub
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered companion for understanding and managing anemia. Chat with our assistant or upload your blood reports for personalized insights.
        </p>
      </header>

      <div className="grid gap-12 md:gap-16 lg:grid-cols-2 w-full max-w-6xl px-4 items-start">
        <Chatbot /> 
        <ReportUploader />
      </div>

      <footer className="mt-16 mb-8 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center space-x-1.5">
          <span>Made with</span>
          <Code2 className="h-4 w-4 text-pink-500" />
          <span>and</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" /> 
          <span>by{' '}</span>
          <a 
            href="https://github.com/0xtaufeeq" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-medium text-primary hover:underline underline-offset-2"
          >
            Taufeeq Riyaz
          </a>
        </div>
      </footer>

      <div className="fixed bottom-8 right-8 z-50">
        <ElevenLabsWidget agentId={elevenLabsAgentId} />
      </div>
    </main>
  );
}
