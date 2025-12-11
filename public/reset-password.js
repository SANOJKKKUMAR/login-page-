

    // ---- STEP 1: Extract Token From URL ----
    const token = window.location.pathname.split("/").pop();
    console.log("Token:", token);
    const rbtn = document.getElementById("rbtn");
    rbtn.addEventListener("click",async(e)=>{
  const password = document.getElementById("password").value;
        const cpassword = document.getElementById("cpassword").value;

        if (password !== cpassword) {
            document.getElementById("msg").innerText = "Passwords do not match";
            return;
        }

        // ---- STEP 2: Send Reset Request to Backend ----
        const res = await fetch("/password/reset-password/" + token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await res.json();
        document.getElementById("msg").innerText = data.message;

        // Redirect to login page after 3 seconds
        if (res.ok) {
            setTimeout(() => {
                alert("Redirecting to login page");
            }, 3000);
        }
    

        })

