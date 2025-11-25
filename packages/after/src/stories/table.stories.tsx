import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: '사용자' },
  { id: 3, name: '이영희', email: 'lee@example.com', role: '사용자' },
];

export const Default: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableCaption>사용자 목록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Table className="w-[700px]">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
          <TableHead className="text-right">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm">수정</Button>
                <Button variant="danger" size="sm">삭제</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => {
    const total = sampleData.length;
    return (
      <Table className="w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>역할</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-right">
              총 {total}명
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center text-muted-foreground">
            데이터가 없습니다
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Complex: Story = {
  render: () => {
    const invoices = [
      { invoice: 'INV-001', paymentStatus: 'Paid', totalAmount: '$250.00', paymentMethod: 'Credit Card' },
      { invoice: 'INV-002', paymentStatus: 'Pending', totalAmount: '$150.00', paymentMethod: 'PayPal' },
      { invoice: 'INV-003', paymentStatus: 'Unpaid', totalAmount: '$350.00', paymentMethod: 'Bank Transfer' },
      { invoice: 'INV-004', paymentStatus: 'Paid', totalAmount: '$450.00', paymentMethod: 'Credit Card' },
    ];

    return (
      <Table className="w-[800px]">
        <TableCaption>인보이스 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">인보이스</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>결제 방법</TableHead>
            <TableHead className="text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>총계</TableCell>
            <TableCell className="text-right">$1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

