<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket, type Problem } from '#lib/kb/problems';

  // tickets: problem → { href, label } of the ticket filed for it.
  let { ticket, tickets }: { ticket: number; tickets: Partial<Record<Problem, { href: string; label: string }>> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const total = $derived(split.rows.reduce((n, r) => n + r.ids.length, 0));
  const fmt = (o: Record<string, number>) =>
    Object.entries(o)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{split.merged.length}</strong> reports merged into #{ticket} ·
  <strong>{split.rows.length}</strong> {split.rows.length === 1 ? 'problem' : 'problems'} ·
  <strong>{split.rows.filter((r) => tickets[r.problem]).length}</strong> with a ticket
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>ticket</th><th>tenants</th><th>came in by</th><th>intake tagged</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each split.rows as r (r.problem)}
      <tr class:missing={!tickets[r.problem]}>
        <td><code>{r.problem}</code></td>
        <td><strong>{r.ids.length}</strong></td>
        <td>{#if tickets[r.problem]}<a href={tickets[r.problem]?.href}>{tickets[r.problem]?.label}</a>{:else}no ticket{/if}</td>
        <td>{r.tenants.length}</td>
        <td class="small">{fmt(r.channels)}</td>
        <td class="small">{fmt(r.taggedAs)}</td>
        <td class="small">{r.firstSeen} → {r.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr><td>total</td><td><strong>{total}</strong></td><td colspan="5" class="small">{total === split.merged.length ? 'every merged report is in exactly one problem' : `${split.merged.length - total} reports not placed`}</td></tr>
  </tfoot>
</table>

{#each split.rows.filter((r) => r.problem === 'one-day-move') as r (r.problem)}
  <p class="small">one-day moves, from desk-notes: {r.ids.join(', ')}</p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .small { color: var(--muted); font-size: 0.85em; }
  .missing td { background: var(--warn-bg); }
  tfoot td { border-bottom: none; }
</style>
