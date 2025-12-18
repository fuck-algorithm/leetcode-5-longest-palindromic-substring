interface StepDescriptionProps {
  description: string | null;
}

export function StepDescription({ description }: StepDescriptionProps) {
  return (
    <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center', minHeight: '48px' }}>
      <span style={{ color: '#374151' }}>{description ?? '准备开始...'}</span>
    </div>
  );
}
