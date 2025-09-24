import mongo from 'mongoose'

const routeScheme = new mongo.Schema({
    startLocation: {
        type: String,
        required: true,
        trim: true
    },
    endLocation: {
        type: String,
        required: true,
        trim: true
    },
    distance: {
        type:Number,
        required: true,
        min: 0
    },

    estimatedTime: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ['unassigned', 'assigned'],
        default: 'unassigned'
    },

    assignedDriver: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    }
    
});

export default mongo.model('Route', routeScheme);