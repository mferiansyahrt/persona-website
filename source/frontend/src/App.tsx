import BackgroundCanvas from "./components/BackgroundCanvas";
import Nav from "./components/Nav";
import Curtain from "./components/Curtain";
import PageMeta from "./components/PageMeta";
import ChatAssistant from "./components/ChatAssistant";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Work from "./pages/Work";
import Record from "./pages/Record";
import Contact from "./pages/Contact";
import type { ComponentType } from "react";
import { RouterProvider, useRouter } from "./lib/router";
import { ChatProvider } from "./lib/chat";
import type { PageId } from "./types";

const PAGES: Record<PageId, ComponentType> = {
  about: About, experience: Experience, work: Work, record: Record, contact: Contact,
};

function Shell() {
  const { current } = useRouter();
  const Page = PAGES[current];
  return (
    <>
      <BackgroundCanvas scene={current} />
      <div className="scan" />
      <div className="frame" />
      <Curtain />
      <Nav />
      <PageMeta />
      <div className="viewport">
        <Page key={current} />
      </div>
      <ChatAssistant />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ChatProvider>
        <Shell />
      </ChatProvider>
    </RouterProvider>
  );
}
