"use client";
import { useState } from 'react';
import { Form, Input, Button, Card, Table, InputNumber, Select, message } from 'antd';
import type { JournalEntryType } from '@/app/types/accounting';

const { Option } = Select;

interface JournalEntryProps {
  entries: JournalEntryType[];
  onNewEntry: (entry: JournalEntryType) => void;
}

export const JournalEntry = ({ entries, onNewEntry }: JournalEntryProps) => {
  const [form] = Form.useForm();

  const accounts = [
    '现金',
    '银行存款',
    '应收账款',
    '预付账款',
    '库存商品',
    '固定资产',
    '应付账款',
    '预收账款',
    '营业收入',
    '营业成本',
    '费用',
  ];

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

  const onFinish = (values: any) => {
    const newEntry: JournalEntryType = {
      key: Date.now(),
      debitAccount: values.debitAccount,
      debitAmount: values.amount,
      creditAccount: values.creditAccount,
      creditAmount: values.amount,
      description: values.description,
      date: new Date().toISOString(),
    };

    onNewEntry(newEntry);
    message.success('记账成功');
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card title="手动记账" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          name="journal_entry"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="借方科目"
            name="debitAccount"
            rules={[{ required: true, message: '请选择借方科目' }]}
          >
            <Select placeholder="选择科目">
              {accounts.map(account => (
                <Option key={account} value={account}>{account}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="贷方科目"
            name="creditAccount"
            rules={[{ required: true, message: '请选择贷方科目' }]}
          >
            <Select placeholder="选择科目">
              {accounts.map(account => (
                <Option key={account} value={account}>{account}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="金额"
            name="amount"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} precision={2} />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              记账
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="记账记录">
        <Table 
          columns={columns} 
          dataSource={entries} 
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
        />
      </Card>
    </div>
  );
}; 