const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let latestDraft = null;
let toastTimeout;

const sceneTemplates = [
  {time:"0–1 s", title:"Attention hook", camera:"Close-up, quick push-in on the product.", purpose:"Show the product clearly in the first second."},
  {time:"1–2 s", title:"Unboxing", camera:"Top-down angle as the package is opened.", purpose:"Reveal the item and included accessories; only show what is actually supplied."},
  {time:"2–3 s", title:"First look", camera:"Slow 45-degree pan around the product.", purpose:"Highlight visible design details without altering the product."},
  {time:"3–4 s", title:"Key feature", camera:"Macro close-up with a steady camera.", purpose:"Demonstrate one verified feature from the product brief."},
  {time:"4–5 s", title:"How it works", camera:"Medium shot, natural handheld movement.", purpose:"Show the normal intended use."},
  {time:"5–6.5 s", title:"Practical benefit", camera:"Over-the-shoulder or point-of-view shot.", purpose:"Show a realistic everyday use case."},
  {time:"6.5–8 s", title:"Detail shot", camera:"Slow pull-back, clean background.", purpose:"Show finish, controls, size, or another visible detail."},
  {time:"8–10 s", title:"Wrap-up", camera:"Stable hero shot with clear framing.", purpose:"End with a neutral invitation to learn more; avoid pressure or unverifiable claims."}
];

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function getCopyText(element) {
  return element ? element.innerText.trim() : "";
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
}

function makeDraft(data) {
  const name = data.productName;
  const detail = data.productDetails;
  const audience = data.audience;
  const tone = data.tone;
  const lang = data.language;
  const isFilipino = lang === "filipino";
  const isEnglish = lang === "english";
  const intro = isEnglish
    ? `Looking for a closer look at ${name}?`
    : isFilipino
      ? `Tingnan natin nang mas malapitan ang ${name}.`
      : `May curious ba sa ${name}? Tara, silipin natin!`;
  const benefit = isEnglish
    ? `A useful detail: ${detail}`
    : isFilipino
      ? `Isang mahalagang detalye: ${detail}`
      : `Ang importanteng detail: ${detail}`;
  const audienceLine = isEnglish
    ? `Made for anyone comparing options for ${audience}.`
    : isFilipino
      ? `Para sa mga ${audience} na gustong ikumpara ang kanilang mga pagpipilian.`
      : `Para sa mga ${audience} na nagco-compare muna bago bumili.`;
  const cta = isEnglish
    ? "Check the product details to see if it fits your needs."
    : isFilipino
      ? "Tingnan ang detalye ng produkto para malaman kung bagay ito sa pangangailangan mo."
      : "Check muna ang product details kung bagay ito sa needs mo.";
  const hooks = tone === "energetic"
    ? [
        isEnglish ? `Wait—here’s a closer look at ${name}.` : isFilipino ? `Teka muna! Silipin natin ang ${name}.` : `Wait lang! Tingnan natin itong ${name}.`,
        isEnglish ? `Before you decide, take a look at this detail.` : isFilipino ? `Bago ka magdesisyon, tingnan ang detalyeng ito.` : `Bago mag-checkout, silipin muna ang detail na ito.`,
        isEnglish ? `Here’s what to notice about ${name}.` : isFilipino ? `Ito ang dapat mapansin sa ${name}.` : `Ito ang magandang tingnan sa ${name}.`
      ]
    : tone === "informative"
      ? [
          isEnglish ? `Three things to look at before buying ${name}.` : isFilipino ? `Tatlong bagay na dapat tingnan bago bumili ng ${name}.` : `3 bagay na i-check bago bumili ng ${name}.`,
          isEnglish ? `Let’s review the features of ${name}.` : isFilipino ? `Suriin natin ang mga feature ng ${name}.` : `Review natin ang features ng ${name}.`,
          isEnglish ? `What should you know about ${name}?` : isFilipino ? `Ano ang dapat mong malaman tungkol sa ${name}?` : `Ano muna ang dapat malaman tungkol sa ${name}?`
        ]
      : [
          intro,
          isEnglish ? `A quick product look before you decide.` : isFilipino ? `Isang mabilis na product review bago magdesisyon.` : `Quick product look muna bago mag-decide.`,
          isEnglish ? `Let’s see if ${name} suits your needs.` : isFilipino ? `Alamin natin kung bagay sa iyo ang ${name}.` : `Check natin kung fit sa needs mo ang ${name}.`
        ];
  const caption = `${intro}\n\n${benefit}.\n${audienceLine}\n\n${cta}\n\n#ProductFinds #TikTokAffiliate #ProductReview`;
  const voiceover = [
    isEnglish ? `Want a closer look at ${name}?` : isFilipino ? `Gusto mo bang makita nang mas malapitan ang ${name}?` : `Gusto mo bang makita nang mas malapitan ang ${name}?`,
    benefit + ".",
    audienceLine,
    cta
  ].join(" ");
  const scenes = sceneTemplates.map((scene, index) => {
    let voice;
    if (index === 0) voice = hooks[0];
    else if (index === 1) voice = isEnglish ? "Let’s open the package and check what is included." : isFilipino ? "Buksan natin ang package at tingnan kung ano ang laman." : "Unboxing muna—tingnan natin kung ano ang kasama.";
    else if (index === 2) voice = isEnglish ? `Here’s a closer look at ${name}.` : isFilipino ? `Ito ang itsura ng ${name} nang malapitan.` : `Close-up muna ng ${name}.`;
    else if (index === 3) voice = benefit + ".";
    else if (index === 4) voice = isEnglish ? "Show how the product is intended to be used." : isFilipino ? "Ipakita kung paano ito wastong gamitin." : "Ipakita kung paano ito gamitin ayon sa instructions.";
    else if (index === 5) voice = audienceLine;
    else if (index === 6) voice = isEnglish ? "Check the details and included accessories." : isFilipino ? "Tingnan ang mga detalye at kasamang accessories." : "Silipin ang details at mga kasamang accessories.";
    else voice = cta;
    return {...scene, voice};
  });
  return {hooks, caption, voiceover, scenes};
}

