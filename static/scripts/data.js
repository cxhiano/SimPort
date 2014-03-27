function pushRequest(timeout, success) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        url: 'apis/test',
        timeout: timeout,

        success: success,

        error: function(xmlReq, txtStatus, error) {
            $("#instructions").append(new Date + '\n');
            $("#instructions").append(txtStatus + '\n');
            if (txtStatus === 'timeout') {
                pushRequest(timeout, success);
            }
        },
    });
}
