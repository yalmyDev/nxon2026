import TerminalComponent from './terminal';

export default function BottomPanel() {
  return (
    <div className="panel-panel" style={{ height: '100%' }}>
      <div className="panel-header">TERMINAL</div>
      <div style={{ height: 'calc(100% - 35px)', width: '100%' }}>
        <TerminalComponent />
      </div>
    </div>
  );
}