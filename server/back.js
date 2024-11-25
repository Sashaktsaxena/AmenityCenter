import pg from "pg";
import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import multer from "multer";
import axios from "axios";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
const app=express();
const port =3002;
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
};
app.use(cors());


const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"School",
    password:"",
    port:5432
});
db.connect();
const updateExpiredAppointments = async (req, res, next) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      await db.query(`
        UPDATE appointments
        SET status = 'Expired'
        WHERE appointment_date < $1 AND status != 'Expired'
      `, [today]);
  
      next();
    } catch (error) {
      console.error("Error updating expired appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

//middleware
app.use(updateExpiredAppointments);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static("public"));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//currently in use
const otpStorage = {};
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
//   auth: {
//       user: 'codesphere1003@gmail.com', // Replace with your email
//       pass: 'umln yddd vgsa zbit', // Replace with your email password or app password
//   },
// });

// function sendOtpEmail(email, otp) {
//   const mailOptions = {
//       from: 'your-email@gmail.com',
//       to: email,
//       subject: 'Your Login OTP',
//       text: `Your OTP for login is ${otp}. It is valid for 5 minutes.`,
//   };

//   return transporter.sendMail(mailOptions);
// }
// app.post('/send-otp', async (req, res) => {
//   console.log ("hi ")
//   const { email } = req.body;

//   if (!email) {
//       return res.status(400).send('Email is required');
//   }

//   const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
//   otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store OTP for 5 minutes

//   try {
//       await sendOtpEmail(email, otp);
//       res.status(200).send('OTP sent successfully');
//   } catch (error) {
//       console.error('Error sending OTP:', error);
//       res.status(500).send('Failed to send OTP');
//   }
// });

// app.post('/verify-otp', (req, res) => {
//   const { email, otp } = req.body;

//   const storedOtp = otpStorage[email];
//   if (!storedOtp) {
//       return res.status(400).send('OTP not found or expired');
//   }

//   if (storedOtp.otp === parseInt(otp, 10) && Date.now() < storedOtp.expiresAt) {
//       delete otpStorage[email]; // Remove OTP after successful verification
//       res.status(200).send('OTP verified successfully');
//   } else {
//       res.status(400).send('Invalid or expired OTP');
//   }
// });
app.post('/getinfo', upload.single('photo'), async (req, res) => {
  try {
      const { name, StudentId, Contact, Course, Password, secret } = req.body;
      const parsedStudentId = parseInt(StudentId);
      const hashedPassword = await bcrypt.hash(Password, 10);
      const photoPath = req.file.buffer;

      if (!name || !StudentId || !Contact || !Course || !Password || !secret) {
          return res.status(400).json({ success: false, message: "Fill all the fields" });
      }
      if(Password.length<8){
        return res.status(400).json({success:false,message:"password must be 8 digit long"})

      }
      var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if(!regularExpression.test(Password)) {
        return res.status(400).json({success:false,message:"password must contain a number and a special charcter"})
      
      }
      // if(Password.match((/[a-z]/) && password.match(/[A-Z]/))){
      //   return req.status(400).json({success:false,message:"password must be 8 digit long"})

      // }
      if (Contact.toString().length !== 10) {
          return res.status(400).json({ success: false, message: "Contact number must be 10 digits long" });
      }

      const insertQuery = "INSERT INTO student (st_id, name, contact, course, pass, secret, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)";
      await db.query(insertQuery, [parsedStudentId, name, Contact, Course, hashedPassword, secret, photoPath]);

      const token = jwt.sign({ userId: parsedStudentId }, "littlecoder", { expiresIn: "1hr" });
      res.status(200).json({ success: true, message: "Data inserted successfully.", token });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// app.post('/getinfo', upload.single('photo'), async (req, res) => {
//   try {
//     const { name, StudentId, Contact, Course, Password, secret, address } = req.body;
//     const parsedStudentId = parseInt(StudentId);
//     const hashedPassword = await bcrypt.hash(Password, 10);
//     const photoPath = req.file.buffer;

//     if (!name || !StudentId || !Contact || !Course || !Password || !secret || !address) {
//       return res.status(400).json({ success: false, message: "Fill all the fields" });
//     }
//     if (Password.length < 8) {
//       return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
//     }

//     const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
//     if (!regularExpression.test(Password)) {
//       return res.status(400).json({ success: false, message: "Password must contain a number and a special character" });
//     }

//     if (Contact.toString().length !== 10) {
//       return res.status(400).json({ success: false, message: "Contact number must be 10 digits long" });
//     }

//     // Get coordinates from the address using axios
//     const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//       params: {
//         address: address,
//         key: 'AIzaSyDcrobVtT9DrUY-NFEEusD7FuaJ9X68jfg' // Replace with your API key
//       }
//     });

//     if (geocodeResponse.data.status !== 'OK') {
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

//     const insertQuery = "INSERT INTO student (st_id, name, contact, course, pass, secret, photo, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
//     await db.query(insertQuery, [parsedStudentId, name, Contact, Course, hashedPassword, secret, photoPath, lat, lng]);

//     const token = jwt.sign({ userId: parsedStudentId }, "littlecoder", { expiresIn: "1hr" });
//     res.status(200).json({ success: true, message: "Data inserted successfully.", token });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });
// app.post("/getinfo", async (req, res) => {
//   try {
//     const { name, StudentId, Contact, Course, Password,secret } = req.body;
//     const parsedStudentId = parseInt(StudentId);
//     const hashedPassword = await bcrypt.hash(Password, 10);
//     if(Course.length==0||name.length==0||Password.length==0||StudentId==0){
//       return res.status(400).json({success:false,message:"Fill all the fields"});
//     }
   
//     if (Contact.toString().length !== 10) {
//       return res.status(400).json({ success: false, message: "Contact number must be 10 digits long" });
//     }

//     const insertQuery = "INSERT INTO student (st_id, name, contact, course, pass,secret) VALUES ($1, $2, $3, $4, $5,$6)";
//     await db.query(insertQuery, [parsedStudentId, name, Contact, Course, hashedPassword,secret]);
//     const token = jwt.sign({ userId: parsedStudentId }, "littlecoder", { expiresIn: "1hr" });
//     res.status(200).json({ success: true, message: "Data inserted successfully." ,token});
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });


  function authenticateToken(req, res, next) {
    // Extract the JWT token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token is provided, return a 401 Unauthorized response
        return res.status(401).json({ message: "Authentication token required" });
    }

    // Verify the token
    jwt.verify(token, 'littlecoder', (err, user) => {
        if (err) {
            // If the token is invalid, return a 403 Forbidden response
            return res.status(403).json({ message: "Invalid token" });
        }
        // If the token is valid, attach the user information to the request object
        req.userId = user.userId;
        next(); // Call the next middleware function in the chain
    });
}

  
app.post("/getlogin", async (req, res) => {
  try {
    const { Id, Passw, email } = req.body;
    console.log("Received request with Id:", Id);

    const result = await db.query("SELECT * FROM student WHERE st_id = $1", [Id]);

    if (result.rows.length === 0) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(Passw, user.pass);

    if (!passwordMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }



    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);

    // Send OTP via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Save OTP to memory or cache (e.g., Redis or in-memory map for demo purposes)
    // You can use a database or more secure caching for production
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    otpStorage[Id] = { otp, expiry: otpExpiry };

    console.log("Login successful, OTP sent");
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { Id, otp } = req.body;

  const storedOtp = otpStorage[Id];
  if (!storedOtp) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (Date.now() > storedOtp.expiry) {
    delete otpStorage[Id]; // Remove expired OTP
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp, 10) === storedOtp.otp) {
    console.log("OTP verified successfully");

    try {
      // Fetch user details from the database using ID
      const result = await db.query("SELECT * FROM student WHERE st_id = $1", [Id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found during token generation" });
      }

      const user = result.rows[0];

      // Check if the user is an admin
      const isAdmin = user.is_admin;

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.st_id, isAdmin: isAdmin }, // Include user and isAdmin info
        "littlecoder", // Secret key (you may want to store this securely)
        { expiresIn: "1h" } // Token expiration
      );

      // Remove OTP after successful verification
      delete otpStorage[Id]; 

      // Return the token along with the admin status
      return res.status(200).json({ message: "OTP verified successfully", token,isAdmin:isAdmin });
    } catch (error) {
      console.error("Error during token generation:", error);
      return res.status(500).json({ message: "Error generating token" });
    }
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

  // app.post('/dietplan', async (req, res) => {
  //   const { studentId, meals } = req.body;
  //   const trainerId = req.userId; // Assume an authentication middleware attaches the `user` object
  
  //   if (!studentId || !meals || meals.length === 0) {
  //     return res.status(400).json({ error: 'Student ID and meals are required' });
  //   }
  
  //   try {
  //     // Insert each meal into the diet_plans table
  //     for (const { meal_time, description } of meals) {
  //       await db.query(
  //         `
  //         INSERT INTO diet_plans (student_id, trainer_id, meal_time, description, created_at)
  //         VALUES ($1, $2, $3, $4, NOW())
  //         `,
  //         [studentId, trainerId, meal_time, description]
  //       );
  //     }
  
  //     res.status(201).json({ message: 'Diet plan added successfully' });
  //   } catch (err) {
  //     console.error('Error inserting diet plan:', err);
  //     res.status(500).json({ error: 'Failed to add diet plan' });
  //   }
  // });
app.get("/profile", authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;

      // Query the database to fetch user profile information including the photo
      const result = await db.query("SELECT name, st_id, contact, course, photo FROM student WHERE st_id = $1", [userId]);

      // Check if the user profile exists
      if (result.rows.length === 0) {
          return res.status(404).json({ message: "User profile not found" });
      }

      // Convert photo binary data to base64 string if it exists
      const userProfile = result.rows[0];
      if (userProfile.photo) {
          userProfile.photo = userProfile.photo.toString('base64');
      }

      // Return user profile information including the photo
      res.status(200).json(userProfile);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



app.patch('/forget/', async (req, res) => {
   
    const {id, secret, newPassword } = req.body;

    try {
        // Fetch the student from the database based on st_id
        
        const user = await db.query('SELECT * FROM student WHERE st_id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const student = user.rows[0];

        // Verify the secret answer
        if (student.secret !== secret) {
            return res.status(400).json({ success: false, message: "Incorrect secret answer" });
        }
        

        // Encrypt the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updateQuery = 'UPDATE student SET pass = $1 WHERE st_id = $2';
        await db.query(updateQuery, [hashedPassword, id]);

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// app.post('/sell', authenticateToken, async (req, res) => {
//   try {
//       const { name, description, sellerId } = req.body;
//       const itemId = generateItemId(); // Function to generate a unique item ID

//       const insertQuery = 'INSERT INTO items (item_id, name, description, seller_id) VALUES ($1, $2, $3, $4)';
//       await db.query(insertQuery, [itemId, name, description, sellerId]);

//       res.status(200).json({ message: 'Item added for selling ', itemId });
//   } catch (error) {
//       console.error('Error selling item:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });




//currently in use
// app.post('/sell', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//       const decodedToken = jwt.verify(token, "littlecoder");
//       const sellerId = decodedToken.userId; // Assuming the token contains userId
//       const itemData = req.body;

//       // Item data to be inserted into the database
//       const newItem = {
//           name: itemData.name,
//           description: itemData.description,
//           sellerId: sellerId,
//       };

//       // SQL query to insert item into the database
//       const insertQuery = 'INSERT INTO items (name, description, seller_id) VALUES ($1, $2, $3) RETURNING *';
//       const values = [newItem.name, newItem.description, newItem.sellerId];

//       // Insert item into the database
//       const result = await db.query(insertQuery, values);
//       const insertedItem = result.rows[0];

//       // Respond with success message and inserted item
//       res.status(200).json({ message: 'Item sold successfully', item: insertedItem });
//   } catch (error) {
//       console.error('Error decoding token or inserting item:', error);
//       res.status(401).json({ message: 'Invalid token or error inserting item' });
//   }
// });


app.post('/sell', authenticateToken, upload.single('photo'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      const decodedToken = jwt.verify(token, "littlecoder");
      const sellerId = decodedToken.userId;
      const { name, description, price } = req.body;
      const photo = req.file.buffer;  // Photo is now in binary format

      const insertQuery = 'INSERT INTO items (name, description, price, photo, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [name, description, price, photo, sellerId];

      const result = await db.query(insertQuery, values);
      const insertedItem = result.rows[0];

      res.status(200).json({ message: 'Item sold successfully', item: insertedItem });
  } catch (error) {
      console.error('Error decoding token or inserting item:', error);
      res.status(401).json({ message: 'Invalid token or error inserting item' });
  }
})

// app.get('/items', async (req, res) => {
//   try {
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.seller_id, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//       `);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

//currenkly in use
// app.get('/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id != $1 AND items.status = 'For Sale'
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });


//currently in use 1
// app.get('/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.price, items.photo, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id != $1 AND items.status = 'For Sale'
//       `, [userId]);
      
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });


app.get('/items', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT items.item_id, items.name, items.description, items.price, encode(items.photo, 'base64') as photo, items.seller_id, items.status, student.contact
          FROM items
          JOIN student ON items.seller_id = student.st_id
          WHERE items.seller_id != $1 AND items.status = 'For Sale'
      `, [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/seller/items', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT items.item_id, items.name, items.description, items.price, encode(items.photo, 'base64') as photo, items.seller_id, items.status, student.contact
          FROM items
          JOIN student ON items.seller_id = student.st_id
          WHERE items.seller_id = $1
      `, [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching seller items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/bills', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await db.query(`
      SELECT gym_memberships.membership_id, gym_memberships.month_paid, gym_memberships.gym_time, student.name, student.contact 
      FROM gym_memberships 
      JOIN student ON gym_memberships.user_id = student.st_id 
      WHERE gym_memberships.user_id = $1
    `, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//currenly in use
// app.get('/seller/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id = $1
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching seller items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

//currently in use 1
// app.get('/seller/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.price, items.photo, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id = $1
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching seller items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

app.patch('/items/request/:itemId', authenticateToken, async (req, res) => {
  try {
      const { itemId } = req.params;
      const buyId=req.userId;
      const updateQuery = `
          UPDATE items
          SET status = 'Requested',buyer_id=$1
          WHERE item_id = $2 AND status = 'For Sale'
          RETURNING *;
      `;
      const result = await db.query(updateQuery, [buyId,itemId]);

      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is not available for request" });
      }

      res.status(200).json({ message: "Item requested successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error requesting item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



app.patch('/items/sell/:itemId', authenticateToken, async (req, res) => {
  try {
      const { itemId } = req.params;
      
      const updateQuery = `
          UPDATE items
          SET status = 'PP'
          WHERE item_id = $1 AND status = 'Requested'
          RETURNING *;
      `;
      const result = await db.query(updateQuery, [itemId]);
      
      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is not available for selling" });
      }

      res.status(200).json({ message: "Item sold successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error selling item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/buy/:itemId', authenticateToken, async (req, res) => {
  const { itemId } = req.params;
  const buyerId = req.userId;

  try {
      const updateQuery = `
          UPDATE items
          SET buyer_id = $1, updated_at = CURRENT_TIMESTAMP
          WHERE item_id = $2 AND buyer_id IS NULL
          RETURNING *;
      `;
      const result = await db.query(updateQuery, [buyerId, itemId]);

      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is already sold or does not exist" });
      }
      const item = result.rows[0];
      if (item.photo) {
          item.photo = item.photo.toString('base64');
      }

      // Return user profile information including the photo
      res.status(200).json(item);
      // res.status(200).json({ message: "Item bought successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error buying item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const userId = req.userId;

      const result = await db.query('DELETE FROM items WHERE item_id = $1 AND seller_id = $2 RETURNING *', [itemId, userId]);
      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Item not found or you're not authorized to delete this item" });
      }
      res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
//currently in use
// app.patch('/items/:itemId', authenticateToken, async (req, res) => {
//   try {
//       const itemId = req.params.itemId;
//       const userId = req.userId;
//       const { name, description } = req.body;

//       const result = await db.query(
//           'UPDATE items SET name = $1, description = $2 WHERE item_id = $3 AND seller_id = $4 RETURNING *',
//           [name, description, itemId, userId]
//       );

//       if (result.rows.length === 0) {
//           return res.status(404).json({ message: "Item not found or you're not authorized to edit this item" });
//       }
//       res.status(200).json({ message: "Item updated successfully", item: result.rows[0] });
//   } catch (error) {
//       console.error("Error updating item:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get('/items/:itemId', authenticateToken, async (req, res) => {
  console.log("Fetching item details");
  const { itemId } = req.params;
  const userId = req.userId; // Extracted from the JWT token

  try {
      const query = `
          SELECT item_id, name, description, seller_id, buyer_id, created_at, updated_at, status, price, photo 
          FROM items 
          WHERE item_id = $1 AND buyer_id = $2 AND status = 'PP'
      `;
      const values = [itemId, userId];

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Item not found or access denied' });
      }

      const item = result.rows[0];

      // Convert the photo from bytea to base64 if it exists
      if (item.photo) {
          item.photo = Buffer.from(item.photo).toString('base64');
      }

      res.status(200).json(item);
  } catch (error) {
      console.error('Error fetching item details:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
app.post('/make-payment', authenticateToken,async (req, res) => {
  const userId = req.userId;
  console.log(userId)
  const { itemName, itemPrice, itemImage } = req.body;

  try {
      const paymentDate = new Date();
      const query = `
          INSERT INTO payments (userId, itemName, itemPrice, itemImage, paymentDate)
          VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      
      const values = [
          userId,
          itemName,
          itemPrice,
          itemImage ? Buffer.from(itemImage, 'base64') : null,
          paymentDate
      ];

      // Execute the query using the db instance
      const result = await db.query(query, values);

      res.status(201).json({ message: "Payment successful", payment: result.rows[0] });
  } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Payment failed" });
  }
});
app.patch('/items/:itemId', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const userId = req.userId;
      const { name, description, price } = req.body;
      const photo = req.file ? req.file.buffer : null;

      const updateQuery = `
          UPDATE items
          SET name = $1, description = $2, price = $3, photo = COALESCE($4, photo)
          WHERE item_id = $5 AND seller_id = $6
          RETURNING *;
      `;
      const values = [name, description, price, photo, itemId, userId];

      const result = await db.query(updateQuery, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Item not found or you're not authorized to edit this item" });
      }
      res.status(200).json({ message: "Item updated successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



// app.get('/cart', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, student.contact AS seller_contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.buyer_id = $1 AND items.status = 'Sold' AND items.status='Requested'
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching cart items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get('/cart', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT items.item_id, items.name, items.description, items.status, student.contact AS seller_contact, encode(items.photo, 'base64') AS photo, items.price
          FROM items
          JOIN student ON items.seller_id = student.st_id
          WHERE items.buyer_id = $1 AND (items.status = 'Sold' OR items.status = 'Requested'Or items.status='PP')
      `, [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
app.get('/payments', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT id, itemname, itemprice, paymentdate 
          FROM payments
          WHERE userid = $1
      `, [userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "No payment history found." });
      }

      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.patch('/change/:itemId', authenticateToken, async (req, res) => {
  console.log("hidjsfhghjk")
  const { itemId } = req.params;
  const { buyerId } = req.body;

  try {
      const updateQuery = `
          UPDATE items
          SET status = 'Sold', buyer_id = $1
          WHERE item_id = $2 AND status = 'PP'
          RETURNING *;
      `;

      const values = [buyerId, itemId];
      const result = await db.query(updateQuery, values);

      // Check if the item was updated successfully
      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is not available for selling" });
      }

      res.status(200).json({ message: "Item sold successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error selling item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// app.post('/gym/register', authenticateToken, async (req, res) => {
//   const { gymTime, monthPaid } = req.body;
//   const userId = req.userId;
//   const currentDate = new Date();
//   const currentDay = currentDate.getDate();
  
//   // Check if today is the 1st of the month
//   if (currentDay >10) {
//       return res.status(400).json({ message: "Gym fees can only be paid on the 1st of any month" });
//   }
//   try {
//       // Check if the user already has a valid membership for the current month
//       const checkQuery = 'SELECT * FROM gym_memberships WHERE user_id = $1 AND month_paid = $2';
//       const checkResult = await db.query(checkQuery, [userId, monthPaid]);

//       if (checkResult.rows.length > 0) {
//           return res.status(400).json({ message: "You have already paid for this month" });
//       }

//       // Insert new gym membership record
//       const insertQuery = 'INSERT INTO gym_memberships (user_id, month_paid, gym_time) VALUES ($1, $2, $3) RETURNING *';
//       const result = await db.query(insertQuery, [userId, monthPaid, gymTime]);

//       res.status(200).json({ message: 'Gym registration and fee payment successful', membership: result.rows[0] });
//   } catch (error) {
//       console.error("Error registering for gym:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
app.post('/trainer_meals',authenticateToken, async (req, res) => {
  console.log("hi")
  const { userId, mealDescription, mealTime } = req.body;
  const trainerId = req.userId; // Assuming `req.user.id` contains the logged-in trainer's ID

  if (!userId || !mealDescription || !mealTime) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Query to insert the meal into the trainer_diets table
    const result = await db.query(
      `INSERT INTO trainer_diets (user_id, trainer_id, diet_description, diet_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, trainerId, mealDescription, mealTime]
    );

    // Return the newly added meal entry
    res.status(201).json({ message: 'excercise added successfully', meal: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding meal' });
  }
});
// Assuming you're using Express.js

// Route to fetch all meals associated with a user
app.get('/user_diets/:userId', authenticateToken,async (req, res) => {
  console.log("hi")

  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM trainer_diets WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'No diets found for this user' });
    }

    res.status(200).json(result.rows); // Return the list of diets
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching diets' });
  }
});
app.post('/trainer_ex',authenticateToken, async (req, res) => {
  console.log("hi")
  const { userId, mealDescription, mealTime } = req.body;
  const trainerId = req.userId; // Assuming `req.user.id` contains the logged-in trainer's ID

  if (!userId || !mealDescription || !mealTime) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Query to insert the meal into the trainer_diets table
    const result = await db.query(
      `INSERT INTO trainer_exer(user_id, trainer_id, exer_description, exer_day)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, trainerId, mealDescription, mealTime]
    );

    // Return the newly added meal entry
    res.status(201).json({ message: 'excercise added successfully', meal: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding meal' });
  }
});
// Assuming you're using Express.js

// Route to fetch all meals associated with a user
app.get('/user_exer/:userId', authenticateToken,async (req, res) => {
  console.log("hi")

  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM trainer_exer WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'No exercise found for this user' });
    }

    res.status(200).json(result.rows); // Return the list of diets
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching diets' });
  }
});

app.get('/user_info/:userId', async (req, res) => {
  console.log("hi")
  const { userId } = req.params; // Get userId from the URL params
  
  try {
    // Query to get user info (height, weight from gym_memberships and user name from student)
    const result = await db.query(
      `SELECT s.name AS user_name, g.height, g.weight 
       FROM gym_memberships g
       JOIN student s ON s.st_id = g.user_id
       WHERE g.user_id = $1`, 
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Return the user info
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching user data' });
  }
});


app.post('/gym/register', authenticateToken, async (req, res) => {
  console.log("fjghs")
  const { gymTime, monthPaid, amount ,height,weight} = req.body;
  const userId = req.userId;
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  // Only allow payment on or before the 10th day of the month
  if (currentDay > 27) {
    return res.status(400).json({ message: "Gym fees can only be paid on or before the 10th of any month" });
  }

  try {
    // Check if the user already has a valid membership for the current month
    const checkQuery = 'SELECT * FROM gym_memberships WHERE user_id = $1 AND month_paid = $2';
    const checkResult = await db.query(checkQuery, [userId, monthPaid]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "You have already paid for this month" });
    }

    // Insert new gym membership record
    const insertQuery = 'INSERT INTO gym_memberships (user_id, month_paid, gym_time, amount,height,weight) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *';
    const result = await db.query(insertQuery, [userId, monthPaid, gymTime, amount,height,weight]);

    res.status(200).json({ message: 'Gym registration and fee payment successful', membership: result.rows[0] });
  } catch (error) {
    console.error("Error registering for gym:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/gym/details', authenticateToken, async (req, res) => {
  const userId = req.userId;

  try {
      // Fetch the latest gym membership for the user
      const query = `
          SELECT * FROM gym_memberships
          WHERE user_id = $1
          ORDER BY registration_date DESC
          LIMIT 1
      `;
      const result = await db.query(query, [userId]);

      if (result.rows.length === 0) {
          return res.status(200).json({ showPaymentPage: true });
      }

      const latestMembership = result.rows[0];
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });

      // Check if the membership is for the current month
      if (latestMembership.month_paid === currentMonth) {
          return res.status(200).json({ showPaymentPage: false, membership: latestMembership });
      } else {
          return res.status(200).json({ showPaymentPage: true });
      }
  } catch (error) {
      console.error("Error fetching gym details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/appointments', authenticateToken, async (req, res) => {
    try {
      const { doctorType, description, appointmentDate } = req.body;
      const userId = req.userId;
  
      // Check if appointmentDate is within the next 2 days
      
      
      const appointmentDateObj = new Date(appointmentDate);

      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 2);
      today.setHours(0, 0, 0, 0);
      if (appointmentDateObj > maxDate) {
        return res.status(400).json({ message: "Appointment date must be within the next 2 days" });
      }
      if(appointmentDateObj<today.getDate()){
        return res.status(400).json({ message: "Appointment date must after todays date" });
      }
      // Find an available doctor of the specified type within the date range
      const doctorResult = await db.query(
        `SELECT id, availability_start_date, availability_end_date, availability_time,type,name
         FROM doctors
         WHERE type = $1 AND $2 BETWEEN availability_start_date AND availability_end_date
         LIMIT 1`,
        [doctorType, appointmentDate]
      );
  
      if (doctorResult.rows.length === 0) {
        return res.status(404).json({ message: "No available doctor found for the specified type and date" });
      }
  
      const doctor = doctorResult.rows[0];
      const docid=doctor.id;
      const { name, type } = doctor;
      const insertQuery = `
        INSERT INTO appointments (user_id, doctor_id, description, appointment_date,dname,dtype)
        VALUES ($1, $2, $3, $4,$5,$6)
        RETURNING *`;





      const result= await db.query(insertQuery, [userId, docid ,description, appointmentDate,name ,type]);
  
      res.status(200).json({ message: 'Appointment created successfully', appointment: result.rows[0] });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Internal server error" ,error:error.message});
    }
  });
  


// Fetch student details
app.get('/api/students/:id',  async (req, res) => {
  const studentId = req.params.id;
  const stid=parseInt(studentId)
  try {
    const result = await db.query('SELECT st_id, name, contact, course FROM student WHERE st_id = $1', [stid]);
    if (result.rows.length === 0) {
      console.log(`No student found with ID: ${stid}`);
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("hi ")
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update student details
app.patch('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { name, contact, course } = req.body;
  try {
    const updateQuery = 'UPDATE student SET name = $1, contact = $2, course = $3 WHERE st_id = $4 RETURNING *';
    const result = await db.query(updateQuery, [name, contact, course, studentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }else{
      res.status(200).json({ message: "Student updated successfully", student: result.rows[0] });
    }
    
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete student
// app.delete('/api/students/:id', async (req, res) => {
//   const studentId = req.params.id;
//   try {
//     const result = await db.query('DELETE FROM student WHERE st_id = $1 RETURNING *', [studentId]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.status(200).json({ message: "Student deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting student:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

app.delete('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const stid = parseInt(studentId);

  try {
    // Start transaction
    await db.query('BEGIN');

    // Delete the student record
    const deleteResult = await db.query('DELETE FROM student WHERE st_id = $1', [stid]);

    if (deleteResult.rowCount === 0) {
      // No student was deleted
      await db.query('ROLLBACK');
      return res.status(404).json({ message: "Student not found" });
    }

    // Commit transaction
    await db.query('COMMIT');
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    await db.query('ROLLBACK');
    res.status(500).json({ message: "Internal server error" });
  }
});
// app.delete('/api/items/:id', async (req, res) => {
//   const itemId = req.params.id;
//   const itemIDParsed = parseInt(itemId, 10);

//   try {
//     // Start transaction
//     await db.query('BEGIN');

//     // Delete the item from the database
//     const deleteResult = await db.query('DELETE FROM items WHERE item_id = $1', [itemIDParsed]);

//     if (deleteResult.rowCount === 0) {
//       // No item was deleted, rollback the transaction
//       await db.query('ROLLBACK');
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     // Commit transaction
//     await db.query('COMMIT');
//     res.status(200).json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     // Rollback transaction in case of error
//     await db.query('ROLLBACK');
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// Fetch all items for admin
app.get('/admin/items', authenticateToken, async (req, res) => {
  try {
      const result = await db.query('SELECT item_id, name, description, status FROM items');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
// Delete an item by ID (admin only)
app.delete('/admin/items/:id', authenticateToken, async (req, res) => {
  const itemId = req.params.id;
  const itemIDParsed = parseInt(itemId, 10);

  try {
      await db.query('BEGIN');
      const deleteResult = await db.query('DELETE FROM items WHERE item_id = $1', [itemIDParsed]);

      if (deleteResult.rowCount === 0) {
          await db.query('ROLLBACK');
          return res.status(404).json({ message: 'Item not found' });
      }

      await db.query('COMMIT');
      res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
      console.error('Error deleting item:', error);
      await db.query('ROLLBACK');
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Update doctor's availability
app.patch('/api/doctors/:id', async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { availabilityStart, availabilityEnd, availabilityTime } = req.body;

  console.log('Updating doctor:', {
    doctorId,
    availabilityStart,
    availabilityEnd,
    availabilityTime
  });

  try {
    const result = await db.query(
      'UPDATE doctors SET availability_start_date = $1, availability_end_date = $2, availability_time = $3 WHERE id = $4 RETURNING *',
      [availabilityStart, availabilityEnd, availabilityTime, doctorId]
    );

    console.log('Query result:', result);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Create a new doctor
app.post('/api/doctors', async (req, res) => {
  const { name, specialization, availabilityStart, availabilityEnd, availabilityTime } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO doctors (name, type, availability_start_date, availability_end_date, availability_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, specialization, availabilityStart, availabilityEnd, availabilityTime]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/doctor-types', async (req, res) => {
  try {
    // Query to get doctor types from the database
    const result = await db.query('SELECT type FROM doctors');
    
    // Check if any doctor types are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No doctor types found' });
    }
    
    // Send the list of doctor types as JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching doctor types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.delete('/api/appointments/:id', async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  try {
    const result = await db.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [appointmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/appointments', authenticateToken, async (req, res) => {
  const userId = req.userId; // Assuming the user's ID is available in the request
  try {
    const result = await db.query('SELECT * FROM appointments WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Submit a report
app.post('/reports', authenticateToken, async (req, res) => {
  try {
      const { type, details } = req.body;
      const userId = req.userId;
      const insertQuery = 'INSERT INTO reports (user_id, type, details) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [userId, type, details]);
      res.status(200).json({ success: true, report: result.rows[0] });
  } catch (error) {
      console.error("Error submitting report:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all reports (Admin only)
app.get('/reports', authenticateToken, async (req, res) => {
  try {
      // const userId = req.userId;
      // const userResult = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
      // if (userResult.rows[0].role !== 'admin') {
      //     return res.status(403).json({ message: "Access denied" });
      // }
      const result = await db.query('SELECT * FROM reports ');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Update report status (Admin only)
app.patch('/reports/:reportId/status', authenticateToken, async (req, res) => {
  try {
      const { reportId } = req.params;
      const { status } = req.body;
      // const userId = req.userId;
      // const userResult = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
      // if (userResult.rows[0].role !== 'admin') {
      //     return res.status(403).json({ message: "Access denied" });
      // }
      const updateQuery = 'UPDATE reports SET status = $1 WHERE report_id = $2 RETURNING *';
      const result = await db.query(updateQuery, [status, reportId]);
      res.status(200).json({ success: true, report: result.rows[0] });
  } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Add comment to a report
app.post('/reports/:reportId/comments', authenticateToken, async (req, res) => {
  try {
      const { reportId } = req.params;
      const { comment } = req.body;
      const userId = req.userId;
      const insertQuery = 'INSERT INTO report_comments (report_id, commenter_id, comment) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [reportId, userId, comment]);
      res.status(200).json({ success: true, comment: result.rows[0] });
  } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch comments for a report
app.get('/reports/:reportId/comments', authenticateToken, async (req, res) => {
  try {
      const { reportId } = req.params;
      const result = await db.query('SELECT * FROM report_comments WHERE report_id = $1 ORDER BY created_at ASC', [reportId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
// Fetch reports for the logged-in user
app.get('/reports/user', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query('SELECT * FROM reports WHERE user_id = $1', [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
app.get('/api/doctor-availabilities',  async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM doctors'); // Modify this query based on your actual table structure
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching doctor availabilities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
})