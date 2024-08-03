import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "zaBooks",
    password: "ElephantMan12",
    port: 5432,
  });

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let result = await db.query("SELECT * FROM books");
result = result.rows;

app.get("/", (req, res) => {
    result.forEach((book) => {
        book.text = book.text.slice(0, 449) + '...';
    });
    // console.log(result)
    res.render("index.ejs", {
        bookPage: result
    });
});

app.get("/addPage", (req, res) => {
    res.render("add.ejs");
});

app.get("/bookRev/:id", async (req, res) => {
    console.log(req.params);
    const id  = parseInt(req.params.id);
    console.log("5000 IQ DIMENSIONAL BEING");
    try {
        const resultFull = await db.query("SELECT * FROM books WHERE id = ($1)", [id]);
        res.render("book.ejs", {
            bookPage: resultFull.rows
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

app.post("/add", async (req, res) => {
    const info = req.body;
    const rating = parseInt(info.rating);
    const dbAdd = [info.isbn, info.authName, info.title, info.date,rating, info.review];
    await db.query("INSERT INTO books(isbn, author, title, dateread, review, text) VALUES ($1, $2, $3, $4, $5, $6)", dbAdd);
    result = await db.query("SELECT * FROM books");
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Website running of port ${port}`);
});
