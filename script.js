// EmailJS (Send Confirmation)
(function(){
  emailjs.init("service_xo5wjsa"); // Get free at emailjs.com
})();

// Register
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    fullname: form.fullname.value,
    cell: form.cell.value,
    email: form.email.value,
    city: form.city.value,
    refcode: form.refcode.value || generateRefCode()
  };
  data.joined = new Date().toISOString();

  // Save user
  localStorage.setItem('g20user', JSON.stringify(data));

  // Send Email
  emailjs.send("service_id", "template_id", {
    to_name: data.fullname,
    to_email: data.email,
    refcode: data.refcode,
    message: `Welcome to G20! Your code: ${data.refcode}`
  });

  // Send SMS via Twilio (use serverless or Email-to-SMS gateway)
  // Example: fetch('https://api.twilio.com/...'...) — use EmailJS for now

  alert(`Registered! Your code: ${data.refcode}`);
  showShare(data.refcode);
  setTimeout(() => window.location.href = 'dashboard.html', 2000);
});

function generateRefCode() {
  return 'G20' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function showShare(code) {
  const msg = encodeURIComponent(`Join G20 & earn 30% in 14 days! Use my code: ${code} → g20invest.co.za`);
  document.getElementById('shareSection').style.display = 'block';
  document.getElementById('whatsappShare').href = `https://wa.me/?text=${msg}`;
  document.getElementById('facebookShare').href = `https://facebook.com/sharer/sharer.php?u=g20invest.co.za%3Fref%3D${code}`;
}

// Toggle Menu
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('show');
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('g20user');
  window.location.href = 'index.html';
});