const deleteButton = document.getElementById('delete-button');
const deleteModal = document.getElementById('delete-modal');
const closeButton = document.getElementById('btn-close');
const cancelButton = document.getElementById('btn-cancel');

function openModal() {
  deleteModal.style.display = 'block';
  deleteModal.style.background = 'rgba(1, 1, 1, 0.8)';
}

function closeModal() {
  deleteModal.style.display = 'none';
  deleteModal.style.background = 'none';
}

deleteButton.addEventListener('click', openModal);

closeButton.addEventListener('click', closeModal);

cancelButton.addEventListener('click', closeModal);
