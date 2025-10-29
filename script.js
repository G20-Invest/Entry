// EmailJS (Send Confirmation)
(function(){
  // Replace with your actual EmailJS user ID if required
  if (service_xo5wjsa) {
    try { emailjs.init("service_xo5wjsa"); } catch (e) { console.warn('EmailJS init failed', e); }
  } else {
    console.warn('EmailJS not loaded - email sending will fail until you include the EmailJS SDK.');
  }
})();

/*
  Modal / Register UI helpers:
  index.html calls openRegister() from multiple buttons (hero, invest buttons, header).
  Add robust handlers so the modal opens, closes, and the form submits reliably.
*/

const authModal = document.getElementById('authModal');
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = authModal?.querySelector('.close');
const switchToLogin = document.getElementById('switchToLogin');

// Open register modal (called inline in index.html via onclick on some buttons)
function openRegister() {
  if (!authModal) {
    return console.warn('authModal not found in DOM');
  }
  authModal.style.display = 'flex';
  // focus first input for accessibility
  const firstInput = authModal.querySelector('input[name="fullname"]');
  firstInput?.focus();
}

// Close register modal
function closeRegister() {
  if (!authModal) return;
  authModal.style.display = 'none';
}

// Attach handlers: open modal from header button and invest buttons (defensive)
loginBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openRegister();
});
document.querySelectorAll('.btn-invest').forEach(btn => {
  btn.addEventListener('click', (e) => { e.preventDefault(); openRegister(); });
});

// Close button inside modal
closeBtn?.addEventListener('click', (e) => { e.preventDefault(); closeRegister(); });

// Clicking outside modal content closes it
window.addEventListener('click', (e) => {
  if (e.target === authModal) closeRegister();
});

// "Already registered? Login" link behaviour
switchToLogin?.addEventListener('click', (e) => {
  e.preventDefault();
  // If you have a separate login modal/page, you can navigate there instead.
  closeRegister();
  alert('If you already have an account, use the Login button on the top-right or go to the Login page.');
});

// Register form submit handler (hardened and async-friendly)
registerForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const data = {
      fullname: form.fullname.value.trim(),
      cell: form.cell.value.trim(),
      email: form.email.value.trim(),
      city: form.city.value.trim(),
      refcode: form.refcode.value.trim() || generateRefCode()
    };
    data.joined = new Date().toISOString();

    // Basic validation
    if (!data.fullname || !data.cell || !data.email || !data.city) {
      return alert('Please fill in all required fields.');
    }

    // Save user locally (demo)
    localStorage.setItem('g20user', JSON.stringify(data));

    // Send Email via EmailJS (ensure service/template IDs are correct)
    try {
      if (window.emailjs && typeof emailjs.send === 'function') {
        // Replace "service_id" and "template_id" with your real EmailJS IDs
        await emailjs.send("service_id", "template_id", {
          to_name: data.fullname,
          to_email: data.email,
          refcode: data.refcode,
          message: `Welcome to G20! Your code: ${data.refcode}`
        });
      } else {
        console.warn('EmailJS not available; skipping email send.');
      }
    } catch (err) {
      // don't block the user if email fails in development; log for debugging
      console.warn('EmailJS send failed:', err);
    }

    // Notify user and show share UI
    alert(`Registered! Your code: ${data.refcode}`);
    showShare(data.refcode);

    // Close modal and redirect after a short delay
    closeRegister();
    setTimeout(() => window.location.href = 'dashboard.html', 1200);
  } catch (err) {
    console.error('Register submit error:', err);
    alert('An error occurred while registering. Check the console for details.');
  }
});

// Keep existing helpers (ref code generation + share)
function generateRefCode() {
  return 'G20' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function showShare(code) {
  const msg = encodeURIComponent(`Join G20 & earn 30% in 14 days! Use my code: ${code} → g20invest.co.za`);
  const shareSection = document.getElementById('shareSection');
  if (!shareSection) return;
  shareSection.style.display = 'block';
  const whatsapp = document.getElementById('whatsappShare');
  const facebook = document.getElementById('facebookShare');
  const twitter = document.getElementById('twitterShare');
  const telegram = document.getElementById('telegramShare');
  if (whatsapp) whatsapp.href = `https://wa.me/?text=${msg}`;
  if (facebook) facebook.href = `https://facebook.com/sharer/sharer.php?u=g20invest.co.za%3Fref%3D${code}`;
  if (twitter) twitter.href = `https://twitter.com/intent/tweet?text=${msg}`;
  if (telegram) telegram.href = `https://t.me/share/url?url=g20invest.co.za&text=${msg}`;
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
