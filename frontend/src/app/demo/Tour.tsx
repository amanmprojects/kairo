"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Step } from "react-joyride";

const Joyride = dynamic(
  () => import("react-joyride").then((mod: any) => mod.Joyride || mod.default || mod),
  { ssr: false }
) as any;

export default function Tour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Start the tour shortly after component mounts
    const timer = setTimeout(() => {
      setRun(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const steps: any[] = [
    {
      target: ".tour-overview",
      content: "Welcome to KIARO! Here you can see your repository's high-level health and delivery metrics.",
      disableBeacon: true,
    },
    {
      target: ".tour-board",
      content: "This is your GitHub-synced Kanban board. Issues and PRs move automatically based on GitHub activity.",
    },
    {
      target: ".tour-pr",
      content: "KIARO highlights high-risk PRs by scanning for decision drift, fragile modules, and historical bugs.",
    },
    {
      target: ".tour-decisions",
      content: "KIARO continuously tracks your architectural decisions, detecting drift when recent code contradicts past decisions.",
    },
    {
      target: ".tour-ask",
      content: "Ask KIARO questions about your codebase! It uses a temporal knowledge graph to provide evidence-backed answers with citations.",
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#14b8a6', // teal-500
          textColor: '#f4f4f5', // zinc-50
          backgroundColor: '#18181b', // zinc-900
          arrowColor: '#18181b',
        },
        buttonClose: {
          display: 'none',
        },
        buttonNext: {
          backgroundColor: '#14b8a6',
        },
        buttonBack: {
          color: '#a1a1aa', // zinc-400
        },
        buttonSkip: {
          color: '#a1a1aa',
        }
      }}
    />
  );
}
