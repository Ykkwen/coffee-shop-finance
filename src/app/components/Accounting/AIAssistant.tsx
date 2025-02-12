"use client";
import { useState } from 'react';
import { Input, Button, Card, Table, message, Modal, Space, Tag } from 'antd';
import type { JournalEntryType } from '@/app/types/accounting';

const { TextArea } = Input;

interface AIAssistantProps {
  entries: JournalEntryType[];
  onNewEntry: (entry: JournalEntryType) => void;
}

// 示例业务描述
const examples = [
  {
    text: '收到客户现金支付的咖啡费用 150 元',
    type: '现金收入',
  },
  {
    text: '通过微信收款 280 元',
    type: '移动支付',
  },
  {
    text: '支付本月房租 5000 元，使用银行转账',
    type: '费用支出',
  },
  {
    text: '采购咖啡豆，赊账 2000 元',
    type: '采购支出',
  },
  {
    text: '支付水电费 800 元，使用现金',
    type: '费用支出',
  },
  {
    text: '收到上月赊账客户还款 1500 元',
    type: '收回账款',
  },
];

export const AIAssistant = ({ entries, onNewEntry }: AIAssistantProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewEntry, setPreviewEntry] = useState<JournalEntryType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '借方科目',
      dataIndex: 'debitAccount',
      key: 'debitAccount',
    },
    {
      title: '借方金额',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
    },
    {
      title: '贷方科目',
      dataIndex: 'creditAccount',
      key: 'creditAccount',
    },
    {
      title: '贷方金额',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // 模拟 AI 处理自然语言生成会计分录
  const processNaturalLanguage = (text: string): JournalEntryType => {
    // 这里是示例的处理逻辑，实际项目中应该调用 AI API
    const amount = text.match(/\d+/)?.[0] || '1000';
    const isIncome = text.includes('收到') || text.includes('收款');
    const isCash = text.includes('现金');

    if (isIncome) {
      return {
        key: Date.now(),
        debitAccount: isCash ? '现金' : '银行存款',
        debitAmount: Number(amount),
        creditAccount: '营业收入',
        creditAmount: Number(amount),
        description: text.trim(),
        date: new Date().toISOString(),
      };
    } else {
      return {
        key: Date.now(),
        debitAccount: text.includes('采购') ? '库存商品' : '费用',
        debitAmount: Number(amount),
        creditAccount: text.includes('赊') ? '应付账款' : (isCash ? '现金' : '银行存款'),
        creditAmount: Number(amount),
        description: text.trim(),
        date: new Date().toISOString(),
      };
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      message.warning('请输入业务描述');
      return;
    }

    setLoading(true);
    try {
      const generatedEntry = processNaturalLanguage(input);
      setPreviewEntry(generatedEntry);
      setIsModalVisible(true);
    } catch (error) {
      message.error('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (previewEntry) {
      onNewEntry(previewEntry);
      setInput('');
      setIsModalVisible(false);
      setPreviewEntry(null);
      message.success('记账成功');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setPreviewEntry(null);
  };

  const previewColumns = [
    {
      title: '借方科目',
      dataIndex: 'debitAccount',
      key: 'debitAccount',
    },
    {
      title: '借方金额',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
    },
    {
      title: '贷方科目',
      dataIndex: 'creditAccount',
      key: 'creditAccount',
    },
    {
      title: '贷方金额',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // 添加示例点击处理函数
  const handleExampleClick = (text: string) => {
    setInput(text);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card title="AI 记账助手" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, color: '#666' }}>常见业务示例：</div>
          <Space wrap size={[8, 16]} style={{ marginBottom: 16 }}>
            {examples.map((example, index) => (
              <Tag
                key={index}
                color="blue"
                style={{ cursor: 'pointer', padding: '4px 8px' }}
                onClick={() => handleExampleClick(example.text)}
              >
                {example.type}: {example.text}
              </Tag>
            ))}
          </Space>
        </div>
        <TextArea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入业务描述，或点击上方示例直接使用"
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={handleGenerate} loading={loading}>
          生成会计分录
        </Button>
      </Card>

      <Card title="记账记录">
        <Table 
          columns={columns} 
          dataSource={entries} 
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
        />
      </Card>

      <Modal
        title="确认会计分录"
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        width={800}
      >
        <p>AI 已根据您的描述生成以下会计分录，请确认：</p>
        <Table
          columns={previewColumns}
          dataSource={previewEntry ? [previewEntry] : []}
          pagination={false}
        />
      </Modal>
    </div>
  );
}; 