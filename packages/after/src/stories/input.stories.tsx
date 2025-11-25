import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'url', 'tel', 'search'],
      description: '입력 필드 타입',
    },
    disabled: {
      control: 'boolean',
      description: '입력 필드 비활성화 여부',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '입력하세요...',
  },
};

export const WithValue: Story = {
  args: {
    value: '입력된 값',
    placeholder: '입력하세요...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호를 입력하세요',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '숫자를 입력하세요',
  },
};

export const Disabled: Story = {
  args: {
    value: '비활성화된 입력',
    disabled: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input type="text" placeholder="텍스트 입력" />
      <Input type="email" placeholder="이메일 입력" />
      <Input type="password" placeholder="비밀번호 입력" />
      <Input type="number" placeholder="숫자 입력" />
      <Input type="url" placeholder="URL 입력" />
      <Input type="tel" placeholder="전화번호 입력" />
      <Input type="search" placeholder="검색어 입력" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input placeholder="기본 상태" />
      <Input value="입력된 값" />
      <Input placeholder="비활성화" disabled />
      <Input value="읽기 전용" readOnly />
    </div>
  ),
};

