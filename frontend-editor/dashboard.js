const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('artaround_token');
let tutteLeOpere = [];
let sequenzaCrea = [];
let sequenzaEdit = [];
let visitaInEdit = null;
let visitaQuizCorrente = null;
let socket = null;
let visitaCorrente = null;
let operaCorrente = 0;
let indiceDomande = 0;
let editaSubview = 'list';
let quizSubview  = 'list';

if (!token) {
  alert('Not Authenticated');
  window.location.href = 'index.html';
}

window.onload = async () => {
  await caricaOpere();
};

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeLabel').textContent = isDark ? 'Tema scuro' : 'Tema chiaro';
  closeMenu();
}

function toggleMenu() {
  document.getElementById('accountMenu').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('accountMenu').classList.remove('open');
}

function logout() {
  localStorage.removeItem('artaround_token');
  window.location.href = 'index.html';
}

document.addEventListener('click', e => {
  if (!document.getElementById('accountBtn').contains(e.target)) closeMenu();
});

function navigate(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  if (viewId === 'view-edita-visita') {
    editaSubview = 'list';
    _syncEditaHeader();
    caricaListaVisite();
  }
  if (viewId === 'view-quiz') {
    quizSubview = 'list';
    _syncQuizHeader();
    caricaListaQuiz();
  }
  if (viewId === 'view-crea-visita') {
    sequenzaCrea = [];
    renderOpere(tutteLeOpere, 'opere-grid-crea', sequenzaCrea);
    renderSequenza(sequenzaCrea, 'sequenza-container-crea');
  }
}

function editaBack() {
  if (editaSubview === 'form') {
    editaSubview = 'list';
    _syncEditaHeader();
    document.getElementById('edita-form').classList.add('hidden');
    caricaListaVisite();
  } else {
    navigate('view-home');
  }
}

function quizBack() {
  if (quizSubview === 'form') {
    quizSubview = 'list';
    _syncQuizHeader();
    document.getElementById('quiz-form-wrap').classList.add('hidden');
    caricaListaQuiz();
  } else {
    navigate('view-home');
  }
}

function _syncEditaHeader() {
  document.getElementById('edita-page-title').textContent =
    editaSubview === 'form' && visitaInEdit
      ? `Modifica: ${visitaInEdit.name}`
      : 'Edita visita';
}

function _syncQuizHeader() {
  document.getElementById('quiz-page-title').textContent =
    quizSubview === 'form' && visitaQuizCorrente
      ? `Quiz: ${visitaQuizCorrente.name}`
      : 'Gestisci quiz';
}

async function caricaOpere() {
  try {
    const res = await fetch(`${API_URL}/items`);
    tutteLeOpere = await res.json();
    renderOpere(tutteLeOpere, 'opere-grid-crea', sequenzaCrea);
  } catch {
    document.getElementById('opere-grid-crea').innerHTML = '<p class="empty-hint">Errore nel caricamento.</p>';
  }
}

function filtraOpere(gridId) {
  const inputId = gridId === 'opere-grid-crea' ? 'search-opere' : 'search-opere-edit';
  const seq     = gridId === 'opere-grid-crea' ? sequenzaCrea : sequenzaEdit;
  const testo   = document.getElementById(inputId).value.toLowerCase();
  const filtrate = tutteLeOpere.filter(op =>
    op.name.toLowerCase().includes(testo) || op.author.toLowerCase().includes(testo)
  );
  renderOpere(filtrate, gridId, seq);
}

function renderOpere(opere, gridId, seq) {
  const grid = document.getElementById(gridId);
  if (!opere.length) {
    grid.innerHTML = '<p class="empty-hint">Nessuna opera trovata.</p>';
    return;
  }
  grid.innerHTML = '';
  opere.forEach((op, i) => {
    const card = document.createElement('div');
    card.className = 'opera-card';
    card.dataset.id = op._id;
    card.style.animationDelay = (i * 0.04) + 's';
    if (seq.find(s => s._id === op._id)) card.classList.add('selezionata');
    card.innerHTML = `
      ${op.image ? `<img src="${op.image}" alt="${op.name}" onerror="this.style.display='none'">` : ''}
      <div class="opera-nome">${op.name}</div>
      <div class="opera-autore">${op.author}</div>
    `;
    card.onclick = () => toggleOpera(op, card, seq, gridId);
    grid.appendChild(card);
  });
}

function toggleOpera(opera, card, seq, gridId) {
  const idx = seq.findIndex(s => s._id === opera._id);
  if (idx === -1) {
    seq.push(opera);
    card.classList.add('selezionata');
  } else {
    seq.splice(idx, 1);
    card.classList.remove('selezionata');
  }
  const seqContId = gridId.includes('crea') ? 'sequenza-container-crea' : 'sequenza-container-edit';
  renderSequenza(seq, seqContId);
}

