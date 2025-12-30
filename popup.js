// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('geminiApiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    const editApiKeyButton = document.getElementById('editApiKeyButton');
    const observationsInput = document.getElementById('observations');
    const temaInput = document.getElementById('temaInput');
    const ticketInput = document.getElementById('ticketInput');
    const userInput = document.getElementById('userInput');
    const userEmailInput = document.getElementById('userEmailInput');
    const generateEmailButton = document.getElementById('generateEmail');
    const generatedSubject = document.getElementById('generatedSubject');
    const generatedBody = document.getElementById('generatedBody');
    const fillFieldsButton = document.getElementById('fillFields');
    const templateSelect = document.getElementById('templateSelect');
    const addTemplateBtn = document.getElementById('addTemplate');
    const editTemplateBtn = document.getElementById('editTemplate');
    const deleteTemplateBtn = document.getElementById('deleteTemplate');
    const templatePreview = document.getElementById('templatePreview');
    const tplPreviewSubject = document.getElementById('tplPreviewSubject');
    const tplPreviewBody = document.getElementById('tplPreviewBody');
    const copySubjectBtn = document.getElementById('copySubject');
    const copyBodyBtn = document.getElementById('copyBody');
    const openSidebarBtn = document.getElementById('openSidebarBtn');

    let packagedTemplates = [];
    let userTemplates = [];
    let templatesList = [];

    function refreshTemplatesList() {
        templatesList = (packagedTemplates || []).concat(userTemplates || []);
        // repopulate select
        if (!templateSelect) return;
        templateSelect.innerHTML = '';
        const noneOpt = document.createElement('option'); noneOpt.value = ''; noneOpt.textContent = '(None)';
        templateSelect.appendChild(noneOpt);
        for (const t of templatesList) {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = (t.name || t.id) + (userTemplates.find(ut=>ut.id===t.id) ? ' (custom)' : '');
            templateSelect.appendChild(opt);
        }
    }

    // Load packaged templates then user templates from storage
    if (templateSelect) {
        fetch('templates.json')
        .then(r => r.json())
        .then(arr => {
            packagedTemplates = Array.isArray(arr) ? arr : [];
            chrome.storage.local.get(['userTemplates'], function(res) {
                userTemplates = Array.isArray(res.userTemplates) ? res.userTemplates : [];
                refreshTemplatesList();
            });
        }).catch(err => {
            console.error('Failed to load templates.json', err);
            chrome.storage.local.get(['userTemplates'], function(res) {
                userTemplates = Array.isArray(res.userTemplates) ? res.userTemplates : [];
                packagedTemplates = [];
                refreshTemplatesList();
            });
        });

        // update preview when selection changes
        templateSelect.addEventListener('change', () => {
            const sel = templateSelect.value;
            if (!sel) { templatePreview.style.display = 'none'; return; }
            const t = templatesList.find(x => x.id === sel);
            if (t) {
                templatePreview.style.display = 'block';
                tplPreviewSubject.textContent = t.subject || '';
                tplPreviewBody.textContent = t.body || '';
            } else {
                templatePreview.style.display = 'none';
            }
        });

        // Add template
        if (addTemplateBtn) addTemplateBtn.addEventListener('click', () => {
            const id = prompt('Template id (short, no spaces):');
            if (!id) return;
            if (templatesList.find(t=>t.id===id)) { alert('A template with that id already exists.'); return; }
            const name = prompt('Template name (friendly):', id) || id;
            const subject = prompt('Template subject (use placeholders like [USER_NAME], [TICKET], [USER_EMAIL], [THEME]):', '') || '';
            const body = prompt('Template body (use placeholders):', '') || '';
            const nt = { id, name, subject, body };
            userTemplates.push(nt);
            chrome.storage.local.set({userTemplates}, () => { refreshTemplatesList(); templateSelect.value = id; templateSelect.dispatchEvent(new Event('change')); });
        });

        // Edit template (only user templates editable; packaged templates can be copied to user)
        if (editTemplateBtn) editTemplateBtn.addEventListener('click', () => {
            const sel = templateSelect.value;
            if (!sel) { alert('Select a template to edit.'); return; }
            let ut = userTemplates.find(t=>t.id===sel);
            if (!ut) {
                // clone packaged into userTemplates for editing
                const pt = packagedTemplates.find(t=>t.id===sel);
                if (!pt) { alert('Template not found.'); return; }
                ut = Object.assign({}, pt);
                // ensure unique id
                let newId = ut.id + '_custom';
                let i = 1; while (templatesList.find(t=>t.id===newId)) { newId = ut.id + '_custom' + i++; }
                ut.id = newId;
                userTemplates.push(ut);
            }
            const name = prompt('Template name:', ut.name) || ut.name;
            const subject = prompt('Template subject (placeholders):', ut.subject) || ut.subject;
            const body = prompt('Template body (placeholders):', ut.body) || ut.body;
            ut.name = name; ut.subject = subject; ut.body = body;
            chrome.storage.local.set({userTemplates}, () => { refreshTemplatesList(); templateSelect.value = ut.id; templateSelect.dispatchEvent(new Event('change')); });
        });

        // Delete template (only user templates deletable)
        if (deleteTemplateBtn) deleteTemplateBtn.addEventListener('click', () => {
            const sel = templateSelect.value;
            if (!sel) { alert('Select a template to delete.'); return; }
            const idx = userTemplates.findIndex(t=>t.id===sel);
            if (idx === -1) { alert('Only custom templates can be deleted. To edit a packaged one, use Edit which will create a custom copy.'); return; }
            if (!confirm('Delete template "' + userTemplates[idx].name + '"?')) return;
            userTemplates.splice(idx,1);
            chrome.storage.local.set({userTemplates}, () => { refreshTemplatesList(); templateSelect.value = ''; templateSelect.dispatchEvent(new Event('change')); });
        });
    }

    // Open sidebar (create a popup window positioned to the right)
    if (openSidebarBtn) {
        openSidebarBtn.addEventListener('click', () => {
            const width = 420;
            const height = Math.min(screen.availHeight || 800, 1000);
            const left = (screen.availWidth ? Math.max(0, (screen.availWidth - width)) : undefined);
            const createOptions = {
                url: chrome.runtime.getURL('popup.html'),
                type: 'popup',
                width,
                height
            };
            if (typeof left !== 'undefined') createOptions.left = left;
            try {
                chrome.windows.create(createOptions);
            } catch (e) {
                // fallback: open a new tab
                window.open(chrome.runtime.getURL('popup.html'), '_blank');
            }
        });
    }

    // Global error handlers to capture stack traces from the popup
    window.addEventListener('error', (evt) => {
        console.error('Popup window error:', evt.message, evt.filename + ':' + evt.lineno + ':' + evt.colno, evt.error && evt.error.stack);
        // keep default behaviour
    });
    window.addEventListener('unhandledrejection', (evt) => {
        console.error('Unhandled promise rejection in popup:', evt.reason);
    });

    // Load saved API key
    chrome.storage.sync.get(['geminiApiKey'], function(result) {
        if (result.geminiApiKey) {
            apiKeyInput.style.display = 'none';
            saveApiKeyButton.style.display = 'none';
            editApiKeyButton.style.display = 'inline';
            apiKeyStatus.textContent = 'API Key saved';
        }
    });

    // Save API key
    saveApiKeyButton.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({geminiApiKey: apiKey}, function() {
                apiKeyStatus.textContent = 'API Key saved';
                apiKeyInput.style.display = 'none';
                saveApiKeyButton.style.display = 'none';
                editApiKeyButton.style.display = 'inline';
            });
        } else {
            apiKeyStatus.textContent = 'Please enter a valid API Key';
        }
    });

    // Edit API key (show the input so user can change it)
    editApiKeyButton.addEventListener('click', function() {
        apiKeyInput.style.display = 'inline';
        saveApiKeyButton.style.display = 'inline';
        editApiKeyButton.style.display = 'none';
        apiKeyStatus.textContent = '';
    });

    // Generate email
    generateEmailButton.addEventListener('click', function() {
        const observations = observationsInput ? observationsInput.value.trim() : '';
        const tema = temaInput ? temaInput.value.trim() : '';
        const ticket = ticketInput ? ticketInput.value.trim() : '';
        const userName = userInput ? userInput.value.trim() : '';
        const userEmail = userEmailInput ? userEmailInput.value.trim() : '';
        // observations are optional; no required freeform description since tema/subject may be provided
        const selectedTemplateId = templateSelect ? templateSelect.value : '';
        const selectedTemplate = templatesList.find(t => t.id === selectedTemplateId);

        chrome.storage.sync.get(['geminiApiKey'], function(result) {
            const apiKey = result.geminiApiKey;
            if (!apiKey) {
                alert('Please save your Gemini API Key first.');
                return;
            }
            // Discover a model that supports generateContent, then call it
            generateEmailButton.disabled = true;
            fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
            .then(async listResp => {
                const txt = await listResp.text();
                let listData = null;
                try {
                    listData = JSON.parse(txt);
                } catch (e) {
                    console.error('Failed to parse models.list response:', txt);
                    throw new Error('Failed to list models. See console for details.');
                }
                if (!listResp.ok) {
                    console.error('models.list error', listResp.status, listData);
                    throw new Error((listData && listData.error && listData.error.message) || `models.list returned ${listResp.status}`);
                }
                const models = listData.models || [];
                // Find first model that advertises generateContent
                let targetModel = null;
                for (const m of models) {
                    const methods = m.supportedGenerationMethods || m.supported_actions || m.supportedActions || [];
                    if (Array.isArray(methods) && methods.includes('generateContent')) {
                        targetModel = m.name; // e.g., "models/gemini-1.5-flash"
                        break;
                    }
                }
                if (!targetModel) {
                    console.warn('No model supporting generateContent was found', models.map(m=>m.name));
                    throw new Error('No model found that supports generateContent. Check your API access.');
                }
                // Cache the chosen model for faster subsequent calls
                if (targetModel) {
                    chrome.storage.sync.set({geminiModel: targetModel});
                }
                // Call the chosen model's generateContent endpoint
                // Build instruction including optional fields and optional template guidance
                let instruction = '';
                if (selectedTemplate) {
                    // provide template as a style example; replace placeholders with provided values when available
                    let subjExample = selectedTemplate.subject || '';
                    let bodyExample = selectedTemplate.body || '';
                    subjExample = subjExample.replace(/\[USER_NAME\]/g, userName || '[USER_NAME]')
                                            .replace(/\[TICKET\]/g, ticket || '[TICKET]')
                                            .replace(/\[USER_EMAIL\]/g, userEmail || '[USER_EMAIL]')
                                            .replace(/\[THEME\]/g, tema || '[THEME]');
                    bodyExample = bodyExample.replace(/\[USER_NAME\]/g, userName || '[USER_NAME]')
                                         .replace(/\[TICKET\]/g, ticket || '[TICKET]')
                                         .replace(/\[USER_EMAIL\]/g, userEmail || '[USER_EMAIL]')
                                         .replace(/\[THEME\]/g, tema || '[THEME]');
                    instruction += `Follow this template for tone and structure. Example subject: ${subjExample}\nExample body: ${bodyExample}\n\n`;
                }
                instruction += `Generate a professional helpdesk email. Provide the subject and body.`;
                if (tema) instruction = `Preferred subject/theme: ${tema}. ` + instruction;
                if (ticket) instruction += ` Include the ticket number: ${ticket}.`;
                if (userName) instruction += ` The request concerns user: ${userName}.`;
                if (userEmail) instruction += ` User email: ${userEmail}.`;
                if (typeof observations !== 'undefined' && observations) instruction += ` Additional observations: ${observations}.`;
                const payload = { contents: [{ parts: [{ text: instruction }] }] };
                const url = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${apiKey}`;
                return fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            })
            .then(async resp => {
                const text = await resp.text();
                let data = null;
                try { data = JSON.parse(text); } catch(e) { console.error('Non-JSON response from generateContent:', text); }
                if (!resp.ok) {
                    console.error('Gemini API error', resp.status, data || text);
                    alert('Gemini API Error (non-OK response): ' + resp.status + '\n' + (data && data.error ? data.error.message : text));
                    return;
                }
                if (data && data.candidates && data.candidates[0]) {
                    const parts = data.candidates[0].content && data.candidates[0].content.parts;
                    const contentText = parts && parts[0] && parts[0].text ? parts[0].text : (Array.isArray(parts) ? parts.join('\n') : '');
                    // Parse subject and body with fallbacks
                    let subject = '';
                    let body = '';
                    if (contentText) {
                        const lines = contentText.split('\n').map(l => l.trim()).filter(Boolean);
                        // Match subject lines even if they are Markdown bolded like **Subject:** or similar
                        const subjRegex = /^\s[*_`"'\[\(]*\s*subject\s*[*_`"'\]\)]*\s*[:\-]?\s*/i;
                        const subjLine = lines.find(l => subjRegex.test(l));
                        if (subjLine) {
                            subject = subjLine.replace(subjRegex, '').trim();
                            // everything after subjLine is body
                            const idx = lines.indexOf(subjLine);
                            body = lines.slice(idx+1).join('\n');
                        } else {
                            // fallback: first non-empty line as subject, rest as body
                            subject = lines[0] || '';
                            body = lines.slice(1).join('\n') || '';
                            // if still empty, try to split by sentence
                            if (!body) {
                                const firstSentenceMatch = contentText.match(/^(.+?[.!?])\s+/);
                                if (firstSentenceMatch) {
                                    subject = firstSentenceMatch[1];
                                    body = contentText.replace(firstSentenceMatch[0], '').trim();
                                }
                            }
                        }
                            // Only strip leading separator or subject-like lines from the body
                            const sepRegex = /^[\-*_\u2014]{3,}$/;
                            const bodyLines = body.split('\n').map(l => l.trim());
                            // drop empty lines and leading separators/subject markers
                            let i = 0;
                            while (i < bodyLines.length) {
                                const ln = bodyLines[i];
                                if (!ln) { i++; continue; }
                                if (sepRegex.test(ln)) { i++; continue; }
                                if (subjRegex.test(ln)) { i++; continue; }
                                break;
                            }
                            const cleanedBodyLines = bodyLines.slice(i);
                            body = cleanedBodyLines.join('\n').trim();
                    }
                    generatedSubject.textContent = subject;
                    generatedBody.textContent = body;
                    if (copySubjectBtn) copySubjectBtn.disabled = false;
                    if (copyBodyBtn) copyBodyBtn.disabled = false;
                } else {
                    console.error('Unexpected Gemini generateContent response:', data || text);
                    alert('Error generating email. See console for details.');
                }
            })
            .catch(err => {
                console.error('Generation flow error:', err);
                alert('Gemini API Error: ' + (err && err.message ? err.message : err));
            })
            .finally(() => { generateEmailButton.disabled = false; });
        });
    });

    // Copy Subject and Body buttons
    if (copySubjectBtn) {
        copySubjectBtn.addEventListener('click', function() {
            const subjectText = generatedSubject.textContent || '';
            if (!subjectText) { alert('No subject to copy'); return; }
            if (!navigator.clipboard) {
                const ta = document.createElement('textarea'); ta.value = subjectText; document.body.appendChild(ta); ta.select();
                try { document.execCommand('copy'); alert('Subject copied'); } catch(e) { alert('Copy failed'); }
                ta.remove(); return;
            }
            navigator.clipboard.writeText(subjectText).then(() => { alert('Subject copied to clipboard'); }).catch(err => { console.error(err); alert('Failed to copy subject'); });
        });
    }
    if (copyBodyBtn) {
        copyBodyBtn.addEventListener('click', function() {
            const bodyText = generatedBody.textContent || '';
            if (!bodyText) { alert('No body to copy'); return; }
            if (!navigator.clipboard) {
                const ta = document.createElement('textarea'); ta.value = bodyText; document.body.appendChild(ta); ta.select();
                try { document.execCommand('copy'); alert('Body copied'); } catch(e) { alert('Copy failed'); }
                ta.remove(); return;
            }
            navigator.clipboard.writeText(bodyText).then(() => { alert('Body copied to clipboard'); }).catch(err => { console.error(err); alert('Failed to copy body'); });
        });
    }
});
