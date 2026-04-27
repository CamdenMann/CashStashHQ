/* Cash Stash Custom Sponsor-Closing Chatbot */

(function () {
  const CONFIG = {
    teamName: "Cash Stash HQ",
    sponsorFormUrl: "#partner",
    rulesUrl: "rules.html",
    citiesUrl: "cities.html",
    cityPages: {
      raleigh: "city.html?city=raleigh",
      durham: "city.html?city=durham",
      wilmington: "city.html?city=wilmington",
      "grand rapids": "city.html?city=grand-rapids",
      dfw: "city.html?city=dfw",
      dallas: "city.html?city=dfw",
      "fort worth": "city.html?city=dfw",
      houston: "city.html?city=houston",
      "baton rouge": "city.html?city=baton-rouge",
      "new orleans": "city.html?city=new-orleans"
    },
    cityInstagram: {
      raleigh: "https://www.instagram.com/cashstashraleigh",
      durham: "https://www.instagram.com/cashstashdurham",
      wilmington: "https://www.instagram.com/cashstashwilmington",
      "grand rapids": "https://www.instagram.com/cashstashgr",
      dfw: "https://www.instagram.com/cashstashdfw",
      dallas: "https://www.instagram.com/cashstashdfw",
      "fort worth": "https://www.instagram.com/cashstashdfw",
      houston: "https://www.instagram.com/cashstashhtx",
      "baton rouge": "https://www.instagram.com/cashstashlouisiana",
      "new orleans": "https://www.instagram.com/nolacashstash"
    },
    citiesLabel: "Raleigh, Durham, Wilmington, Grand Rapids, Dallas/Fort Worth, Houston, Baton Rouge, and New Orleans"
  };

  let state = {
    flow: null,
    step: 0,
    lead: {}
  };

  const leadSteps = [
    { key: "business", q: "Perfect — what business or brand are you with?" },
    { key: "name", q: "What’s your name?" },
    { key: "email", q: "What email should Cash Stash HQ use to follow up?" },
    { key: "phone", q: "Optional — what phone number should they use? If you don’t want to share, type “skip.”" },
    { key: "cityScope", q: "Are you trying to sponsor one city, multiple cities, or the full Cash Stash network?" },
    { key: "cities", q: "Which city or cities are you interested in? Current cities: " + CONFIG.citiesLabel + "." },
    { key: "promotion", q: "What are you trying to promote? Example: restaurant, event, product launch, service, app, brand awareness, new location, etc." },
    { key: "goal", q: "What’s the main goal? Followers, website visits, foot traffic, event turnout, sales, or brand awareness?" },
    { key: "destination", q: "Where do you want people sent — Instagram, website, physical location, event, or all of the above?" },
    { key: "timeline", q: "When are you hoping to run this campaign?" },
    { key: "budget", q: "Do you already have a rough campaign budget in mind? If not, type “not sure.”" },
    { key: "websiteOrInstagram", q: "Last thing — paste your business website or Instagram handle." }
  ];

  function init() {
    console.log("Cash Stash chatbot loaded");

    if (document.getElementById("csChatToggle")) return;

    const toggle = document.createElement("button");
    toggle.className = "cs-chat-toggle";
    toggle.id = "csChatToggle";
    toggle.type = "button";
    toggle.textContent = "💬 Sponsor Chat";

    const widget = document.createElement("div");
    widget.className = "cs-chat-widget";
    widget.id = "csChatWidget";
    widget.innerHTML = `
      <div class="cs-chat-head">
        <div class="cs-chat-title">
          <strong>Cash Stash HQ</strong>
          <span>Sponsor assistant</span>
        </div>
        <button class="cs-close" type="button" aria-label="Close chatbot">✕</button>
      </div>
      <div class="cs-chat-body" id="csChatBody"></div>
      <div class="cs-chat-foot">
        <input class="cs-input" id="csInput" placeholder="Ask about sponsoring or playing..." />
        <button class="cs-send" id="csSend" type="button">Send</button>
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(widget);

    toggle.addEventListener("click", function () {
      widget.classList.toggle("cs-open");
      if (document.getElementById("csChatBody").children.length === 0) startChat();
    });

    widget.querySelector(".cs-close").addEventListener("click", function () {
      widget.classList.remove("cs-open");
    });

    document.getElementById("csSend").addEventListener("click", handleSend);
    document.getElementById("csInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSend();
    });
  }

  function startChat() {
    bot("Want your brand in front of real local attention? I can help you pick the right Cash Stash campaign — one city, multiple cities, or the full network.");
    quickButtons([
      "Sponsor all cities",
      "Sponsor one city",
      "See cities",
      "How it works",
      "What results can I expect?",
      "I want to play"
    ]);
  }

  function body() {
    return document.getElementById("csChatBody");
  }

  function bot(text) {
    const el = document.createElement("div");
    el.className = "cs-msg cs-bot";
    el.textContent = text;
    body().appendChild(el);
    scrollDown();
  }

  function user(text) {
    const el = document.createElement("div");
    el.className = "cs-msg cs-user";
    el.textContent = text;
    body().appendChild(el);
    scrollDown();
  }

  function htmlBot(html) {
    const el = document.createElement("div");
    el.className = "cs-msg cs-bot";
    el.innerHTML = html;
    body().appendChild(el);
    scrollDown();
  }

  function quickButtons(labels) {
    const wrap = document.createElement("div");
    wrap.className = "cs-buttons";
    labels.forEach(function (label) {
      const b = document.createElement("button");
      b.className = "cs-quick";
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", function () {
        user(label);
        respond(label);
      });
      wrap.appendChild(b);
    });
    body().appendChild(wrap);
    scrollDown();
  }

  function scrollDown() {
    setTimeout(function () {
      body().scrollTop = body().scrollHeight;
    }, 20);
  }

  function handleSend() {
    const input = document.getElementById("csInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    user(text);

    if (state.flow === "lead") {
      continueLeadFlow(text);
    } else {
      respond(text);
    }
  }

  function respond(raw) {
    const text = raw.toLowerCase();

    if (matches(text, ["sponsor all", "all cities", "network", "multi city", "multiple cities"])) {
      bot("Network-wide campaigns are the biggest opportunity. They let one sponsor activate across multiple markets at once instead of paying for attention city by city.");
      bot("For full-network interest, Cash Stash HQ will want to understand your goal, cities, timeline, and budget before recommending the right structure.");
      startLeadFlow("network");
      return;
    }

    if (matches(text, ["sponsor one", "one city", "single city", "local sponsor", "local campaign"])) {
      bot("A single-city campaign is best when your goal is local foot traffic, a city-specific event, a local launch, or growing one business page.");
      startLeadFlow("single");
      return;
    }

    if (matches(text, ["calculator", "recommend", "best campaign", "which campaign", "campaign type", "start sponsor calculator"])) {
      bot("I can help recommend the right campaign type. I’ll ask a few questions and then summarize it for Cash Stash HQ.");
      startLeadFlow("calculator");
      return;
    }

    if (matches(text, ["how it works", "what is cash stash", "what do you do"])) {
      bot("Cash Stash is a multi-city cash hunt. We hide real cash, post clues on Instagram/TikTok, and people race to find it. Sponsors get placed inside the content so they become part of the hype instead of just another ad.");
      quickButtons(["Sponsor one city", "Sponsor all cities", "What does a sponsor get?", "See cities"]);
      return;
    }

    if (matches(text, ["what does sponsor get", "benefits", "what do i get", "exposure"])) {
      bot("Sponsors can get shoutouts, tags, traffic to their page or site, winner content, city-specific visibility, and multi-city exposure. The value is social reach plus real-world participation combined.");
      quickButtons(["Start sponsor calculator", "Sponsor all cities", "Sponsor one city"]);
      return;
    }

    if (matches(text, ["price", "cost", "budget", "how much"])) {
      bot("Pricing depends on city count, campaign size, drop size, and sponsor goals. Cash Stash HQ does not list public pricing because a single-city restaurant campaign and a full-network brand campaign are completely different.");
      bot("If you tell me what you want to promote and which cities you want, I can help recommend the best campaign direction before you submit the form.");
      startLeadFlow("pricing");
      return;
    }

    if (matches(text, ["results", "roi", "views", "turnout", "show up", "work"])) {
      bot("Cash Stash works because people are not just watching an ad. They’re following clues, tagging friends, sharing posts, and physically participating.");
      bot("Proof points: the network has over 100K followers, some posts reach hundreds of thousands of views, drops can bring 100+ people, and strong campaigns can reach around 1M views across pages.");
      bot("We don’t guarantee sales, but every campaign includes sponsor placement in posted content, and exposure is built into the campaign.");
      quickButtons(["Start sponsor calculator", "Sponsor all cities", "Sponsor one city"]);
      return;
    }

    if (matches(text, ["cities", "locations", "where are you", "active cities", "see cities"])) {
      bot("Current active cities: " + CONFIG.citiesLabel + ".");
      quickButtons(["Raleigh", "Durham", "Wilmington", "Grand Rapids", "DFW", "Houston", "Baton Rouge", "New Orleans"]);
      return;
    }

    const cityKey = findCityKey(text);
    if (cityKey) {
      bot("For " + titleCity(cityKey) + ", you can view the city page or follow the city Instagram for clues and local updates.");
      htmlBot(`<a class="cs-link" href="${CONFIG.cityPages[cityKey]}" target="_blank">Open ${titleCity(cityKey)} page</a><br><a class="cs-link" href="${CONFIG.cityInstagram[cityKey]}" target="_blank">Open Instagram</a>`);
      bot("Are you looking to sponsor this city only, or compare it with a multi-city campaign?");
      quickButtons(["Sponsor this city", "Compare multi-city", "I want to play"]);
      return;
    }

    if (matches(text, ["play", "find cash", "clues", "next drop", "where is the cash", "where is it hidden", "drop location"])) {
      participantAnswer(text);
      return;
    }

    if (matches(text, ["rules", "safe", "trespass", "digging", "damage", "minor", "minors"])) {
      bot("Basic rules: no trespassing, no digging, no damaging property, and don’t do anything unsafe. Full rules: " + CONFIG.rulesUrl);
      return;
    }

    if (matches(text, ["contact", "form", "get started", "submit", "partner"])) {
      bot("Best next step: submit the sponsor form and Cash Stash HQ will build campaign options around your goal.");
      htmlBot(`<a class="cs-link" href="${CONFIG.sponsorFormUrl}" target="_blank">Open sponsor form</a>`);
      return;
    }

    bot("I can help with sponsorships, cities, campaign recommendations, rules, or how to play. If you’re a business, the fastest path is the sponsor calculator.");
    quickButtons(["Start sponsor calculator", "Sponsor all cities", "Sponsor one city", "I want to play"]);
  }

  function participantAnswer(text) {
    if (matches(text, ["where is the cash", "where is it hidden", "exact location"])) {
      bot("I can’t give exact stash locations. Clues only drop on the city Instagram/TikTok accounts.");
    } else if (matches(text, ["next drop", "when"])) {
      bot("Drops are announced on the city Instagram pages. The website does not post live clues.");
    } else {
      bot("To play, follow your city account for clues. The website does not post live clues.");
    }
    bot("Play safe: no trespassing, no digging, no damaging property. Full rules: " + CONFIG.rulesUrl);
    quickButtons(["See cities", "Rules", "Sponsor a drop"]);
  }

  function startLeadFlow(mode) {
    state.flow = "lead";
    state.step = 0;
    state.lead = {
      business: "",
      name: "",
      email: "",
      phone: "",
      cityScope: mode === "network" ? "Full network / all cities" : mode === "single" ? "Single city" : "",
      cities: "",
      promotion: "",
      goal: "",
      destination: "",
      timeline: "",
      budget: "",
      websiteOrInstagram: ""
    };
    bot(leadSteps[state.step].q);
  }

  function continueLeadFlow(answer) {
    const current = leadSteps[state.step];
    state.lead[current.key] = answer;
    state.step += 1;

    if (state.step < leadSteps.length) {
      bot(leadSteps[state.step].q);
      return;
    }

    finishLeadFlow();
  }

  function finishLeadFlow() {
    state.flow = null;
    const rec = recommendCampaign(state.lead);
    const budgetNote = budgetGuidance(state.lead, rec);

    htmlBot(`<div class="cs-lead-card">
      <strong>Recommended direction:</strong><br>${rec}<br><br>
      <strong>Lead summary:</strong><br>
      Business: ${safe(state.lead.business)}<br>
      Contact: ${safe(state.lead.name)}<br>
      Email: ${safe(state.lead.email)}<br>
      Phone: ${safe(state.lead.phone)}<br>
      City scope: ${safe(state.lead.cityScope)}<br>
      Cities: ${safe(state.lead.cities)}<br>
      Promotion: ${safe(state.lead.promotion)}<br>
      Goal: ${safe(state.lead.goal)}<br>
      Destination: ${safe(state.lead.destination)}<br>
      Timeline: ${safe(state.lead.timeline)}<br>
      Budget: ${safe(state.lead.budget)}<br>
      Link: ${safe(state.lead.websiteOrInstagram)}
    </div>`);

    bot(budgetNote);
    bot("That sounds like a good fit. The next step is to submit the sponsor form and paste this summary into the message box so Cash Stash HQ can build the right campaign option.");
    htmlBot(`<a class="cs-link" href="${CONFIG.sponsorFormUrl}" target="_blank">Open sponsor form</a>`);
    quickButtons(["Ask another question", "See cities", "How it works"]);
  }

  function recommendCampaign(lead) {
    const allText = Object.values(lead).join(" ").toLowerCase();
    if (matches(allText, ["all cities", "full network", "network", "national"])) return "Network Campaign";
    if (matches(allText, ["multiple", "multi", "several cities", "2 cities", "3 cities"])) return "Multi-City Campaign";
    if (matches(allText, ["event", "launch", "grand opening", "opening", "festival", "drop date"])) return "Event / Launch Campaign";
    return "Single City Campaign";
  }

  function budgetGuidance(lead, rec) {
    const n = parseBudget(lead.budget);
    if (!n) return "Budget note: if you’re not sure on budget yet, Cash Stash HQ can recommend options based on city count and campaign size.";

    if (rec === "Network Campaign" && n < 10000) {
      return "Budget note: for all-city / network campaigns, your budget may need to be higher to match the reach and coordination involved. Cash Stash HQ can still review it and recommend the best structure.";
    }
    if (rec === "Multi-City Campaign" && n < 3000) {
      return "Budget note: for multiple cities, a higher budget usually gives the campaign more room to perform. Cash Stash HQ can help size the campaign correctly.";
    }
    if (rec === "Single City Campaign" && n < 500) {
      return "Budget note: for a single city, Cash Stash HQ can review your goal and recommend what level makes sense without overbuilding it.";
    }
    return "Budget note: that budget gives Cash Stash HQ something useful to work with. The final structure should match your city count, drop size, and goal.";
  }

  function parseBudget(text) {
    if (!text) return 0;
    const cleaned = String(text).toLowerCase().replace(/,/g, "");
    if (cleaned.includes("not sure") || cleaned.includes("skip")) return 0;
    const match = cleaned.match(/\$?\s*(\d+(\.\d+)?)(k)?/);
    if (!match) return 0;
    let n = parseFloat(match[1]);
    if (match[3] === "k") n *= 1000;
    return n;
  }

  function matches(text, words) {
    return words.some(function (w) { return text.includes(w); });
  }

  function findCityKey(text) {
    return Object.keys(CONFIG.cityPages).find(function (k) { return text.includes(k); });
  }

  function titleCity(key) {
    const map = {
      dfw: "Dallas / Fort Worth",
      dallas: "Dallas / Fort Worth",
      "fort worth": "Dallas / Fort Worth",
      "grand rapids": "Grand Rapids",
      "baton rouge": "Baton Rouge",
      "new orleans": "New Orleans"
    };
    return map[key] || key.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function safe(v) {
    return String(v || "Not provided").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
