const supabaseUrl = "https://sjkaymmawesdmxblpqlc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqa2F5bW1hd2VzZG14YmxwcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MzY2NDIsImV4cCI6MjA4NDUxMjY0Mn0.fKOLvHOhh7vBsXGweQhvW7Nersz9oFeHR5fQoC6jbfU";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadPackages() {
  const { data: packages, error: pkgError } = await supabase
    .from("packages")
    .select("*");

  console.log("Packages:", packages);
  console.log("Package Error:", pkgError);

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

async function loadChannels(packageId) {
  const { data: channels, error: chError } = await supabase
    .from("channels")
    .select("*")
    .eq("package_id", packageId);

  console.log("Channels:", channels);
  console.log("Channels Error:", chError);

  const container = document.getElementById("channels");
  container.innerHTML = "";

  if (!channels) return;

  channels.forEach(channel => {
    const btn = document.createElement("button");
    btn.innerText = channel.name;
    btn.onclick = () => playStream(channel.stream_url);
    container.appendChild(btn);
  });

  if (channels.length > 0) {
    playStream(channels[0].stream_url);
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
