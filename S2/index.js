const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./models/user')
const messageModel = require('./models/message')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://max09lui:T4XEs0OHoUJIcJGF@cluster0.kcdmgrl.mongodb.net/?retryWrites=true&w=majority")

/*app.get('/getConversation/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    try {
        const conversation = await messageModel.getConversation(userId1, userId2);
        res.status(200).json({ message: 'Conversation retrieved successfully', data: conversation });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving conversation', error: error.message });
    }
});
*/

app.post('/addMessage', async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;  // Extract data from request 

        const newMessage = new messageModel({
            sender: senderId,
            receiver: receiverId,
            text: text,
        });
        
        await newMessage.save();

        res.status(200).json({ message: 'Message added successfully', data: newMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/login", (req, res) =>{ // API endpoint
    const {name, pw} = req.body;
    UserModel.findOne({name:name})
    .then(user => {
        if(user) {
            if(user.pw === pw){
                res.json(
                    {status:"Success",
                    name:user.name,
                    id: user._id})
            } else{
                res.json(
                    {status:"Wrong Password",
                    user: null})
            }
        } else{
            res.json(
                {status:"No User Exists",
                    user: null}
            )
        }
    })
})

app.post('/register', (req, res) =>{ // request, response
    const {name, pw, color} = req.body

    UserModel.findOne({name:name})
    .then(user => {
        if(user) {
            res.json({
                status: "Failure",
                user: null
            })
        } else{
            UserModel.create({name,pw, color, count:0})
            .then(user => res.json({
                status: "Success",
                user: user}))
            .catch(err => res.json(err))
        }
    })
})

app.get('/getUserData', async (req, res) => {
    try {
        const _id = req.query; // Modify the query parameter to "_id"
        const query = _id ? { _id } : {};
        
        const user = await UserModel.findOne(query);
        res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
});

app.get('/getUserId', async (req, res) => {
    try {
        const { name } = req.query;
        const query = name ? { name } : {};
        
        const user = await UserModel.findOne(query);
        res.json({
            id:user._id
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/updateUserCount/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the user to update from the URL parameter
        const { count } = req.body; // Get the new count value from the request body

        // Use Mongoose to update the count field for the specified user
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { count } }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/updateUserColor/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the user to update from the URL parameter
        const { color } = req.body; // Get the new count value from the request body

        // Use Mongoose to update the count field for the specified user
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { color } }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete('/deleteDocument/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameter
  
    try {
      const deletedDocument = await UserModel.findByIdAndDelete(id);
      if (!deletedDocument) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });


  app.put('/updateUserBio/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the user to update from the URL parameter
        const { bio } = req.body; // Get the new bio value from the request body

        // Use Mongoose to update the bio field for the specified user
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { bio } }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/updateProfilePicture/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the user to update from the URL parameter
        const { profilepicture } = req.body; // Get the new bio value from the request body

        // Use Mongoose to update the bio field for the specified user
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { profilepicture } }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3001, () =>{ // Start on this port
    console.log("server is running")
})
