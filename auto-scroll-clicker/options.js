document.addEventListener('DOMContentLoaded', () => {
  const rulesBody = document.getElementById('rulesBody');
  const domainInput = document.getElementById('domain');
  const selectorInput = document.getElementById('selector');
  const delayInput = document.getElementById('delay');
  const addBtn = document.getElementById('addRule');
  const downloadBtn = document.getElementById('download');
  const uploadInput = document.getElementById('upload');

  let rules = [];

  // Sanitize: replace double quotes with single quotes
  function sanitizeSelector(s) {
    return (s || '').replace(/"/g, "'");
  }

  // Save rules to chrome storage
  function saveRules() {
    const toSave = rules.map(r => ({
      domain: r.domain || '',
      querySelector: sanitizeSelector(r.querySelector || ''),
      delay: parseInt(r.delay) || 500
    }));
    chrome.storage.local.set({ settings: JSON.stringify(toSave) });
  }

  // Render the rules into the table
  function renderRules() {
    rulesBody.innerHTML = '';
    rules.forEach((rule, index) => {
      const row = document.createElement('tr');

      // Domain column
      const tdDomain = document.createElement('td');
      const inDomain = document.createElement('input');
      inDomain.type = 'text';
      inDomain.value = rule.domain || '';
      inDomain.dataset.field = 'domain';
      inDomain.dataset.index = index;
      tdDomain.appendChild(inDomain);

      // Selector column
      const tdSelector = document.createElement('td');
      const inSelector = document.createElement('input');
      inSelector.type = 'text';
      inSelector.value = rule.querySelector || '';
      inSelector.dataset.field = 'querySelector';
      inSelector.dataset.index = index;
      tdSelector.appendChild(inSelector);

      // Delay column
      const tdDelay = document.createElement('td');
      const inDelay = document.createElement('input');
      inDelay.type = 'number';
      inDelay.value = rule.delay || 500;
      inDelay.dataset.field = 'delay';
      inDelay.dataset.index = index;
      tdDelay.appendChild(inDelay);

      // Action column (delete button)
      const tdActions = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.dataset.action = 'delete';
      delBtn.dataset.index = index;
      tdActions.appendChild(delBtn);

      row.appendChild(tdDomain);
      row.appendChild(tdSelector);
      row.appendChild(tdDelay);
      row.appendChild(tdActions);

      rulesBody.appendChild(row);
    });
  }

  // Load rules from chrome storage
  chrome.storage.local.get(['settings'], result => {
    if (result.settings) {
      try {
        const parsed = JSON.parse(result.settings);
        if (Array.isArray(parsed)) {
          rules = parsed.map(r => ({
            domain: r.domain || '',
            querySelector: sanitizeSelector(r.querySelector || ''),
            delay: parseInt(r.delay) || 500
          }));
        }
      } catch (err) {
        console.error('Error parsing settings:', err);
      }
    }
    renderRules();
  });

  // Add new rule (or update existing if domain already exists)
  addBtn.addEventListener('click', () => {
    const domain = domainInput.value.trim();
    const selector = sanitizeSelector(selectorInput.value.trim());
    const delay = parseInt(delayInput.value) || 500;

    if (!domain || !selector) {
      alert('Domain and selector are required.');
      return;
    }

    const existingIndex = rules.findIndex(r => r.domain === domain);
    if (existingIndex !== -1) {
      // Update existing rule
      rules[existingIndex].querySelector = selector;
      rules[existingIndex].delay = delay;
    } else {
      // Add new rule
      rules.push({ domain, querySelector: selector, delay });
    }

    renderRules();
    saveRules(); // auto save

    domainInput.value = '';
    selectorInput.value = '';
    delayInput.value = '500';
  });

  // Inline editing with auto save
  rulesBody.addEventListener('input', e => {
    const field = e.target.dataset.field;
    const idx = e.target.dataset.index;
    if (typeof field === 'undefined' || typeof idx === 'undefined') return;
    const index = Number(idx);
    if (!Number.isInteger(index) || !rules[index]) return;

    if (field === 'delay') {
      rules[index][field] = parseInt(e.target.value) || 500;
    } else if (field === 'querySelector') {
      rules[index][field] = sanitizeSelector(e.target.value);
      if (e.target.value !== rules[index][field]) {
        e.target.value = rules[index][field];
      }
    } else {
      rules[index][field] = e.target.value;
    }

    saveRules();
  });

  // Delete rule with auto save
  rulesBody.addEventListener('click', e => {
    if (e.target.dataset.action === 'delete') {
      const index = Number(e.target.dataset.index);
      if (!Number.isNaN(index)) {
        rules.splice(index, 1);
        renderRules();
        saveRules();
      }
    }
  });

  // Download rules as JSON
  downloadBtn.addEventListener('click', () => {
    const toDownload = rules.map(r => ({
      domain: r.domain || '',
      querySelector: sanitizeSelector(r.querySelector || ''),
      delay: parseInt(r.delay) || 500
    }));
    const blob = new Blob([JSON.stringify(toDownload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auto-scroll-clicker-settings.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Upload rules from file
  uploadInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          rules = imported.map(r => ({
            domain: r.domain || '',
            querySelector: sanitizeSelector(r.querySelector || ''),
            delay: parseInt(r.delay) || 500
          }));
          renderRules();
          saveRules();
          alert('Settings loaded and saved automatically!');
        } else {
          alert('Invalid file format. Expected an array of rules.');
        }
      } catch (err) {
        alert('Error parsing file: ' + err.message);
      }
    };
    reader.readAsText(file);
    uploadInput.value = '';
  });
});
