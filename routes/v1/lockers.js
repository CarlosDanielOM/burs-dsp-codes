require('dotenv').config();
const express = require('express')
const router = express.Router();
const path = require('path')

const lockerSchema = require(path.resolve(__dirname, './../../schemas/lockers.js'));

router.get('/', async (req, res) => {
    let lockers = await lockerSchema.find().sort({succeeds: 1, rejects: -1}).exec();
    res.status(200).json({lockers});
});

router.get('/:address', async (req, res) => {
    const address = req.params.address;
    const lockerCodes = await lockerSchema.find({ address });
    if (!lockerCodes || lockerCodes.length === 0) return res.status(404).json({ error: true, reason: "No locker codes found with that address" });

    res.status(200).json({ error: false, lockerCodes });
});


router.post('/', async (req, res) => {
    let body = req.body;
    let headers = req.headers;
    let authBearer = headers.authorization;

    let lockerData = {
        address: body.address,
        submitter: body.submitter,
        code: body.code
    }

    if(authBearer == "Bearer DSPAUTHTOKEN") {
        lockerData.status = true;
    }

    let newLockerCode = new lockerSchema(lockerData);
    await newLockerCode.save();

    res.status(200).json({error: false, message: 'Locker Code Created Successfully', locker: newLockerCode});
    
});

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    let headers = req.headers;
    let bearer = headers.authorization;
    let authToken = bearer.split(' ')[1];

    if(authToken != 'DSPAUTHTOKEN') return res.status(401).json({error: true, reason: 'Unauthorized'})

    let exists = await lockerSchema.findById(id);

    if(!exists) return res.status(404).json({error: true, reason: "Locker Code does not exists with that ID"});

    let deleted = await lockerSchema.findByIdAndDelete({_id: id});

    res.status(200).json({error: false, message: 'Locker Code Deleted Successfully', locker: deleted});

    
});

router.patch('/:id', async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let headers = req.headers;
    let bearer = headers.authorization;
    let authToken = bearer.split(' ')[1];

    if(authToken != 'DSPAUTHTOKEN') return res.status(401).json({error: true, reason: 'Unauthorized'})
    
    let exists = await lockerSchema.findById(id);
    if(!exists) return res.status(404).json({error: true, reason: "Locker Code does not exists with that ID"});

    let patched = await lockerSchema.findByIdAndUpdate({_id: id}, body, {new: true});

    res.status(200).json({error: false, message: 'Locker Code Updated Successfully', locker: patched});
    
});

module.exports = router;