import { useEffect, useState } from "react";
import { api } from "../api";

export default function Blockchain() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlockchain().then(setBlocks).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Blockchain Ledger</h1>
          <p>Tamper-proof SHA-256 hash chain of all system events — {blocks.length} blocks</p>
        </div>
        <button className="btn btn-ghost" onClick={() => { setLoading(true); api.getBlockchain().then(setBlocks).finally(() => setLoading(false)); }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? <div className="loading"><div className="spinner" />Loading blockchain...</div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Data</th><th>Hash</th><th>Previous Hash</th><th>Timestamp</th></tr>
              </thead>
              <tbody>
                {blocks.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ color: "var(--accent)", fontWeight: 700 }}>{b.id}</td>
                    <td style={{ fontWeight: 500, color: "var(--text)" }}>{b.data}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--success)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={b.hash}>{b.hash}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={b.previousHash}>{b.previousHash}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{b.timestamp ? new Date(b.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {blocks.length === 0 && (
                  <tr><td colSpan={5}>
                    <div className="empty-state"><div className="empty-icon">🔗</div><p>No blockchain records yet. Register a tourist to create the first block.</p></div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
