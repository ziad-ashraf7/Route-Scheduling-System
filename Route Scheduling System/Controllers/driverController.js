import express from 'express'
import Route from '../Models/Route.js';
import Driver from '../Models/Driver.js';
import { assignRoute } from './assignmentController.js';

export const createDriver = async(req, res) => {
    try {
        const { id, name, licenseType, availability } = req.body;

        const exist = await Driver.findOne({id});

        if(exist){
            return res.status(400).json({message: "Driver already exists"});
        }

        let driver = new Driver({
            id,
            name,
            licenseType,
            availability: availability !== undefined ? availability : true
        });

        await driver.save();

        const route = await assignRoute(driver._id);

        if(route){
            driver = await Driver.findById(driver._id).populate("activeRoute")
        }

        res.status(201).json(driver);
    } catch (error) {
        res.status(500).json({errorMessage: error.message})
    }
};

export const getAllDrivers = async(req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({errorMessage: error.message})
    }
};

export const getDriverById = async(req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findOne({id}).populate('activeRoute');
        
        if (!driver) {
            return res.status(404).json({message: "Driver not found"});
        }
        
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({errorMessage: error.message})
    }
};
