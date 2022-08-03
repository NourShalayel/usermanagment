const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// View Users
exports.view = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

//Find User By Serach
exports.find = (req, res) => {

    let searchTerm = req.body.search ; 

    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ? ' , ['%' + searchTerm + '%', '%' + searchTerm + '%'],  (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          let removedUser = req.query.removed;
          res.render('home', { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
}


exports.form = (req , res)=>{
    res.render('add-user')
}
//add user 
exports.create = (req, res) => {

  const {first_name , last_name , email , phone , comments }= req.body
    connection.query('INSERT INTO user SET first_name = ? , last_name = ? , email = ? , phone = ? , comments = ?'
     ,[first_name , last_name , email , phone , comments],  (err, rows) => {
        // When done with the connection, release it
        if (!err) {
           res.render('add-user', {alert : 'User Added Successfully.'});
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
}


//edit user 
exports.edit = (req , res )=>{
  connection.query('SELECT * FROM user WHERE id = ?' , [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


//update user 
exports.update = (req , res )=>{

  const {first_name , last_name , email , phone , comments} = req.body
  connection.query('UPDATE user SET first_name = ? , last_name = ? , email = ? , phone = ? , comments = ?  WHERE id = ?'
   , [ first_name ,last_name, email , phone , comments ,req.params.id], (err, rows) => {
    if (!err) {

      connection.query('SELECT * FROM user WHERE id = ?' , [req.params.id], (err, rows) => {
        if (!err) {
          res.render('edit-user', { rows , alert : `${first_name} has been updated` });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
        
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

//delete user 
exports.delete = (req , res )=>{
  connection.query('DELETE FROM user WHERE id = ?' , [req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User Successfully delete .')
      res.redirect('/?removed=' + removedUser)
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });

}


//view all 
exports.viewall = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM user WHERE id = ?' , [req.params.id], (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      let removedUser = req.query.removed;
      res.render('view-user', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}