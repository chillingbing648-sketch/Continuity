import React from "react";

export const Icon = ({
  d,
  size = 18,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.75,
  className = "",
  style = {},
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d={d} />
  </svg>
);

export const Icons = {
  home: (props) => (
    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" {...props} />
  ),
  map: (props) => (
    <Icon d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z M9 3v15 M15 6v15" {...props} />
  ),
  docs: (props) => (
    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" {...props} />
  ),
  people: (props) => (
    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" {...props} />
  ),
  continuity: (props) => (
    <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...props} />
  ),
  activity: (props) => (
    <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" {...props} />
  ),
  settings: (props) => (
    <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...props} />
  ),
  plus: (props) => (
    <Icon d="M12 5v14 M5 12h14" {...props} />
  ),
  chevronRight: (props) => (
    <Icon d="M9 18l6-6-6-6" {...props} />
  ),
  chevronDown: (props) => (
    <Icon d="M6 9l6 6 6-6" {...props} />
  ),
  chevronUp: (props) => (
    <Icon d="M18 15l-6-6-6 6" {...props} />
  ),
  check: (props) => (
    <Icon d="M20 6L9 17l-5-5" {...props} />
  ),
  x: (props) => (
    <Icon d="M18 6L6 18 M6 6l12 12" {...props} />
  ),
  shield: (props) => (
    <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...props} />
  ),
  lock: (props) => (
    <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" {...props} />
  ),
  unlock: (props) => (
    <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 9.9-1" {...props} />
  ),
  bank: (props) => (
    <Icon d="M3 9l9-7 9 7H3z M4 9v11 M8 9v11 M12 9v11 M16 9v11 M20 9v11 M3 20h18" {...props} />
  ),
  trending: (props) => (
    <Icon d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" {...props} />
  ),
  umbrella: (props) => (
    <Icon d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" {...props} />
  ),
  building: (props) => (
    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M9 22V12h6v10" {...props} />
  ),
  dollar: (props) => (
    <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...props} />
  ),
  file: (props) => (
    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" {...props} />
  ),
  upload: (props) => (
    <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" {...props} />
  ),
  search: (props) => (
    <Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" {...props} />
  ),
  filter: (props) => (
    <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" {...props} />
  ),
  bell: (props) => (
    <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" {...props} />
  ),
  user: (props) => (
    <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" {...props} />
  ),
  users: (props) => (
    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" {...props} />
  ),
  eye: (props) => (
    <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" {...props} />
  ),
  eyeOff: (props) => (
    <Icon d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22" {...props} />
  ),
  info: (props) => (
    <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4" {...props} />
  ),
  alertTriangle: (props) => (
    <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" {...props} />
  ),
  checkCircle: (props) => (
    <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" {...props} />
  ),
  clock: (props) => (
    <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2" {...props} />
  ),
  arrowRight: (props) => (
    <Icon d="M5 12h14 M12 5l7 7-7 7" {...props} />
  ),
  arrowLeft: (props) => (
    <Icon d="M19 12H5 M12 19l-7-7 7-7" {...props} />
  ),
  edit: (props) => (
    <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...props} />
  ),
  trash: (props) => (
    <Icon d="M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6" {...props} />
  ),
  download: (props) => (
    <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" {...props} />
  ),
  refresh: (props) => (
    <Icon d="M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15" {...props} />
  ),
  link: (props) => (
    <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...props} />
  ),
  menu: (props) => (
    <Icon d="M3 12h18 M3 6h18 M3 18h18" {...props} />
  ),
  logOut: (props) => (
    <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" {...props} />
  ),
  percent: (props) => (
    <Icon d="M19 5L5 19 M6.5 6.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm11 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" {...props} />
  ),
  calendar: (props) => (
    <Icon d="M3 4h18v18H3V4z M16 2v4 M8 2v4 M3 10h18" {...props} />
  ),
  smartphone: (props) => (
    <Icon d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M12 18h.01" {...props} />
  ),
  key: (props) => (
    <Icon d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" {...props} />
  ),
  layers: (props) => (
    <Icon d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" {...props} />
  ),
  package: (props) => (
    <Icon d="M16.5 9.4l-9-5.18M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" {...props} />
  ),
  sparkles: (props) => (
    <Icon d="M12 3l1.9 4.7L18.5 9.5l-4.6 1.8L12 16l-1.9-4.7L5.5 9.5l4.6-1.8L12 3z M19 15l.9 2.2L22 18l-2.1.8L19 21l-.9-2.2L16 18l2.1-.8L19 15z" {...props} />
  ),
  play: (props) => (
    <Icon d="M5 3l14 9-14 9V3z" {...props} />
  ),
  flag: (props) => (
    <Icon d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7" {...props} />
  ),
  lifeMap: (props) => (
    <Icon d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" {...props} />
  ),
  guide: (props) => (
    <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" {...props} />
  ),
  share: (props) => (
    <Icon d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13" {...props} />
  ),
};

export const LogoIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9" strokeWidth="2.5" />
    <path d="M17 6l5-3M17 6l-3 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);
