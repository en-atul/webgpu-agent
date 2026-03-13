import { AppProviders } from "./app/providers";
import { RootLayout } from "./app/ui/RootLayout";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./app/ui/HomePage";
import { ChatbotPage } from "./features/chatbot/ui/ChatbotPage";
import { CopilotPage } from "./features/copilot/ui/CopilotPage";
import { SummarizerPage } from "./features/summarizer/ui/SummarizerPage";
import { KnowledgeBasePage } from "./features/knowledge-base/ui/KnowledgeBasePage";
import { WebSearchPage } from "./features/web-search/ui/WebSearchPage";

function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="copilot" element={<CopilotPage />} />
          <Route path="summarizer" element={<SummarizerPage />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="web-search" element={<WebSearchPage />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}

export default App;

