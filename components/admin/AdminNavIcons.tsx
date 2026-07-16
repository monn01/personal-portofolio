const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  className: "h-full w-full",
  "aria-hidden": true as const,
};

export function DashboardIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75h6.5v6.5h-6.5v-6.5zM13.75 3.75h6.5v6.5h-6.5v-6.5zM3.75 13.75h6.5v6.5h-6.5v-6.5zM13.75 13.75h6.5v6.5h-6.5v-6.5z"
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

export function TrophyIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4h10v4a5 5 0 01-10 0V4zM7 5.5H4.5A2.5 2.5 0 007 9M17 5.5h2.5A2.5 2.5 0 0117 9M12 13v3.5m-3 3.5h6m-3-3.5a3.5 3.5 0 003.5-3.5"
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25h16.5v13.5H3.75V5.25zM3.75 6l8.25 6.75L20.25 6"
      />
    </svg>
  );
}
