---
title: 颜色板
order: 3
nav:
  title: 文档
  order: 4
group:
  title: 设计
  order: 2
---

# 颜色板

颜色板共分为 7 大色系，默认以绿色为主色系（primary），可按项目需要更改主题色，即变更$primary-XX 相关变量。所有业务变量对应 variables.scss 中的业务变量。如果只是需要修改主题色，请在 variables.scss 中修改业务变量即可，暂还不支持自定义主题色配置方案。

## 中性色 Neutral

> 中性色是创造界面时最常使用的颜色，通常不同的颜色层级能够区分不同的元素内容。我们的中性色来自于黑色， 丰富的色彩层级能够满足各个产品的不同需求

| ID  | 原始变量    | HEX                                                                     | 业务变量                              |
| --- | ----------- | ----------------------------------------------------------------------- | ------------------------------------- |
| N20 | $neutral-20 | <div class="item" style="background-color: #020508;" /> | $black-background                     |
| N19 | $neutral-19 | <div class="item" style="background-color: #09121a;" /> | $title1                               |
| N18 | $neutral-18 | <div class="item" style="background-color: #141f29;" /> |                                       |
| N17 | $neutral-17 | <div class="item" style="background-color: #1d2b3a;" /> |                                       |
| N16 | $neutral-16 | <div class="item" style="background-color: #273849;" /> | $title2                               |
| N15 | $neutral-15 | <div class="item" style="background-color: #324558;" /> | $title3                               |
| N14 | $neutral-14 | <div class="item" style="background-color: #3e5265;" /> |                                       |
| N13 | $neutral-13 | <div class="item" style="background-color: #4c5e70;" /> | $help1                                |
| N12 | $neutral-12 | <div class="item" style="background-color: #5d6b79;" />  |                                       |
| N11 | $neutral-11 | <div class="item" style="background-color: #697886;" />  |                                       |
| N10 | $neutral-10 | <div class="item" style="background-color: #778592;" />  |                                       |
| N9  | $neutral-9  | <div class="item" style="background-color: #86919c;" />  |                                       |
| N8  | $neutral-8  | <div class="item" style="background-color: #939ea9;" />  | $help2                                |
| N7  | $neutral-7  | <div class="item" style="background-color: #a1abb5;" />  |                                       |
| N6  | $neutral-6  | <div class="item" style="background-color: #aeb8c1;" />  |                                       |
| N5  | $neutral-5  | <div class="item" style="background-color: #b6c2cd;" />  | $icon-dark-fill                       |
| N4  | $neutral-4  | <div class="item" style="background-color: #c6d1dc;" />  |                                       |
| N3  | $neutral-3  | <div class="item" style="background-color: #d5dee7;" />  | $border-color                         |
| N2  | $neutral-2  | <div class="item" style="background-color: #e4ebf1;" />  | $light-border-color，$body-background |
| N1  | $neutral-1  | <div class="item" style="background-color: #f5f7fa;" />  | $black-background                     |
| N0  | $neutral-0  | <div class="item" style="background-color: #ffffff;" />  | $white                                |

## 绿色 Green

> 默认主题色，成功色

