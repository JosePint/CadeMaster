export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-xs font-mono text-blue-500 animate-pulse uppercase tracking-[0.2em]">Sincronizando Banco de Dados...</p>
    </div>
  );
}
