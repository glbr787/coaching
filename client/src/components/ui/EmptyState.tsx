interface Props {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="ui-empty-state">
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  );
}
