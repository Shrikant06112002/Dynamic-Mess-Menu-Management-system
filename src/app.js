const express = require("express");
const app = express();
const path = require("path");
const hbs = require('hbs');
const session = require('express-session');
const flash = require('express-flash');
const port = process.env.PORT || 8000;
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(flash());
require("./db/conn");
const { User, MessOwner} = require("./models/registers")
// Create the models
// const MessOwnerMenu = mongoose.model("MessOwnerMenu", MessOwnerSchema);
// const DailyMenu = mongoose.model("DailyMenu", DailyMenuSchema);
//bulid in middleware
// console.log(path.join(__dirname,"../public"))
const staticPath = path.join(__dirname, "../public");
const templetePath = path.join(__dirname, "../templates")
const partialPath = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// to set the view engine
app.set("view engine", "hbs");
app.set('views', templetePath);
hbs.registerPartials(partialPath);
app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.render("../templates/views/index.hbs");
});
app.get("/index", (req, res) => {
    res.render("../templates/views/index.hbs");
});
//  app.get("/mess", (req, res) => {
//     res.render("../templates/views/mess.hbs");
// }); 
app.get("/index#about", (req, res) => {
    res.render("../templates/views/index.hbs#about");
});
app.get("/contact", (req, res) => {
    res.render("../templates/views/contact.hbs");
});
app.get("/login", (req, res) => {
    res.render("../templates/views/login.hbs");
});
app.get("/signUs", (req, res) => {
    res.render("../templates/views/signUs.hbs");
});
app.get("/todaysmenu", (req, res) => {
  res.render("../templates/views/todaysmenu.hbs");
});app.get("/addMenu", (req, res) => {
  res.render("../templates/views/addMenu.hbs");
});
// app.get('*',(req,res)=>{
//   res.render("../templates/views/404.hbs");
// })
// app.get("/mess", async (req, res) => {
//   try {
//     const messOwner = await MessOwner.findOne(); // Fetches the first document from the MessOwner collection
//     if (!messOwner) {
//       return res.status(404).render("../templates/views/404.hbs");
//     }

//     const dailyMenu = messOwner.dailymenu[0]; // Assuming you have only one daily menu per MessOwner

//     res.render("../templates/views/mess.hbs", { messOwner, dailyMenu });
//   } catch (error) {
//     res.status(500).render("../templates/views/404.hbs");
//   }
// });

app.post("/login", async (req, res) => {

    try{
    const { userType } = req.body;
    let newUser;

    if (userType == 'Normal-User') {
      newUser = new User(req.body);
      await newUser.save();
    res.status(201).render("../templates/views/mess.hbs");
    } else if (userType == 'Mess-Owner') {
      newUser = new MessOwner(req.body);
      await newUser.save();
        const previousMenus = newUser.dailymenu;
        res.render("../templates/views/addMenu.hbs", { previousMenus });
    } else {
      return res.status(400).render("../templates/views/404.hbs");
    }

    
  } catch (error) {
    res.status(400).render("../templates/views/404.hbs");
  }
});

// app.get("/",(req,res)=>{
//     res.send("hello from express");
// })
// login check
app.post("/signUs", async(req, res) => {
    try {
        const userType = req.body.userType;
        const {email,password,} = req.body;

        
        let user;
        if (userType =='Normal-User') {
          user = await User.findOne({ email, password });
        } else if (userType == 'Mess-Owner') {
          user = await MessOwner.findOne({ email, password });
        } else {
            req.render("../templates/views/404.hbs");
            return res.redirect('/signUs');
        }
         // Store the user information in the session
    req.session.user = user;
        if (!user) {
            req.render("../templates/views/404.hbs");
            return res.redirect('/signUs');
        }
  

        if (user && (userType=="Normal-User")) {
    res.render("../templates/views/index.hbs");
          
        }else{
    const previousMenus = user.dailymenu;
    res.render("../templates/views/addMenu.hbs", { previousMenus });
        }
      } catch (error) {
        res.status(400).render("../templates/views/404.hbs");
      }
});



// app.post("/todaysmenu", async (req, res) => {
//   try {
//     const { date,messsName,meal, riceplate, subji1,subji2,subji3, rice} = req.body;
//     const {email} = req.body;
//       let
//     user = await MessOwner.findOne({ email});
    
//     console.log(email)
//     // const { user } = req;
//     // const messOwner1 = await MessOwner.findOne({email});
//     const messOwner = await MessOwner.findOne(user);
//     const dailyMenu = {
//       date,
//       messsName,
//       meal,
//       riceplate,
//       subji1,
//       subji2,
//       subji3,
//       rice,   
//     };
//     // req.session.user = user;
//     // const formattedDate = date.toLocaleDateString();
//     // const formattedTime = date.toLocaleTimeString();
//     // const messOwner = await MessOwner.findById({ _id: "64660da118dce11f040d76c1" });

//     messOwner.dailymenu.push(dailyMenu);

//     await messOwner.save();
//     const previousMenus = user.dailymenu;
//     res.render("../templates/views/addMenu.hbs", { previousMenus });
//     // res.render("../templates/views/addMenu.hbs");
//   } catch (error) {
//     res.status(400).render("../templates/views/404.hbs");
//   }
// });

