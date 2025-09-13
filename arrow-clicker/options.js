document.addEventListener('DOMContentLoaded', () => {
  const rulesBody = document.getElementById('rulesBody');
  const addBtn = document.getElementById('addRule');
  const downloadBtn = document.getElementById('download');
  const uploadInput = document.getElementById('upload');

  function renderRules() {
    chrome.storage.sync.get('sites', data => {
      const sites = data.sites || {};
      rulesBody.innerHTML = '';

      Object.keys(sites).forEach(domain => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${domain}</td>
          <td>${sites[domain].left}</td>
          <td>${sites[domain].right}</td>
          <td>
            <button data-action="delete" data-domain="${domain}">Delete</button>
          </td>
        `;

        rulesBody.appendChild(row);
      });

      // Delete rule
      document.querySelectorAll("button[data-action='delete']").forEach(btn => {
        btn.addEventListener('click', () => {
          const domain = btn.getAttribute('data-domain');
          chrome.storage.sync.get('sites', data => {
            const sites = data.sites || {};
            delete sites[domain];
            chrome.storage.sync.set({ sites }, renderRules);
          });
        });
      });
    });
  }

  // Add rule
  addBtn.addEventListener('click', () => {
    const domain = document.getElementById('domain').value.trim();
    const left = document.getElementById('leftSelector').value.trim();
    const right = document.getElementById('rightSelector').value.trim();

    if (!domain || !left || !right) return;

    chrome.storage.sync.get('sites', data => {
      const sites = data.sites || {};
      sites[domain] = { left, right };
      chrome.storage.sync.set({ sites }, renderRules);
    });

    document.getElementById('domain').value = '';
    document.getElementById('leftSelector').value = '';
    document.getElementById('rightSelector').value = '';
  });

  // Download settings
  downloadBtn.addEventListener('click', () => {
    chrome.storage.sync.get('sites', data => {
      const blob = new Blob([JSON.stringify(data.sites || {}, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'arrow-clicker-settings.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // Upload settings
  uploadInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (typeof imported === 'object') {
          chrome.storage.sync.set({ sites: imported }, renderRules);
          alert('Settings imported successfully!');
        } else {
          alert('Invalid settings file.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  });

  renderRules();
});
