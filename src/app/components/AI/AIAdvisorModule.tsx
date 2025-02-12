"use client";
import { useState } from "react";
import { Tabs, Card } from "antd";
import { BusinessAdvice } from "./BusinessAdvice";
import { InvestmentAdvice } from "./InvestmentAdvice";
import { HealthAnalysis } from "./HealthAnalysis";
import type { JournalEntryType } from "@/app/types/accounting";

interface AIAdvisorModuleProps {
  entries: JournalEntryType[];
}

export const AIAdvisorModule = ({ entries }: AIAdvisorModuleProps) => {
  const items = [
    {
      key: "1",
      label: "经营健康度",
      children: <HealthAnalysis entries={entries} />,
    },
    {
      key: "2",
      label: "经营建议",
      children: <BusinessAdvice entries={entries} />,
    },
    {
      key: "3",
      label: "投资分析",
      children: <InvestmentAdvice entries={entries} />,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card title="AI 智能助手">
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
}; 