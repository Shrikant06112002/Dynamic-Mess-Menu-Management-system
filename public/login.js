const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

$(function(){
    // Show/hide the Mess Name input field based on the radio button selection
    $('input[name="accountType"]').on('change', function() {
      var selectedValue = $(this).val();
      var messNameInput = $('#messNameInput');
      
      if (selectedValue === 'messOwner') {
        messNameInput.show();
      } else {
        messNameInput.hide();
      }
    });
  });