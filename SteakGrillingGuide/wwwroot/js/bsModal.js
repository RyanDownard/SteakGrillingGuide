var currentModal = null;

function showModalById(modalId) {
    currentModal = bootstrap.Modal.getOrCreateInstance(modalId);

    currentModal.show();
}

function hideModalById(modalId) {
    currentModal.hide();
}

export { showModalById, hideModalById };
