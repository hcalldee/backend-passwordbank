var t = null
var rw = null
var apilink="https://passwordbank.herokuapp.com/"
$(document).ready( function () {
    t = $('#example').DataTable();
    $.get(apilink+"users",function(data) {
        data.forEach(d => {
            t.row.add([d.username,
                // "<textarea style='resize:none' class='form-control' disabled rows='3'>"+d.generated+"</textarea>",
                d.site,
                "<div class='row'>"
                    +"<button type='button' data-id='"+d.id+"' data-gen='"+d.generated+"' data-usr='"+d.username+"' class='mr-1 decrypt btn btn-info'>decrypt</button>"
                    +"<button type='button' data-id='"+d.id+"' data-gen='"+d.generated+"' class='mr-1 edit btn btn-success'>edit</button>"
                    +"<button  type='button' data-id='"+d.id+"'  data-gen='"+d.generated+"' class='mr-1 delete btn btn-danger'>delete</button>"
                +"</div>"
                // "<button type='button' data-id='"+d.id+"' data-gen='"+d.generated+"' data-usr='"+d.username+"' class='btn decrypt btn-info'>Decrypt</button>"
        ]).draw(false)
        // console.log(d)
    });
})
} );



var stat = null

$('#example').on('click','.decrypt', function (ev) {
    stat = 'decrypt'
    ev.stopImmediatePropagation();
    $('#formdecrypt').removeAttr('hidden')
    $('#usrm').val($(this).attr('data-usr'))
    $('.generated').val($(this).attr('data-gen'))
    $('#btndecrypt').attr('data-id',$(this).attr('data-id'))
    $( "#myModal" ).modal();
})

$('#example').on('click','.edit', function (ev) {
    stat = 'edit'
    ev.stopImmediatePropagation();
    $.ajax({
        url:apilink+"users/search",
        type:'post',
        data:{
            id:$(this).attr('data-id')
        },
        datatype:'JSON',
        success:function (data) {
            console.log(data)
            $('#usre').val(data.username)
            $('#sitee').val(data.site)
        } 
    })
    $('#formedit').removeAttr('hidden')
    $('#usrm').val($(this).attr('data-usr'))
    $('.generated').val($(this).attr('data-gen'))
    $('#btndecrypt').attr('data-id',$(this).attr('data-id'))
    $('#btndecrypt').html('Save')
    $('#title').html('Edit Data')
    $( "#myModal" ).modal();
})

$('#example').on('click','.delete', function (ev) {
    stat = 'delete'
    ev.stopImmediatePropagation();
    $.ajax({
        url:apilink+"users/search",
        type:'post',
        data:{
            id:$(this).attr('data-id')
        },
        datatype:'JSON',
        success:function (data) {
            console.log(data)
            $('#formdelete .generated').val(data.generated)
            console.log($('#formdelete .generated').val())

        } 
    })
    $('#formdelete').removeAttr('hidden')
    $('#btndecrypt').attr('data-id',$(this).attr('data-id'))
    $( "#myModal" ).modal();
})

$('#myModal').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
    $('#formdecrypt').attr('hidden',true)
    $('#formedit').attr('hidden',true)
    $('#formdelete').attr('hidden',true)
    $( "#myModal #res" ).html('');
    $( "#myModal .result" ).attr('hidden',true);
})

$('#btndecrypt').click(function() {
    if(stat=='decrypt'){
        data = {
            'id':$(this).attr('data-id'),
            'generated': $('.generated').val(),
            'key': $('#kym').val()
        }
        $('#kym').val('')
        $.ajax({
            url:apilink+"users/decrypt",
            type:'post',
            data:data,
            datatype:'JSON',
            success:function (data) {
                $( "#myModal .result" ).attr('hidden',false);
                $( "#myModal #res" ).html(data.password);
            } 
        })
    }else if(stat=='edit'){
        data = {
            'id':$(this).attr('data-id'),
            'generated': $('.generated').val(),
            'site': $('#sitee').val(),
            'username': $('#usre').val(),
            'old_pw': $('#pweo').val(),
            'old_ky': $('#kyeo').val(),
            'new_pw': $('#pwen').val(),
            'new_ky': $('#kyen').val(),
        }
        $.ajax({
            url:apilink+"users/edit",
            type:'patch',
            data:data,
            datatype:'JSON',
            success:function (data) {
                alert(data)
                location.reload();
            } 
        })
    }else if(stat=='delete'){
        data = {
            'id':$(this).attr('data-id'),
            'generated': $('#formdelete .generated').val(),
            'key': $('#kyd').val(),
            'pw': $('#pwd').val(),
        }
        $.ajax({
            url:apilink+"users/delete",
            type:'delete',
            data:data,
            datatype:'JSON',
            success:function (data) {
                alert(data)
                location.reload();
            } 
        })
    }
})

$('#add').click(function() {
    data = {
        'username':$('#usr').val(),
        'password': $('#pw').val(),
        'key': $('#ky').val(),
        'site': $('#site').val()
    }
    $.ajax({
        url:apilink+"users/",
        type:'post',
        data:data,
        datatype:'JSON',
        success:function (data) {
            // console.log(data.password)
            location.reload();
        } 
    })
    
})