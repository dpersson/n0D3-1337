$(document).ready(function(){
  $('.input_text').each(function(){
    var default_value = $(this).val();

    $(this).blur(function(){
      if($(this).val() === '') {
        $(this).val(default_value);
      }
    });

    $(this).focus(function(){
      $(this).val('');
    })
  }); 
});