function renderSequenza(seq, containerId) {
  const container = document.getElementById(containerId);
  if (!seq.length) {
    container.className = 'sequenza-wrap';
    container.innerHTML = '<p class="empty-hint">Nessuna opera selezionata.</p>';
    return;
  }
  container.className = 'sequenza-wrap has-items';
  container.innerHTML = '';
  seq.forEach((op, i) => {
    const item = document.createElement('div');
    item.className = 'sequenza-item';
    item.style.animationDelay = (i * 0.05) + 's';
    item.innerHTML = `
      <div style="display:flex;align-items:center;">
        <span class="seq-num">${i + 1}</span>
        <strong>${op.name}</strong>
        <span style="color:var(--text2);font-size:0.8em"> — ${op.author}</span>
      </div>
      <button class="btn btn-danger btn-sm" onclick="rimuoviSeq(${i}, '${containerId}')">✕</button>
    `;
    container.appendChild(item);
  });
}

function rimuoviSeq(idx, containerId) {
  const seq    = containerId.includes('crea') ? sequenzaCrea : sequenzaEdit;
  const gridId = containerId.includes('crea') ? 'opere-grid-crea' : 'opere-grid-edit';
  const rimossa = seq.splice(idx, 1)[0];
  document.querySelectorAll(`#${gridId} .opera-card`).forEach(c => {
    if (c.dataset.id === rimossa._id) c.classList.remove('selezionata');
  });
  renderSequenza(seq, containerId);
}

async function creaVisita() {
  const msg  = document.getElementById('msg-visita');
  const name = document.getElementById('visit-name').value.trim();
  const code = document.getElementById('visit-code').value.trim();

  if (!name || !code)
    return mostraMsg(msg, '❌ Compila tutti i campi.', false);
  if (!sequenzaCrea.length)
    return mostraMsg(msg, '❌ Seleziona almeno un\'opera.', false);

  try {
    const res = await fetch(`${API_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, code, items: sequenzaCrea.map(op => op._id) })
    });
    const data = await res.json();
    if (res.ok) {
      mostraMsg(msg, '✅ Visita creata!', true);
      sequenzaCrea = [];
      renderSequenza(sequenzaCrea, 'sequenza-container-crea');
    } else {
      mostraMsg(msg, `❌ ${data.message}`, false);
    }
  } catch {
    mostraMsg(msg, '❌ Errore di connessione.', false);
  }
}

async function caricaListaVisite() {
  document.getElementById('edita-form').classList.add('hidden');
  const container = document.getElementById('visite-list-container');
  container.innerHTML = '<p class="empty-hint">Caricamento...</p>';
  try {
    const res    = await fetch(`${API_URL}/visits`);
    const visite = await res.json();
    container.innerHTML = '';
    if (!visite.length) {
      container.innerHTML = '<p class="empty-hint">Nessuna visita trovata.</p>';
      return;
    }
    visite.forEach((v, i) => {
      const item = document.createElement('div');
      item.className = 'visit-item';
      item.style.animationDelay = (i * 0.06) + 's';
      item.innerHTML = `
        <div class="visit-item-info">
          <h4>${v.name}</h4>
          <span>Codice: ${v.code} · ${v.items?.length || 0} opere</span>
        </div>
        <span class="visit-status ${v.status}">${v.status}</span>
      `;
      item.onclick = () => apriEditVisita(v);
      container.appendChild(item);
    });
  } catch {
    container.innerHTML = '<p class="empty-hint">Errore nel caricamento.</p>';
  }
}

function apriEditVisita(visita) {
  visitaInEdit = visita;
  sequenzaEdit = [...(visita.items || [])];
  editaSubview = 'form';
  _syncEditaHeader();
  document.getElementById('visite-list-container').innerHTML = '';
  document.getElementById('edita-form').classList.remove('hidden');
  renderOpere(tutteLeOpere, 'opere-grid-edit', sequenzaEdit);
  renderSequenza(sequenzaEdit, 'sequenza-container-edit');
}

async function salvaEditVisita() {
  if (!visitaInEdit) return;
  const msg = document.getElementById('msg-edit-visita');
  try {
    const res = await fetch(`${API_URL}/visits/${visitaInEdit.code}/items`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items: sequenzaEdit.map(op => op._id || op) })
    });
    const data = await res.json();
    if (res.ok) mostraMsg(msg, '✅ Visita aggiornata!', true);
    else         mostraMsg(msg, `❌ ${data.message}`, false);
  } catch {
    mostraMsg(msg, '❌ Errore di connessione.', false);
  }
}

async function caricaListaQuiz() {
  document.getElementById('quiz-form-wrap').classList.add('hidden');
  const container = document.getElementById('quiz-visite-list-container');
  container.innerHTML = '<p class="empty-hint">Caricamento...</p>';
  try {
    const res  = await fetch(`${API_URL}/visits`);
    const data = await res.json();
    container.innerHTML = '';
    if (!data.length) {
      container.innerHTML = '<p class="empty-hint">Nessuna visita trovata.</p>';
      return;
    }
    data.forEach((v, i) => {
      const item = document.createElement('div');
      item.className = 'visit-item';
      item.style.animationDelay = (i * 0.06) + 's';
      item.innerHTML = `
        <div class="visit-item-info">
          <h4>${v.name}</h4>
          <span>Codice: ${v.code} · ${v.items?.length || 0} opere</span>
        </div>
        <span style="color:var(--accent);font-size:0.8rem">${v.quiz ? 'Modifica quiz →' : 'Crea quiz →'}</span>
      `;
      item.onclick = () => apriFormQuiz(v);
      container.appendChild(item);
    });
  } catch {
    container.innerHTML = '<p class="empty-hint">Errore nel caricamento.</p>';
  }
}

async function apriFormQuiz(visita) {
  visitaQuizCorrente = visita;
  quizSubview = 'form';
  _syncQuizHeader();
  document.getElementById('quiz-visite-list-container').innerHTML = '';
  document.getElementById('domande-container').innerHTML = '';
  indiceDomande = 0;

  if (visita.quiz) {
    try {
      const res = await fetch(`${API_URL}/quiz/${visita.quiz}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const quizEsistente = await res.json();
        (quizEsistente.domande || []).forEach(d => {
          aggiungiDomanda();
          const block = document.getElementById(`domanda-${indiceDomande}`);
          block.querySelector('.domanda-testo').value = d.testo || '';
          const opzioniInputs = block.querySelectorAll('.opzione-testo');
          const radios        = block.querySelectorAll('.radio-custom');
          (d.opzioni || []).forEach((op, i) => {
            if (opzioniInputs[i]) opzioniInputs[i].value = op;
            if (radios[i] && i === d.corretta) radios[i].checked = true;
          });
        });
      }
    } catch {}
  }

  document.getElementById('quiz-form-wrap').classList.remove('hidden');
}

