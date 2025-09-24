import Driver from '../Models/Driver.js'
import Route from '../Models/Route.js'

export const schedule = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('activeRoute');

    const schedule = drivers.map(driver => ({
      driverId: driver.id,
      driverName: driver.name,
      availability: driver.availability,
      route: driver.activeRoute
        ? {
            routeId: driver.activeRoute._id,
            startLocation: driver.activeRoute.startLocation,
            endLocation: driver.activeRoute.endLocation,
            distance: driver.activeRoute.distance,
            estimatedTime: driver.activeRoute.estimatedTime
          }
        : null
    }));

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getDriverHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findOne({ id });
    
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    const routes = await Route.find({ assignedDriver: driver._id });
    
    res.status(200).json({
      driverId: driver.id,
      driverName: driver.name,
      routeHistory: routes.map(route => ({
        routeId: route._id,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distance: route.distance,
        estimatedTime: route.estimatedTime,
        status: route.status
      }))
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};






