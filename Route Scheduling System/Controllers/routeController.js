import express from 'express'
import Route from '../Models/Route.js';
import Driver from '../Models/Driver.js';

import { assignDriver } from '../Controllers/assignmentController.js'

export const createRoute = async(req, res) => {
    try {
        const { startLocation, endLocation, distance, estimatedTime } = req.body;
        
        if (!startLocation || !endLocation || !distance || !estimatedTime) {
            return res.status(400).json({ message: 'Missing required route information' });
        }
        
        let newRoute = new Route({
            startLocation,
            endLocation,
            distance,
            estimatedTime,
            status: 'unassigned'
        });
        
        await newRoute.save();
        
        const assignedDriver = await assignDriver(newRoute._id);
        
        if (assignedDriver) {
            newRoute = await Route.findById(newRoute._id).populate('assignedDriver');
        }
        
        return res.status(201).json(newRoute);
    } catch (error) {
        res.status(500).json({errorMessage: error.message})
    }
};

export const getAllRoutes = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const routes = await Route.find()
            .populate('assignedDriver')
            .skip(skip)
            .limit(limit);
            
        const total = await Route.countDocuments();
        
        res.status(200).json({
            routes,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalRoutes: total
        });
    } catch (error) {
        res.status(500).json({errorMessage: error.message})
    }
};

export const getRouteById = async(req, res) => {
    try {
        const { id } = req.params;
        const route = await Route.findById(id).populate('assignedDriver');
        
        if (!route) {
            return res.status(404).json({message: "Route not found"});
        }
        
        res.status(200).json(route);
    } catch (error) {
        res.status(500).json({errorMessage: error.message})
    }
};