function renderDraft(draft) {
  latestDraft = draft;
  $("#empty-state").hidden = true;
  $("#results").hidden = false;
  $("#copy-all").disabled = false;
  $("#output-hooks").replaceChildren(...draft.hooks.map((hook, index) => {
    const p = document.createElement("p");
    p.className = "hook-line";
    p.textContent = `${index + 1}. ${hook}`;
    return p;
  }));
  $("#output-caption").textContent = draft.caption;
  $("#output-voiceover").textContent = draft.voiceover;
  $("#output-storyboard").replaceChildren(...draft.scenes.map(scene => {
    const item = document.createElement("div");
    item.className = "scene";
    const time = document.createElement("div");
    time.className = "scene-time";
    time.textContent = scene.time;
    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = scene.title;
    const camera = document.createElement("p");
    camera.textContent = `Camera: ${scene.camera}`;
    const purpose = document.createElement("p");
    purpose.textContent = scene.purpose;
    const voice = document.createElement("p");
    voice.className = "voice-line";
    voice.textContent = `VO: “${scene.voice}”`;
    body.append(title, camera, purpose, voice);
    item.append(time, body);
    return item;
  }));
}

$("#creator-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const data = {
    productName: cleanText(form.get("productName")),
    productDetails: cleanText(form.get("productDetails")),
    audience: form.get("audience"),
    language: form.get("language"),
    tone: form.get("tone")
  };
  if (!data.productName || !data.productDetails) {
    showToast("Please add a product name and description.");
    return;
  }
  renderDraft(makeDraft(data));
  showToast("Your draft is ready to review.");
});

$("#sample-button").addEventListener("click", () => {
  $("#product-name").value = "Solar outdoor wall light";
  $("#product-details").value = "A solar-powered outdoor light with a wall-mounted design. Confirm the actual sensor, brightness, battery, and weather-resistance specifications from the product listing before making claims.";
  $("#audience").value = "homeowners";
  $("#language").value = "taglish";
  $('input[name="tone"][value="friendly"]').checked = true;
  showToast("Sample loaded. Review the product details before generating.");
});

$$("[data-copy]").forEach(button => button.addEventListener("click", async () => {
  if (!latestDraft) return;
  const key = button.dataset.copy;
  let text = "";
  if (key === "hooks") text = latestDraft.hooks.map((h, i) => `${i + 1}. ${h}`).join("\n");
  if (key === "caption") text = latestDraft.caption;
  if (key === "voiceover") text = latestDraft.voiceover;
  if (key === "storyboard") text = latestDraft.scenes.map(s => `${s.time} — ${s.title}\nCamera: ${s.camera}\nAction: ${s.purpose}\nVO: ${s.voice}`).join("\n\n");
  await copyText(text);
}));

$("#copy-all").addEventListener("click", async () => {
  if (!latestDraft) return;
  const storyboard = latestDraft.scenes.map(s => `${s.time} — ${s.title}\nCamera: ${s.camera}\nAction: ${s.purpose}\nVO: ${s.voice}`).join("\n\n");
  await copyText(`HOOKS\n${latestDraft.hooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}\n\nCAPTION\n${latestDraft.caption}\n\nVOICEOVER\n${latestDraft.voiceover}\n\nSTORYBOARD\n${storyboard}`);
});

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      const copied = document.execCommand("copy");
      area.remove();
      if (!copied) throw new Error("Copy unavailable");
    }
    showToast("Copied to clipboard.");
  } catch {
    showToast("Copy failed. Select the text and copy it manually.");
  }
}

const moduleCopy = {
  bms: {
    label: "BMS Assistant", title: "Make maintenance notes clearer.", intro: "A future module for converting observations into structured notes—not a replacement for site procedures.",
    icon: "▦", heading: "BMS Maintenance Assistant", description: "Turn equipment observations into clear maintenance notes, troubleshooting checklists, and shift handover drafts."
  },
  automation: {
    label: "Automation Lab", title: "Connect repetitive tasks.", intro: "A future module for mapping simple workflows between forms, spreadsheets, and AI tools.",
    icon: "⌘", heading: "Automation Lab", description: "Learn to connect forms, spreadsheets, and AI tools into repeatable workflows, with security and human review built in."
  }
};

$$("[data-view]").forEach(button => button.addEventListener("click", () => {
  const view = button.dataset.view;
  $$(".nav-item").forEach(item => item.classList.toggle("active", item === button));
  const coming = view !== "creator";
  $("#creator-view").hidden = coming;
  $("#coming-view").hidden = !coming;
  const copy = moduleCopy[view];
  $("#breadcrumb-current").textContent = coming ? copy.label : "Creator Assistant";
  $("#page-title").innerHTML = coming ? copy.title : "Turn product ideas into<br><span>content that’s ready to refine.</span>";
  $("#page-intro").textContent = coming ? copy.intro : "Make a first draft for your TikTok affiliate workflow. Learn by using it, then improve it one feature at a time.";
  if (coming) {
    $("#coming-icon").textContent = copy.icon;
    $("#coming-title").textContent = copy.heading;
    $("#coming-description").textContent = copy.description;
  }
}));

$("#back-to-creator").addEventListener("click", () => $('[data-view="creator"]').click());
