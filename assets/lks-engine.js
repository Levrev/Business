/* =====================================================================
   LKSystems Product Engine — behaviour
   ---------------------------------------------------------------------
   Self-contained IIFE: defines no globals, only queries inside
   #products, and never touches the site's existing script (mobile menu,
   hero canvas, #projectForm / Formspree). Safe to load with `defer`.
   ===================================================================== */
(function(){
  'use strict';

  var root = document.getElementById('products');
  if(!root) return;

  // Optional: set to a Formspree (or any JSON-accepting) endpoint to have
  // Custom Requests delivered somewhere. While empty, submissions are only
  // logged to the browser console.
  var REQUEST_ENDPOINT = '';

  function q(sel, ctx){ return (ctx || root).querySelector(sel); }
  function qa(sel, ctx){ return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  // Un-hide an element and replay the entrance animation.
  function reveal(el){
    el.hidden = false;
    el.classList.remove('lks-enter');
    void el.offsetWidth;
    el.classList.add('lks-enter');
  }


  /* ------------------------------------------------------------------
     Hub tabs (WAI-ARIA tabs pattern, arrow keys + Home/End)
     ------------------------------------------------------------------ */
  var tabs = qa('[role="tab"]');

  function activateTab(tab, moveFocus){
    tabs.forEach(function(t){
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if(!panel) return;
      if(on){ if(panel.hidden) reveal(panel); }
      else panel.hidden = true;
    });
    if(moveFocus) tab.focus();
    // keep the active chip visible in the horizontal (mobile) tab strip
    if(tab.scrollIntoView && tab.parentElement.scrollWidth > tab.parentElement.clientWidth){
      tab.scrollIntoView({block:'nearest', inline:'nearest'});
    }
  }

  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){ activateTab(tab, false); });
    tab.addEventListener('keydown', function(ev){
      var next = null;
      if(ev.key === 'ArrowDown' || ev.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if(ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if(ev.key === 'Home') next = tabs[0];
      else if(ev.key === 'End') next = tabs[tabs.length - 1];
      if(next){ ev.preventDefault(); activateTab(next, true); }
    });
  });

  function goToTab(id){
    var tab = document.getElementById('lks-tab-' + id);
    if(tab) activateTab(tab, false);
  }


  /* ------------------------------------------------------------------
     Shared modal overlay (focus trap, Esc / backdrop to close)
     ------------------------------------------------------------------ */
  var overlay = q('#lks-overlay');
  var modal = q('.lks-modal', overlay);
  var modalBody = q('.lks-modal-body', overlay);
  var lastFocus = null;

  function openModal(html, opts){
    opts = opts || {};
    lastFocus = document.activeElement;
    modalBody.innerHTML = html;
    modal.classList.toggle('lks-modal--wide', !!opts.wide);
    overlay.hidden = false;
    document.documentElement.classList.add('lks-lock');
    modal.scrollTop = 0;
    var target = q('[data-lks-autofocus]', modal) || q('[data-lks-close]', modal);
    if(target) target.focus();
  }
  function closeModal(){
    if(overlay.hidden) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('lks-lock');
    modalBody.innerHTML = '';
    if(lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  overlay.addEventListener('click', function(ev){
    if(ev.target === overlay || ev.target.closest('[data-lks-close]')) closeModal();
  });
  document.addEventListener('keydown', function(ev){
    if(overlay.hidden) return;
    if(ev.key === 'Escape'){ ev.preventDefault(); closeModal(); return; }
    if(ev.key !== 'Tab') return;
    var f = qa('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);
    if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(ev.shiftKey && document.activeElement === first){ ev.preventDefault(); last.focus(); }
    else if(!ev.shiftKey && document.activeElement === last){ ev.preventDefault(); first.focus(); }
  });

  function checkIcon(){
    return '<div class="lks-check" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 26 26" fill="none">' +
      '<path d="M5 13.5L10.5 19L21 7.5" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  }


  /* ------------------------------------------------------------------
     Module 1 — Custom Requests
     ------------------------------------------------------------------ */
  var reqForm = q('#lks-request-form');
  var reqBtn = q('#lks-request-submit');
  var reqStatus = q('#lks-request-status');
  var reqBtnLabel = reqBtn.textContent;

  // `invalid` doesn't bubble, so listen in the capture phase.
  reqForm.addEventListener('invalid', function(ev){ ev.target.classList.add('field-invalid'); }, true);
  ['input', 'change'].forEach(function(type){
    reqForm.addEventListener(type, function(ev){ ev.target.classList.remove('field-invalid'); });
  });

  function requestPayload(){
    var fd = new FormData(reqForm);
    function val(k){ return String(fd.get(k) || '').trim(); }
    return {
      requestId: 'LKS-' + Date.now().toString(36).toUpperCase(),
      submittedAt: new Date().toISOString(),
      source: 'lks-product-engine/custom-requests',
      fullName: val('fullName'),
      email: val('email'),
      projectCategory: val('projectCategory'),
      budget: val('budget'),
      requirements: val('requirements')
    };
  }

  function showRequestSuccess(p){
    var first = p.fullName.split(/\s+/)[0] || 'there';
    openModal(
      checkIcon() +
      '<div class="lks-kicker" style="margin-top:22px">Ref ' + esc(p.requestId) + '</div>' +
      '<h3 id="lks-modal-title">Request Received</h3>' +
      '<p class="lks-modal-lead">Thanks, ' + esc(first) + ' — your brief is in. We\'ll review it and reply to <b>' + esc(p.email) + '</b> with next steps.</p>' +
      '<dl class="lks-summary">' +
        '<div><dt>Category</dt><dd>' + esc(p.projectCategory) + '</dd></div>' +
        '<div><dt>Budget</dt><dd>' + esc(p.budget) + '</dd></div>' +
        '<div><dt>Brief</dt><dd>' + esc(p.requirements.length > 140 ? p.requirements.slice(0, 140) + '…' : p.requirements) + '</dd></div>' +
      '</dl>' +
      '<div class="lks-modal-actions"><button class="btn btn-primary" type="button" data-lks-close data-lks-autofocus>Done</button></div>'
    );
  }

  reqForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    if(!reqForm.checkValidity()){ reqForm.reportValidity(); return; }

    var payload = requestPayload();
    console.log('[LKS Engine] Custom request captured:', payload);
    console.log(JSON.stringify(payload, null, 2));

    function done(){
      reqForm.reset();
      reqStatus.textContent = '';
      reqStatus.className = 'form-status';
      showRequestSuccess(payload);
    }

    if(!REQUEST_ENDPOINT){ done(); return; }

    reqBtn.disabled = true;
    reqBtn.textContent = 'Sending…';
    fetch(REQUEST_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(payload)
    }).then(function(res){
      if(!res.ok) throw new Error('HTTP ' + res.status);
      done();
    }).catch(function(err){
      console.warn('[LKS Engine] Request delivery failed:', err);
      reqStatus.textContent = 'Couldn\'t send that — please try again or email us directly.';
      reqStatus.className = 'form-status err';
    }).then(function(){
      reqBtn.disabled = false;
      reqBtn.textContent = reqBtnLabel;
    });
  });


  /* ------------------------------------------------------------------
     Module 2 — PC Parts Advisor
     Temporary hardware dictionary keyed "budget|use|device".
     scores = [gaming, productivity, upgrade path (desktop) / portability (laptop)] out of 5
     ------------------------------------------------------------------ */
  var LABELS = {
    budget: {'u800':'Under $800', '800-1500':'$800 – $1,500', '1500-2500':'$1,500 – $2,500', '2500p':'$2,500+'},
    use: {gaming:'Gaming', work:'Work', hybrid:'Hybrid'},
    device: {desktop:'Desktop', laptop:'Laptop'}
  };

  function D(name, tagline, est, cpu, gpu, ram, storage, platform, cooling, scores, why){
    return {name:name, tagline:tagline, est:est, scores:scores, why:why, specs:[
      ['Processor', cpu], ['Graphics', gpu], ['Memory', ram], ['Storage', storage], ['Platform', platform], ['Case & cooling', cooling]
    ]};
  }
  function L(name, tagline, est, cpu, gpu, ram, storage, display, mobility, scores, why){
    return {name:name, tagline:tagline, est:est, scores:scores, why:why, specs:[
      ['Processor', cpu], ['Graphics', gpu], ['Memory', ram], ['Storage', storage], ['Display', display], ['Battery & weight', mobility]
    ]};
  }

  var BUILDS = {
    /* ---------- Under $800 ---------- */
    'u800|gaming|desktop': D('Entry Frame', 'A no-nonsense 1080p gaming rig that punches above its price.', '$750 – $800',
      'AMD Ryzen 5 7600 · 6-core', 'GeForce RTX 5060 8GB', '16GB DDR5-6000 (2×8GB)', '1TB NVMe Gen4 SSD',
      'B650 micro-ATX · 600W 80+ Bronze', 'Mesh-front mATX case · stock cooler', [3,2,4],
      'Nearly every dollar goes to the graphics card, where 1080p frame rates are won. The AM5 platform means you can drop in a faster CPU later without replacing the motherboard.'),
    'u800|work|desktop': D('Quiet Office', 'Silent, snappy and built to multitask all day.', '$600 – $750',
      'AMD Ryzen 5 8600G · 6-core APU', 'Integrated Radeon 760M', '32GB DDR5-5600 (2×16GB)', '1TB NVMe Gen4 SSD',
      'B650 micro-ATX · 550W 80+ Gold', 'Sound-dampened case · tower air cooler', [1,3,4],
      'Skipping a graphics card lets the budget go into 32GB of RAM — the thing that actually keeps dozens of tabs, spreadsheets and calls smooth. Add a GPU later if needs change.'),
    'u800|hybrid|desktop': D('Dual Shift', 'Handles the workday and the weekend without breaking a sweat.', '$760 – $800',
      'AMD Ryzen 5 7600 · 6-core', 'Radeon RX 7600 8GB', '32GB DDR5-6000 (2×16GB)', '1TB NVMe Gen4 SSD',
      'B650 micro-ATX · 600W 80+ Bronze', 'Airflow mATX case · stock cooler', [3,3,4],
      'A slightly cheaper graphics card frees up budget for 32GB of memory, so the same machine stays fluid with work apps open while still running esports and AAA titles at 1080p.'),
    'u800|gaming|laptop': L('Starter Strike', 'Portable 1080p gaming on a sensible budget.', '$750 – $800',
      'Intel Core i5 / Ryzen 5 H-series', 'GeForce RTX 5050 Laptop (or RTX 4050)', '16GB DDR5', '512GB NVMe SSD',
      '15.6" 1080p IPS · 144Hz', '~4–5 h light use · ~2.3 kg', [3,2,2],
      'At this price the GPU matters most — an RTX-class chip with a high-refresh screen beats a thinner laptop with integrated graphics for any real gaming. Budget for a 1TB SSD upgrade later.'),
    'u800|work|laptop': L('Daily Driver', 'Light, long-lasting and quick for everyday work.', '$650 – $800',
      'Intel Core Ultra 5 / Ryzen 5 (U-series)', 'Integrated Intel Arc / Radeon', '16GB LPDDR5X', '512GB NVMe SSD',
      '14" 1920×1200 IPS · 300+ nits', '~10–12 h · ~1.4 kg', [1,3,4],
      'An efficient U-series chip gives all-day battery and a cool, quiet chassis. 16GB is the minimum we recommend in 2026 — avoid 8GB models even when they\'re on sale.'),
    'u800|hybrid|laptop': L('Crossover 15', 'A work laptop that can still game after hours.', '$780 – $800',
      'Ryzen 5 / Core i5 H-series', 'GeForce RTX 4050 Laptop 6GB', '16GB DDR5', '512GB NVMe SSD',
      '15.6" 1080p IPS · 144Hz', '~5–6 h · ~2.1 kg', [3,2,3],
      'A dedicated GPU keeps games and GPU-accelerated apps viable, while the H-series CPU is plenty for office and dev work. It\'s the most balanced option under $800.'),

    /* ---------- $800 – $1,500 ---------- */
    '800-1500|gaming|desktop': D('Apex 1440', 'The price-to-performance sweet spot for high-refresh 1440p.', '$1,350 – $1,500',
      'AMD Ryzen 7 7800X3D · 8-core, 3D V-Cache', 'GeForce RTX 5070 12GB', '32GB DDR5-6000 CL30', '2TB NVMe Gen4 SSD',
      'B650 ATX · 750W 80+ Gold', 'High-airflow mid-tower · dual-tower air cooler', [4,3,4],
      'The X3D cache chip is still one of the best gaming CPUs per dollar, and pairs with a 12GB RTX 5070 for high frame rates at 1440p. 2TB means you won\'t be uninstalling games every month.'),
    '800-1500|work|desktop': D('Studio Core', 'A 12-core workhorse for code, data and content.', '$1,300 – $1,500',
      'AMD Ryzen 9 9900X · 12-core', 'GeForce RTX 5060 8GB', '64GB DDR5-6000 (2×32GB)', '2TB NVMe Gen4 SSD',
      'B650 ATX · 650W 80+ Gold', 'Quiet mid-tower · 240mm AIO', [3,4,4],
      'Cores and memory do the heavy lifting for compiling, VMs and exports; a modest RTX card still provides CUDA and hardware encoding for editing tools and local AI experiments.'),
    '800-1500|hybrid|desktop': D('All-Rounder', 'Balanced enough to be the only computer you need.', '$1,250 – $1,450',
      'AMD Ryzen 7 9700X · 8-core', 'GeForce RTX 5060 Ti 16GB', '32GB DDR5-6000 (2×16GB)', '2TB NVMe Gen4 SSD',
      'B650 ATX · 750W 80+ Gold', 'Airflow mid-tower · dual-tower air cooler', [4,4,4],
      'The 16GB version of the 5060 Ti gives games and creative apps room to breathe, and the 9700X is efficient and fast in both worlds. Strong, quiet and easy to upgrade.'),
    '800-1500|gaming|laptop': L('Velocity 16', 'Serious 1440p-class gaming you can carry.', '$1,300 – $1,500',
      'Intel Core i7 / Ryzen 7 H-series', 'GeForce RTX 5060 Laptop 8GB', '16GB DDR5 (upgradable)', '1TB NVMe SSD',
      '16" 2560×1600 IPS · 165Hz', '~5 h light use · ~2.3 kg', [4,3,2],
      'A 16" high-res, high-refresh panel with an RTX 5060 is the sweet spot for laptop gaming. Check the GPU power limit (TGP) — higher-wattage models are noticeably faster.'),
    '800-1500|work|laptop': L('Pro Air 14', 'Premium build, OLED screen, all-day stamina.', '$1,100 – $1,400',
      'Intel Core Ultra 7 / Ryzen AI 7 (with NPU)', 'Integrated Intel Arc / Radeon 800M', '32GB LPDDR5X', '1TB NVMe SSD',
      '14" 2.8K OLED · 120Hz', '~12 h · ~1.3 kg', [1,4,5],
      'Prioritises a great screen, keyboard and battery over raw GPU power. 32GB of memory and an on-chip NPU keep it capable with heavier workloads and on-device AI features for years.'),
    '800-1500|hybrid|laptop': L('Switch 14', 'Thin enough for the office, strong enough for games.', '$1,350 – $1,500',
      'Ryzen AI 7 / Core Ultra 7 H-series', 'GeForce RTX 5060 Laptop 8GB', '32GB LPDDR5X', '1TB NVMe SSD',
      '14" 2.8K OLED · 120Hz', '~7 h · ~1.6 kg', [3,4,4],
      'Compact 14" gaming laptops now weigh about the same as business machines. You get a real RTX GPU for play and creative work without a bulky chassis.'),

    /* ---------- $1,500 – $2,500 ---------- */
    '1500-2500|gaming|desktop': D('Vanguard X3D', 'High-refresh 1440p and capable 4K with headroom to spare.', '$2,100 – $2,450',
      'AMD Ryzen 7 9800X3D · 8-core, 3D V-Cache', 'GeForce RTX 5070 Ti 16GB', '32GB DDR5-6000 CL30', '2TB NVMe Gen4 SSD',
      'X870 ATX · 850W 80+ Gold (ATX 3.1)', 'Premium airflow case · 360mm AIO', [5,4,5],
      'The fastest gaming CPU class paired with a 16GB GPU — ideal for 240Hz 1440p or entry 4K. The ATX 3.1 PSU and X870 board leave room for a future flagship GPU.'),
    '1500-2500|work|desktop': D('Render Station', 'A 16-core creator machine for heavy, parallel work.', '$2,100 – $2,450',
      'AMD Ryzen 9 9950X · 16-core', 'GeForce RTX 5070 12GB', '64GB DDR5-6000 (2×32GB)', '2TB Gen4 (OS) + 2TB Gen4 (projects)',
      'X870 ATX · 850W 80+ Gold', 'Silent-focused full tower · 360mm AIO', [4,5,5],
      '16 cores and 64GB crush renders, builds and big datasets. Splitting system and project drives keeps the OS snappy while exporting, and the RTX card accelerates video and AI tools.'),
    '1500-2500|hybrid|desktop': D('Creator Play', 'Top-tier gaming meets a proper creative workstation.', '$2,200 – $2,500',
      'AMD Ryzen 9 9900X3D · 12-core, 3D V-Cache', 'GeForce RTX 5070 Ti 16GB', '64GB DDR5-6000 (2×32GB)', '2TB NVMe Gen4 SSD',
      'X870 ATX · 850W 80+ Gold (ATX 3.1)', 'Premium airflow case · 360mm AIO', [5,5,5],
      'A 12-core X3D chip gives you both extra cores and gaming cache — no compromise between the two. 64GB of RAM keeps editing and streaming smooth while a game runs.'),
    '1500-2500|gaming|laptop': L('Titan 16', 'Desktop-class gaming in a 16" chassis.', '$2,200 – $2,500',
      'Intel Core Ultra 9 275HX / Ryzen 9 HX', 'GeForce RTX 5070 Ti Laptop 12GB', '32GB DDR5', '2TB NVMe SSD',
      '16" 2560×1600 · 240Hz', '~4 h light use · ~2.5 kg', [5,4,2],
      'HX-class CPUs and a 12GB RTX 5070 Ti push high settings at the panel\'s native resolution. Expect a big charger and fan noise under load — it\'s built for performance first.'),
    '1500-2500|work|laptop': L('Creator Pro 16', 'A colour-accurate mobile studio for serious work.', '$1,900 – $2,300',
      'Intel Core Ultra 9 285H · 16-core', 'GeForce RTX 5060 Laptop 8GB (Studio drivers)', '32GB LPDDR5X', '2TB NVMe SSD',
      '16" 3.2K OLED · 120Hz · 100% DCI-P3', '~10 h · ~1.8 kg', [3,5,4],
      'A calibrated OLED and plenty of fast storage matter more than raw GPU speed for creative work. The RTX chip handles CUDA, encoding and AI plug-ins on the go.'),
    '1500-2500|hybrid|laptop': L('Nomad OLED', 'Premium, portable and genuinely good at both.', '$1,900 – $2,300',
      'AMD Ryzen AI 9 HX 370 · 12-core', 'GeForce RTX 5070 Laptop 8GB', '32GB LPDDR5X', '2TB NVMe SSD',
      '16" 2.5K OLED · 240Hz', '~8 h · ~1.9 kg', [4,4,3],
      'Efficient Zen 5 cores keep battery life reasonable for work, while the RTX 5070 and a 240Hz OLED make it a legitimate gaming machine in the evening.'),

    /* ---------- $2,500+ ---------- */
    '2500p|gaming|desktop': D('Apex Flagship', 'Max-settings 4K at high refresh. No compromises.', '$3,000 – $3,800',
      'AMD Ryzen 7 9800X3D · 8-core, 3D V-Cache', 'GeForce RTX 5080 16GB (5090 32GB if budget allows)', '32GB DDR5-6000 CL30', '4TB NVMe Gen4 SSD',
      'X870E ATX · 1000W 80+ Gold (ATX 3.1)', 'Showcase airflow case · 360mm AIO', [5,4,5],
      'The best gaming CPU class with a flagship-tier RTX card for 4K and path-traced titles. A 1000W ATX 3.1 supply leaves a clean upgrade path to a 5090.'),
    '2500p|work|desktop': D('Workstation Max', 'Built for 3D, simulation, large codebases and local AI.', '$3,200 – $4,000',
      'AMD Ryzen 9 9950X · 16-core', 'GeForce RTX 5080 16GB', '128GB DDR5-5600 (4×32GB)', '2TB Gen5 (OS) + 4TB Gen4 (projects)',
      'X870E ATX · 1000W 80+ Platinum', 'Silent full tower · 360mm AIO', [4,5,5],
      '128GB handles massive scenes, datasets and multiple VMs, and a Gen5 system drive keeps load times minimal. The RTX 5080 provides serious GPU compute for rendering and AI.'),
    '2500p|hybrid|desktop': D('Ultimate Hybrid', 'The machine that does everything, fast.', '$4,000+',
      'AMD Ryzen 9 9950X3D · 16-core, 3D V-Cache', 'GeForce RTX 5090 32GB', '64GB DDR5-6000 (2×32GB)', '4TB NVMe Gen4 SSD',
      'X870E ATX · 1200W 80+ Platinum (ATX 3.1)', 'Premium full tower · 360mm AIO', [5,5,5],
      'The 9950X3D gives flagship gaming performance and 16 cores for work, and the 32GB RTX 5090 is the fastest consumer GPU for both games and AI. Genuinely no weak spot.'),
    '2500p|gaming|laptop': L('Behemoth 18', 'Desktop-replacement gaming, maxed out.', '$3,500 – $4,200',
      'Intel Core Ultra 9 275HX · 24-core', 'GeForce RTX 5090 Laptop 24GB', '32GB DDR5', '4TB NVMe SSD (2×2TB)',
      '18" 2560×1600 Mini-LED · 240Hz', '~3 h light use · ~3.3 kg', [5,4,1],
      'The fastest laptop GPU on a huge Mini-LED screen. It\'s heavy and power-hungry — think of it as a desktop you can move, rather than one you carry every day.'),
    '2500p|work|laptop': L('AI Workstation 14', 'Unified-memory powerhouse for AI, data and creative work.', '$2,600 – $3,200',
      'AMD Ryzen AI Max+ 395 · 16-core', 'Integrated Radeon 8060S (shares system memory)', '64–128GB unified LPDDR5X', '2TB NVMe SSD',
      '14" 2.5K OLED · 120Hz', '~10 h · ~1.6 kg', [3,5,5],
      'Huge unified memory lets the GPU use far more than any laptop graphics card — ideal for running large local AI models and heavy datasets — in a thin 14" body.'),
    '2500p|hybrid|laptop': L('Summit 16', 'Flagship gaming and pro-grade work in one bag.', '$3,000 – $3,600',
      'Intel Core Ultra 9 275HX / Ryzen 9 HX', 'GeForce RTX 5080 Laptop 16GB', '64GB DDR5', '4TB NVMe SSD (2×2TB)',
      '16" 2.5K OLED · 240Hz', '~6 h · ~2.5 kg', [5,5,3],
      'A 16GB RTX 5080 and 64GB of memory handle 4K editing and AAA gaming equally well. The OLED panel is accurate enough for colour work and fast enough for competitive play.')
  };

  var wizard = q('#lks-wizard');
  var steps = qa('.lks-step', wizard);
  var progress = qa('.lks-progress li', wizard);
  var btnBack = q('[data-lks-back]', wizard);
  var btnNext = q('[data-lks-next]', wizard);
  var btnFinish = q('[data-lks-finish]', wizard);
  var counter = q('.lks-wizard-count', wizard);
  var result = q('#lks-build-result');
  var STEP_FIELDS = ['budget', 'use', 'device'];
  var current = 0;

  function choice(name){
    var el = wizard.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }
  function syncNav(){
    var answered = !!choice(STEP_FIELDS[current]);
    var last = current === steps.length - 1;
    btnBack.hidden = current === 0;
    btnNext.hidden = last;
    btnFinish.hidden = !last;
    btnNext.disabled = !answered;
    btnFinish.disabled = !answered;
    counter.textContent = 'Step ' + (current + 1) + ' of ' + steps.length;
  }
  function showStep(i, focus){
    current = i;
    steps.forEach(function(s, n){ if(n === i) reveal(s); else s.hidden = true; });
    progress.forEach(function(li, n){
      li.classList.toggle('is-active', n === i);
      li.classList.toggle('is-done', n < i);
    });
    syncNav();
    if(focus){ var lg = q('legend', steps[i]); if(lg) lg.focus({preventScroll:true}); }
  }

  wizard.addEventListener('change', syncNav);
  btnNext.addEventListener('click', function(){ if(choice(STEP_FIELDS[current])) showStep(current + 1, true); });
  btnBack.addEventListener('click', function(){ showStep(current - 1, true); });

  function meter(label, score){
    var bars = '';
    for(var i = 1; i <= 5; i++) bars += '<span' + (i <= score ? ' class="on"' : '') + '></span>';
    return '<div class="lks-meter"><div class="lks-meter-top"><span>' + label + '</span><b>' + score + '/5</b></div>' +
      '<div class="lks-meter-bar" role="img" aria-label="' + label + ' ' + score + ' out of 5">' + bars + '</div></div>';
  }

  var lastBuild = null;

  function renderBuild(sel){
    var b = BUILDS[sel.budget + '|' + sel.use + '|' + sel.device];
    if(!b) return;
    lastBuild = {build:b, sel:sel};
    var specs = b.specs.map(function(r){
      return '<div class="lks-spec-row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('');
    result.innerHTML =
      '<article class="lks-sheet">' +
        '<header class="lks-sheet-head">' +
          '<div>' +
            '<div class="lks-kicker">Recommended System Build</div>' +
            '<h3 tabindex="-1">' + esc(b.name) + '</h3>' +
            '<p>' + esc(b.tagline) + '</p>' +
            '<div class="lks-chips">' +
              '<span class="lks-pill lks-pill--plain">' + esc(LABELS.budget[sel.budget]) + '</span>' +
              '<span class="lks-pill lks-pill--plain">' + esc(LABELS.use[sel.use]) + '</span>' +
              '<span class="lks-pill lks-pill--plain">' + esc(LABELS.device[sel.device]) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="lks-price"><div class="k">Est. total</div><div class="v">' + esc(b.est) + '</div></div>' +
        '</header>' +
        '<div class="lks-sheet-body">' +
          '<dl class="lks-specs">' + specs + '</dl>' +
          '<div class="lks-sheet-side">' +
            '<div>' +
              meter('Gaming', b.scores[0]) +
              meter('Productivity', b.scores[1]) +
              meter(sel.device === 'laptop' ? 'Portability' : 'Upgrade path', b.scores[2]) +
            '</div>' +
            '<div class="lks-why"><div class="k">Why this build</div><p>' + esc(b.why) + '</p></div>' +
          '</div>' +
        '</div>' +
        '<footer class="lks-sheet-foot">' +
          '<p class="lks-disclaimer">Indicative spec for planning. Prices and availability change often — check before you buy.</p>' +
          '<div class="lks-actions">' +
            '<button class="btn btn-ghost" type="button" data-lks-restart>Start over</button>' +
            '<button class="btn btn-primary" type="button" data-lks-source>Have us source it &rarr;</button>' +
          '</div>' +
        '</footer>' +
      '</article>';
    wizard.hidden = true;
    reveal(result);
    q('h3', result).focus({preventScroll:true});
    var top = result.getBoundingClientRect().top;
    if(top < 70 || top > window.innerHeight * 0.6){
      result.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
    }
  }

  wizard.addEventListener('submit', function(ev){
    ev.preventDefault();
    var sel = {budget:choice('budget'), use:choice('use'), device:choice('device')};
    if(!sel.budget || !sel.use || !sel.device) return;
    renderBuild(sel);
  });

  result.addEventListener('click', function(ev){
    if(ev.target.closest('[data-lks-restart]')){
      wizard.reset();
      result.hidden = true;
      result.innerHTML = '';
      reveal(wizard);
      showStep(0, true);
    } else if(ev.target.closest('[data-lks-source]') && lastBuild){
      // Hand the build over to the Custom Requests form.
      var b = lastBuild.build, s = lastBuild.sel;
      q('#lks-f-category').value = 'Other';
      q('#lks-f-req').value = 'PC build request: "' + b.name + '" (' + LABELS.budget[s.budget] + ' · ' +
        LABELS.use[s.use] + ' · ' + LABELS.device[s.device] + ').\n\n' +
        b.specs.map(function(r){ return r[0] + ': ' + r[1]; }).join('\n') +
        '\n\nPlease source the parts' + (s.device === 'desktop' ? ' and assemble it.' : '.');
      goToTab('requests');
      q('#lks-f-name').focus();
    }
  });

  showStep(0, false);


  /* ------------------------------------------------------------------
     Module 3 — Web Prospector (mockup: search is simulated)
     ------------------------------------------------------------------ */
  var pForm = q('#lks-prospect-form');
  var pInput = q('#lks-prospect-q');
  var pTable = q('#lks-prospect-table');
  var pMeta = q('#lks-prospect-meta');
  var pBtn = q('button[type="submit"]', pForm);

  var NICHE_COPY = {
    'Home Services': {
      headline: 'Fast, fixed-price plumbing & heating.',
      sub: 'Emergency call-outs, boiler servicing and bathroom installs — with upfront quotes and no surprise fees.',
      cta: 'Call now',
      services: [['Emergency repairs', 'Same-day call-outs'], ['Boiler servicing', 'Annual checks & certs'], ['Bathroom installs', 'Design to finish']]
    },
    'Retail · Florist': {
      headline: 'Fresh, hand-tied flowers for every moment.',
      sub: 'Same-day local delivery, wedding and event florals, and weekly arrangements for businesses.',
      cta: 'Order flowers',
      services: [['Same-day delivery', 'Order by 1pm'], ['Weddings & events', 'Free consultation'], ['Business subscriptions', 'Weekly arrangements']]
    },
    'Automotive': {
      headline: 'Showroom finish, at your door.',
      sub: 'Mobile valeting, paint correction and ceramic coating — booked online in under a minute.',
      cta: 'Book a detail',
      services: [['Mobile valet', 'We come to you'], ['Paint correction', 'Swirl & scratch removal'], ['Ceramic coating', 'Long-lasting protection']]
    }
  };

  pInput.addEventListener('input', function(){ pInput.classList.remove('field-invalid'); });

  pForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    var target = pInput.value.trim();
    if(!target){ pInput.classList.add('field-invalid'); pInput.focus(); return; }
    if(pTable.classList.contains('is-loading')) return;

    pTable.classList.add('is-loading');
    pTable.setAttribute('aria-busy', 'true');
    pBtn.disabled = true;
    pMeta.innerHTML = 'Scanning <b>' + esc(target) + '</b>…';

    setTimeout(function(){
      qa('.lks-biz-loc', pTable).forEach(function(el){ el.textContent = target; });
      pMeta.innerHTML = 'Showing <b>3 leads</b> · ' + esc(target);
      pTable.classList.remove('is-loading');
      pTable.removeAttribute('aria-busy');
      pBtn.disabled = false;
    }, 1100);
  });

  pTable.addEventListener('click', function(ev){
    var btn = ev.target.closest('[data-lks-preview]');
    if(!btn || btn.getAttribute('aria-busy') === 'true') return;
    var row = btn.closest('tr');
    var lead = {
      name: row.getAttribute('data-name'),
      industry: row.getAttribute('data-industry'),
      rating: row.getAttribute('data-rating'),
      reviews: row.getAttribute('data-reviews'),
      loc: (q('.lks-biz-loc', row) || {}).textContent || ''
    };
    var label = btn.textContent;
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'Generating…';
    setTimeout(function(){
      btn.removeAttribute('aria-busy');
      btn.textContent = label;
      showPreview(lead);
    }, 700);
  });

  function showPreview(lead){
    var c = NICHE_COPY[lead.industry] || NICHE_COPY['Home Services'];
    var slug = lead.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var short = lead.name.split(/\s+/).slice(0, 2).join(' ');
    var loc = lead.loc && lead.loc !== 'Sample market' ? ' · ' + lead.loc : '';
    openModal(
      '<div class="lks-kicker">Auto-generated preview</div>' +
      '<h3 id="lks-modal-title">Website concept for ' + esc(lead.name) + '</h3>' +
      '<p class="lks-modal-lead">A first-draft homepage built from their Google Maps listing — a ready-made visual for your outreach pitch.</p>' +
      '<div class="lks-browser">' +
        '<div class="lks-browser-bar"><span class="lks-browser-dots"><i></i><i></i><i></i></span><span class="lks-browser-url">preview / ' + esc(slug) + '</span></div>' +
        '<div class="lks-site">' +
          '<div class="lks-site-nav"><b>' + esc(short) + '</b><span>Services · Reviews · Contact</span></div>' +
          '<div class="lks-site-hero">' +
            '<div class="lks-site-kicker">' + esc(lead.industry) + esc(loc) + '</div>' +
            '<h4>' + esc(c.headline) + '</h4>' +
            '<p>' + esc(c.sub) + '</p>' +
            '<div class="lks-site-ctas"><span>' + esc(c.cta) + '</span><span>Get a free quote</span></div>' +
          '</div>' +
          '<div class="lks-site-grid">' + c.services.map(function(s){
            return '<div>' + esc(s[0]) + '<small>' + esc(s[1]) + '</small></div>';
          }).join('') + '</div>' +
          '<div class="lks-site-review"><b>★★★★★</b> Rated ' + esc(lead.rating) + ' from ' + esc(lead.reviews) + ' Google reviews</div>' +
        '</div>' +
      '</div>' +
      '<div class="lks-modal-actions"><button class="btn btn-primary" type="button" data-lks-close data-lks-autofocus>Close preview</button></div>',
      {wide:true}
    );
  }

  // Module 4 (Roblox showcase) is static markup — no behaviour needed.
})();
