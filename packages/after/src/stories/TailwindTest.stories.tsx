import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
    title: "Test/Tailwind CSS",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

/**
 * Tailwind CSS가 제대로 연결되었는지 확인하는 테스트 스토리입니다.
 * 아래 스타일이 적용되면 Tailwind가 정상 작동하는 것입니다.
 */
export const TailwindTest: Story = {
    render: () => (
        <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tailwind CSS 연결 테스트
            </h2>

            {/* 배경색 테스트 */}
            <div className="space-y-4">
                <div className="p-4 bg-blue-500 text-white rounded-lg">
                    파란색 배경 (bg-blue-500)
                </div>
                <div className="p-4 bg-green-500 text-white rounded-lg">
                    초록색 배경 (bg-green-500)
                </div>
                <div className="p-4 bg-red-500 text-white rounded-lg">
                    빨간색 배경 (bg-red-500)
                </div>
            </div>

            {/* Flexbox 테스트 */}
            <div className="flex gap-4 p-4 bg-gray-100 rounded-lg">
                <div className="px-4 py-2 bg-purple-500 text-white rounded">
                    Flex Item 1
                </div>
                <div className="px-4 py-2 bg-purple-500 text-white rounded">
                    Flex Item 2
                </div>
                <div className="px-4 py-2 bg-purple-500 text-white rounded">
                    Flex Item 3
                </div>
            </div>

            {/* Grid 테스트 */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-400 text-center rounded">1</div>
                <div className="p-4 bg-yellow-400 text-center rounded">2</div>
                <div className="p-4 bg-yellow-400 text-center rounded">3</div>
            </div>

            {/* 텍스트 스타일 테스트 */}
            <div className="space-y-2">
                <p className="text-sm text-gray-600">작은 텍스트 (text-sm)</p>
                <p className="text-base text-gray-700">
                    기본 텍스트 (text-base)
                </p>
                <p className="text-lg font-semibold text-gray-800">
                    큰 텍스트 (text-lg font-semibold)
                </p>
                <p className="text-xl font-bold text-gray-900">
                    더 큰 텍스트 (text-xl font-bold)
                </p>
            </div>

            {/* Border 및 Shadow 테스트 */}
            <div className="p-6 border-2 border-blue-500 rounded-lg shadow-lg bg-white">
                <p className="text-gray-700">
                    Border와 Shadow가 적용된 박스입니다.
                </p>
            </div>

            {/* Hover 효과 테스트 */}
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Hover 효과 테스트 (마우스를 올려보세요)
            </button>

            {/* 컬러 토큰 테스트 */}
            <div className="space-y-4 mt-8">
                <h3 className="text-xl font-bold text-foreground">
                    컬러 토큰 테스트
                </h3>
                <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                    Primary 배경 (bg-primary text-primary-foreground)
                </div>
                <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                    Secondary 배경 (bg-secondary text-secondary-foreground)
                </div>
                <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
                    Destructive 배경 (bg-destructive
                    text-destructive-foreground)
                </div>
                <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                    Muted 배경 (bg-muted text-muted-foreground)
                </div>
                <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                    Accent 배경 (bg-accent text-accent-foreground)
                </div>
                <div className="p-4 bg-card text-card-foreground border border-border rounded-lg">
                    Card 배경 (bg-card text-card-foreground border-border)
                </div>
                <div className="p-4 bg-background text-foreground border border-border rounded-lg">
                    Background (bg-background text-foreground)
                </div>
            </div>
        </div>
    ),
};
