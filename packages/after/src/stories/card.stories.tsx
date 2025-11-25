import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import { Button } from '../components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>카드 설명입니다. 여기에 추가 정보를 넣을 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드 내용이 여기에 표시됩니다.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>푸터가 있는 카드입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드 내용이 여기에 표시됩니다.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary">취소</Button>
        <Button variant="primary">확인</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>간단한 카드입니다. 헤더 없이 내용만 있습니다.</p>
      </CardContent>
    </Card>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>사용자 프로필</CardTitle>
        <CardDescription>사용자 정보를 확인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>이름:</strong> 홍길동</p>
          <p><strong>이메일:</strong> hong@example.com</p>
          <p><strong>역할:</strong> 관리자</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="primary" className="flex-1">수정</Button>
        <Button variant="secondary" className="flex-1">삭제</Button>
      </CardFooter>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>카드 1</CardTitle>
          <CardDescription>첫 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 1</p>
        </CardContent>
      </Card>
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>카드 2</CardTitle>
          <CardDescription>두 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 2</p>
        </CardContent>
      </Card>
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>카드 3</CardTitle>
          <CardDescription>세 번째 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <p>내용 3</p>
        </CardContent>
      </Card>
    </div>
  ),
};

