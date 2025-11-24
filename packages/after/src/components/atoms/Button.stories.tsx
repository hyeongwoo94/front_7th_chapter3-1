import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "danger", "success"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        disabled: {
            control: "boolean",
        },
        fullWidth: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Button",
        variant: "primary",
        size: "md",
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
        size: "md",
    },
};

export const Danger: Story = {
    args: {
        children: "Button",
        variant: "danger",
        size: "md",
    },
};

export const Success: Story = {
    args: {
        children: "Button",
        variant: "success",
        size: "md",
    },
};

export const Small: Story = {
    args: {
        children: "Small Button",
        size: "sm",
    },
};

export const Large: Story = {
    args: {
        children: "Large Button",
        size: "lg",
    },
};

export const Disabled: Story = {
    args: {
        children: "Disabled Button",
        disabled: true,
    },
};

export const FullWidth: Story = {
    args: {
        children: "Full Width Button",
        fullWidth: true,
    },
};
