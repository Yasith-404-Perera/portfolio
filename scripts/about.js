 // Page Transition Script from previous step
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.getAttribute("href");
                document.body.style.opacity = "0";
                document.body.style.transform = "scale(0.98)";
                document.body.style.transition = "0.4s";
                setTimeout(() => { window.location.href = target; }, 400);
            });
        });