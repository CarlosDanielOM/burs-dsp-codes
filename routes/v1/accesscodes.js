const express = require('express');
const router = express.Router();
const path = require('path');

const accessCodesSchema = require(path.resolve(__dirname, './../../schemas/accesscodes'));

router.get('/', async (req, res) => {
    const accessCodes = await accessCodesSchema.find().sort({succeeds: 1, rejects: -1}).exec();
    res.status(200).json({error: false, accessCodes});
});

router.get('/:address', async (req, res) => {
    let address = req.params.address;
    address = address.split('%20').join(' ');
    const accessCodes = await accessCodesSchema.find({ address });
    if (!accessCodes) return res.status(404).json({ error: true, reason: "The access code with that address does not exist" });

    res.status(200).json({ error: false, accessCodes });
});


router.post('/', async (req, res) => {
    let body = req.body;
    let headers = req.headers;
    let authBearer = headers.authorization;

    let accessCodeData = {
        address: body.address,
        submitter: body.submitter,
        code: body.code
    }

    if(authBearer == "Bearer DSPAUTHTOKEN") {
        accessCodeData.status = true;
    }
    
    let newAccessCode = new accessCodesSchema(accessCodeData);
    await newAccessCode.save();

    res.status(200).json({error: false, message: "Access code created", accessCode: newAccessCode});
    
})

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    let headers = req.headers;
    let bearer = headers.authorization;
    let authToken = bearer.split(' ')[1];

    if(authToken != 'DSPAUTHTOKEN') return res.status(401).json({error: true, reason: 'Unauthorized'})
    
    let exists = await accessCodesSchema.findById(id);
    if(!exists) return res.status(404).json({error: true, reason: "The access code with that ID does not exist"});

    let deleted = await accessCodesSchema.findByIdAndDelete(id);

    res.status(200).json({error: false, message: "Access code deleted", accessCode: deleted});
})

router.patch('/:id', async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let headers = req.headers;
    let bearer = headers.authorization;
    let authToken = bearer.split(' ')[1];

    if(authToken != 'DSPAUTHTOKEN') return res.status(401).json({error: true, reason: 'Unauthorized'})
    
    let exists = await accessCodesSchema.findById(id);
    if(!exists) return res.status(404).json({error: true, reason: "Locker Code does not exists with that ID"});

    let patched = await accessCodesSchema.findByIdAndUpdate({_id: id}, body, {new: true});

    res.status(200).json({error: false, message: 'Locker Code Updated Successfully', accessCode: patched});
    
});

module.exports = router;