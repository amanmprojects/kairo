"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Step } from "react-joyride";

const Joyride = dynamic(
  () => import("react-joyride").then((mod: any) => mod.Joyride || mod.default || mod),
  { ssr: false }
) as any;

interface TourProps {
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  runTour?: boolean;
  setRunTour?: (run: boolean) => void;
}

export default function Tour({
  activeTab,
  setActiveTab,
  runTour,
  setRunTour,
}: TourProps) {
  const [internalRun, setInternalRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Auto-launch walkthrough shortly after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalRun(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (runTour) {
      setStepIndex(0);
    }
  }, [runTour]);

  const run = runTour !== undefined ? runTour : internalRun;
  const setRun = (val: boolean) => {
    setInternalRun(val);
    setRunTour?.(val);
  };

  const steps: any[] = [
    {
      target: ".tour-overview",
      title: "1. Executive Portfolio Overview",
      content: "Welcome to KIARO! Here you can see your repository's high-level health, active initiatives, and quarterly delivery metrics.",
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: ".tour-board",
      title: "2. Active Tasks & Kanban Board",
      content: "This is your GitHub-synced Kanban board. Issues, PRs, and story points move automatically based on GitHub activity.",
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: ".tour-pr",
      title: "3. PR Risk & Fragility Scanner",
      content: "KIARO highlights high-risk pull requests by scanning for decision drift, fragile modules, and historical bugs.",
      disableBeacon: true,
      placement: "right",
    },
    {
      target: ".tour-decisions",
      title: "4. Decision Drift & Architectural Invariants",
      content: "KIARO continuously tracks your architectural decisions, detecting drift when recent code contradicts past decisions.",
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: ".tour-ask",
      title: "5. Ask KIARO Knowledge Graph",
      content: "Ask KIARO questions about your codebase! It uses a temporal knowledge graph to provide evidence-backed answers with citations.",
      disableBeacon: true,
      placement: "top",
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;

    if (status === "finished" || status === "skipped" || action === "close") {
      setRun(false);
      setStepIndex(0);
      return;
    }

    if (type === "step:after" || type === "error:target_not_found") {
      const nextIndex = index + (action === "prev" ? -1 : 1);

      if (nextIndex >= 0 && nextIndex < steps.length) {
        // Automatically switch the page tab to match the walkthrough step!
        if (nextIndex === 0) {
          setActiveTab?.("overview");
        } else if (nextIndex === 1 || nextIndex === 2) {
          setActiveTab?.("board");
        } else if (nextIndex === 3) {
          setActiveTab?.("impact");
        } else if (nextIndex === 4) {
          setActiveTab?.("ask");
        }

        // Allow React a moment to mount the target element in the new tab
        setTimeout(() => {
          setStepIndex(nextIndex);
        }, 200);
      } else {
        setRun(false);
        setStepIndex(0);
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      spotlightClicks
      styles={{
        options: {
          primaryColor: "#321c64",
          textColor: "#0f172a",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
          overlayColor: "rgba(15, 23, 42, 0.4)",
          zIndex: 10000,
        },
        buttonClose: {
          display: "none",
        },
        buttonNext: {
          backgroundColor: "#321c64",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "600",
          padding: "6px 14px",
          outline: "none",
        },
        buttonBack: {
          color: "#64748b",
          fontSize: "12px",
          fontWeight: "500",
          marginRight: "8px",
        },
        buttonSkip: {
          color: "#94a3b8",
          fontSize: "11px",
        },
        tooltip: {
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "18px",
          maxWidth: "420px",
        },
        tooltipTitle: {
          fontSize: "14px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "6px",
        },
        tooltipContent: {
          fontSize: "12px",
          lineHeight: "1.6",
          color: "#475569",
        },
      }}
    />
  );
}