| ID  | 原始变量  | HEX                                                                     | 业务变量                                             |
| --- | --------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| G20 | $green-20 | <div class="item" style="background-color: #031612;" /> |                                                      |
| G19 | $green-19 | <div class="item" style="background-color: #05261d;" /> |                                                      |
| G18 | $green-18 | <div class="item" style="background-color: #073628;" /> |                                                      |
| G17 | $green-17 | <div class="item" style="background-color: #094633;" /> |                                                      |
| G16 | $green-16 | <div class="item" style="background-color: #0b563e;" /> |                                                      |
| G15 | $green-15 | <div class="item" style="background-color: #0d6649;" /> |                                                      |
| G14 | $green-14 | <div class="item" style="background-color: #0f7654;" /> |                                                      |
| G13 | $green-13 | <div class="item" style="background-color: #11865f;" /> | $primary-active, $success-active                     |
| G12 | $green-12 | <div class="item" style="background-color: #13966a;" /> | $primary-hover, $success-hover                       |
| G11 | $green-11 | <div class="item" style="background-color: #15a675;" /> | $primary, $success, $primary-border, $success-border |
| G10 | $green-10 | <div class="item" style="background-color: #18b27f;" /> |                                                      |
| G9  | $green-9  | <div class="item" style="background-color: #2fb788;" /> |                                                      |
| G8  | $green-8  | <div class="item" style="background-color: #45bf95;" /> |                                                      |
| G7  | $green-7  | <div class="item" style="background-color: #5bc7a2;" /> |                                                      |
| G6  | $green-6  | <div class="item" style="background-color: #71cfaf;" /> |                                                      |
| G5  | $green-5  | <div class="item" style="background-color: #87d7bc;" /> |                                                      |
| G4  | $green-4  | <div class="item" style="background-color: #9ddfc9;" /> |                                                      |
| G3  | $green-3  | <div class="item" style="background-color: #b3e7d6;" /> |                                                      |
| G2  | $green-2  | <div class="item" style="background-color: #c9efe3;" /> |                                                      |
| G1  | $green-1  | <div class="item" style="background-color: #dff7f0;" /> |                                                      |
| G0  | $green-0  | <div class="item" style="background-color: #f5fffd;" /> | $primary-background, $success-background             |

## 红色 Red

> 警示色

| ID  | 原始变量 | HEX                                                                     | 业务变量                |
| --- | -------- | ----------------------------------------------------------------------- | ----------------------- |
| R20 | $red-20  | <div class="item" style="background-color: #17080a;" /> |                         |
| R19 | $red-19  | <div class="item" style="background-color: #2d0e13;" /> |                         |
| R18 | $red-18  | <div class="item" style="background-color: #3f1317;" /> |                         |
| R17 | $red-17  | <div class="item" style="background-color: #51181b;" /> |                         |
| R16 | $red-16  | <div class="item" style="background-color: #631d1f;" /> |                         |
| R15 | $red-15  | <div class="item" style="background-color: #752223;" /> |                         |
| R14 | $red-14  | <div class="item" style="background-color: #872727;" /> | $danger-active          |
| R13 | $red-13  | <div class="item" style="background-color: #992c2b;" /> |                         |
| R12 | $red-12  | <div class="item" style="background-color: #ab312f;" /> |                         |
| R11 | $red-11  | <div class="item" style="background-color: #bd3633;" /> | $danger-hover           |
| R10 | $red-10  | <div class="item" style="background-color: #cf3b37;" /> | $danger, $danger-border |
| R9  | $red-9   | <div class="item" style="background-color: #d44e4b;" /> |                         |
| R8  | $red-8   | <div class="item" style="background-color: #d9615f;" /> |                         |
| R7  | $red-7   | <div class="item" style="background-color: #de7473;" /> |                         |
| R6  | $red-6   | <div class="item" style="background-color: #e38787;" /> |                         |
| R5  | $red-5   | <div class="item" style="background-color: #e89a9b;" /> |                         |
| R4  | $red-4   | <div class="item" style="background-color: #edadaf;" /> |                         |
| R3  | $red-3   | <div class="item" style="background-color: #f2c0c3;" /> |                         |
| R1  | $red-1   | <div class="item" style="background-color: #fce6eb;" /> |                         |
| R0  | $red-0   | <div class="item" style="background-color: #fff9fa;" /> | $danger-background      |

## 黄色 Yellow

> 提醒色

