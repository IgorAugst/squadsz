const nav = document.getElementById('profile-nav');
const dropdown = document.getElementById('dropdown');
const modal = document.getElementById('profile-modal');
const buttonModal = document.getElementById('button-config-modal');
const closeButton = document.getElementById('btn-close-config-modal');
const cancelButton = document.getElementById('btn-cancel-config-modal');

function toggleDropdown() {
  nav.classList.toggle('active');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    return;
  }
  dropdown.style.display = 'block';
}

function openModal() {
  modal.style.display = 'block';
  modal.style.background = 'rgba(1, 1, 1, 0.8)';
}

function closeModal() {
  modal.style.display = 'none';
  modal.style.background = 'none';
}

nav.addEventListener('click', toggleDropdown);
buttonModal.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);
