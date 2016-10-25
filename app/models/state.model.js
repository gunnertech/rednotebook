import mongoose from 'mongoose';

let stateSchema = new mongoose.Schema({
	name: { 
		type: String,
		required: true 
	}
});

export default mongoose.model('State', stateSchema);