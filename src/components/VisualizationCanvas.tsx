import { useRef, useEffect } from 'react';
import { VisualizationStep } from '../types';
import { D3Renderer } from '../utils/d3Renderer';

interface VisualizationCanvasProps {
  step: VisualizationStep | null;
  input: string;
  width: number;
  height: number;
}

export function VisualizationCanvas({ step, input, width, height }: VisualizationCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rendererRef = useRef<D3Renderer | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      rendererRef.current = new D3Renderer();
      rendererRef.current.initialize(svgRef.current, width, height);
    }
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.resize(width, height);
    }
  }, [width, height]);

  useEffect(() => {
    if (!rendererRef.current || !step) return;
    if (step.type === 'dp') {
      rendererRef.current.renderDPTable(step, input);
    } else {
      rendererRef.current.renderCenterExpansion(step, input);
    }
  }, [step, input]);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
  );
}
