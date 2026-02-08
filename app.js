const supabaseUrl = "https://sjkaymmawesdmxblpqlc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqa2F5bW1hd2VzZG14YmxwcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MzY2NDIsImV4cCI6MjA4NDUxMjY0Mn0.fKOLvHOhh7vBsXGweQhvW7Nersz9oFeHR5fQoC6jbfU";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 1️⃣ ضع رابط مشروعك ومفتاح anon من Supabase

// 2️⃣ تحميل الباقات
async function loadPackages() {
  const { data: packages, error: pkgError } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order", { ascending: true });

  console.log("Packages Data:", packages);
  console.log("Packages Error:", pkgError);

  const container = document.getElementById("packages");
  container.innerHTML = "";

  if (!packages) return;

  packages.forEach(pkg => {
    const btn = document.createElement("button");
    btn.innerText = pkg.name;
    btn.onclick = () => loadChannels(pkg.id);
    container.appendChild(btn);
  });
}

// 3️⃣ تحميل القنوات عند الضغط على باقة
async function loadChannels(packageId) {
  const { data: channels, error: chError } = await supabase
    .from("channels")
    .select("*")
    .eq("package_id", packageId)
    .order("sort_order", { ascending: true });

  console.log("Channels Data:", channels);
  console.log("Channels Error:", chError);

  const container = document.getElementById("channels");
  container.innerHTML = "";

  if (!channels || channels.length === 0) return;

  // عرض القنوات كأزرار
  channels.forEach(channel => {
    const btn = document.createElement("button");
    btn.innerText = channel.name;
    btn.onclick = () => playStream(channel.stream_url);
    container.appendChild(btn);
  });

  // تشغيل أول قناة تلقائي
  playStream(channels[0].stream_url);
}

// 4️⃣ تشغيل البث باستخدام hls.js
function playStream(url) {
  const video = document.getElementById("video");

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  }
}

// 5️⃣ ابدأ تحميل الباقات مباشرة عند فتح الصفحة
loadPackages();
