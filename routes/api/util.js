const Group = require('../../models/Group');

module.exports =  createGroup = (req, res) => {
    const NEW_GROUP = new Group({
        name: req.body.name,
        users: JSON.parse(req.body.users)
    });

    NEW_GROUP.save()
        .then(group => res.json(group))
        .catch(err => console.log(err));
};