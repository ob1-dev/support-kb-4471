// The problems inside one merged ticket, counted with the desk's own view (causes.ts, as exported):
// each report is counted once, under its cause by tenant. Reports the desk read as a one-day move
// (desk-notes.json) are a problem of their own, but stay counted where they are filed and are footnoted there.
import { groupByCause, readAs, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day-move';

export type ProblemRow = {
  problem: Problem;
  count: number;
  // For a footnoted problem: the cause its reports are counted under.
  filedUnder: CauseGroup['cause'] | null;
  ids: string[];
  tenants: number;
  taggedAs: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; rows: ProblemRow[] } {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const groups = groupByCause(merged, tenantOf);
  const rows: ProblemRow[] = [];
  for (const g of groups) {
    rows.push({
      problem: g.cause,
      count: g.reports.length,
      filedUnder: null,
      ids: g.reports.map((r) => r.id).sort(),
      tenants: g.tenants,
      taggedAs: g.taggedAs,
      firstSeen: g.firstSeen,
      lastSeen: g.lastSeen,
    });
    if (readAs(g, oneDayMove)) {
      const rs = g.reports.filter((r) => oneDayMove.includes(r.id));
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      rows.push({
        problem: 'one-day-move',
        count: rs.length,
        filedUnder: g.cause,
        ids: rs.map((r) => r.id).sort(),
        tenants: new Set(rs.map((r) => r.tenant)).size,
        taggedAs: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      });
    }
  }
  return { merged, rows };
}
