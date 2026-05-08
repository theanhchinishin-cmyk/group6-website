const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = 8080;
const path = require("path")

const app = express();

app.use(cors());
app.use(express.json()); //Tạo API /register Bước 2

// Cho phép Express truy cập vào thư mục 'public' để lấy CSS/JS
app.use(express.static(path.join(__dirname, 'public')));

// KẾT NỐI DATABASE
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Thequang123@', // nếu có mật khẩu thì điền vào
  database: 'exp_web_math',
});

app.get('/', (req, res) => {
  res.render('homepage', {
    
  });
});

app.get('/course', (req, res) => {
  res.render('course', {
    
  });
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
    if (err) {
      return res.json({ error: err });
    }

    if (result.length === 0) {
      return res.json({ message: "Email không tồn tại ❌" });
    }

    const user = result[0];

    if (user.password !== password) {
      return res.json({ message: "Sai mật khẩu ❌" });
    }

    res.json({ message: "Đăng nhập thành công 🎉", user: user });
  });
});
//LEVEL 3: LOGIN (ĐĂNG NHẬP) Bước 3
