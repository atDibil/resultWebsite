$(document).ready(function(){
    console.log('linked');

    $('.delete-btn').on('click', (e)=>{
        

        $target = $(e.target);

        const id = $target.attr('data-id');

        $.ajax({
            method: 'DELETE',
            url: '/delete/'+id,

            success: function(response){
                alert('Deleting User..');
                window.location.href='/dashboard';
            },

            error: function(err){
                console.log(err);
            }
        });
    })
});