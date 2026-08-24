// ============================================================
// Wakatobi Island Login — interactivity
// Mirrors the behavior of the original React component:
// - Tab switching between Sign In / Sign Up / Forgot Password
// - Password show/hide toggle
// - Sign-in validation, loading spinner, success screen
// - Google sign-in demo autofill
// - Quick menu dropdown
// - Forgot-password toast + demo credential autofill
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // ---- Element references ----
  const forms = {
    signin: document.getElementById('signinForm'),
    signup: document.getElementById('signupForm'),
    forgot: document.getElementById('forgotForm'),
  };
  const successScreen = document.getElementById('successScreen');
  const successEmail = document.getElementById('successEmail');

  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const quickMenu = document.getElementById('quickMenu');

  const signinEmailInput = document.getElementById('signinEmail');
  const signinPasswordInput = document.getElementById('signinPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const signinError = document.getElementById('signinError');
  const signinSubmitBtn = document.getElementById('signinSubmitBtn');
  const signinSubmitSpinner = document.getElementById('signinSubmitSpinner');
  const signinSubmitLabel = document.getElementById('signinSubmitLabel');
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  const googleBtnLabel = document.getElementById('googleBtnLabel');
  const autofillBtn = document.getElementById('autofillBtn');
  const resetBtn = document.getElementById('resetBtn');

  const forgotEmailInput = document.getElementById('forgotEmail');
  const toast = document.getElementById('toast');

  let activeTab = 'signin';

  // ---- Tab switching ----
  function showTab(tab) {
    activeTab = tab;
    successScreen.classList.add('hidden');

    Object.entries(forms).forEach(([key, form]) => {
      form.classList.toggle('hidden', key !== tab);
    });

    closeMenu();
  }

  document.querySelectorAll('.tab-link-btn, .menu-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });

  // ---- Quick menu dropdown ----
  function openMenu() {
    quickMenu.classList.remove('hidden');
    quickMenu.classList.add('menu-open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    quickMenu.classList.add('hidden');
    quickMenu.classList.remove('menu-open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (quickMenu.classList.contains('hidden')) openMenu();
    else closeMenu();
  });
  document.addEventListener('click', (e) => {
    if (!quickMenu.contains(e.target) && e.target !== menuToggleBtn) closeMenu();
  });

  document.getElementById('exportCodeBtn').addEventListener('click', () => {
    closeMenu();
    showToast('This is the live source — view index.html, styles.css and script.js.');
  });

  // ---- Password show/hide ----
  let showPassword = false;
  togglePasswordBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    signinPasswordInput.type = showPassword ? 'text' : 'password';
    togglePasswordBtn.innerHTML = showPassword
      ? '<i data-lucide="eye" class="w-4 h-4"></i>'
      : '<i data-lucide="eye-off" class="w-4 h-4"></i>';
    togglePasswordBtn.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    lucide.createIcons();
  });

  // ---- Sign in submit ----
  function setSigninLoading(isLoading) {
    signinSubmitBtn.disabled = isLoading;
    signinSubmitSpinner.classList.toggle('hidden', !isLoading);
    signinSubmitLabel.classList.toggle('hidden', isLoading);
  }

  function showSuccess(email) {
    Object.values(forms).forEach((form) => form.classList.add('hidden'));
    successEmail.textContent = email;
    successScreen.classList.remove('hidden');
    successScreen.classList.add('fade-scale-in');
    lucide.createIcons();
  }

  function showSigninError(message) {
    signinError.textContent = message;
    signinError.classList.remove('hidden');
    signinError.classList.remove('animate-shake');
    // restart the shake animation
    void signinError.offsetWidth;
    signinError.classList.add('animate-shake');
  }
  function clearSigninError() {
    signinError.classList.add('hidden');
    signinError.textContent = '';
  }

  forms.signin.addEventListener('submit', (e) => {
    e.preventDefault();
    clearSigninError();

    const email = signinEmailInput.value.trim();
    const password = signinPasswordInput.value;

    if (!email) {
      showSigninError('Please enter your email address');
      return;
    }
    if (!password) {
      showSigninError('Please enter your password');
      return;
    }

    setSigninLoading(true);
    setTimeout(() => {
      setSigninLoading(false);
      showSuccess(email);
    }, 1000);
  });

  googleSignInBtn.addEventListener('click', () => {
    googleSignInBtn.disabled = true;
    const original = googleBtnLabel.textContent;
    googleBtnLabel.textContent = 'Connecting…';

    setTimeout(() => {
      signinEmailInput.value = 'alex.morgan@wakatobi.org';
      signinPasswordInput.value = '••••••••••••';
      googleSignInBtn.disabled = false;
      googleBtnLabel.textContent = original;
      showSuccess('alex.morgan@wakatobi.org');
    }, 800);
  });

  autofillBtn.addEventListener('click', () => {
    signinEmailInput.value = 'bahadar.user@wakatobi.id';
    signinPasswordInput.value = 'Wakatobi@2026';
  });

  resetBtn.addEventListener('click', () => {
    signinEmailInput.value = '';
    signinPasswordInput.value = '';
    clearSigninError();
    showTab('signin');
  });

  // ---- Sign up submit (demo: routes to the same success screen) ----
  forms.signup.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    showSuccess(email || 'your new account');
  });

  // ---- Forgot password submit ----
  forms.forgot.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = forgotEmailInput.value.trim() || 'your email';
    showToast(`Password reset link sent to ${email}`);
    showTab('signin');
  });

  // ---- Toast helper ----
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('toast-visible');
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('toast-visible');
    }, 2600);
  }

  // Init
  showTab('signin');
});