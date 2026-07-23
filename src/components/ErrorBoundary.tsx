import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ROAD TO F1 App Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050811] text-white flex items-center justify-center p-4 text-center font-sans">
          <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl uppercase">¡SESIÓN REINICIADA!</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Haz clic abajo para reiniciar la sesión del simulador de carrera en el motorsport.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-sm uppercase py-3.5 rounded-2xl shadow-lg inline-flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REINICIAR Y CARGAR SIMULADOR 🏎️</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
