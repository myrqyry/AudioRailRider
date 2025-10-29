import React from 'react';

type UniformControl = 'range' | 'number' | 'checkbox' | 'color' | 'select' | string;
interface UniformDef {
  name: string;
  control: UniformControl;
  min?: number;
  max?: number;
  step?: number;
  default?: any;
  options?: string[];
}

interface ShaderUniformsControlProps {
  uniformsManifest: Record<string, UniformDef[]>;
  uniformValues: Record<string, any>;
  onUniformChange: (name: string, value: any) => void;
}

const ShaderUniformsControl: React.FC<ShaderUniformsControlProps> = ({
  uniformsManifest,
  uniformValues,
  onUniformChange,
}) => {
  return (
    <div className="mt-3">
      <h4 className="font-medium text-gray-100 mb-1">Shader Uniforms</h4>
      <div className="space-y-2 max-h-48 overflow-auto pr-2">
        {Object.entries(uniformsManifest).map(([shader, uniforms]) => (
          <div key={shader} className="mb-2">
            <div className="text-xs text-gray-400">{shader}</div>
            {uniforms.map((u: any) => (
              <div key={u.name} className="mt-1">
                <label className="block text-xs text-gray-300">{u.name}</label>
                {u.control === 'range' && (
                  <input data-uniform={`$${u.name}`} type="range" min={u.min ?? 0} max={u.max ?? 1} step={u.step ?? 0.01} value={uniformValues[u.name] ?? (u.min ?? 0)} onChange={(e) => onUniformChange(u.name, Number(e.target.value))} className="w-full" />
                )}
                {u.control === 'number' && (
                  <input data-uniform={`$${u.name}`} type="number" min={u.min ?? 0} max={u.max ?? 16} step={u.step ?? 1} value={uniformValues[u.name] ?? (u.min ?? 0)} onChange={(e) => onUniformChange(u.name, Number(e.target.value))} className="w-full" />
                )}
                {u.control === 'checkbox' && (
                  <input data-uniform={`$${u.name}`} type="checkbox" checked={!!uniformValues[u.name]} onChange={(e) => onUniformChange(u.name, e.target.checked)} />
                )}
                {u.control === 'color' && (
                  <input data-uniform={`$${u.name}`} type="color" value={uniformValues[u.name] ?? '#000000'} onChange={(e) => onUniformChange(u.name, e.target.value)} />
                )}
                {u.control === 'select' && u.options && (
                  <select data-uniform={`$${u.name}`} value={uniformValues[u.name] ?? u.options[0]} onChange={(e) => onUniformChange(u.name, e.target.value)} className="w-full">
                    {u.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShaderUniformsControl;
