const features = [
  {
    title: "Schema negotiator",
    copy: "Maps drifting source fields into a contract your warehouse can trust.",
    meter: "84%",
  },
  {
    title: "Agent runbooks",
    copy: "Deploy AI operators with scoped permissions, approvals, rollback checks, and crisp audit trails.",
    meter: "91%",
  },
  {
    title: "Forecast fabric",
    copy: "Blends operational signals with CRM, billing, and product events for live revenue predictions.",
    meter: "78%",
  },
  {
    title: "Secure enrich",
    copy: "Routes enrichment tasks through policy gates before any customer data leaves your perimeter.",
    meter: "88%",
  },
  {
    title: "Human checkpoints",
    copy: "Escalates ambiguous actions to owners with context, confidence, and one-tap resolution.",
    meter: "73%",
  },
];

const pricingMatrix = {
  baseMonthlyUsd: {
    starter: 79,
    scale: 249,
    enterprise: 699,
  },
  billing: {
    monthly: 1,
    annual: 0.8,
  },
  currency: {
    USD: { symbol: "$", fx: 1, tariff: 1, locale: "en-US", maxFraction: 0 },
    INR: { symbol: "₹", fx: 83.42, tariff: 0.82, locale: "en-IN", maxFraction: 0 },
    EUR: { symbol: "€", fx: 0.93, tariff: 1.04, locale: "de-DE", maxFraction: 0 },
  },
};

let activeFeatureIndex = 0;
let activeBilling = "monthly";
let activeCurrency = "USD";

const bentoNodes = Array.from(document.querySelectorAll("[data-feature-index]"));
const accordionItems = Array.from(document.querySelectorAll("[data-accordion-index]"));
const featureTitle = document.querySelector("[data-feature-title]");
const featureCopy = document.querySelector("[data-feature-copy]");
const meter = document.querySelector(".preview-meter span");
const mobileQuery = window.matchMedia("(max-width: 900px)");

function setFeature(index) {
  activeFeatureIndex = index;
  const feature = features[index];

  bentoNodes.forEach((node) => {
    node.classList.toggle("is-active", Number(node.dataset.featureIndex) === index);
  });

  accordionItems.forEach((item) => {
    const isOpen = Number(item.dataset.accordionIndex) === index;
    item.classList.toggle("is-open", isOpen);
    item.querySelector("button").setAttribute("aria-expanded", String(isOpen));
  });

  if (featureTitle && featureCopy && meter) {
    featureTitle.textContent = feature.title;
    featureCopy.textContent = feature.copy;
    meter.style.setProperty("--meter", feature.meter);
  }
}

bentoNodes.forEach((node) => {
  const index = Number(node.dataset.featureIndex);
  node.addEventListener("mouseenter", () => setFeature(index), { passive: true });
  node.addEventListener("focus", () => setFeature(index));
  node.addEventListener("click", () => setFeature(index));
});

accordionItems.forEach((item) => {
  item.querySelector("button").addEventListener("click", () => {
    setFeature(Number(item.dataset.accordionIndex));
  });
});

mobileQuery.addEventListener("change", () => {
  requestAnimationFrame(() => setFeature(activeFeatureIndex));
});

function formatPrice(value, currency) {
  const config = pricingMatrix.currency[currency];
  return new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: config.maxFraction,
  }).format(value);
}

function computePlanPrice(plan, billing, currency) {
  const config = pricingMatrix.currency[currency];
  const monthly =
    pricingMatrix.baseMonthlyUsd[plan] *
    pricingMatrix.billing[billing] *
    config.fx *
    config.tariff;

  return {
    monthly,
    annualTotal: monthly * 12,
    symbol: config.symbol,
  };
}

function updatePricingText() {
  document.querySelectorAll("[data-plan]").forEach((card) => {
    const plan = card.dataset.plan;
    const price = computePlanPrice(plan, activeBilling, activeCurrency);
    card.querySelector("[data-price-symbol]").textContent = price.symbol;
    card.querySelector("[data-price-amount]").textContent = formatPrice(price.monthly, activeCurrency);
    card.querySelector("[data-price-period]").textContent = activeBilling === "annual" ? "/mo billed yearly" : "/mo";
    card.querySelector("[data-annual-total]").textContent =
      `${price.symbol}${formatPrice(price.annualTotal, activeCurrency)}`;
  });
}

document.querySelector("[data-currency-switcher]").addEventListener("change", (event) => {
  activeCurrency = event.target.value;
  updatePricingText();
});

document.querySelectorAll("[data-billing]").forEach((button) => {
  button.addEventListener("click", () => {
    activeBilling = button.dataset.billing;
    document.querySelectorAll("[data-billing]").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    updatePricingText();
  });
});

function bootThreeJsScene() {
  const canvas = document.querySelector("#signal-canvas");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);

  const colorTeal = new THREE.Color('#2dd4bf');
  const colorViolet = new THREE.Color('#a78bfa');

  for (let i = 0; i < particlesCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 15;
    posArray[i+1] = (Math.random() - 0.5) * 15;
    posArray[i+2] = (Math.random() - 0.5) * 10;
    
    const mixedColor = colorTeal.clone().lerp(colorViolet, Math.random());
    colorsArray[i] = mixedColor.r;
    colorsArray[i+1] = mixedColor.g;
    colorsArray[i+2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  camera.position.z = 4;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  const clock = new THREE.Clock();
  let frame = 0;

  function animate() {
    frame = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.z += 0.001;
    particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.1;

    renderer.render(scene, camera);
  }

  function resize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  window.addEventListener("resize", resize, { passive: true });
  
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
}

document.addEventListener("mousemove", (e) => {
  document.querySelectorAll('.bento-node, .price-card, .proof-grid figure').forEach(el => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spotlight variables
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);

    // 3D Tilt Parallax
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    
    // Apply transform only if hovering inside
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      el.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });
});

document.querySelectorAll('.bento-node, .price-card, .proof-grid figure').forEach(el => {
  el.addEventListener('mouseleave', () => {
    el.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
  });
});


setFeature(0);
updatePricingText();
bootThreeJsScene();
