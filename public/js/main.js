$(document).ready(() => {
  // Animate header
  $('.display-4').addClass('animate__animated animate__pulse animate__infinite');

  // Fetch fact via AJAX
  $.ajax({
    url: 'http://numbersapi.com/1/30/date?json',
    method: 'GET',
    success: ({ text }) => $('#fact').text(text),
    error: () => $('#fact').text('Could not load fact.')
  });

  // Drag & drop upload
  const dropZone = $('#drop_zone');
  const fileInput = $('#file_input');

  dropZone.on('click', () => fileInput.click());
  dropZone.on('dragover', e => { e.preventDefault(); dropZone.addClass('dragover'); });
  dropZone.on('dragleave', () => dropZone.removeClass('dragover'));
  dropZone.on('drop', e => {
    e.preventDefault(); dropZone.removeClass('dragover');
    uploadFiles(e.originalEvent.dataTransfer.files);
  });

  fileInput.on('change', () => uploadFiles(fileInput[0].files));

  function uploadFiles(files) {
    const form = new FormData();
    $.each(files, (_, file) => form.append('images', file));
    $.ajax({
      url: '/upload',
      type: 'POST',
      data: form,
      contentType: false,
      processData: false,
      success: res => $('#upload_result').html('<div class="alert alert-success">'+res.message+'</div>'),
      error: () => $('#upload_result').html('<div class="alert alert-danger">Upload failed.</div>')
    });
  }
});