| ID  | 原始变量   | HEX                                                                     | 业务变量                  |
| --- | ---------- | ----------------------------------------------------------------------- | ------------------------- |
| Y20 | $yellow-20 | <div class="item" style="background-color: #1a1807;" /> |                           |
| Y19 | $yellow-19 | <div class="item" style="background-color: #312b0a;" /> |                           |
| Y18 | $yellow-18 | <div class="item" style="background-color: #483e0d;" /> |                           |
| Y17 | $yellow-17 | <div class="item" style="background-color: #5f5110;" /> |                           |
| Y16 | $yellow-16 | <div class="item" style="background-color: #766413;" /> |                           |
| Y15 | $yellow-15 | <div class="item" style="background-color: #8d7716;" /> |                           |
| Y14 | $yellow-14 | <div class="item" style="background-color: #a48a19;" /> | $warning-active           |
| Y13 | $yellow-13 | <div class="item" style="background-color: #bb9d1c;" /> |                           |
| Y12 | $yellow-12 | <div class="item" style="background-color: #d2b01f;" /> |                           |
| Y11 | $yellow-11 | <div class="item" style="background-color: #e9c322;" /> | $warning-hover            |
| Y10 | $yellow-10 | <div class="item" style="background-color: #ffd127;" /> | $warning, $warning-border |
| Y9  | $yellow-9  | <div class="item" style="background-color: #ffd939;" /> |                           |
| Y8  | $yellow-8  | <div class="item" style="background-color: #ffdd4d;" /> |                           |
| Y7  | $yellow-7  | <div class="item" style="background-color: #ffe161;" /> |                           |
| Y6  | $yellow-6  | <div class="item" style="background-color: #ffe575;" /> |                           |
| Y5  | $yellow-5  | <div class="item" style="background-color: #ffe989;" /> |                           |
| Y4  | $yellow-4  | <div class="item" style="background-color: #ffed9d;" /> |                           |
| Y3  | $yellow-3  | <div class="item" style="background-color: #fff1b1;" /> |                           |
| Y2  | $yellow-2  | <div class="item" style="background-color: #fff5c5;" /> |                           |
| Y1  | $yellow-1  | <div class="item" style="background-color: #fff9d9;" /> |                           |
| Y0  | $yellow-0  | <div class="item" style="background-color: #fffded;" /> | $warning-background       |

## 蓝色 Blue

> 提示色

| ID  | 原始变量 | HEX                                                                     | 业务变量                             |
| --- | -------- | ----------------------------------------------------------------------- | ------------------------------------ |
| B20 | $blue-20 | <div class="item" style="background-color: #04121d;" /> |                                      |
| B19 | $blue-19 | <div class="item" style="background-color: #092333;" /> |                                      |
| B18 | $blue-18 | <div class="item" style="background-color: #0c3147;" /> |                                      |
| B17 | $blue-17 | <div class="item" style="background-color: #0f3f5b;" /> |                                      |
| B16 | $blue-16 | <div class="item" style="background-color: #124d6f;" /> |                                      |
| B15 | $blue-15 | <div class="item" style="background-color: #155b83;" /> |                                      |
| B14 | $blue-14 | <div class="item" style="background-color: #186997;" /> |                                      |
| B13 | $blue-13 | <div class="item" style="background-color: #0b75b7;" /> | $info-active                         |
| B12 | $blue-12 | <div class="item" style="background-color: #1e85c7;" /> | $info-hover                          |
| B11 | $blue-11 | <div class="item" style="background-color: #2193d3;" /> | $info, $info-border                  |
| B10 | $blue-10 | <div class="item" style="background-color: #229ce9;" /> |                                      |
| B9  | $blue-9  | <div class="item" style="background-color: #3aa2ed;" /> |                                      |
| B8  | $blue-8  | <div class="item" style="background-color: #4facef;" /> |                                      |
| B7  | $blue-7  | <div class="item" style="background-color: #64b6f1;" /> |                                      |
| B6  | $blue-6  | <div class="item" style="background-color: #79c0f3;" /> |                                      |
| B5  | $blue-5  | <div class="item" style="background-color: #8ecaf5;" /> |                                      |
| B4  | $blue-4  | <div class="item" style="background-color: #a3d4f7;" /> |                                      |
| B3  | $blue-3  | <div class="item" style="background-color: #b8def9;" /> |                                      |
| B2  | $blue-2  | <div class="item" style="background-color: #cde8fb;" /> |                                      |
| B1  | $blue-1  | <div class="item" style="background-color: #e2f2fd;" /> |                                      |
| B0  | $blue-0  | <div class="item" style="background-color: #f7fcff;" /> | $info-background                     |
| B99 | $blue-99 | <div class="item" style="background-color: #0366d6;" /> | $link（a 标签自带颜色）              |
| B98 | $blue-98 | <div class="item" style="background-color: #035cc1;" /> | $link-hover（a 标签 hover 自带颜色） |

## 橘色 Orange

> 辅助色板色

