    // Theme toggle
    function toggleTheme() {
      const html = document.documentElement;
      const btn = document.querySelector('.theme-toggle');
      if (html.dataset.theme === 'dark') {
        html.dataset.theme = 'light';
        btn.textContent = '☕ → ☀️';
        localStorage.setItem('theme', 'light');
      } else {
        html.dataset.theme = 'dark';
        btn.textContent = '☕ → 🌙';
        localStorage.setItem('theme', 'dark');
      }
    }

    // Restore saved theme
    (function() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        document.documentElement.dataset.theme = saved;
        const btn = document.querySelector('.theme-toggle');
        btn.textContent = saved === 'dark' ? '☕ → 🌙' : '☕ → ☀️';
      }
    })();

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── Trollbox helper ──
    function tbTime(d) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // ── AI Config ──
    const AI_CONFIG = {
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: '',  // Set your API key here, or use a proxy
      model: 'gpt-4o-mini',
      systemPrompt: 'You are a helpful assistant helping visitors learn about Václav Pavlín. Be concise, technical, and friendly. Mention he is a Linux hacker, Solution Engineer at Logos, ex-Red Hat, and a builder at heart.',
    };

    // ── Chat State ──
    let chatMode = false;
    let chatHistory = [];

    // ── Terminal Emulator ──
    const commands = {
      help: () => `Available commands:
  <span style="color:var(--accent2)">neofetch</span>    Show system info
  <span style="color:var(--accent2)">whoami</span>      Who am I?
  <span style="color:var(--accent2)">fortune</span>     Random fact
  <span style="color:var(--accent2)">skills</span>      List skills
  <span style="color:var(--accent2)">projects</span>    List projects
  <span style="color:var(--accent2)">history</span>     Recent activity
  <span style="color:var(--accent2)">uptime</span>      How long I've been building
  <span style="color:var(--accent2)">chat</span>        Chat with AI
  <span style="color:var(--accent2)">trollbox</span>    Waku mesh chat
  <span style="color:var(--accent2)">clear</span>       Clear terminal
  <span style="color:var(--accent2)">help</span>        Show this help

  In trollbox: /nick /quit /peers /status /discover /@jimmy`,

      neofetch: () => `<span style="color:var(--accent)">        .--.        </span>  <span style="color:var(--accent2)">OS:</span>     vaclavOS 2026.06 x86_64
<span style="color:var(--accent)">        |o_o |       </span>  <span style="color:var(--accent2)">Kernel:</span>  6.8.0-logos
<span style="color:var(--accent)">        |:_/ |       </span>  <span style="color:var(--accent2)">Shell:</span>   bash 5.2
<span style="color:var(--accent)">       //   \\ \\      </span>  <span style="color:var(--accent2)">DE:</span>      Wayland (Sway)
<span style="color:var(--accent)">      (|     | )     </span>  <span style="color:var(--accent2)">WM:</span>      i3 / sway
<span style="color:var(--accent)">     /'\\_   _/ '\\    </span>  <span style="color:var(--accent2)">Terminal:</span> kitty / foot
<span style="color:var(--accent)">     \\___)=(___/     </span>  <span style="color:var(--accent2)">CPU:</span>     Ryzen AI Max+ 395
                         <span style="color:var(--accent2)">RAM:</span>     128GB DDR5
                         <span style="color:var(--accent2)">Uptime:</span>  ∞ days
                         <span style="color:var(--accent2)">Packages:</span> 2847 (vaclavOS)
                         <span style="color:var(--accent2)">Theme:</span>   Dracula [GTK2/3]
                         <span style="color:var(--accent2)">Discords:</span> 47
                         <span style="color:var(--accent2)">Coffee:</span>  ☕☕☕☕☕ (5/5)`,

      whoami: () => `vpavlin — Solution Engineer @ Logos
  ex-Red Hat (10 years)
  Co-founder (startup experience: what breaks first)
  Dad of 2
  Based in Brno, CZ
  Location: Europe/Prague
  Shell: /usr/bin/bash
  Interests: Linux, Rust, blockchain, local AI, 3D printing, coffee`,

      fortune: () => {
        const fortunes = [
          "Dad of 2 kids who are obsessed with robots. Future competitors.",
          "Based in Brno, Czech Republic — the city of brains and beer.",
          "My AI agent is named Jimmy. He's technically my second-in-command.",
          "455+ repos on GitHub. Some of them are good. Most are experiments.",
          "If it can be 3D printed, it probably will be.",
          "V60, AeroPress, Chemex, espresso. No bias, all methods welcome.",
          "The first thing to break is always the thing you assumed would work.",
          "Run it on your own hardware. If it's in the cloud, I'm suspicious.",
          "Your data is yours. Always has been, always should be.",
          "Decentralized systems: networks that don't need permission.",
          "Code. Peer-to-peer. Privacy. Local AI. Coffee. 3D printing. Dad. Repeat.",
          "Read a Prolog book at age 8–9, forgot it completely. Came back during university — whipped up a Prolog project without thinking.",
          "Once broke a datacenter at a nuclear power plant.",
          "Once broke Starbucks. Never read manuals. Learn by breaking things.",
          "Helped digitize books at the Czech National Library.",
          "First released Fedora Docker base images were built on my laptop.",
          "Worked in AI before it became the hype (see opendatahub.io).",
        ];
        return fortunes[Math.floor(Math.random() * fortunes.length)];
      },

      skills: () => `Skills & expertise:
  [████████████████████] Linux Software Engineering — 13+ years
  [██████████████████░░] Peer-to-Peer systems       — P2P networks, DHTs
  [██████████████████░░] Privacy                    — your data, your rules
  [████████████████░░░░] AI-Assisted Development    — I use AI, I ship code
  [██████████████░░░░░░] Blockchain infrastructure  — Logos/SPEL/QAKU
  [█████████████░░░░░░░] Home Assistant             — automations & IoT
  [███████████░░░░░░░░░] 3D Printing                — FreeCAD, Bambu Studio
  [███████████░░░░░░░░░] Coffee                     — V60, AeroPress, Chemex, espresso`,

      projects: () => `Projects in /home/vpavlin/projects/:
  ⚡ <span style="color:var(--accent2)">spel</span>         — Logos Execution Zone (Solana-like stateless programs)
  🔍 <span style="color:var(--accent2)">qaku</span>         — messaging & storage layer (P2P)
  🎭 <span style="color:var(--accent2)">joke-wall</span>    — community joke voting on SPEL
  🗣️ <span style="color:var(--accent2)">whisper-wall</span>  — anonymous bidding board
  📦 <span style="color:var(--accent2)">cerebrum</span>      — shared agent knowledge base
  🏠 <span style="color:var(--accent2)">domecek</span>       — home automation gateway
  Use <span style="color:var(--accent2)">ls -la /home/vpavlin/projects/</span> for full listing`,

      history: () => `Recent commits:
  <span style="color:var(--accent)">a3f8c2d</span> <span class="status-ok">feat:</span> add terminal to portfolio site
  <span style="color:var(--accent)">b7e1f45</span> <span class="status-ok">feat:</span> redesign portfolio with Linux hacker theme
  <span style="color:var(--accent)">c9d2e81</span> <span class="status-warn">wip:</span> add neofetch to vaclav-website
  <span style="color:var(--accent)">d4a5b92</span> <span class="status-ok">feat:</span> initial portfolio site
  <span style="color:var(--accent)">e1f3c77</span> <span class="status-err">fix:</span> theme toggle not persisting`,

      uptime: () => {
        const buildYears = 27;
        return `System uptime:
  ${buildYears}y of continuous building (started 1999, age ~11)
  Red Hat:      10 years (2012–2022)
  Logos:        1 year+ (2024–present)
  Startup:      7 months (2022–2022)
  First commit: 1999
  Current task: making this website more Linux-y`;
      },

      clear: () => '__CLEAR__',

      chat: () => {
        chatMode = true;
        chatHistory = [{ role: 'system', content: AI_CONFIG.systemPrompt }];
        return `<span style="color:var(--accent2)">🤖 AI Chat mode active</span>
  Ask anything about Václav or tech. Type /exit to quit.
  (Requires API key in AI_CONFIG)\n`;
      },

      trollbox: () => {
        tbMode = true;
        tbNickname = tbNickname || '';
        tbCmdHistory = [];
        tbCmdHistoryIndex = -1;
        // Clear terminal
        output.innerHTML = '';
        // Update prompt
        const promptHtml = `<span style="color:var(--accent2)">🔥 ${tbNickname || 'anon'}</span> <span style="color:var(--accent4)">● waiting</span> `;
        document.querySelector('.terminal-input-line .prompt').innerHTML = promptHtml;
        // Show header
        output.innerHTML += `<span style="color:var(--fg-muted);font-style:italic">🔥 trollbox — Waku mesh chat. /nick /quit /peers /status /discover /@jimmy\n</span>`;

        // Check if already agreed
        if (localStorage.getItem('tb-agreed') === '1') {
          output.innerHTML += `<span style="color:var(--fg-muted)">✓ Disclaimer accepted (type /disclaimer to re-show)</span>\n`;
          tbAwaitingConfirm = false;
          const p2 = `<span style="color:var(--accent2)">🔥 ${tbNickname || 'anon'}</span> <span style="color:var(--accent4)">● connecting</span> `;
          document.querySelector('.terminal-input-line .prompt').innerHTML = p2;
          output.innerHTML += `<span style="color:var(--accent)">Entering trollbox...</span>\n`;
          window.__tb?.init();
          input.focus();
          return '';
        }

        // Show disclaimer inline
        output.innerHTML += `<span style="color:var(--fg-muted)">─────────────────────────────────────────────────────────</span>\n`;
        output.innerHTML += `<span style="color:var(--accent4)">⚠ DISCLAIMER</span>: The author of this website cannot read,\n`;
        output.innerHTML += `<span style="color:var(--accent4)">  filter, or influence trollbox content. Messages come\n`;
        output.innerHTML += `<span style="color:var(--accent4)">  via Waku mesh from unknown peers. No moderation, no\n`;
        output.innerHTML += `<span style="color:var(--accent4)">  guarantee of delivery, no liability.</span>\n`;
        output.innerHTML += `<span style="color:var(--fg-muted)">─────────────────────────────────────────────────────────</span>\n`;
        output.innerHTML += `<span style="color:var(--accent2)">Press y to enter, n to go back: </span>`;
        // Set awaiting confirm
        tbAwaitingConfirm = true;
        return '';
      },

      ls: () => `index.html  README.md  assets/  .git/`,
      cat: () => `cat: missing operand\nTry 'cat /etc/passwd' for system info`,
      pwd: () => `/home/vpavlin`,
      date: () => new Date().toString(),
      echo: (args) => args.join(' '),
      uname: () => `Linux logos 6.8.0-logos #1 SMP PREEMPT_DYNAMIC vaclavOS x86_64 GNU/Linux`,
      id: () => `uid=1000(vpavlin) gid=1000(vpavlin) groups=1000(vpavlin),27(sudo),998(docker)`,
      df: () => `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       1.8T  420G  1.4T  23% /
/dev/sdb1       3.6T  1.2T  2.4T  33% /home`,
      free: () => `              total        used        free      shared  buff/cache   available
Mem:       131072000   45678912    34567890     2345678    50825198    82345678
Swap:       8388608     1234567     7154041`,
      top: () => `top - 14:32:01 up 42 days, 3:14,  1 user,  load average: 0.42, 0.38, 0.35
Tasks: 342 total,   3 running, 339 sleeping,   0 stopped,   0 zombie
%Cpu(s): 12.3 us,  3.2 sy,  0.0 ni, 83.1 id,  0.8 wa,  0.0 hi,  0.6 si
MiB Mem : 128000.0 total,  34567.8 free,  45678.9 used,  47753.3 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1234 vpavlin   20   0  456789 123456  45678 S  15.2   0.1   12:34.56 cargo
 2345 vpavlin   20   0  234567  89012  34567 S   8.3   0.1    5:43.21 llama.cpp
 3456 vpavlin   20   0  123456  67890  23456 S   2.1   0.1    1:23.45 kitty`,
    };

    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    let commandHistory = [];
    let historyIndex = -1;

    // ── Trollbox state ──
    const tbBody = document.getElementById('terminal-body');
    let tbMode = false;
    let tbConnected = false;
    let tbNickname = localStorage.getItem('tb-nickname') || '';
    let tbWakuNode = null;
    const TB_CONTENT_TOPIC = '/vpavlin/1/trollbox/json';
    let tbCmdHistory = [];
    let tbCmdHistoryIndex = -1;
    let tbAwaitingConfirm = false;

    // Known commands for TAB completion
    const knownCommands = Object.keys(commands);
    // Known file/dir completions
    const completions = {
      'ls': ['index.html', 'README.md', 'assets/', '.git/'],
      'cd': ['.', '..', 'projects/', 'devel/', 'cerebrum/'],
      'cat': ['/etc/passwd', '/var/log/talks.log', 'README.md'],
    };

    function getCompletions(inputValue) {
      const parts = inputValue.split(/\s+/);
      const current = parts[parts.length - 1];

      if (parts.length === 1) {
        // Complete command name
        return knownCommands.filter(c => c.startsWith(current)).slice(0, 10);
      }

      const cmd = parts[0].toLowerCase();
      if (completions[cmd] && parts.length >= 2) {
        return completions[cmd].filter(c => c.startsWith(current)).slice(0, 10);
      }

      return [];
    }

    function showCompletions(completions, currentInput) {
      if (completions.length === 0) return;
      if (completions.length === 1) {
        const parts = currentInput.split(/\s+/);
        parts[parts.length - 1] = completions[0];
        input.value = parts.join(' ');
        return;
      }
      // Multiple matches - show them
      const match = completions[0];
      const common = match.split('').findIndex((c, i) =>
        completions.every(m => m[i] === c)
      );
      if (common > 0) {
        const parts = currentInput.split(/\s+/);
        parts[parts.length - 1] = match.substring(0, common);
        input.value = parts.join(' ');
      }
      // Show options below
      output.innerHTML += completions.join('  ') + '\n';
      const body = document.getElementById('terminal-body');
      body.scrollTop = body.scrollHeight;
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = input.value.trim();
        input.value = '';

        // Trollbox mode — send chat message
        if (tbMode) {
          // Disclaimer confirmation
          if (tbAwaitingConfirm) {
            tbAwaitingConfirm = false;
            if (raw === 'y') {
              localStorage.setItem('tb-agreed', '1');
              const promptHtml = `<span style="color:var(--accent2)">🔥 ${tbNickname || 'anon'}</span> <span style="color:var(--accent4)">● connecting</span> `;
              document.querySelector('.terminal-input-line .prompt').innerHTML = promptHtml;
              output.innerHTML += `<span style="color:var(--accent)">✓ Entering trollbox...</span>\n`;
              window.__tb?.init();
            } else {
              // 'n' or anything else — exit trollbox
              output.innerHTML += `<span style="color:var(--accent3)">✗ Cancelled</span>\n`;
              tbMode = false;
              const promptHtml = `<span class="prompt-user">vpavlin</span>@<span class="prompt-path">logos</span>:<span class="prompt-path">~</span>$ `;
              document.querySelector('.terminal-input-line .prompt').innerHTML = promptHtml;
            }
            tbBody.scrollTop = tbBody.scrollHeight;
            input.focus();
            return;
          }

          // Save commands to history (not chat messages)
          if (raw && raw.startsWith('/')) {
            tbCmdHistory.unshift(raw);
            if (tbCmdHistory.length > 50) tbCmdHistory.pop();
            tbCmdHistoryIndex = -1;
          }

          if (raw === '/quit' || raw === '/exit') {
            window.__tb?.quit();
            output.innerHTML += `<span style="color:var(--accent3)">👋 Left trollbox</span>\n`;
            const promptHtml = `<span class="prompt-user">vpavlin</span>@<span class="prompt-path">logos</span>:<span class="prompt-path">~</span>$ `;
            document.querySelector('.terminal-input-line .prompt').innerHTML = promptHtml;
          } else if (raw.startsWith('/nick ')) {
            tbNickname = raw.slice(6).trim() || 'anon';
            localStorage.setItem('tb-nickname', tbNickname);
            output.innerHTML += `<span style="color:var(--accent2)">nick:</span> now <span style="color:var(--accent)">${escapeHtml(tbNickname)}</span>\n`;
            window.__tb?.renderInput?.();
          } else if (raw === '/peers') {
            window.__tb?.showPeers();
          } else if (raw === '/status') {
            window.__tb?.showStatus();
          } else if (raw === '/discover') {
            window.__tb?.discoverPeers();
          } else if (raw === '/disclaimer') {
            output.innerHTML += `<span style="color:var(--fg-muted)">─────────────────────────────────────────────────────────</span>\n`;
            output.innerHTML += `<span style="color:var(--accent4)">⚠ DISCLAIMER</span>: The author of this website cannot read,\n`;
            output.innerHTML += `<span style="color:var(--accent4)">  filter, or influence trollbox content. Messages come\n`;
            output.innerHTML += `<span style="color:var(--accent4)">  via Waku mesh from unknown peers. No moderation, no\n`;
            output.innerHTML += `<span style="color:var(--accent4)">  guarantee of delivery, no liability.</span>\n`;
            output.innerHTML += `<span style="color:var(--fg-muted)">─────────────────────────────────────────────────────────</span>\n`;
            output.innerHTML += `<span style="color:var(--fg-muted)">Accepted ${new Date(localStorage.getItem('tb-agreed-at') || Date.now()).toLocaleString()} (type /agree to re-confirm)</span>\n`;
          } else if (raw === '/agree') {
            localStorage.setItem('tb-agreed', '1');
            localStorage.setItem('tb-agreed-at', Date.now().toString());
            output.innerHTML += `<span style="color:var(--accent2)">✓ Disclaimer re-accepted</span>\n`;
            input.focus();
          } else if (raw) {
            window.__tb?.send(raw);
          }
          tbBody.scrollTop = tbBody.scrollHeight;
          input.focus();
          return;
        }

        // Echo the command
        const cmdLine = `<span class="prompt"><span class="prompt-user">vpavlin</span>@<span class="prompt-path">logos</span>:<span class="prompt-path">~</span>$ </span>${escapeHtml(raw)}\n`;
        output.innerHTML += cmdLine;

        if (raw) {
          commandHistory.unshift(raw);
          if (commandHistory.length > 50) commandHistory.pop();
          historyIndex = -1;

          const parts = raw.split(/\s+/);
          const cmd = parts[0].toLowerCase();
          const args = parts.slice(1);

          if (commands[cmd]) {
            const result = commands[cmd](args);
            if (result === '__CLEAR__') {
              output.innerHTML = '';
            } else {
              output.innerHTML += result + '\n';
            }
          } else {
            output.innerHTML += `<span style="color:var(--accent3)">bash: ${escapeHtml(cmd)}: command not found</span>\n`;
          }
        }

        // Scroll to bottom
        const body = document.getElementById('terminal-body');
        body.scrollTop = body.scrollHeight;
        input.focus();
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const completions = getCompletions(input.value);
        if (completions.length > 0) {
          showCompletions(completions, input.value);
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (tbMode && !tbAwaitingConfirm) {
          if (tbCmdHistoryIndex < tbCmdHistory.length - 1) {
            tbCmdHistoryIndex++;
            input.value = tbCmdHistory[tbCmdHistoryIndex];
          }
        } else {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
          }
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (tbMode && !tbAwaitingConfirm) {
          if (tbCmdHistoryIndex > 0) {
            tbCmdHistoryIndex--;
            input.value = tbCmdHistory[tbCmdHistoryIndex];
          } else {
            tbCmdHistoryIndex = -1;
            input.value = '';
          }
        } else {
          if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
          } else {
            historyIndex = -1;
            input.value = '';
          }
        }
      }
    });

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Handle chat mode input
    const originalKeydown = input.onkeydown;
    input.addEventListener('keydown', async (e) => {
      if (!chatMode) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        const raw = input.value.trim();
        input.value = '';

        if (!raw) return;

        const body = document.getElementById('terminal-body');

        // Check for exit command
        if (raw === '/exit' || raw === '/quit') {
          chatMode = false;
          chatHistory = [];
          output.innerHTML += `<span style="color:var(--accent3)">👋 Chat mode exited</span>\n`;
          body.scrollTop = body.scrollHeight;
          return;
        }

        // Echo user message
        output.innerHTML += `<span style="color:var(--accent2)">you:</span> ${escapeHtml(raw)}\n`;
        chatHistory.push({ role: 'user', content: raw });

        // Show loading
        const loadingId = 'chat-loading-' + Date.now();
        output.innerHTML += `<span id="${loadingId}" style="color:var(--fg-muted)">thinking...</span>\n`;
        body.scrollTop = body.scrollHeight;

        try {
          const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
            },
            body: JSON.stringify({
              model: AI_CONFIG.model,
              messages: chatHistory,
              max_tokens: 500,
              temperature: 0.7,
            }),
          });

          const data = await response.json();
          const aiReply = data.choices?.[0]?.message?.content || 'No response.';
          chatHistory.push({ role: 'assistant', content: aiReply });

          document.getElementById(loadingId).innerHTML = `<span style="color:var(--accent)">ai:</span> ${escapeHtml(aiReply)}`;
        } catch (err) {
          document.getElementById(loadingId).innerHTML = `<span style="color:var(--accent3)">ai:</span> Error: ${escapeHtml(err.message)}\nCheck API key in AI_CONFIG.`;
        }

        body.scrollTop = body.scrollHeight;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (chatMode) {
          const completions = ['/exit'];
          if (completions.length > 0) {
            showCompletions(completions, input.value);
          }
        }
      }
    });

    // ── Trollbox TUI ──
    (function() {
      function tbStatus(connected) {
        return connected
          ? '<span style="color:var(--accent)">●</span> connected'
          : '<span style="color:var(--accent4)">●</span> connecting';
      }

      function tbAddMessage(sender, text, time, isSystem) {
        if (isSystem) {
          output.innerHTML += `<span style="color:var(--fg-muted);font-style:italic">  [system] ${escapeHtml(text)}</span>\n`;
        } else {
          const t = tbTime(new Date());
          output.innerHTML += `<span style="color:var(--fg-muted)">${escapeHtml(t)}</span> <span style="color:var(--accent2);font-weight:600">${escapeHtml(sender)}:</span> <span style="color:var(--fg)">${escapeHtml(text)}</span>\n`;
        }
        tbBody.scrollTop = tbBody.scrollHeight;
      }

      // Write raw HTML to terminal (no escaping)
      function tbAddRaw(html) {
        output.innerHTML += html + '\n';
        tbBody.scrollTop = tbBody.scrollHeight;
      }

      async function tbInit() {
        tbAddMessage('system', 'Booting Waku mesh node...', true);
        try {
          // Wait for Waku bundle to be available (module scripts load after inline)
          let tries = 0;
          const maxTries = 100;  // Increase to 10 seconds
          while ((typeof createLightNode !== 'function' || typeof window.Waku === 'undefined') && tries < maxTries) {
            await new Promise(r => setTimeout(r, 100));
            tries++;
            if (tries % 10 === 0) {
              console.log(`Waiting for Waku bundle... (${tries}ms)`);
              tbAddMessage('system', `Waiting for Waku SDK... (${tries/10}s)`, true);
            }
          }
          if (typeof createLightNode !== 'function' || typeof window.Waku === 'undefined') {
            console.error('Waku bundle failed to load after 10 seconds');
            tbAddMessage('system', 'Waku SDK not loaded after 10 seconds. Check network connection and console.', true);
            return;
          }
          
          console.log('Waku SDK loaded successfully:', window.Waku);

          // Create light node with both default bootstrap and explicit waku.sandbox peers
          const nodeOptions = {
            numPeersToUse: 2,
            defaultBootstrap: true,
            discovery: {
              dns: true,
              peerExchange: true,
              peerCache: true
            },
            bootstrapPeers: [
              '/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmNaeL4p3WEYzC9mgXBmBWSgWjPHRvatZTXnp8Jgv3iKsb',
              '/dns4/node-01.gc-us-central1-a.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmRv1iQ3NoMMcjbtRmKxPuYBbF9nLYz2SDv9MTN8WhGuUU',
              '/dns4/node-01.ac-cn-hongkong-c.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmQYiojgZ8APsh9wqbWNyCstVhnp9gbeNrxSEQnLJchC92'
            ],
            // Use correct Waku Network configuration
            networkConfig: {
              clusterId: 1,  // The Waku Network cluster ID (not 0!)
              numShardsInCluster: 8  // Default number of shards per cluster
            }
          };
          
          // Enable Waku debug logging - multiple methods
          if (typeof window !== 'undefined') {
            window.DEBUG = true;
            localStorage.setItem('waku-debug', 'true');
            localStorage.setItem('DEBUG', 'true');
            // Try to enable debug through environment variable simulation (Node.js only)
            if (typeof process !== 'undefined' && process.env) {
              process.env['WAKU_DEBUG'] = 'true';
            }
          }
          
          console.log('Creating Waku node with options:', JSON.stringify(nodeOptions, null, 2));
          
          // Set up comprehensive logging
          const originalLog = console.log;
          const originalError = console.error;
          console.log = function(...args) {
            originalLog.apply(console, args);
            // Also output to terminal if possible
            if (typeof tbAddMessage !== 'undefined' && args[0] && typeof args[0] === 'string' && args[0].includes('Waku')) {
              tbAddMessage('debug', args.join(' '), true);
            }
          };
          
          try {
            tbWakuNode = await createLightNode(nodeOptions);
            console.log('Waku node created successfully');
          } catch(nodeError) {
            console.error('Failed to create Waku node:', nodeError);
            tbAddMessage('system', 'Failed to create Waku node: ' + nodeError.message, true);
            return;
          }
          tbAddMessage('system', `Mesh node started. Waiting for peers...`, true);
          
          // Wait for at least one peer connection with detailed monitoring
          let connected = false;
          console.log('Starting peer connection wait...');
          for (let i = 0; i < 40; i++) {  // Increase to 20 seconds total
            await new Promise(r => setTimeout(r, 500));
            try {
              const conns = tbWakuNode.libp2p.getConnections();
              console.log(`Attempt ${i+1}: Connected peers:`, conns.length, conns);
              
              // Also check the peer store
              if (tbWakuNode.libp2p.peerStore) {
                const peers = tbWakuNode.libp2p.peerStore.peers;
                console.log(`Peers in store:`, peers ? Array.from(peers.keys()) : 'none');
              }
              
              // Check dialer for pending connections
              if (tbWakuNode.libp2p.dialer) {
                const addresses = tbWakuNode.libp2p.dialer.addresses;
                console.log(`Dialer addresses:`, addresses);
              }
              
              if (conns.length > 0) {
                connected = true;
                console.log('Peer connection established!');
                break;
              }
            } catch(e) {
              console.log(`Error checking connections:`, e.message);
            }
          }
          
          if (!connected) {
            console.log('No peers connected after timeout');
            // Try to show what addresses we're trying to connect to
            if (tbWakuNode.libp2p.addressManager) {
              console.log('Address manager:', tbWakuNode.libp2p.addressManager);
            }
          }
          
          tbAddMessage('system', 'Warning: No peers connected yet. Will try to send anyway.', true);
          
          tbAddMessage('system', `Subscribing to ${TB_CONTENT_TOPIC}...`, true);

          const decoder = tbWakuNode.createDecoder({
            contentTopic: TB_CONTENT_TOPIC
          });

          try {
            await tbWakuNode.filter.subscribe(decoder, (decodedMsg) => {
              try {
                const msg = JSON.parse(new TextDecoder().decode(decodedMsg.payload));
                const time = tbTime(new Date(msg.timestamp || Date.now()));

                // Skip our own messages
                if (msg.sender === (tbNickname || 'anon') && msg.time) {
                  const lastLine = output.innerHTML.split('\n').pop();
                  if (lastLine && lastLine.includes(msg.text)) return;
                }

                tbAddMessage(msg.sender, msg.text, time, false);

                // Jimmy mentions
                if (/@jimmy|@jimm/.test(msg.text)) {
                  tbJimmyReply(msg.sender);
                }
              } catch(e) {
                console.warn('tb parse error:', e);
              }
            });
          } catch(subscribeError) {
            tbAddMessage('system', `Subscribe failed: ${subscribeError.message}`, true);
            console.error('Subscription error:', subscribeError);
          }

          // Check actual peer connections
          let peerCount = 0;
          try {
            const conns = tbWakuNode.libp2p.getConnections();
            peerCount = conns.length;
          } catch(e) {}
          
          if (peerCount > 0) {
            tbConnected = true;
          } else {
            tbConnected = false;
          }
          
          const peerText = peerCount > 0 ? ` (${peerCount} peer${peerCount > 1 ? 's' : ''})` : '';
          // Update prompt to show connection status
          const statusColor = peerCount > 0 ? 'var(--accent)' : 'var(--accent4)';
          const statusText = peerCount > 0 ? 'connected' : 'connecting';
          const promptHtml = `<span style="color:var(--accent2)">🔥 ${tbNickname || 'anon'}</span> <span style="color:${statusColor}">● ${statusText}${peerText}</span> `;
          document.querySelector('.terminal-input-line .prompt').innerHTML = promptHtml;
          
          if (peerCount > 0) {
            tbAddMessage('system', `● connected${peerText} — Troll box online. Say anything. @jimmy for reactions.`, true);
          } else {
            tbAddMessage('system', '⚠ No peers connected yet. Will attempt to connect in background.', true);
          }

        } catch(err) {
          console.error('tb init failed:', err);
          tbAddMessage('system', 'Mesh connection failed: ' + err.message, true);
        }
      }

      function tbJimmyReply(from) {
        const replies = [
          `@${from} what's up? 🔥`,
          `@${from} Jimmy heard you 👀`,
          `@${from} got shade? 😏`,
          `@${from} say less 🦞`,
          `@${from} lobsters watching 🦞`,
          `@${from} you rang? 👾`,
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        const time = tbTime(new Date());
        tbAddMessage('jimmy', reply, time, false);

        if (tbWakuNode?.lightPush) {
          const enc = tbWakuNode.createEncoder({ contentTopic: TB_CONTENT_TOPIC });
          tbWakuNode.lightPush.send(enc, new TextEncoder().encode(JSON.stringify({
            sender: 'jimmy', text: reply, time: new Date().toISOString(), timestamp: Date.now()
          })), { autoRetry: true }).catch(() => {});
        }
      }

function tbSendMsg(text) {
        const sender = tbNickname || 'anon';
        const time = tbTime(new Date());
        tbAddMessage(sender, text, time, false);

        if (!tbWakuNode?.lightPush) {
          tbAddMessage('system', 'Waku node not ready...', true);
          return;
        }

        const msg = JSON.stringify({ sender, text, ts: Date.now() });
        const enc = tbWakuNode.createEncoder({ contentTopic: TB_CONTENT_TOPIC });
        const payload = new TextEncoder().encode(msg);
        
        console.log('Sending', payload.length, 'bytes:', msg.substring(0, 100));
        
        tbWakuNode.lightPush.send(enc, payload)
          .then(results => {
            if (results.failures?.length > 0) {
              tbAddMessage('system', `Failed to ${results.failures.length} peers`, true);
            } else {
              tbAddMessage('system', '✓ Sent');
            }
          })
          .catch(err => {
            tbAddMessage('system', 'Send failed: ' + err.message, true);
          });
      }

      // ── Peer info extraction ──
      function getPeerInfo() {
        const peers = [];
        const node = tbWakuNode;
        if (!node) return peers;

        try {
          if (node.libp2p?.connectionManager?.connections) {
            const conns = node.libp2p.connectionManager.connections;
            for (const peer of conns.values()) {
              peers.push(peer);
            }
          }
        } catch(e) {}

        return peers.slice(0, 10);
      }
      });
