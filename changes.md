# Changelog

## [Current Session]

### 🎨 Visual Polish - "Gemini Pro" Match
*   **ChatPanel Refinement**:
    *   **Input Container**: Changed to `#F0F4F9` (light grey) with `rounded-[32px]` for that tactile "nested" feel.
    *   **Deep Think Button**: Implemented as a white pill with shadow and border, distinct from the grey input background.
    *   **Typography**: Updated placeholder color to `#5F6368` (Google Grey 700) for better contrast and accuracy.
    *   **Suggestion Chips**: Updated to softer pills (`rounded-[16px]`) with `bg-canvas` to sit quietly above the input.

### 🎨 UI Polish - Command Bar
*   **Component**: `CommandBar.tsx`
*   **Change**: Implemented a strict 2-row layout in the empty state to match the reference screenshot.
    *   **Row 1**: Search Icon + Input.
    *   **Row 2**: Chips (Left) + Actions (Right).
    *   **Styling**: Used specific hex codes for "Zinc" grays to match the crisp look. Added `rounded-full` to chips and proper spacing.
    *   **Behavior**: Bottom row hides completely when typing `query`.

### 🚀 Features & Refactors (Previous)
*   **Chat Panel**: Updated input area to match "Gemini Pro" look.
*   **Animation**: Synced right sidebar easing.
