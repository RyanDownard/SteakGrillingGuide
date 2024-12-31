function showModalById(modalId) {
    let currentModal = bootstrap.Modal.getOrCreateInstance(modalId);
    if (currentModal != null) {
        currentModal.show();
    }

}

function hideModalById(modalId) {
    let currentModal = bootstrap.Modal.getOrCreateInstance(modalId);
    if (currentModal != null) {
        currentModal.hide();
    }
}

export { showModalById, hideModalById };