app.post("/todaysmenu", async (req, res) => {
  try {
    const { date, messsName, meal, riceplate, subji1, subji2, subji3, rice } = req.body;
    const { email } = req.body;

    // Find the mess owner based on their email
    const messOwner = await MessOwner.findOne({ email });

    if (!messOwner) {
      // Handle the case where the mess owner is not found
      // For example, you can send an error response or redirect to an error page
      return res.status(404).render("../templates/views/404.hbs");
    }

    const dailyMenu = {
      date,
      messsName,
      meal,
      riceplate,
      subji1,
      subji2,
      subji3,
      rice,
    };

    messOwner.dailymenu.push(dailyMenu);
    await messOwner.save();

    const previousMenus = messOwner.dailymenu;
    res.render("../templates/views/addMenu.hbs", { previousMenus });
  } catch (error) {
    res.status(400).render("../templates/views/404.hbs");
  }
});


// Assuming you have an express route to handle the request
// Route to fetch data from MessOwner collection
// Assuming you have required the necessary modules and set up the routes properly

// Fetch data from MessOwner collection
// const { MessOwner } = require("./models/registers");

// app.get("/mess", async (req, res) => {
//   try {
//     const messOwner = await MessOwner.findOne(); // Fetches the first document from the MessOwner collection
//     if (!messOwner) {
//       return res.status(404).render("../templates/views/404.hbs");
//     }

//     const dailyMenu = messOwner.dailymenu[0]; // Assuming you have only one daily menu per MessOwner

//     res.render("../templates/views/mess.hbs", { messOwner, dailyMenu });
//   } catch (error) {
//     res.status(500).render("../templates/views/404.hbs");
//   }
// });

// Assuming you have required the necessary modules and set up the routes properly

// Fetch data from MessOwner collection
// const { MessOwner } = require("./models/registers");

// app.get("/fetchData", async (req, res) => {
//   // try {
//   //   const messOwner = await MessOwner.findOne(); // Fetches the first document from the MessOwner collection
//   //   if (!messOwner) {
//   //     return res.status(404).render("../templates/views/404.hbs");
//   //   }

//   //   const dailyMenu = messOwner.dailymenu; // Fetches the dailymenu array from the MessOwner document

//   //   res.render("../templates/views/mess.hbs", { dailyMenu }); // Render the view template with the fetched data
//   // } catch (error) {
//   //   res.status(500).render("../templates/views/404.hbs");
//   // }\
//     try {
//     const mpreviousMenus = await MessOwner.find({userType:"Mess-Owner"});
//     console.log(messOwners) // Fetch all documents from the MessOwner collection
//     res.render("../templates/views/mess.hbs", { messOwners }); // Pass the fetched data to the 'display.hbs' template
//   } catch (error) {
//     res.status(500).send('Internal Server Error');
//   }
// });
// app.get("/fetchData", async (req, res) => {
//   try {
//     const messOwner = await MessOwner.findOne();
//     if (!messOwner) {
//       return res.status(404).render("../templates/views/404.hbs");
//     }

//     const dailymenus = messOwner.dailymenu;

//     res.render("../templates/views/mess.hbs", { dailymenus });
//   } catch (error) {
//     res.status(500).render("../templates/views/404.hbs");
//   }
// // });
// app.get("/mess", async (req, res) => {
//   try {
//     const messOwner = await MessOwner.findOne();
//     if (!messOwner) {
//       return res.status(404).render("../templates/views/404.hbs");
//     }

//     const dailymenus = messOwner.dailymenu;

//     res.render("../templates/views/mess.hbs", { dailymenus });
//   } catch (error) {
//     res.status(500).render("../templates/views/404.hbs");
//   }
// });

// app.get("/mess", async (req, res) => {
//   try {
//     const messOwner = await MessOwner.findOne();
//     if (!messOwner) {
//       return res.status(404).render("../templates/views/404.hbs");
//     }

//     const { messName, dailymenu } = messOwner;
//     const sortedMenus = dailymenu.sort((a, b) => a.date - b.date);

//     res.render("../templates/views/mess.hbs", { messName, dailymenus: sortedMenus });
//   } catch (error) {
//     res.status(500).render("../templates/views/404.hbs");
//   }
// });

// app.get("/mess", async (req, res) => {
//   try {
//     const messOwners = await MessOwner.find();
//     if (messOwners.length === 0) {
//       return res.status(404).render("../templates/views/404.hbs");
//     }

//     const messesData = [];
//     messOwners.forEach((messOwner) => {
//       const { messName, dailymenu } = messOwner;
//       const sortedMenus = dailymenu.sort((a, b) => a.date - b.date);
//       messesData.push({ messName, dailymenus: sortedMenus });
//     });

//     res.render("../templates/views/mess.hbs", { messesData });
//   } catch (error) {
//     res.status(500).render("../templates/views/404.hbs");
//   }
// });
app.get("/mess", async (req, res) => {
  try {
    const messOwners = await MessOwner.find();
    if (messOwners.length === 0) {
      return res.status(404).render("../templates/views/404.hbs");
    }

    const messesData = [];
    messOwners.forEach((messOwner) => {
      const { dailymenu } = messOwner;
      const sortedMenus = dailymenu.sort((a, b) => new Date(a.date) - new Date(b.date));
      messesData.push({ dailymenus: sortedMenus });
    });

    res.render("../templates/views/mess.hbs", { messesData });
  } catch (error) {
    res.status(500).render("../templates/views/404.hbs");
  }
});

app.listen(port, () => {
    console.log(`listing the port no ${port}`)
});