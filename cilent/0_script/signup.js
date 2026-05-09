// ================== TOGGLE LOGIN / REGISTER ==================
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector('a[href="/logout"]');



registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// ================== REGISTER ==================
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registerForm);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch("http://localhost:8080/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // 👉 REGISTER chỉ thông báo
  alert(result.message);
});

// ================== LOGIN ==================
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  // 👉 LOGIN mới lưu user
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
    alert("Đăng nhập thành công 🎉");
    
    // reload để check trạng thái
    //sửa lever5
    window.location.href = "/";
  } else {
    alert(result.message);
  }
});

// ================== CHECK LOGIN ==================
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  console.log("Đã đăng nhập:", user);
}

app.post('/login', (req, res) => {
    // ... logic kiểm tra database ...
    
    if (user) {
        // Lưu thông tin user vào session
        req.session.user = {
            email: userFromDB.email,
            password: userFromDB.password
        };
        res.redirect('/'); // Quay về trang chủ
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem("user"); // "Xóa user" ở máy khách
    });
}