| ID  | 原始变量   | HEX                                                                     | 业务变量 |
| --- | ---------- | ----------------------------------------------------------------------- | -------- |
| O20 | $orange-20 | <div class="item" style="background-color: #1d0f04;" /> |          |
| O19 | $orange-19 | <div class="item" style="background-color: #331c06;" /> |          |
| O18 | $orange-18 | <div class="item" style="background-color: #492908;" /> |          |
| O17 | $orange-17 | <div class="item" style="background-color: #5f360a;" /> |          |
| O16 | $orange-16 | <div class="item" style="background-color: #75430c;" /> |          |
| O15 | $orange-15 | <div class="item" style="background-color: #8b500e;" /> |          |
| O14 | $orange-14 | <div class="item" style="background-color: #a15d10;" /> |          |
| O13 | $orange-13 | <div class="item" style="background-color: #b76a12;" /> |          |
| O12 | $orange-12 | <div class="item" style="background-color: #cd7714;" /> |          |
| O11 | $orange-11 | <div class="item" style="background-color: #e38416;" /> |          |
| O10 | $orange-10 | <div class="item" style="background-color: #f49113;" /> |          |
| O9  | $orange-9  | <div class="item" style="background-color: #f59c2a;" /> |          |
| O8  | $orange-8  | <div class="item" style="background-color: #f6a741;" /> |          |
| O7  | $orange-7  | <div class="item" style="background-color: #f7b258;" /> |          |
| O6  | $orange-6  | <div class="item" style="background-color: #f8bd6f;" /> |          |
| O5  | $orange-5  | <div class="item" style="background-color: #f9c886;" /> |          |
| O4  | $orange-4  | <div class="item" style="background-color: #fad39d;" /> |          |
| O3  | $orange-3  | <div class="item" style="background-color: #fbdeb4;" /> |          |
| O2  | $orange-2  | <div class="item" style="background-color: #fce9cb;" /> |          |
| O1  | $orange-1  | <div class="item" style="background-color: #fdf4e2;" /> |          |
| O0  | $orange-0  | <div class="item" style="background-color: #fffbf7;" /> |          |

## 紫色 Purple

> 辅助色板色

| ID  | 原始变量   | HEX                                                                     | 业务变量 |
| --- | ---------- | ----------------------------------------------------------------------- | -------- |
| P20 | $purple-20 | <div class="item" style="background-color: #11041d;" /> |          |
| P19 | $purple-19 | <div class="item" style="background-color: #1a042b;" /> |          |
| P18 | $purple-18 | <div class="item" style="background-color: #230439;" /> |          |
| P17 | $purple-17 | <div class="item" style="background-color: #2c0447;" /> |          |
| P16 | $purple-16 | <div class="item" style="background-color: #350455;" /> |          |
| P15 | $purple-15 | <div class="item" style="background-color: #3e0463;" /> |          |
| P14 | $purple-14 | <div class="item" style="background-color: #470471;" /> |          |
| P13 | $purple-13 | <div class="item" style="background-color: #50047f;" /> |          |
| P12 | $purple-12 | <div class="item" style="background-color: #59048d;" /> |          |
| P11 | $purple-11 | <div class="item" style="background-color: #62049b;" /> |          |
| P10 | $purple-10 | <div class="item" style="background-color: #6600aa;" /> |          |
| P9  | $purple-9  | <div class="item" style="background-color: #7519b3;" /> |          |
| P8  | $purple-8  | <div class="item" style="background-color: #8432bc;" /> |          |
| P7  | $purple-7  | <div class="item" style="background-color: #934bc5;" /> |          |
| P6  | $purple-6  | <div class="item" style="background-color: #a264ce;" /> |          |
| P5  | $purple-5  | <div class="item" style="background-color: #b17dd7;" /> |          |
| P4  | $purple-4  | <div class="item" style="background-color: #c096e0;" /> |          |
| P3  | $purple-3  | <div class="item" style="background-color: #cfafe9;" /> |          |
| P2  | $purple-2  | <div class="item" style="background-color: #dec8f2;" /> |          |
| P1  | $purple-1  | <div class="item" style="background-color: #ede1fb;" /> |          |
| P0  | $purple-0  | <div class="item" style="background-color: #f7f7ff;" /> |          |

<style>
  .item {
    width:80px;
    height:24px;
  }
</style>