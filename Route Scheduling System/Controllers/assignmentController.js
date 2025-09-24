import Driver from "../Models/Driver.js"
import Route from "../Models/Route.js"

export const assignDriver = async (routeId) => {
  try {
    const availableDriver = await Driver.findOne({
      availability: true,
      activeRoute: null
    });

    if (!availableDriver) {
      return null;
    }

    const route = await Route.findByIdAndUpdate(
      routeId,
      {
        status: 'assigned',
        assignedDriver: availableDriver._id
      },
      { new: true }
    );

    if (!route) {
      throw new Error('Route not found');
    }

    await Driver.findByIdAndUpdate(
      availableDriver._id,
      {
        activeRoute: routeId,
        availability: false
      }
    );

    return availableDriver;
  } catch (error) {
    throw error;
  }
};


export const assignRoute = async (driverId) => {
    try {
        const freeRoute = await Route.findOne({
            status: "unassigned",
            assignedDriver: null
        });

        if(!freeRoute) return null;

        const driver = await Driver.findByIdAndUpdate(
            driverId,
            {
                availability: false,
                activeRoute: freeRoute._id
            },
            {new: true}
        );

        if(!driver){
            throw new Error('Route not found');
        }

        await Route.findByIdAndUpdate(
            freeRoute._id,
            {
                status: "assigned",
                assignedDriver: driverId
            },
        );

        return freeRoute;
    } catch (error) {
        throw error;
    }
}