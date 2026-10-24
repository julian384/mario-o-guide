// Moon checklist and spoiler setting, saved in this browser only.
(() => {
  const KEY = 'odyssey-moons:v1';
  const SPOILER_KEY = 'odyssey-moons:spoilers';

  const read = (k, fallback) => {
    try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  let done = new Set(read(KEY, []));
  const save = () => write(KEY, [...done]);

  function render() {
    document.querySelectorAll('input[data-moon]').forEach((box) => {
      box.checked = done.has(box.dataset.moon);
      box.closest('.moon-row')?.classList.toggle('done', box.checked);
    });
    document.querySelectorAll('[data-progress]').forEach((el) => {
      const keys = el.dataset.progress.split(',');
      const got = keys.filter((k) => done.has(k)).length;
      el.textContent = `${got} / ${keys.length} collected`;
    });
  }

  document.addEventListener('change', (e) => {
    const box = e.target.closest?.('input[data-moon]');
    if (!box) return;
    box.checked ? done.add(box.dataset.moon) : done.delete(box.dataset.moon);
    save();
    render();
  });

  // Spoiler gate for post-game and Moon Rock moons.
  function renderSpoilers() {
    const on = read(SPOILER_KEY, false) === true;
    document.querySelectorAll('[data-spoiler]').forEach((el) => { el.hidden = !on; });
    document.querySelectorAll('[data-spoiler-gate]').forEach((el) => { el.hidden = on; });
    document.querySelectorAll('[data-spoiler-status]').forEach((el) => {
      el.textContent = on ? 'Post-game moons are shown.' : 'Post-game moons are hidden.';
    });
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest?.('[data-spoiler-on]')) { write(SPOILER_KEY, true); renderSpoilers(); }
    if (e.target.closest?.('[data-spoiler-off]')) { write(SPOILER_KEY, false); renderSpoilers(); }
  });

  // Transfer codes: one bit per moon in site order, base64url, "v1." prefix.
  const allKeysEl = document.querySelector('[data-all-keys]');
  if (allKeysEl) {
    const order = allKeysEl.dataset.allKeys.split(',');
    const out = document.getElementById('transfer-code');
    const msg = document.getElementById('transfer-msg');

    const encode = () => {
      const bytes = new Uint8Array(Math.ceil(order.length / 8));
      order.forEach((k, i) => { if (done.has(k)) bytes[i >> 3] |= 1 << (i & 7); });
      const b64 = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return `v1.${b64}`;
    };
    const decode = (code) => {
      const m = code.trim().match(/^v1\.([A-Za-z0-9_-]+)$/);
      if (!m) throw new Error('That code should start with "v1." followed by letters and numbers.');
      const bin = atob(m[1].replace(/-/g, '+').replace(/_/g, '/'));
      const next = new Set();
      order.forEach((k, i) => { if ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) next.add(k); });
      return next;
    };

    document.getElementById('transfer-export')?.addEventListener('click', () => {
      out.value = encode();
      out.select();
      msg.textContent = 'Copy this code and paste it into the checklist on your other device.';
    });
    document.getElementById('transfer-import')?.addEventListener('click', () => {
      try {
        done = decode(out.value);
        save();
        render();
        msg.textContent = `Loaded ${done.size} collected moons.`;
      } catch (err) {
        msg.textContent = err.message;
      }
    });
    document.getElementById('transfer-clear')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (btn.dataset.confirm !== '1') {
        btn.dataset.confirm = '1';
        btn.textContent = 'Click again to clear every tick';
        return;
      }
      done = new Set();
      save();
      render();
      btn.dataset.confirm = '';
      btn.textContent = 'Clear checklist';
      msg.textContent = 'Checklist cleared.';
    });
  }

  render();
  renderSpoilers();
})();
