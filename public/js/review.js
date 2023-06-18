console.log(periode)
function submit() {
    Swal.fire({
        title: 'Do you agree to this activity? ',
        text: "If anyone agrees then there will be a digital signature",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/api/monthly/approvement",
                method: "POST",
                data: {
                    nik: nik,
                    periode: periode,
                    status: true
                },
                success: function (response) {
                    console.log(response)
                    Swal.fire({
                        title: 'Thank You',
                        text: "Your consent has been recorded.",
                        icon: 'success',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/approvement"
                        }
                    })

                }
            })
        }
    })
}