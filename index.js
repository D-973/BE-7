const express = require ('express')
const app = express();
const port =3000; 
/*
const users = require('./users.js');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const path = require("path");
const multer = require("multer")
const upload = multer({dest: "public"})
const cors = require('cors');
*/
const {Pool} =require("pg");
const db = require('./db');
app.use(express.json());


app.get("/latihan", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM latihan");
    res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/latihan", async (req, res) => {
  const { name, address } = req.body;
  try {
    const result = await db.query(
      `INSERT into latihan (name, address) values ('${name}', '${address}')`
    );
    res.status(200).json({
      status: "success",
      message: "data berhasil dimasukan",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/latihan/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const result = await db.query(
      "UPDATE latihan SET name = $1, address = $2 WHERE id = $3",
      [name, address, id]
    );

    res.status(200).json({
      status: "success",
      message: "data berhasil diperbarui",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Tidak berhasil",
    });
  }
});

app.delete("/latihan/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM latihan WHERE id = $1", [id]);

    res.status(200).json({
      status: "success",
      message: "data berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/latihan/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM latihan WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "data tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
/*
//1b
app.use(morgan('tiny'));
//5b
app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())
//6b
app.post("/upload",upload.single("file"),(req,res)=>{
    res.send(req.file);
})
//4b
app.use(express.static(path.join(__dirname, "public")));
//7b
app.use(
    cors({
        origin: "http://127.0.0.1:5500",
}));
app.get("/", (req,res) => {
    res.send("This is the home page <3")
});
//1
app.get("/users", (req,res) => {
    res.json({
        Status: 'success',
        Message: 'response success',
        Data: users,
    })
});
//2
app.get('/users/:name', (req, res) => {
    const requestedName = req.params.name.toLowerCase(); // Ubah nama menjadi lowercase
    const user = users.find((user) => user.name.toLowerCase() === requestedName);//params

    if (user) {
        res.json({
          status: 'success',
          message: 'User ditemukan',
          data: user,
        });
    } else {
        res.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan',
        });
    }
});
//3
app.post("/users", (req, res) => {
    const userData = req.body;
  
    if (!userData || !userData.name) {
      return res.status(400).json({
        status: "error",
        message: "Masukan nama di request body",
      });
    }
  
    const newUser = {
      id: users.length + 1,
      name: userData.name,
    };
  
    users.push(newUser);
  
    res.status(201).json({
      status: "success",
      message: "User has been uploaded",
      data: newUser,
    });
});

//4
app.post ("/upload", upload.single("file"), (req, res) => {
    const file = req. file;
    if (file){
        const target = path.join(_dirname, "public", file.originalname);
        fs.renameSync (file.path, target); 
        res.json({
            Status: 'success',
            Message: 'File berhasil diupload',
        })
    }else {
        res.json({
            Status: 'success',
            Message: 'File gagal diupload',
        })
    }
});
//5
app.put("/users/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const requestedName = req.params.name.toLowerCase(); // Ubah nama menjadi lowercase
    const user = users.find((user) => user.name.toLowerCase() === requestedName);//params
    const userIndex = users.findIndex((user) => user.name === name);
  
    if (!req.body || !req.body.name) {// check ini kata dulu karena dia mau ingin data
      return res.status(400).json({
        status: "error",
        message: "Tolong berikan nama",
      });
    }
    if (userIndex === -1) {//ini mau ngecheck kalau ada atau tidak
      return res.status(404).json({
        status: "error",
        message: "tidak ditemukan",
      });
    }
  
    users[userIndex] = {
      id: users[userIndex].id,
      name: req.body.name,
    };
  
    res.json({
      status: "success",
      message: "User telah diupdate",
      data: users[userIndex],
    });
  });
  
 //6 
app.delete("/users/:name", (req, res) => {
    const name = req.params.name;
  
    const userIndex = users.findIndex((user) => user.name === name);
  
    if (userIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }
  
    const deletedUser = users.splice(userIndex, 1)[0];
  
    res.json({
      status: "success",
      message: "User didelete",
      data: deletedUser,
    });
});
 

//2b
app.use((req,res, next) => {
    res.json({
        status:'error',
        message: 'resource tidak ditemukan'
    })
})
//3b
const errorHandling = (err, req, res, next) => {
    res.json({
        status: 'error',
        message: 'terjadi kesalahan pada server'
    })
}

app.use(errorHandling);
*/
app.listen(port,() => 
    console.log(`Server running at http://localhost:${port}`)
);

