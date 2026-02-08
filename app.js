const supabaseUrl = "https://lrndhbrxzrqcoltbqzjs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybmRoYnJ4enJxY29sdGJxempzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDI3MjYsImV4cCI6MjA4NTY3ODcyNn0.71W4hvrf8P17b80PHjdrTfSVhFB8KEsmOS9vycIBl7E";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadPackages() {
  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const container = document.getElementById("packages");

  data.forEach(pkg => {
    const btn = document.createElement("button");
    btn.innerText = pkg.name;
    btn.onclick = () => loadChannels(pkg.id);
    container.appendChild(btn);
  });
}

async function loadChannels(packageId) {
  const { data } = await supabase
    .from("channels")
    .select("*")
    .eq("package_id", packageId)
    .order("sort_order", { ascending: true });

  const container = document.getElementById("channels");
  container.innerHTML = "";

  data.forEach(channel => {
    const btn = document.createElement("button");
    btn.innerText = channel.name;
    btn.onclick = () => playStream(channel.stream_url);
    container.appendChild(btn);
  });

  if (data.length > 0) {
    playStream(data[0].stream_url);
  }
}

function playStream(url) {
  const video = document.getElementById("video");

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}

loadPackages();
