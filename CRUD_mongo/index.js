const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port = 8002;

//connect
mongoose.connect('mongodb://127.0.0.1:27017/task-1')
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Err in connecting Mongo", err));
//schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    jobTitle: {
        type: String
    },
    gender: {
        type: String
    }
});

//model
const User = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: false }));

app.get('/users', async (req, res) => {
    const data = await User.find({});
    console.log(data);
    const html = `
     <ul>
     ${data.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
     </ul>
     `;
    res.send(html);
})

app.get('/api/users', async (req, res) => {
    const data = await User.find({});
    return res.json(data);
})

app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    return res.json(user);
})

app.post('/api/users', async (req, res) => {
    //create user
    const body = req.body;
    if (
        !body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title
    ) {
        return res.json({ msg: 'All fields are required...!' });
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        jobTitle: body.job_title,
        gender: body.gender
    });
    console.log(result);
    return res.json({ msg: 'data stored' });
});

app.patch('/api/Updtusers/:id', async (req, res) => {
    //update user
    await User.findByIdAndUpdate(req.params.id, { lastName: "Updated" });
    return res.json({ status: 'Successfully updated' });

})

app.delete('/api/Delusers/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Deleted" });
});


app.listen(port, () => {
    console.log('Server Listenes the port 8002');
})