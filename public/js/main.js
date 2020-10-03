$(document).ready(function(){
  $(function() {
    $(".meter > span").each(function() {
      $(this)
        .data("origWidth", $(this).width())
        .width(0)
        .animate({
          width: $(this).data("origWidth")
        }, 1200);
    });
  });
  $('.delete-goal').on('click', function(e){
    $target = $(e.target);
    let id = $target.attr('data-id');
    $.ajax({
      type:'post',
      url: '/goals/delete/'+id,
      success: function(response){
        window.location.href='/';
      },
      error:function(x,e) {
      }
    });
  });
  $('.delete-objective').on('click', function(e){
    $target = $(e.target);
    let id = $target.attr('data-id');
    $.ajax({
      type:'post',
      url: '/objectives/delete/'+id,
      success: function(response){
        window.location.href='/';
      },
      error:function(x,e) {
      }
    });
  });
  $('.done').on('click', function(e){
    $target = $(e.target);
    let id = $target.attr('data-id');
    document.getElementById(id).style.backgroundColor = '#30f298';
    $.ajax({
      type:'post',
      url: '/goals/edit/'+id,
      success: function(response){
        window.location.href='/';
      },
      error:function(x,e) {
      }
    });
  });
  $('.undone').on('click', function(e){
    $target = $(e.target);
    let id = $target.attr('data-id');
    document.getElementById(id).style.backgroundColor = '#34b7eb';
  });
  $('.openModal').on('click', function(e){
    // Get the modal
    var modal = document.getElementById("Modal");

    // When the user clicks on the button, open the modal
    modal.style.display = "block";
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });
  $('.openModal1').on('click', function(e){
    // Get the modal
    var modal = document.getElementById("Modal1");

    // When the user clicks on the button, open the modal
    modal.style.display = "block";
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });
});
