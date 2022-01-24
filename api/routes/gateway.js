const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Gateway = require('../models/gateway');
const Device = require('../models/device');

router.post('/new-gateway', [
    body("num_serie").custom(value => {
        return Gateway.find({
            num_serie: value
        }).then(gatew => {
            if (gatew.length > 0) {
                // Custom error message and reject
                // the promise
                return Promise.reject('Gateway serie number already in use');
            }
        });
    })
    .not()
    .isEmpty()
    .withMessage('Serie Number is required'),
    body("devices")
    .optional()
    .custom((value) => {
        value.forEach(dev => {
            if (dev.uid == 0) throw new Error('The devices UID must be a number');
            return true;
        })
        return true;
    }),
    body("ipv4")
    .isIP()
    .withMessage('The IPv4 is not correct')
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        res.json({ mssg: array })
    } else {
        const gateway = new Gateway();
        const {
            devices
        } = req.body;
        gateway.num_serie = req.body.num_serie;
        gateway.nombre_gateway = req.body.nombre_gateway;
        gateway.ipv4 = req.body.ipv4;
        if (devices.length) {
            devices.forEach(device => {

                var dev = new Device({
                    uid: device.uid,
                    vendor: device.vendor,
                    status: device.status,
                    gateway: gateway._id
                });

                dev.save(function(err) {
                    if (err) {
                        res.json(err);
                    }

                });
                gateway.devices.push(dev);
            });
        }


        gateway.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(gateway);
            }
        })
    }


});

router.get('/gateway', async(req, res) => {

    try {
        const gateway = await Gateway.find().
        populate('devices').
        exec((err, gateway) => {
            res.json(gateway);
        });

    } catch (err) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            err
        });
    }

});

router.get('/gateway/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const gateway = await Gateway.findOne({
            _id
        });
        res.json(gateway);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

router.delete('/gateway/:id', async(req, res) => {
    const gateway = await Gateway.findById(req.params.id);
    gateway.remove();
});

router.put('/edit-gateway', [
    body("num_serie").custom(value => {
        return Gateway.find({
            num_serie: value
        }).then(gatew => {
            if (gatew.length > 0 && gatew.id != body.id) {
                return Promise.reject('Gateway serie number already in use');
            }
        });
    })
    .not()
    .isEmpty()
    .withMessage('Serie Number is required'),
    body("devices")
    .optional()
    .custom((value) => {
        value.forEach(dev => {
            if (dev.uid == 0) throw new Error('The devices UID must be a number');
            return true;
        })
        return true;
    }),
    body("ipv4")
    .isIP()
    .withMessage('The IPv4 is not correct')
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        res.json({
            mssg: array
        })
    } else {
        const gateway = await Gateway.findById(req.body._id).populate('devices');
        var devInBody = req.body.devices;
        gateway.num_serie = req.body.num_serie;
        gateway.nombre_gateway = req.body.nombre_gateway;
        gateway.ipv4 = req.body.ipv4;

        if (devInBody.length > 0) {
            for (i = 0; i < devInBody.length; i++) {

                const d = await Device.findById(devInBody[i]._id);
                if (d) {
                    d.uid = devInBody[i].uid;
                    d.vendor = devInBody[i].vendor;
                    d.status = devInBody[i].status;
                    d.gateway = gateway._id;

                    d.save(function(err) {
                        if (err) {
                            res.send(err);
                        }

                    });

                } else {
                    var dev = new Device({
                        _id: mongoose.Types.ObjectId(),
                        uid: devInBody[i].uid,
                        vendor: devInBody[i].vendor,
                        status: devInBody[i].status,
                        gateway: gateway._id
                    });
                    dev.save(function(err) {
                        if (err) {
                            res.send(err);
                        }

                    });

                    gateway.devices.push(dev);
                }
            }
        }

        gateway.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.json(gateway);
            }
        })
    }


});

router.put('/gateway/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    const {
        devices
    } = req.body;
    try {

        const gateway = await Gateway.findByIdAndUpdate(
            _id, body, {

                $push: {
                    devices: devices
                },
                new: true
            });
        res.json(gateway);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

router.put('/gateway_delete_device/:id/:idDevice', async(req, res) => {
    const _id = req.params.id;
    const idDevice = req.params.idDevice;
    const gateway = await Gateway.findById(_id);
    var indice = gateway.devices.indexOf(idDevice);
    gateway.devices.splice(indice, 1);
});

router.get('/gateway_exist/:num_serie', async(req, res) => {
    const num_serie = req.params.num_serie;
    /* const gateway = await Gateway.findOne({ 'num_serie': num_serie });
    res.json(gateway); */
    try {

        const gateway = await Gateway.findOne({
            num_serie
        });

        console.log('gateway :>> ', gateway);
        res.send(gateway);





    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        });
    }
});

module.exports = router;