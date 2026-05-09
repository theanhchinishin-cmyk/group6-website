const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = 8080;
const path = require("path")
const session = require('express-session');

const app = express();

app.use(cors());
app.use(express.json()); //Tạo API /register Bước 2

// Cho phép Express truy cập vào thư mục 'public' để lấy CSS/JS
app.use(express.static(path.join(__dirname, 'cilent')));
app.use(express.static('cilent'));

// KẾT NỐI DATABASE
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Thequang123@', // nếu có mật khẩu thì điền vào
  database: 'exp_web_math',
});

app.use(session({
    secret: 'secret-key-cua-quang', // Chuỗi bảo mật tùy ý
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Để false nếu chạy localhost
}));

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Lỗi khi xóa session:", err);
            return res.redirect('/');
        }
        // Xóa cookie lưu vết ở trình duyệt
        res.clearCookie('connect.sid'); 
        
        // ĐIỀU QUAN TRỌNG: Điều hướng trình duyệt về lại trang chủ
        // Sau lệnh này, URL trên thanh địa chỉ sẽ là http://localhost:8080/
        res.redirect('/'); 
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(); // Đây chính là lệnh "Xóa user" trên Server
    res.clearCookie('connect.sid'); 
    res.redirect('/'); // Quay về trang chủ để Header cập nhật lại
});





// 1. Cấu hình session (phải đặt trước các route app.get/post)

// 2. Middleware quan trọng: Tự động truyền biến user vào tất cả các file EJS
app.use((req, res, next) => {
    // res.locals giúp biến 'user' có mặt ở mọi file .ejs mà không cần truyền thủ công
    res.locals.user = req.session.user || null; 
    next();
});

app.get('/course', (req, res) => {
  res.render('course', {
    
  });
});

app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/document', (req, res) => {
  res.render('document', {
    
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    
  });
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi kết nối MySQL:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// ... các biến const ở trên giữ nguyên ...

// SỬA ĐOẠN NÀY
app.set('view engine', 'ejs');
// Kiểm tra lại cấu trúc thư mục, nếu views nằm ngay cạnh file server thì dùng:
app.set('views', path.join(__dirname, 'views'));

// Thay đổi route:
app.get('/signup', (req, res) => {
    // Express sẽ tự tìm file "signup.ejs" trong thư mục "views" đã set ở trên
    res.render('signup'); 
});


// test database
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Working at http://localhost:${PORT}`);
})

//Tạo API /register Bước 2
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json({ message: "Đăng ký thành công 🎉" });
  });
});
//Tạo API /register Bước 2

//LEVEL 3: LOGIN (ĐĂNG NHẬP) Bước 3
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) return res.json({ error: err });
    if (result.length === 0) return res.json({ message: "Email không tồn tại ❌" });

    const user = result[0];
    if (user.password !== password) return res.json({ message: "Sai mật khẩu ❌" });

    // Cần thêm dòng này để lưu vào Session của Server
    req.session.user = user; 

    // Gửi phản hồi về cho client
    res.json({ message: "Đăng nhập thành công 🎉", user: user });
  });
});
