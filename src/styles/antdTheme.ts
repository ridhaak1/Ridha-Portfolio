import type { ThemeConfig } from "antd";

/**
 * Ant Design v5 Custom Theme
 * Built to align with the dark, minimal luxury aesthetic
 */
export const antdTheme: ThemeConfig = {
  token: {
    // Brand Colors
    colorPrimary: "#4f9cf9",
    colorInfo: "#4f9cf9",
    colorSuccess: "#3ecf8e",
    colorWarning: "#f5a623",
    colorError: "#ff5c5c",

    // Background
    colorBgBase: "#080b10",
    colorBgContainer: "#0e1117",
    colorBgElevated: "#141820",
    colorBgLayout: "#080b10",
    colorBgSpotlight: "rgba(79, 156, 249, 0.12)",
    colorBgMask: "rgba(0, 0, 0, 0.7)",

    // Text
    colorText: "#e8eaf0",
    colorTextSecondary: "#8b91a0",
    colorTextTertiary: "#4a5060",
    colorTextDisabled: "#2e3340",

    // Border
    colorBorder: "rgba(255, 255, 255, 0.08)",
    colorBorderSecondary: "rgba(255, 255, 255, 0.04)",
    colorSplit: "rgba(255, 255, 255, 0.06)",

    // Typography
    fontFamily: "'DM Sans', sans-serif",
    fontFamilyCode: "'JetBrains Mono', monospace",
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeLG: 18,
    fontSizeXL: 20,
    fontSizeHeading1: 48,
    fontSizeHeading2: 36,
    fontSizeHeading3: 28,
    fontSizeHeading4: 22,
    fontSizeHeading5: 18,

    // Motion
    motionDurationSlow: "0.4s",
    motionDurationMid: "0.25s",
    motionDurationFast: "0.15s",
    motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    motionEaseOut: "cubic-bezier(0, 0, 0.2, 1)",

    // Radius
    borderRadius: 8,
    borderRadiusSM: 4,
    borderRadiusLG: 12,
    borderRadiusXS: 2,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,

    // Line Heights
    lineHeight: 1.6,
    lineHeightLG: 1.5,
    lineHeightSM: 1.667,

    // Shadows
    boxShadow: "0 1px 1px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
    boxShadowSecondary: "0 1px 3px rgba(0,0,0,0.4)",

    // Control heights
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // Z-index
    zIndexPopupBase: 1000,
    zIndexBase: 0,
  },
  components: {
    Button: {
      primaryColor: "#080b10",
      colorPrimary: "#4f9cf9",
      colorPrimaryHover: "#6aabfa",
      colorPrimaryActive: "#3a8ef7",
      borderRadius: 8,
      controlHeight: 44,
      paddingContentHorizontal: 24,
      fontWeight: 500,
    },
    Input: {
      colorBgContainer: "#0e1117",
      colorBorder: "rgba(255, 255, 255, 0.08)",
      hoverBorderColor: "rgba(79, 156, 249, 0.4)",
      activeBorderColor: "#4f9cf9",
      colorText: "#e8eaf0",
      colorTextPlaceholder: "#4a5060",
      borderRadius: 8,
      controlHeight: 44,
    },
    Card: {
      colorBgContainer: "#0e1117",
      colorBorderSecondary: "rgba(255, 255, 255, 0.06)",
      borderRadius: 12,
      paddingLG: 24,
    },
    Tag: {
      colorBgContainer: "rgba(79, 156, 249, 0.1)",
      colorBorder: "rgba(79, 156, 249, 0.2)",
      colorText: "#4f9cf9",
      borderRadius: 999,
    },
    Tooltip: {
      colorBgSpotlight: "#141820",
      colorTextLightSolid: "#e8eaf0",
      borderRadius: 8,
    },
    Drawer: {
      colorBgElevated: "#0e1117",
    },
    Modal: {
      colorBgElevated: "#141820",
      borderRadius: 16,
    },
    Menu: {
      colorBgContainer: "transparent",
      colorItemText: "#8b91a0",
      colorItemTextHover: "#e8eaf0",
      colorItemTextSelected: "#4f9cf9",
      colorItemBgSelected: "rgba(79, 156, 249, 0.1)",
    },
  },
};
