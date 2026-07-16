const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  className: "h-full w-full",
  "aria-hidden": true as const,
};

export function HomeIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 11.5L12 4.5l8.25 7M6 9.75V19a1 1 0 001 1h3.5v-5h3v5H17a1 1 0 001-1V9.75"
      />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="8" r="3.25" />
      <path strokeLinecap="round" d="M4.5 20a7.5 7.5 0 0115 0" />
    </svg>
  );
}

export function SkillsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.3 2.3-2-2 2.3-2.3z"
      />
    </svg>
  );
}

export function FolderIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

export function AwardIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="8" r="5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5"
      />
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 4.5h9l6 6v9a1.5 1.5 0 01-1.5 1.5h-13.5A1.5 1.5 0 013 19.5v-13.5A1.5 1.5 0 014.5 4.5zM13.5 4.5v6h6M8 13.5h8M8 17h5"
      />
    </svg>
  );
}
