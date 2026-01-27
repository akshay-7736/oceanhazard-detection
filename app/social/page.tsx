import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SentimentAnalysis } from "@/components/sentiment-analysis"

export default function SocialPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Social Media Monitoring</h1>
            <SentimentAnalysis />
          </div>
        </main>
      </div>
    </div>
  )
}
