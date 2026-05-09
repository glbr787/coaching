interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  value: string;
  onChange: (next: string) => void;
}

export default function Tabs({ tabs, value, onChange }: Props) {
  return (
    <div className="ui-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={value === tab.key}
          className={`ui-tab ${value === tab.key ? 'is-active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