function aggiungiDomanda() {
  indiceDomande += 1;
  const container = document.getElementById('domande-container');
  const block = document.createElement('div');
  block.className = 'domanda-block';
  block.id = `domanda-${indiceDomande}`;
  block.innerHTML = `
    <div class="domanda-header">
      <strong>Domanda ${indiceDomande}</strong>
      <button class="btn btn-danger btn-sm" onclick="rimuoviDomanda(${indiceDomande})">✕</button>
    </div>
    <div class="form-group">
      <label>Testo</label>
      <input type="text" class="domanda-testo" placeholder="Quale tecnica usò l'artista?">
    </div>
    <label style="margin-bottom:8px">Opzioni (seleziona la corretta)</label>
    ${[0, 1, 2, 3].map(i => `
      <div class="opzione-row">
        <input type="radio" class="radio-custom" name="corretta-${indiceDomande}" value="${i}">
        <input type="text" class="opzione-testo" placeholder="Opzione ${i + 1}">
      </div>
    `).join('')}
  `;
  container.appendChild(block);
}

function rimuoviDomanda(id) {
  document.getElementById(`domanda-${id}`)?.remove();
}

async function salvaQuiz() {
  if (!visitaQuizCorrente) return;
  const msg    = document.getElementById('msg-quiz');
  const blocks = document.querySelectorAll('.domanda-block');
  const domande = [];

  for (const block of blocks) {
    const testo   = block.querySelector('.domanda-testo').value.trim();
    const opzioni = [...block.querySelectorAll('.opzione-testo')].map(i => i.value.trim());
    const corretta = block.querySelector('.radio-custom:checked');
    if (!testo)              return mostraMsg(msg, '❌ Ogni domanda deve avere un testo.', false);
    if (opzioni.some(o => !o)) return mostraMsg(msg, '❌ Compila tutte le opzioni.', false);
    if (!corretta)           return mostraMsg(msg, '❌ Seleziona la risposta corretta.', false);
    domande.push({ testo, opzioni, corretta: parseInt(corretta.value) });
  }

  if (!domande.length) return mostraMsg(msg, '❌ Aggiungi almeno una domanda.', false);

  try {
    const res = await fetch(`${API_URL}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ visitCode: visitaQuizCorrente.code, domande })
    });
    const data = await res.json();
    if (res.ok) mostraMsg(msg, '✅ Quiz salvato!', true);
    else         mostraMsg(msg, `❌ ${data.message}`, false);
  } catch {
    mostraMsg(msg, '❌ Errore di connessione.', false);
  }
}

function mostraMsg(el, testo, ok) {
  el.className = 'msg ' + (ok ? 'msg-ok' : 'msg-err');
  el.textContent = testo;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
