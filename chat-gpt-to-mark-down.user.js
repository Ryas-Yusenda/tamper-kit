// ==UserScript==
// @name         ChatGPT to MarkDown
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.0.0
// @description  Export ChatGPT conversation to Markdown
// @author       Ry-ys
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/chat-gpt-to-mark-down.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/chat-gpt-to-mark-down.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Create the export button when the page loads
  window.onload = () => {
    createExportButton();
    // Ensure the button doesn't disappear
    setInterval(() => {
      if (!document.getElementById('export-chat')) {
        createExportButton();
      }
    }, 2000);
  };

  // Create Export Button
  function createExportButton() {
    const btn = document.createElement('button');
    btn.id = 'export-chat';
    btn.textContent = 'Export Chat';
    Object.assign(btn.style, {
      marginLeft: '6px',
      marginRight: '6px',
      padding: '5px',
      height: 'auto',
      width: '93%',
      backgroundColor: '#4cafa3',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer'
    });
    btn.addEventListener('click', exportChatAsMarkdown);

    // --- Hover effect ---
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = '#42998f';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = '#4cafa3';
    });

    // Find the element with data-testid="create-new-chat-button"
    const target = document.querySelector('aside > a.group.__menu-item.hoverable[data-testid="create-new-chat-button"]');
    if (target && target.parentNode) {
      target.parentNode.insertBefore(btn, target);
    }
  }

  // Get conversation elements
  function getConversationElements() {
    return document.querySelectorAll('div[data-message-id]');
  }

  // Export chat as markdown
  function exportChatAsMarkdown() {
    let markdownContent = '';
    const allElements = getConversationElements();

    for (let i = 0; i < allElements.length; i += 2) {
      if (!allElements[i + 1]) break;
      let userText = allElements[i].textContent.trim();
      let answerHtml = allElements[i + 1].innerHTML.trim();

      userText = htmlToMarkdown(userText);
      answerHtml = htmlToMarkdown(answerHtml);

      markdownContent += `\n# 🌟 User Question\n${userText}\n# 🤖 Answer\n${answerHtml}`;
    }

    if (markdownContent) {
      // Use the page title as the file name
      let pageTitle = document.title || 'chat-export';
      pageTitle = pageTitle.replace(/[\\\/:*?"<>|]/g, '').trim();
      if (!pageTitle) pageTitle = 'chat-export';

      const filename = `${pageTitle}.md`;

      // Trigger file download
      downloadFile(markdownContent, filename, 'text/markdown');
    } else {
      console.log('❌ No conversation found.');
    }
  }

  // File download helper
  function downloadFile(data, filename, type) {
    const file = new Blob([data], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  // Convert HTML into Markdown (Improved)
  function htmlToMarkdown(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // --- Headings ---
    doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
      const level = h.tagName[1];
      h.replaceWith('\n' + '#'.repeat(level) + ' ' + h.textContent.trim() + '\n');
    });

    // --- Blockquotes ---
    doc.querySelectorAll('blockquote').forEach(bq => {
      const text = bq.textContent
        .trim()
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n');
      bq.replaceWith('\n' + text + '\n');
    });

    // --- Horizontal Rule ---
    doc.querySelectorAll('hr').forEach(hr => {
      hr.replaceWith('\n---\n');
    });

    // --- Inline Code ---
    doc.querySelectorAll('code').forEach(code => {
      code.replaceWith('`' + code.textContent + '`');
    });

    // --- Bold & Italic ---
    doc.querySelectorAll('strong, b').forEach(el => {
      el.replaceWith('**' + el.textContent + '**');
    });
    doc.querySelectorAll('em, i').forEach(el => {
      el.replaceWith('*' + el.textContent + '*');
    });

    // --- Links ---
    doc.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href') || '';
      link.replaceWith(`[${link.textContent}](${href})`);
    });

    // --- Images ---
    doc.querySelectorAll('img').forEach(img => {
      const alt = img.getAttribute('alt') || '';
      const src = img.getAttribute('src') || '';
      img.replaceWith(`![${alt}](${src})`);
    });

    // --- Code Blocks ---
    doc.querySelectorAll('pre').forEach(pre => {
      const code = pre.textContent.trim();
      pre.replaceWith(`\n\`\`\`\n${code}\n\`\`\`\n`);
    });

    // --- Unordered Lists ---
    doc.querySelectorAll('ul').forEach(ul => {
      let md = '';
      ul.querySelectorAll(':scope > li').forEach(li => {
        md += `- ${li.textContent.trim()}\n`;
      });
      ul.replaceWith('\n' + md);
    });

    // --- Ordered Lists ---
    doc.querySelectorAll('ol').forEach(ol => {
      let md = '';
      ol.querySelectorAll(':scope > li').forEach((li, idx) => {
        md += `${idx + 1}. ${li.textContent.trim()}\n`;
      });
      ol.replaceWith('\n' + md);
    });

    // --- Tables ---
    doc.querySelectorAll('table').forEach(table => {
      let md = '\n';
      const rows = table.querySelectorAll('tr');

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('th, td');
        const line = Array.from(cells)
          .map(cell => cell.textContent.trim())
          .join(' | ');
        md += '| ' + line + ' |\n';

        // Header separator after first row
        if (rowIndex === 0) {
          md +=
            '| ' +
            Array.from(cells)
              .map(() => '---')
              .join(' | ') +
            ' |\n';
        }
      });

      table.replaceWith(md + '\n');
    });

    // --- Paragraphs ---
    doc.querySelectorAll('p').forEach(p => {
      p.replaceWith('\n' + p.textContent.trim() + '\n');
    });

    return doc.body.textContent.trim();
  }
})();
