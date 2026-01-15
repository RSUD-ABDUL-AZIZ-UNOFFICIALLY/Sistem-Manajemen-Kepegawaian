// const qrcodeBody = new QRCode("qrcodeUser", {
//     text: window.location.href,
//     width: 200,
//     height: 200,
//     colorDark: "#000000",
//     colorLight: "#ffffff",
//     correctLevel: QRCode.CorrectLevel.H
// });

async function getPasskey() {
    const response = await fetch("/api/passkey/generator");
    const data = await response.json();
   console.log(data);
    if (data.status == 200) {
        document.getElementById("passkey_accoun").innerHTML = data.message;
    }
    if (data.status == 500) {
        document.getElementById("passkey_accoun").innerHTML = data.message;
    }
    if (data.status == 201) {
        document.getElementById("passkey_accoun").innerHTML = data.message;
        document.getElementById("main_auth").innerHTML = `
        
        <div class="flex items-center justify-center md:mx-auto">
            <div class="w-full md:w-1/2 p-4 md:p-6">
                <div class="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div class="flex items-center justify-center mb-4 md:mb-6">
                        <div id="qrcodeUser" class="w-full md:w-1/2"></div>
                    </div>
                    <form class="w-full" id="ativate_passkey">
                        <input type="hidden" id="base32" name="base32" value="${data.data.base32}" />
                        <div class="mb-4 md:mb-6">
                            <label for="otp" class="block text-sm font-semibold text-gray-700 mb-2">Masukan OTP</label>
                            <input type="number" id="otp" name="otp" placeholder="Masukan OTP" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900" />
                        </div>
                        <div class="flex items-center justify-center">
                            <button type="submit" id="fsubmit" class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 md:py-2 px-6 rounded-lg transition-colors duration-200">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
        const qrcodeBody = new QRCode("qrcodeUser", {
            text: data.data.otpauth_url,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        // bind handler di sini
        const form = document.getElementById("ativate_passkey");

        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // stop reload default

            // baca values
            const base32 = document.getElementById("base32").value;
            const otp = document.getElementById("otp").value;

            console.log("Submit intercepted:", { base32, otp });
                const response = await fetch("/api/passkey/activate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        base32,
                        otp,
                    }),
                });
                const data = await response.json();
                if (data.status == 401) {
                    document.getElementById("passkey_accoun").innerHTML = data.message;
                }
                if (data.status == 500) {
                    document.getElementById("passkey_accoun").innerHTML = data.message;
                }
                if (data.status == 201) {
                    document.getElementById("passkey_accoun").innerHTML = data.message;
                    document.getElementById("main_auth").innerHTML = ``;
                }
        });
    }

}

getPasskey();
// document.getElementById("ativate_passkey").addEventListener("submit", async function(e) {
//     e.preventDefault();
//     const base32 = document.getElementById("base32").value;
//     const otp = document.getElementById("otp").value;
//     console.log(base32, otp)
//     // const response = await fetch("/api/passkey/activate", {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({
//     //         base32,
//     //         otp,
//     //     }),
//     // });
//     // const data = await response.json();
//     // if (data.status == 401) {
//     //     document.getElementById("passkey_accoun").innerHTML = data.message;
//     // }
//     // if (data.status == 500) {
//     //     document.getElementById("passkey_accoun").innerHTML = data.message;
//     // }
//     // if (data.status == 201) {
//     //     document.getElementById("passkey_accoun").innerHTML = data.message;
//     //     document.getElementById("main_auth").innerHTML = ``;
//     // }
// });
// setelah render, baru binding
