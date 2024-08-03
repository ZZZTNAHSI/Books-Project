import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// constants for express, bodyparser and pg
const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "zaBooks",
    password: "",
    port: 5432,
  });

// connecting to db, enabling bodyparser and setting public folder as static so ejs files can get css'd
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// whenever you log into a website this will run, it will get stuff from db. 
let result = await db.query("SELECT * FROM books");
result = result.rows;

app.get("/", (req, res) => {
    // shortens reviews to 450 characters so the review book blocks are short, also adds ... to indicate there is more review
    result.forEach((book) => {
        book.text = book.text.slice(0, 449) + '...';
    });
    // sends back the result w/ shortened reviews
    res.render("index.ejs", {
        bookPage: result
    });
});

app.get("/addPage", (req, res) => {
    // on the ejs file there is a add button, this is linked to that and it just renders add.ejs so you can add a book
    res.render("add.ejs");
}); 

app.get("/best", async (req, res) => {
    // will sort by best
    try {
        result = await db.query("SELECT * FROM books ORDER BY review DESC");
        result = result.rows;
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

app.get("/recent", async (req, res) => {
    // will sort by recent
    try {
        result = await db.query("SELECT * FROM books ORDER BY dateread DESC");
        result = result.rows;
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

app.get("/:id", async (req, res) => {
    // will get the id from the title clicked
    const id  = parseInt(req.params.id);
    try {
        // use that id to search db to find what book is linked to that id.
        const resultFull = await db.query("SELECT * FROM books WHERE id = ($1)", [id]);
        res.render("book.ejs", {
            // will render book.ejs with the selected book. it will show the full review and only one book instead of the home page which shows multiple books and the review being 450 char limit
            bookPage: resultFull.rows
        });
    } catch (err) {
        // shitty error handling
        console.log(err);
        res.redirect("/");
    }
});

app.get("/delete/:id", async (req, res) => {
    // on the book.ejs page you can delete the article at the bottom, first deletes element and instead of quering again to update result it just manually delete the book from result and then redirect to home page
    try {
        const id = parseInt(req.params.id);
        await db.query("DELETE FROM books WHERE id = ($1)", [id]);
        const index = result.findIndex((book) => book.id == id);
        result.splice(index, 1);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
})

app.post("/add", async (req, res) => {
    try {
        const info = req.body;
        const rating = parseInt(info.rating);
        const dbAdd = [info.isbn, info.authName, info.title, info.date,rating, info.review];
        // on add.ejs it will send this to the db and log it in. and then update result and redirect to show the new item
        await db.query("INSERT INTO books(isbn, author, title, dateread, review, text) VALUES ($1, $2, $3, $4, $5, $6)", dbAdd);
        result = await db.query("SELECT * FROM books");
        result = result.rows;
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Website running of port ${port}`);
});
