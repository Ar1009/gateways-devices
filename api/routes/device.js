const express = require('express');
const router = express.Router();

const Device = require('../models/device');

router.post('/new-device', async(req, res) => {
    const body = req.body;
    const gat_id = req.body.gateway._id;
    try {
        this.axios.put('/gateway/' + gat_id, body)
        const device = await Device.create(body);
        res.status(200).json(device);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

router.get('/device', async(req, res) => {

    try {
        const device = await Device.find().
        populate('gateway').
        exec((err, device) => {
            res.json(device);
        });
    } catch (err) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            err
        });
    }

});

router.get('/device/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const device = await Device.findOne({
            _id
        });
        res.json(device);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

router.delete('/device/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const device = await Device.findByIdAndDelete({
            _id
        });
        router.put('/gateway_delete_device/' + device._id);
        if (!device) {
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        res.json(device);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

router.delete('/delete-all-devices/:id', async(req, res) => {
    const device = await Device.findById(req.params.id);
    device.remove();
});

router.put('/device/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const device = await Device.findByIdAndUpdate(
            _id,
            body, {
                new: true
            });
        res.json(device);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

module.exports = router;